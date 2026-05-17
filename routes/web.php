<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SparePartController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Portal\CustomerAuthController;
use App\Http\Controllers\Portal\PortalDashboardController;

// ─── Redirect root ke portal ─────────────────────────────────────────────────
Route::get('/', fn () => redirect('/portal'));

// ─── Portal Pelanggan: Auth ───────────────────────────────────────────────────
Route::prefix('portal')->name('portal.')->group(function () {
    Route::get('/',        fn () => redirect('/portal/login'))->name('home');
    Route::get('/login',   [CustomerAuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login',  [CustomerAuthController::class, 'login']);
    Route::get('/register',[CustomerAuthController::class, 'showRegisterForm'])->name('register');
    Route::post('/register',[CustomerAuthController::class, 'register']);
    Route::post('/logout', [CustomerAuthController::class, 'logout'])->name('logout');

    // Protected portal routes
    Route::middleware('auth:customer')->group(function () {
        Route::get('/dashboard',         [PortalDashboardController::class, 'index'])->name('dashboard');
        Route::get('/services/{id}',     [PortalDashboardController::class, 'serviceDetail'])->name('service.detail');
    });
});

// ─── Admin Auth ───────────────────────────────────────────────────────────────
Route::get('/admin/login',   [AdminAuthController::class, 'showLoginForm'])->name('login');
Route::post('/admin/login',  [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('logout')->middleware('auth');

// ─── Admin Panel (Protected) ──────────────────────────────────────────────────
Route::prefix('admin')->middleware('auth')->name('admin.')->group(function () {

    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Laporan
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // Pelanggan
    Route::resource('customers', CustomerController::class)->names([
        'index'   => 'customers.index',
        'create'  => 'customers.create',
        'store'   => 'customers.store',
        'show'    => 'customers.show',
        'edit'    => 'customers.edit',
        'update'  => 'customers.update',
        'destroy' => 'customers.destroy',
    ]);

    // Kendaraan
    Route::resource('vehicles', VehicleController::class)->except(['index'])->names([
        'create'  => 'vehicles.create',
        'store'   => 'vehicles.store',
        'show'    => 'vehicles.show',
        'edit'    => 'vehicles.edit',
        'update'  => 'vehicles.update',
        'destroy' => 'vehicles.destroy',
    ]);

    // Servis
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

    // Spare Part
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
