<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SparePartController;
use App\Http\Controllers\VehicleController;

// ─── Portal Pelanggan (Sementara) ──────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Portal/Dashboard', [
        'auth' => ['user' => null],
    ]);
});

// ─── Admin Auth ─────────────────────────────────────────────────────────────
Route::get('/admin/login',  [AdminAuthController::class, 'showLoginForm'])->name('login');
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout',[AdminAuthController::class, 'logout'])->name('logout')->middleware('auth');

// ─── Admin Panel (Protected) ────────────────────────────────────────────────
Route::prefix('admin')->middleware('auth')->name('admin.')->group(function () {

    // Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Manajemen Pelanggan
    Route::resource('customers', CustomerController::class)->names([
        'index'   => 'customers.index',
        'create'  => 'customers.create',
        'store'   => 'customers.store',
        'show'    => 'customers.show',
        'edit'    => 'customers.edit',
        'update'  => 'customers.update',
        'destroy' => 'customers.destroy',
    ]);

    // Manajemen Kendaraan
    Route::resource('vehicles', VehicleController::class)->except(['index'])->names([
        'create'  => 'vehicles.create',
        'store'   => 'vehicles.store',
        'show'    => 'vehicles.show',
        'edit'    => 'vehicles.edit',
        'update'  => 'vehicles.update',
        'destroy' => 'vehicles.destroy',
    ]);

    // Manajemen Servis
    Route::resource('services', ServiceController::class)->names([
        'index'   => 'services.index',
        'create'  => 'services.create',
        'store'   => 'services.store',
        'show'    => 'services.show',
        'edit'    => 'services.edit',
        'update'  => 'services.update',
        'destroy' => 'services.destroy',
    ]);
    Route::patch('services/{service}/status', [ServiceController::class, 'updateStatus'])->name('services.status');

    // Manajemen Spare Part
    Route::resource('spare-parts', SparePartController::class)->except(['show'])->names([
        'index'   => 'spare-parts.index',
        'create'  => 'spare-parts.create',
        'store'   => 'spare-parts.store',
        'edit'    => 'spare-parts.edit',
        'update'  => 'spare-parts.update',
        'destroy' => 'spare-parts.destroy',
    ]);
    Route::patch('spare-parts/{sparePart}/stock', [SparePartController::class, 'adjustStock'])->name('spare-parts.stock');
});
