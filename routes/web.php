<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name("dashboard");
        Route::prefix('properties')->group(function () {
            Route::get('/', [DashboardController::class, 'properties']);
            Route::post('/', [PropertyController::class, 'store']);
            Route::get('/create', [PropertyController::class, 'create']);
            Route::get('/{property}', [PropertyController::class, 'show'])->name('properties.show');
        });
        Route::get('/applications', [DashboardController::class, 'applications']);
        Route::get('/tenants', [DashboardController::class, 'tenants']);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
