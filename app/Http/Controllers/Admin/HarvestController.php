<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Harvest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HarvestController extends Controller
{
    public function index(Request $request)
    {
        $query = Harvest::with(['farm.producer', 'crops']);

        // Busca por ano da safra, nome da fazenda ou nome do produtor
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('year', 'like', "%{$search}%")
                  ->orWhereHas('farm', function($farmQuery) use ($search) {
                      $farmQuery->where('name', 'like', "%{$search}%")
                                ->orWhereHas('producer', function($producerQuery) use ($search) {
                                    $producerQuery->where('name', 'like', "%{$search}%");
                                });
                  })
                  ->orWhereHas('crops', function($cropQuery) use ($search) {
                      $cropQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $perPage = $request->get('per_page', 15);
        $harvests = $query->paginate($perPage);

        return Inertia::render('panel-admin/dashboardHarvest', [
            'harvests' => $harvests,
        ]);
    }
}
