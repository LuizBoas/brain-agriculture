<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use App\Models\Farm;
use App\Models\Harvest;
use App\Models\Crop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $totalFarms = Farm::count();
        $totalHectares = Farm::sum('total_area');

        $byState = Farm::select('state', DB::raw('COUNT(*) as count'))
            ->groupBy('state')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'label' => $item->state,
                    'value' => $item->count
                ];
            });

        $byCrop = Crop::select('name', DB::raw('COUNT(*) as count'))
            ->groupBy('name')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function($item) {
                return [
                    'label' => $item->name,
                    'value' => $item->count
                ];
            });

        $totalArable = Farm::sum('arable_area');
        $totalVegetation = Farm::sum('vegetation_area');
        
        $bySoilUse = [
            ['label' => 'Área Agricultável', 'value' => (float) $totalArable],
            ['label' => 'Área de Vegetação', 'value' => (float) $totalVegetation]
        ];

        return Inertia::render('panel-admin/dashboard', [
            'totalFarms' => $totalFarms,
            'totalHectares' => (float) $totalHectares,
            'byState' => $byState,
            'byCrop' => $byCrop,
            'bySoilUse' => $bySoilUse,
        ]);
    }
}


