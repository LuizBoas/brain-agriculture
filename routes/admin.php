<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProducerController;
use App\Http\Controllers\Admin\FarmController;
use App\Http\Controllers\Admin\HarvestController;
use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'admin'])->group(function () {
    // Dashboard principal
    Route::get('/admin/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    // Produtores
    Route::get('/admin/dashboard/producer', [ProducerController::class, 'index'])->name('dashboard.producer');
    Route::get('/admin/dashboard/producer/{id}', [ProducerController::class, 'show'])->name('dashboard.producer.detail');
    Route::get('/admin/producer/{id}/edit', [ProducerController::class, 'edit'])->name('producer.edit.form');
    Route::post('/admin/producer', [ProducerController::class, 'store'])->name('producer.create');
    Route::put('/admin/producer/{id}', [ProducerController::class, 'update'])->name('producer.edit');
    Route::delete('/admin/producer/{id}', [ProducerController::class, 'destroy'])->name('producer.delete');

    // Fazendas
    Route::get('/admin/dashboard/farm', [FarmController::class, 'index'])->name('dashboard.farm');
    Route::post('/admin/producer/{producerId}/farm', [FarmController::class, 'store'])->name('farm.create');
    Route::put('/admin/producer/{producerId}/farm/{farmId}', [FarmController::class, 'update'])->name('farm.edit');
    Route::delete('/admin/producer/{producerId}/farm/{farmId}', [FarmController::class, 'destroy'])->name('farm.delete');

    // Colheitas
    Route::get('/admin/dashboard/harvest', [HarvestController::class, 'index'])->name('dashboard.harvest');

    // Administradores
    Route::get('/admin/dashboard/admin', [AdminController::class, 'index'])->name('dashboard.admin');
    Route::post('/admin/admin', [AdminController::class, 'store'])->name('create');
    Route::put('/admin/admin/{id}', [AdminController::class, 'update'])->name('edit');
    Route::delete('/admin/admin/{id}', [AdminController::class, 'destroy'])->name('delete');
});

