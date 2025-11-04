<?php

namespace App\Services;

use App\Models\Farm;
use App\Models\Harvest;
use App\Models\Producer;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class FarmService
{
    protected HarvestService $harvestService;

    public function __construct(HarvestService $harvestService)
    {
        $this->harvestService = $harvestService;
    }

    public function validateFarmData(array $farmData, bool $includeHarvests = true): array
    {
        $rules = [
            'producer_id' => 'required|string|exists:producers,id',
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|size:2',
            'total_area' => 'required|numeric|min:0.01|not_in:0,0.0,0.00',
            'arable_area' => 'required|numeric|min:0',
            'vegetation_area' => 'required|numeric|min:0',
        ];

        if ($includeHarvests) {
            $rules['harvests'] = 'nullable|array';
            $rules['harvests.*.year'] = 'nullable|string|regex:/^\d{4}$/';
            $rules['harvests.*.crops'] = 'nullable|array';
            $rules['harvests.*.crops.*'] = 'nullable|string|max:255';
        }

        $messages = [
            'producer_id.required' => 'O campo produtor é obrigatório.',
            'producer_id.exists' => 'O produtor selecionado não existe.',
            'name.required' => 'O campo nome da fazenda é obrigatório.',
            'name.max' => 'O nome da fazenda não pode ter mais de 255 caracteres.',
            'city.required' => 'O campo cidade é obrigatório.',
            'city.max' => 'O nome da cidade não pode ter mais de 255 caracteres.',
            'state.required' => 'O campo estado é obrigatório.',
            'state.size' => 'O estado deve ter exatamente 2 caracteres.',
            'total_area.required' => 'O campo área total é obrigatório.',
            'total_area.numeric' => 'A área total deve ser um número.',
            'total_area.min' => 'A área total deve ser maior que zero.',
            'total_area.not_in' => 'A área total deve ser maior que zero.',
            'arable_area.required' => 'O campo área agricultável é obrigatório.',
            'arable_area.numeric' => 'A área agricultável deve ser um número.',
            'arable_area.min' => 'A área agricultável deve ser maior ou igual a zero.',
            'vegetation_area.required' => 'O campo área de vegetação é obrigatório.',
            'vegetation_area.numeric' => 'A área de vegetação deve ser um número.',
            'vegetation_area.min' => 'A área de vegetação deve ser maior ou igual a zero.',
            'harvests.*.year.regex' => 'O ano deve ter exatamente 4 dígitos numéricos (ex: 2024).',
            'harvests.*.crops.*.max' => 'O nome da cultura não pode ter mais de 255 caracteres.',
        ];

        $validator = Validator::make($farmData, $rules, $messages);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        return $farmData;
    }

    public function validateAreaSum(float $totalArea, float $arableArea, float $vegetationArea): void
    {
        if (($arableArea + $vegetationArea) > $totalArea) {
            throw ValidationException::withMessages([
                'total_area' => 'A soma das áreas agricultável e vegetação não pode ultrapassar a área total.'
            ]);
        }
    }

    public function createFarm(string $producerId, array $farmData): Farm
    {
        $this->validateFarmData($farmData, true);

        $totalArea = isset($farmData['total_area']) && $farmData['total_area'] !== '' 
            ? (float) $farmData['total_area'] 
            : 0;
        $arableArea = isset($farmData['arable_area']) && $farmData['arable_area'] !== '' 
            ? (float) $farmData['arable_area'] 
            : 0;
        $vegetationArea = isset($farmData['vegetation_area']) && $farmData['vegetation_area'] !== '' 
            ? (float) $farmData['vegetation_area'] 
            : 0;

        if ($totalArea > 0) {
            $this->validateAreaSum($totalArea, $arableArea, $vegetationArea);
        }

        $farm = Farm::create([
            'producer_id' => $producerId,
            'name' => trim($farmData['name']),
            'city' => trim($farmData['city']),
            'state' => trim($farmData['state']),
            'total_area' => $totalArea,
            'arable_area' => $arableArea,
            'vegetation_area' => $vegetationArea,
        ]);

        if (isset($farmData['harvests']) && is_array($farmData['harvests']) && count($farmData['harvests']) > 0) {
            $this->harvestService->createHarvestsForFarm($farm->id, $farmData['harvests']);
        }

        return $farm->load('harvests.crops');
    }

    public function updateFarm(Farm $farm, array $farmData): Farm
    {
        if (!isset($farmData['producer_id']) || empty($farmData['producer_id'])) {
            $farmData['producer_id'] = $farm->producer_id;
        }
        
        $farmData['name'] = trim($farmData['name'] ?? '');
        $farmData['city'] = trim($farmData['city'] ?? '');
        $farmData['state'] = trim($farmData['state'] ?? '');
        
        if (empty($farmData['total_area']) || $farmData['total_area'] === '0' || $farmData['total_area'] === 0) {
            $farmData['total_area'] = '';
        }
        if (empty($farmData['arable_area']) || $farmData['arable_area'] === '0' || $farmData['arable_area'] === 0) {
            $farmData['arable_area'] = '';
        }
        if (empty($farmData['vegetation_area']) || $farmData['vegetation_area'] === '0' || $farmData['vegetation_area'] === 0) {
            $farmData['vegetation_area'] = '';
        }
        
        $this->validateFarmData($farmData, true);

        $totalArea = (float) $farmData['total_area'];
        $arableArea = (float) $farmData['arable_area'];
        $vegetationArea = (float) $farmData['vegetation_area'];

        $this->validateAreaSum($totalArea, $arableArea, $vegetationArea);

        // Hard delete para evitar conflito de UNIQUE constraint (farm_id, year)
        $farm->load(['harvests' => function($query) {
            $query->withTrashed()->with(['crops' => function($q) {
                $q->withTrashed();
            }]);
        }]);
        
        foreach ($farm->harvests as $harvest) {
            foreach ($harvest->crops as $crop) {
                $crop->forceDelete();
            }
            $harvest->forceDelete();
        }

        $updateData = [
            'name' => trim($farmData['name']),
            'city' => trim($farmData['city']),
            'state' => trim($farmData['state']),
            'total_area' => $totalArea,
            'arable_area' => $arableArea,
            'vegetation_area' => $vegetationArea,
        ];

        if (isset($farmData['producer_id']) && !empty($farmData['producer_id'])) {
            $producer = Producer::find($farmData['producer_id']);
            if ($producer) {
                $updateData['producer_id'] = $farmData['producer_id'];
            }
        }

        $farm->update($updateData);

        if (isset($farmData['harvests']) && is_array($farmData['harvests']) && count($farmData['harvests']) > 0) {
            $this->harvestService->createHarvestsForFarm($farm->id, $farmData['harvests']);
        }

        return $farm->fresh()->load('harvests.crops');
    }

    public function deleteFarm(Farm $farm): void
    {
        $farm->load('harvests.crops');
        
        foreach ($farm->harvests as $harvest) {
            foreach ($harvest->crops as $crop) {
                $crop->delete();
            }
            $harvest->delete();
        }
        
        $farm->delete();
    }

    public function createFarmsForProducer(string $producerId, array $farmsData): array
    {
        $created = [];

        if (empty($farmsData) || !is_array($farmsData)) {
            return $created;
        }

        foreach ($farmsData as $farmIndex => $farmData) {
            if (empty($farmData['name']) || empty($farmData['city']) || empty($farmData['state'])) {
                continue;
            }

            try {
                $farm = $this->createFarm($producerId, $farmData);
                $created[] = $farm;
            } catch (ValidationException $e) {
                $errors = [];
                foreach ($e->errors() as $key => $messages) {
                    $errors["farms.{$farmIndex}.{$key}"] = $messages;
                }
                throw ValidationException::withMessages($errors);
            }
        }

        return $created;
    }
}

