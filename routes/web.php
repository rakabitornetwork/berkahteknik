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
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Public\LandingController;
use App\Http\Controllers\Public\PublicPostController;
use App\Http\Controllers\CmsPostController;
use App\Http\Controllers\LandingSettingController;
use App\Http\Controllers\SystemUpdateController;

// ─── Halaman publik (landing & konten) ───────────────────────────────────────
Route::get('/', [LandingController::class, 'index'])->name('home');
Route::get('/konten', [PublicPostController::class, 'index'])->name('posts.index');
Route::get('/konten/{slug}', [PublicPostController::class, 'show'])->name('posts.show');

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

        // Vehicles
        Route::get('/vehicles/create',   [PortalDashboardController::class, 'createVehicle'])->name('vehicles.create');
        Route::post('/vehicles',          [PortalDashboardController::class, 'storeVehicle'])->name('vehicles.store');

        // Bookings
        Route::get('/bookings/create',   [PortalDashboardController::class, 'createBooking'])->name('bookings.create');
        Route::post('/bookings',          [PortalDashboardController::class, 'storeBooking'])->name('bookings.store');
    });
});

// ─── Admin Auth ───────────────────────────────────────────────────────────────
Route::get('/admin/login',   [AdminAuthController::class, 'showLoginForm'])->name('login');
Route::post('/admin/login',  [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('logout')->middleware('auth');

// ─── Mechanic Panel (Protected) ────────────────────────────────────────────────
Route::prefix('mechanic')->middleware(['auth', 'mechanic.role'])->name('mechanic.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\MechanicDashboardController::class, 'index'])->name('dashboard');
    Route::get('/services/{service}', [App\Http\Controllers\MechanicDashboardController::class, 'show'])->name('services.show');
    Route::patch('/services/{service}/status', [App\Http\Controllers\MechanicDashboardController::class, 'updateStatus'])->name('services.status');
    Route::post('/services/{service}/notes', [App\Http\Controllers\MechanicDashboardController::class, 'updateNotes'])->name('services.notes');
});

// ─── Admin Panel (Protected) ──────────────────────────────────────────────────
Route::prefix('admin')->middleware(['auth', 'admin.role'])->name('admin.')->group(function () {

    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Laporan
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

    // Pengaturan Aplikasi
    Route::get('/settings', [SettingController::class, 'edit'])->name('settings.edit');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');

    // Update dari GitHub (hanya role admin)
    Route::middleware('admin.role')->prefix('system-update')->name('system-update.')->group(function () {
        Route::get('/', [SystemUpdateController::class, 'index'])->name('index');
        Route::post('/deploy', [SystemUpdateController::class, 'deploy'])->name('deploy');
        Route::post('/discard-changes', [SystemUpdateController::class, 'discardChanges'])->name('discard-changes');
    });

    // CMS Konten Situs
    Route::prefix('cms')->name('cms.')->group(function () {
        Route::get('/landing', [LandingSettingController::class, 'edit'])->name('landing.edit');
        Route::put('/landing', [LandingSettingController::class, 'update'])->name('landing.update');
        Route::resource('posts', CmsPostController::class)->except(['show'])->parameters(['posts' => 'post']);
    });

    // Profil Admin
    Route::get('/profile', [AdminProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [AdminProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [AdminProfileController::class, 'updatePassword'])->name('profile.password');

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

    // Surat Perintah Kerja (SPK)
    Route::get('/work-orders', [WorkOrderController::class, 'index'])->name('work-orders.index');
    Route::get('/services/{service}/spk', [WorkOrderController::class, 'print'])->name('services.spk');

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
    Route::get('services/{service}/invoice', [ServiceController::class, 'invoice'])->name('services.invoice');

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

    // Mekanik
    Route::resource('mechanics', App\Http\Controllers\MechanicController::class)->except(['create', 'show', 'edit'])->names([
        'index'   => 'mechanics.index',
        'store'   => 'mechanics.store',
        'update'  => 'mechanics.update',
        'destroy' => 'mechanics.destroy',
    ]);

    // Penjualan Langsung (POS)
    Route::patch('sales/{sale}/pay', [App\Http\Controllers\SaleController::class, 'pay'])->name('sales.pay');
    Route::get('/sales/{sale}/receipt', [App\Http\Controllers\SaleController::class, 'receipt'])->name('sales.receipt');
    Route::resource('sales', App\Http\Controllers\SaleController::class)->only(['index', 'create', 'store', 'show', 'destroy'])->names([
        'index'   => 'sales.index',
        'create'  => 'sales.create',
        'store'   => 'sales.store',
        'show'    => 'sales.show',
        'destroy' => 'sales.destroy',
    ]);

    // Pengeluaran Operasional
    Route::resource('expenses', App\Http\Controllers\ExpenseController::class)->except(['show'])->names([
        'index'   => 'expenses.index',
        'create'  => 'expenses.create',
        'store'   => 'expenses.store',
        'edit'    => 'expenses.edit',
        'update'  => 'expenses.update',
        'destroy' => 'expenses.destroy',
    ]);
    // Supplier & Purchase Orders
    Route::resource('suppliers', SupplierController::class);
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::patch('purchase-orders/{purchaseOrder}/status', [PurchaseOrderController::class, 'updateStatus'])->name('purchase-orders.status');
});
