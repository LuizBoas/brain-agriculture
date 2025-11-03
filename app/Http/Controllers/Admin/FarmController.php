<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use App\Models\Farm;
use App\Models\Harvest;
use App\Models\Crop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class FarmController extends Controller
{
    public function index(Request $request)
    {
        $query = Farm::with(['producer'])->withCount('harvests');

        // Busca por nome da fazenda, cidade, estado ou nome do produtor
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('state', 'like', "%{$search}%")
                  ->orWhereHas('producer', function($producerQuery) use ($search) {
                      $producerQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = $request->get('per_page', 15);
        $farms = $query->paginate($perPage);

        return Inertia::render('panel-admin/dashboardFarm', [
            'farms' => $farms,
        ]);
    }

    public function store(Request $request, $producerId)
    {
        $producer = Producer::findOrFail($producerId);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|size:2',
            'total_area' => 'required|numeric|min:0',
            'arable_area' => 'required|numeric|min:0',
            'vegetation_area' => 'required|numeric|min:0',
            'harvests' => 'nullable|array',
            'harvests.*.year' => 'required|string',
            'harvests.*.crops' => 'nullable|array',
            'harvests.*.crops.*' => 'nullable|string',
        ]);

        // Validar soma das áreas
        $totalArea = (float) $request->total_area;
        $arableArea = (float) $request->arable_area;
        $vegetationArea = (float) $request->vegetation_area;

        if (($arableArea + $vegetationArea) > $totalArea) {
            return back()->withErrors(['farms' => 'A soma das áreas agricultável e vegetação não pode ultrapassar a área total']);
        }

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $farm = Farm::create([
            'producer_id' => $producer->id,
            'name' => $request->name,
            'city' => $request->city,
            'state' => $request->state,
            'total_area' => $totalArea,
            'arable_area' => $arableArea,
            'vegetation_area' => $vegetationArea,
        ]);

        // Criar safras e culturas
        if ($request->has('harvests') && is_array($request->harvests)) {
            foreach ($request->harvests as $harvestData) {
                $harvest = Harvest::create([
                    'farm_id' => $farm->id,
                    'year' => $harvestData['year'],
                ]);

                if (isset($harvestData['crops']) && is_array($harvestData['crops'])) {
                    foreach ($harvestData['crops'] as $cropName) {
                        if (!empty($cropName)) {
                            Crop::create([
                                'harvest_id' => $harvest->id,
                                'name' => $cropName,
                            ]);
                        }
                    }
                }
            }
        }

        return redirect()->route('admin.dashboard.producer.detail', $producer->id)->with('success', 'Fazenda cadastrada com sucesso!');
    }

    public function update(Request $request, $producerId, $farmId)
    {
        $farm = Farm::where('producer_id', $producerId)->findOrFail($farmId);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|size:2',
            'total_area' => 'required|numeric|min:0',
            'arable_area' => 'required|numeric|min:0',
            'vegetation_area' => 'required|numeric|min:0',
        ]);

        $totalArea = (float) $request->total_area;
        $arableArea = (float) $request->arable_area;
        $vegetationArea = (float) $request->vegetation_area;

        if (($arableArea + $vegetationArea) > $totalArea) {
            return back()->withErrors(['farms' => 'A soma das áreas agricultável e vegetação não pode ultrapassar a área total']);
        }

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $farm->update([
            'name' => $request->name,
            'city' => $request->city,
            'state' => $request->state,
            'total_area' => $totalArea,
            'arable_area' => $arableArea,
            'vegetation_area' => $vegetationArea,
        ]);

        return redirect()->route('admin.dashboard.producer.detail', $producerId)->with('success', 'Fazenda atualizada com sucesso!');
    }

    public function destroy($producerId, $farmId)
    {
        $farm = Farm::where('producer_id', $producerId)->findOrFail($farmId);
        
        // Deletar em cascata (harvests, crops)
        foreach ($farm->harvests as $harvest) {
            $harvest->crops()->delete();
        }
        $farm->harvests()->delete();
        $farm->delete();

        return redirect()->route('admin.dashboard.producer.detail', $producerId)->with('success', 'Fazenda excluída com sucesso!');
    }
}

