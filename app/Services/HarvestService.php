<?php

namespace App\Services;

use App\Models\Harvest;
use App\Models\Crop;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class HarvestService
{
    public function validateHarvestData(array $harvestData): array
    {
        $currentYear = (int) date('Y');
        $minYear = 1900;
        $maxYear = $currentYear + 1;

        if (isset($harvestData['name']) && !isset($harvestData['crops'])) {
            $name = trim($harvestData['name'] ?? '');
            $harvestData['crops'] = $name ? [$name] : [];
            unset($harvestData['name']);
        }

        $messages = [
            'year.required' => 'O campo ano da safra é obrigatório.',
            'year.regex' => 'O ano deve ter exatamente 4 dígitos numéricos (ex: 2024).',
            'crops.*.required' => 'O campo cultura é obrigatório.',
            'crops.*.max' => 'O nome da cultura não pode ter mais de 255 caracteres.',
        ];

        $validator = Validator::make($harvestData, [
            'year' => [
                'required',
                'string',
                'regex:/^\d{4}$/',
                function ($attribute, $value, $fail) use ($minYear, $maxYear) {
                    $yearInt = (int) trim($value);
                    if ($yearInt < $minYear || $yearInt > $maxYear) {
                        $fail("O ano deve estar entre {$minYear} e {$maxYear}.");
                    }
                },
            ],
            'crops' => 'nullable|array',
            'crops.*' => 'required|string|max:255',
        ], $messages);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        return [
            'year' => trim($harvestData['year']),
            'crops' => $harvestData['crops'] ?? [],
        ];
    }

    public function validateYearRange(string $year): bool
    {
        $yearInt = (int) $year;
        $currentYear = (int) date('Y');
        
        return $yearInt >= 1900 && $yearInt <= ($currentYear + 1);
    }

    public function createHarvest(string $farmId, array $harvestData): Harvest
    {
        $validated = $this->validateHarvestData($harvestData);

        $harvest = Harvest::create([
            'farm_id' => $farmId,
            'year' => $validated['year'],
        ]);

        if (!empty($validated['crops']) && is_array($validated['crops'])) {
            $this->createCropsForHarvest($harvest->id, $validated['crops']);
        }

        return $harvest->load('crops');
    }

    public function createCropsForHarvest(string $harvestId, array $crops): array
    {
        $created = [];

        foreach ($crops as $cropName) {
            if (empty($cropName) || trim($cropName) === '') {
                continue;
            }

            $created[] = Crop::create([
                'harvest_id' => $harvestId,
                'name' => trim($cropName),
            ]);
        }

        return $created;
    }

    public function createHarvestsForFarm(string $farmId, array $harvestsData): array
    {
        $created = [];
        
        if (empty($harvestsData) || !is_array($harvestsData)) {
            return $created;
        }

        foreach ($harvestsData as $harvestData) {
            if (empty($harvestData['year'])) {
                continue;
            }

            if (isset($harvestData['name']) && !isset($harvestData['crops'])) {
                $name = trim($harvestData['name'] ?? '');
                $harvestData['crops'] = $name ? [$name] : [];
                unset($harvestData['name']);
            }

            try {
                $harvest = $this->createHarvest($farmId, $harvestData);
                $created[] = $harvest;
            } catch (ValidationException $e) {
                \Log::warning('Erro ao criar safra', [
                    'farm_id' => $farmId,
                    'harvest_data' => $harvestData,
                    'errors' => $e->errors()
                ]);
            }
        }

        return $created;
    }

    public function validateHarvestsArray(array $harvests): void
    {
        foreach ($harvests as $index => $harvest) {
            try {
                $this->validateHarvestData($harvest);
            } catch (ValidationException $e) {
                throw ValidationException::withMessages([
                    "harvests.{$index}.year" => $e->errors()['year'] ?? [],
                    "harvests.{$index}.crops" => $e->errors()['crops'] ?? [],
                ]);
            }
        }
    }

    public function updateHarvest(Harvest $harvest, array $harvestData): Harvest
    {
        $validated = $this->validateHarvestData($harvestData);

        $harvest->update([
            'year' => $validated['year'],
        ]);

        $harvest->crops()->delete();

        if (!empty($validated['crops']) && is_array($validated['crops'])) {
            $this->createCropsForHarvest($harvest->id, $validated['crops']);
        }

        return $harvest->fresh()->load('crops');
    }

    public function deleteHarvest(Harvest $harvest): void
    {
        $harvest->load('crops');
        
        foreach ($harvest->crops as $crop) {
            $crop->delete();
        }
        
        $harvest->delete();
    }
}
