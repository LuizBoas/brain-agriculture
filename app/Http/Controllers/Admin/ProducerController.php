<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Producer;
use App\Services\ProducerService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class ProducerController extends Controller
{
    protected ProducerService $producerService;

    public function __construct(ProducerService $producerService)
    {
        $this->producerService = $producerService;
    }
    public function index(Request $request)
    {
        $query = Producer::withCount('farms');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('document', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 10);
        $producers = $query->paginate($perPage);

        return Inertia::render('panel-admin/dashboardProducer', [
            'producers' => $producers,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $this->producerService->createProducer($request->all());
            return redirect()->route('admin.admin.dashboard.producer')->with('success', 'Produtor cadastrado com sucesso!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }
    }

    public function edit($id)
    {
        $producer = Producer::with(['farms.harvests'])->findOrFail($id);
        $formattedData = $this->producerService->formatForEdit($producer);
        return response()->json($formattedData);
    }

    public function update(Request $request, $id)
    {
        try {
            $producer = Producer::findOrFail($id);
            $this->producerService->updateProducer($producer, $request->all());
            return redirect()->route('admin.admin.dashboard.producer')->with('success', 'Produtor atualizado com sucesso!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }
    }

    public function destroy($id)
    {
        $producer = Producer::findOrFail($id);
        $this->producerService->deleteProducer($producer);
        return redirect()->route('admin.admin.dashboard.producer')->with('success', 'Produtor excluído com sucesso!');
    }

    public function show($id)
    {
        $producer = Producer::with(['farms.harvests.crops', 'creator'])->findOrFail($id);
        
        return Inertia::render('panel-admin/dashboardProducerDetail', [
            'producer' => $producer,
        ]);
    }
}

