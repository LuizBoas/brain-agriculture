<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Harvest;
use App\Services\HarvestService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class HarvestController extends Controller
{
    protected HarvestService $harvestService;

    public function __construct(HarvestService $harvestService)
    {
        $this->harvestService = $harvestService;
    }

    public function index(Request $request)
    {
        $query = Harvest::with(['farm.producer', 'crops']);

        // Busca por ano da safra, nome da plantação/cultura, nome da fazenda ou nome do produtor
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('year', 'like', "%{$search}%")
                  ->orWhereHas('crops', function($cropQuery) use ($search) {
                      $cropQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('farm', function($farmQuery) use ($search) {
                      $farmQuery->where('name', 'like', "%{$search}%")
                                ->orWhereHas('producer', function($producerQuery) use ($search) {
                                    $producerQuery->where('name', 'like', "%{$search}%");
                                });
                  });
            });
        }

        $perPage = $request->get('per_page', 10);
        $harvests = $query->paginate($perPage);

        return Inertia::render('panel-admin/dashboardHarvest', [
            'harvests' => $harvests,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $harvest = Harvest::findOrFail($id);
            $this->harvestService->updateHarvest($harvest, $request->all());
            return redirect()->route('admin.admin.dashboard.harvest')->with('success', 'Safra atualizada com sucesso!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }
    }
}
