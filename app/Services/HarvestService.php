<?php

namespace App\Services;

use App\Models\Harvest;
use App\Models\Crop;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class HarvestService
{
    /**
     * Valida os dados de uma safra (sem culturas)
     * Aceita tanto o formato antigo (name) quanto o novo (crops)
     */
    public function validateHarvestData(array $harvestData): array
    {
        $currentYear = (int) date('Y');
        $minYear = 1900;
        $maxYear = $currentYear + 1;

        // Normalizar dados: converter 'name' em 'crops' se necessário (compatibilidade)
        if (isset($harvestData['name']) && !isset($harvestData['crops'])) {
            // Formato antigo: converter 'name' (string) para 'crops' (array)
            $name = trim($harvestData['name'] ?? '');
            $harvestData['crops'] = $name ? [$name] : [];
            unset($harvestData['name']);
        }

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
        ], [
            'year.regex' => 'O ano deve ter exatamente 4 dígitos numéricos (ex: 2024)',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        return [
            'year' => trim($harvestData['year']),
            'crops' => $harvestData['crops'] ?? [],
        ];
    }

    /**
     * Valida se o ano é válido (entre 1900 e ano atual + 1)
     */
    public function validateYearRange(string $year): bool
    {
        $yearInt = (int) $year;
        $currentYear = (int) date('Y');
        
        return $yearInt >= 1900 && $yearInt <= ($currentYear + 1);
    }

    /**
     * Cria uma safra com suas culturas
     */
    public function createHarvest(string $farmId, array $harvestData): Harvest
    {
        $validated = $this->validateHarvestData($harvestData);

        // Criar safra
        $harvest = Harvest::create([
            'farm_id' => $farmId,
            'year' => $validated['year'],
        ]);

        // Criar culturas se fornecidas
        if (!empty($validated['crops']) && is_array($validated['crops'])) {
            $this->createCropsForHarvest($harvest->id, $validated['crops']);
        }

        return $harvest->load('crops');
    }

    /**
     * Cria culturas para uma safra
     */
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

    /**
     * Cria múltiplas safras para uma fazenda
     */
    public function createHarvestsForFarm(string $farmId, array $harvestsData): array
    {
        $created = [];
        
        if (empty($harvestsData) || !is_array($harvestsData)) {
            return $created;
        }

        foreach ($harvestsData as $harvestData) {
            // Pula safras sem ano
            if (empty($harvestData['year'])) {
                continue;
            }

            // Normalizar: converter 'name' em 'crops' se necessário (compatibilidade com frontend antigo)
            if (isset($harvestData['name']) && !isset($harvestData['crops'])) {
                $name = trim($harvestData['name'] ?? '');
                $harvestData['crops'] = $name ? [$name] : [];
                unset($harvestData['name']);
            }

            try {
                $harvest = $this->createHarvest($farmId, $harvestData);
                $created[] = $harvest;
            } catch (ValidationException $e) {
                // Loga erro mas continua processando outras safras
                \Log::warning('Erro ao criar safra', [
                    'farm_id' => $farmId,
                    'harvest_data' => $harvestData,
                    'errors' => $e->errors()
                ]);
            }
        }

        return $created;
    }

    /**
     * Valida array de safras
     */
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

    /**
     * Atualiza uma safra e suas culturas
     */
    public function updateHarvest(Harvest $harvest, array $harvestData): Harvest
    {
        $validated = $this->validateHarvestData($harvestData);

        // Atualizar ano da safra
        $harvest->update([
            'year' => $validated['year'],
        ]);

        // Deletar culturas antigas
        $harvest->crops()->delete();

        // Criar novas culturas
        if (!empty($validated['crops']) && is_array($validated['crops'])) {
            $this->createCropsForHarvest($harvest->id, $validated['crops']);
        }

        return $harvest->fresh()->load('crops');
    }

    /**
     * Deleta uma colheita e suas culturas (soft delete em cascata)
     */
    public function deleteHarvest(Harvest $harvest): void
    {
        // Carregar relacionamentos para garantir que todas as culturas sejam deletadas
        $harvest->load('crops');
        
        // Soft delete das culturas (safras)
        foreach ($harvest->crops as $crop) {
            $crop->delete();
        }
        
        // Soft delete da colheita
        $harvest->delete();
    }
}
