<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use App\Models\Farm;
use App\Services\FarmService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class FarmController extends Controller
{
    protected FarmService $farmService;

    public function __construct(FarmService $farmService)
    {
        $this->farmService = $farmService;
    }
    public function index(Request $request)
    {
        $query = Farm::with(['producer', 'harvests.crops'])->withCount('harvests');

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

        $perPage = $request->get('per_page', 10);
        $farms = $query->paginate($perPage);

        // Buscar produtores para o select (se solicitado)
        $producers = Producer::select('id', 'name', 'document', 'document_type')->get();

        return Inertia::render('panel-admin/dashboardFarm', [
            'farms' => $farms,
            'producers' => $producers,
        ]);
    }

    public function store(Request $request, $producerId)
    {
        try {
            $producer = Producer::findOrFail($producerId);
            $this->farmService->createFarm($producer->id, $request->all());
            return redirect()->route('admin.admin.dashboard.producer.detail', $producer->id)->with('success', 'Fazenda cadastrada com sucesso!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }
    }

    public function update(Request $request, $producerId, $farmId)
    {
        try {
            $farm = Farm::where('producer_id', $producerId)->findOrFail($farmId);
            $this->farmService->updateFarm($farm, $request->all());
            return redirect()->route('admin.admin.dashboard.farm')->with('success', 'Fazenda atualizada com sucesso!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy($producerId, $farmId)
    {
        $farm = Farm::where('producer_id', $producerId)->findOrFail($farmId);
        $this->farmService->deleteFarm($farm);
        return redirect()->route('admin.admin.dashboard.farm')->with('success', 'Fazenda excluída com sucesso!');
    }
}

