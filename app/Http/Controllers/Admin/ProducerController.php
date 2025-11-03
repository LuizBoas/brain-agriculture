<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use App\Models\Farm;
use App\Models\Crop;
use App\Models\Harvest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ProducerController extends Controller
{
    public function index(Request $request)
    {
        $query = Producer::withCount('farms');

        // Busca por nome ou documento
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('document', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $producers = $query->paginate($perPage);

        return Inertia::render('panel-admin/dashboardProducer', [
            'producers' => $producers,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|string',
            'document_type' => 'required|in:CPF,CNPJ',
            'name' => 'required|string|max:255',
            'farms' => 'nullable|array',
            'farms.*.name' => 'required_with:farms|string|max:255',
            'farms.*.city' => 'required_with:farms|string|max:255',
            'farms.*.state' => 'required_with:farms|string|size:2',
            'farms.*.total_area' => 'required_with:farms|numeric|min:0',
            'farms.*.arable_area' => 'required_with:farms|numeric|min:0',
            'farms.*.vegetation_area' => 'required_with:farms|numeric|min:0',
            'farms.*.harvests' => 'nullable|array',
            'farms.*.harvests.*.year' => 'required_with:farms.*.harvests|string',
            'farms.*.harvests.*.crops' => 'nullable|array',
            'farms.*.harvests.*.crops.*' => 'nullable|string|max:255',
        ]);

        // Validar CPF/CNPJ
        $document = preg_replace('/[^0-9]/', '', $request->document);
        if ($request->document_type === 'CPF' && strlen($document) !== 11) {
            return back()->withErrors(['document' => 'CPF inválido']);
        }
        if ($request->document_type === 'CNPJ' && strlen($document) !== 14) {
            return back()->withErrors(['document' => 'CNPJ inválido']);
        }

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Verificar duplicidade
        $exists = Producer::where('document', $document)
            ->where('document_type', $request->document_type)
            ->exists();

        if ($exists) {
            return back()->withErrors(['document' => 'Já existe um produtor com este documento']);
        }

        $producer = Producer::create([
            'document' => $document,
            'document_type' => $request->document_type,
            'name' => $request->name,
            'created_by' => auth()->id(),
        ]);

        // Log para debug
        \Log::info('Dados recebidos no backend:', [
            'all' => $request->all(),
            'farms' => $request->farms,
            'farms_count' => $request->has('farms') ? count($request->farms ?? []) : 0,
            'farms_is_array' => is_array($request->farms),
            'farms_type' => gettype($request->farms),
            'input' => $request->input('farms')
        ]);

        // Criar fazendas
        if ($request->has('farms') && is_array($request->farms) && count($request->farms) > 0) {
            foreach ($request->farms as $farmIndex => $farmData) {
                // Validar que a fazenda tem dados mínimos
                if (empty($farmData['name']) || empty($farmData['city']) || empty($farmData['state'])) {
                    continue; // Pula fazendas incompletas
                }

                // Validar soma das áreas
                $totalArea = isset($farmData['total_area']) && $farmData['total_area'] !== '' ? (float) $farmData['total_area'] : 0;
                $arableArea = isset($farmData['arable_area']) && $farmData['arable_area'] !== '' ? (float) $farmData['arable_area'] : 0;
                $vegetationArea = isset($farmData['vegetation_area']) && $farmData['vegetation_area'] !== '' ? (float) $farmData['vegetation_area'] : 0;

                if ($totalArea > 0 && ($arableArea + $vegetationArea) > $totalArea) {
                    return back()->withErrors(["farms.{$farmIndex}.total_area" => 'A soma das áreas agricultável e vegetação não pode ultrapassar a área total']);
                }

                $farm = Farm::create([
                    'producer_id' => $producer->id,
                    'name' => trim($farmData['name']),
                    'city' => trim($farmData['city']),
                    'state' => trim($farmData['state']),
                    'total_area' => $totalArea,
                    'arable_area' => $arableArea,
                    'vegetation_area' => $vegetationArea,
                ]);

                // Criar safras e culturas
                if (isset($farmData['harvests']) && is_array($farmData['harvests']) && count($farmData['harvests']) > 0) {
                    foreach ($farmData['harvests'] as $harvestData) {
                        // Validar que a safra tem ano
                        if (empty($harvestData['year']) || trim($harvestData['year']) === '') {
                            continue; // Pula safras sem ano
                        }

                        $harvest = Harvest::create([
                            'farm_id' => $farm->id,
                            'year' => trim($harvestData['year']),
                        ]);

                        // Criar culturas
                        if (isset($harvestData['crops']) && is_array($harvestData['crops']) && count($harvestData['crops']) > 0) {
                            foreach ($harvestData['crops'] as $cropName) {
                                if (!empty($cropName) && trim($cropName) !== '') {
                                    Crop::create([
                                        'harvest_id' => $harvest->id,
                                        'name' => trim($cropName),
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
        }

        return redirect()->route('admin.dashboard.producer')->with('success', 'Produtor cadastrado com sucesso!');
    }

    public function edit($id)
    {
        $producer = Producer::with(['farms.harvests.crops'])->findOrFail($id);
        
        // Formatar os dados para o frontend
        $farmsData = $producer->farms->map(function($farm) {
            return [
                'id' => $farm->id,
                'name' => $farm->name,
                'city' => $farm->city,
                'state' => $farm->state,
                'total_area' => (string)$farm->total_area,
                'arable_area' => (string)$farm->arable_area,
                'vegetation_area' => (string)$farm->vegetation_area,
                'harvests' => $farm->harvests->map(function($harvest) {
                    return [
                        'id' => $harvest->id,
                        'year' => $harvest->year,
                        'crops' => $harvest->crops->pluck('name')->toArray()
                    ];
                })->toArray()
            ];
        })->toArray();

        return response()->json([
            'producer' => [
                'id' => $producer->id,
                'document' => $producer->document,
                'document_type' => $producer->document_type,
                'name' => $producer->name,
            ],
            'farms' => $farmsData
        ]);
    }

    public function update(Request $request, $id)
    {
        $producer = Producer::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'document' => 'required|string',
            'document_type' => 'required|in:CPF,CNPJ',
            'name' => 'required|string|max:255',
            'farms' => 'nullable|array',
            'farms.*.name' => 'required_with:farms|string|max:255',
            'farms.*.city' => 'required_with:farms|string|max:255',
            'farms.*.state' => 'required_with:farms|string|size:2',
            'farms.*.total_area' => 'required_with:farms|numeric|min:0',
            'farms.*.arable_area' => 'required_with:farms|numeric|min:0',
            'farms.*.vegetation_area' => 'required_with:farms|numeric|min:0',
            'farms.*.harvests' => 'nullable|array',
            'farms.*.harvests.*.year' => 'required_with:farms.*.harvests|string',
            'farms.*.harvests.*.crops' => 'nullable|array',
            'farms.*.harvests.*.crops.*' => 'nullable|string|max:255',
        ]);

        $document = preg_replace('/[^0-9]/', '', $request->document);
        
        if ($request->document_type === 'CPF' && strlen($document) !== 11) {
            return back()->withErrors(['document' => 'CPF inválido']);
        }
        if ($request->document_type === 'CNPJ' && strlen($document) !== 14) {
            return back()->withErrors(['document' => 'CNPJ inválido']);
        }

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Verificar duplicidade (exceto o próprio registro)
        $exists = Producer::where('document', $document)
            ->where('document_type', $request->document_type)
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['document' => 'Já existe um produtor com este documento']);
        }

        $producer->update([
            'document' => $document,
            'document_type' => $request->document_type,
            'name' => $request->name,
        ]);

        // Atualizar fazendas (lógica similar ao store)
        // Por enquanto, vamos deletar todas e recriar (simplificado)
        // Em produção, seria melhor fazer update/delete/insert seletivo
        foreach ($producer->farms as $farm) {
            foreach ($farm->harvests as $harvest) {
                $harvest->crops()->delete();
            }
            $farm->harvests()->delete();
        }
        $producer->farms()->delete();

        if ($request->has('farms') && is_array($request->farms)) {
            foreach ($request->farms as $farmIndex => $farmData) {
                // Validar soma das áreas
                $totalArea = isset($farmData['total_area']) ? (float) $farmData['total_area'] : 0;
                $arableArea = isset($farmData['arable_area']) ? (float) $farmData['arable_area'] : 0;
                $vegetationArea = isset($farmData['vegetation_area']) ? (float) $farmData['vegetation_area'] : 0;

                if ($totalArea > 0 && ($arableArea + $vegetationArea) > $totalArea) {
                    return back()->withErrors(["farms.{$farmIndex}.total_area" => 'A soma das áreas agricultável e vegetação não pode ultrapassar a área total']);
                }

                $farm = Farm::create([
                    'producer_id' => $producer->id,
                    'name' => $farmData['name'],
                    'city' => $farmData['city'],
                    'state' => $farmData['state'],
                    'total_area' => $totalArea,
                    'arable_area' => $arableArea,
                    'vegetation_area' => $vegetationArea,
                ]);

                // Criar safras e culturas
                if (isset($farmData['harvests']) && is_array($farmData['harvests'])) {
                    foreach ($farmData['harvests'] as $harvestData) {
                        $harvest = Harvest::create([
                            'farm_id' => $farm->id,
                            'year' => $harvestData['year'],
                        ]);

                        // Criar culturas
                        if (isset($harvestData['crops']) && is_array($harvestData['crops'])) {
                            foreach ($harvestData['crops'] as $cropName) {
                                if (trim($cropName) !== '') {
                                    Crop::create([
                                        'harvest_id' => $harvest->id,
                                        'name' => trim($cropName),
                                    ]);
                                }
                            }
                        }
                    }
                }
            }
        }

        return redirect()->route('admin.dashboard.producer')->with('success', 'Produtor atualizado com sucesso!');
    }

    public function destroy($id)
    {
        $producer = Producer::findOrFail($id);
        
        // Deletar em cascata (farms, harvests, crops)
        foreach ($producer->farms as $farm) {
            foreach ($farm->harvests as $harvest) {
                $harvest->crops()->delete();
            }
            $farm->harvests()->delete();
        }
        $producer->farms()->delete();
        $producer->delete();

        return redirect()->route('admin.dashboard.producer')->with('success', 'Produtor excluído com sucesso!');
    }

    public function show($id)
    {
        $producer = Producer::with(['farms.harvests.crops', 'creator'])->findOrFail($id);
        
        return Inertia::render('panel-admin/dashboardProducerDetail', [
            'producer' => $producer,
        ]);
    }
}

