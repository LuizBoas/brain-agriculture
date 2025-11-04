<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProducerController;
use App\Http\Controllers\Admin\FarmController;
use App\Http\Controllers\Admin\HarvestController;
use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'admin'])->prefix('admin')->group(function () {
    // Dashboard principal
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('admin.dashboard');

    // Produtores
    Route::get('/dashboard/producer', [ProducerController::class, 'index'])->name('admin.dashboard.producer');
    Route::get('/dashboard/producer/{id}', [ProducerController::class, 'show'])->name('admin.dashboard.producer.detail');
    Route::get('/producer/{id}/edit', [ProducerController::class, 'edit'])->name('admin.producer.edit.form');
    Route::post('/producer', [ProducerController::class, 'store'])->name('admin.producer.create');
    Route::put('/producer/{id}', [ProducerController::class, 'update'])->name('admin.producer.edit');
    Route::delete('/producer/{id}', [ProducerController::class, 'destroy'])->name('admin.producer.delete');

    // Fazendas
    Route::get('/dashboard/farm', [FarmController::class, 'index'])->name('admin.dashboard.farm');
    Route::post('/producer/{producerId}/farm', [FarmController::class, 'store'])->name('admin.farm.create');
    Route::put('/producer/{producerId}/farm/{farmId}', [FarmController::class, 'update'])->name('admin.farm.edit');
    Route::delete('/producer/{producerId}/farm/{farmId}', [FarmController::class, 'destroy'])->name('admin.farm.delete');

    // Safras
    Route::get('/dashboard/harvest', [HarvestController::class, 'index'])->name('admin.dashboard.harvest');
    Route::put('/harvest/{id}', [HarvestController::class, 'update'])->name('admin.harvest.update');

    // Administradores
    Route::get('/dashboard/admin', [AdminController::class, 'index'])->name('admin.dashboard.admin');
    Route::post('/admin', [AdminController::class, 'store'])->name('admin.create');
    Route::put('/admin/{id}', [AdminController::class, 'update'])->name('admin.edit');
    Route::delete('/admin/{id}', [AdminController::class, 'destroy'])->name('admin.delete');
});

