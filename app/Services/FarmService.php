<?php

namespace App\Services;

use App\Models\Farm;
use App\Models\Harvest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class FarmService
{
    protected HarvestService $harvestService;

    public function __construct(HarvestService $harvestService)
    {
        $this->harvestService = $harvestService;
    }

    /**
     * Valida os dados de uma fazenda
     */
    public function validateFarmData(array $farmData, bool $includeHarvests = true): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|size:2',
            'total_area' => 'required|numeric|min:0',
            'arable_area' => 'required|numeric|min:0',
            'vegetation_area' => 'required|numeric|min:0',
        ];

        if ($includeHarvests) {
            $rules['harvests'] = 'nullable|array';
            $rules['harvests.*.year'] = 'required_with:harvests|string|regex:/^\d{4}$/';
            $rules['harvests.*.crops'] = 'nullable|array';
            $rules['harvests.*.crops.*'] = 'required|string|max:255';
        }

        $validator = Validator::make($farmData, $rules, [
            'harvests.*.year.regex' => 'O ano deve ter exatamente 4 dígitos numéricos (ex: 2024)',
        ]);

        if ($validator->fails()) {
            throw ValidationException::withMessages($validator->errors()->toArray());
        }

        return $farmData;
    }

    /**
     * Valida se a soma das áreas não ultrapassa a área total
     */
    public function validateAreaSum(float $totalArea, float $arableArea, float $vegetationArea): void
    {
        if (($arableArea + $vegetationArea) > $totalArea) {
            throw ValidationException::withMessages([
                'total_area' => 'A soma das áreas agricultável e vegetação não pode ultrapassar a área total'
            ]);
        }
    }

    /**
     * Cria uma fazenda com suas safras
     */
    public function createFarm(string $producerId, array $farmData): Farm
    {
        // Validar dados básicos
        $this->validateFarmData($farmData, true);

        // Converter e validar áreas
        $totalArea = isset($farmData['total_area']) && $farmData['total_area'] !== '' 
            ? (float) $farmData['total_area'] 
            : 0;
        $arableArea = isset($farmData['arable_area']) && $farmData['arable_area'] !== '' 
            ? (float) $farmData['arable_area'] 
            : 0;
        $vegetationArea = isset($farmData['vegetation_area']) && $farmData['vegetation_area'] !== '' 
            ? (float) $farmData['vegetation_area'] 
            : 0;

        // Validar soma das áreas
        if ($totalArea > 0) {
            $this->validateAreaSum($totalArea, $arableArea, $vegetationArea);
        }

        // Criar fazenda
        $farm = Farm::create([
            'producer_id' => $producerId,
            'name' => trim($farmData['name']),
            'city' => trim($farmData['city']),
            'state' => trim($farmData['state']),
            'total_area' => $totalArea,
            'arable_area' => $arableArea,
            'vegetation_area' => $vegetationArea,
        ]);

        // Criar safras se fornecidas
        if (isset($farmData['harvests']) && is_array($farmData['harvests']) && count($farmData['harvests']) > 0) {
            $this->harvestService->createHarvestsForFarm($farm->id, $farmData['harvests']);
        }

        return $farm->load('harvests.crops');
    }

    /**
     * Atualiza uma fazenda e suas safras
     */
    public function updateFarm(Farm $farm, array $farmData): Farm
    {
        // Validar dados (com safras)
        $this->validateFarmData($farmData, true);

        // Converter e validar áreas
        $totalArea = (float) $farmData['total_area'];
        $arableArea = (float) $farmData['arable_area'];
        $vegetationArea = (float) $farmData['vegetation_area'];

        // Validar soma das áreas
        $this->validateAreaSum($totalArea, $arableArea, $vegetationArea);

        // Atualizar fazenda
        $farm->update([
            'name' => trim($farmData['name']),
            'city' => trim($farmData['city']),
            'state' => trim($farmData['state']),
            'total_area' => $totalArea,
            'arable_area' => $arableArea,
            'vegetation_area' => $vegetationArea,
        ]);

        // Deletar safras antigas (carregar primeiro para deletar crops)
        $farm->load('harvests.crops');
        foreach ($farm->harvests as $harvest) {
            $harvest->crops()->delete();
        }
        $farm->harvests()->delete();

        // Criar novas safras se fornecidas
        if (isset($farmData['harvests']) && is_array($farmData['harvests']) && count($farmData['harvests']) > 0) {
            $this->harvestService->createHarvestsForFarm($farm->id, $farmData['harvests']);
        }

        return $farm->fresh()->load('harvests.crops');
    }

    /**
     * Deleta uma fazenda e suas safras
     */
    public function deleteFarm(Farm $farm): void
    {
        $farm->harvests()->delete();
        $farm->delete();
    }

    /**
     * Cria múltiplas fazendas para um produtor
     */
    public function createFarmsForProducer(string $producerId, array $farmsData): array
    {
        $created = [];

        if (empty($farmsData) || !is_array($farmsData)) {
            return $created;
        }

        foreach ($farmsData as $farmIndex => $farmData) {
            // Validar dados mínimos
            if (empty($farmData['name']) || empty($farmData['city']) || empty($farmData['state'])) {
                continue;
            }

            try {
                $farm = $this->createFarm($producerId, $farmData);
                $created[] = $farm;
            } catch (ValidationException $e) {
                // Re-throw com índice da fazenda para melhor feedback
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

