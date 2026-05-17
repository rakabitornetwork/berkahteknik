<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Portal Pelanggan
Route::get('/', function () {
    return Inertia::render('Portal/Dashboard', [
        'auth' => [
            'user' => ['name' => 'Bapak Budi (Customer)']
        ]
    ]);
});

// Admin Panel
Route::prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => ['name' => 'Admin Utama']
            ]
        ]);
    });
});
