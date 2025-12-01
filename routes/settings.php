<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Settings routes - same paths on both tenant and manager domains
// Route names accept a prefix parameter for subdomain-specific naming
// Usage: require_once with $routePrefix set before requiring

$prefix = $routePrefix ?? 'settings';

Route::get('settings', function () use ($prefix) {
    return redirect()->route("{$prefix}.profile");
})->name("{$prefix}");

Route::get('settings/profile', [ProfileController::class, 'edit'])
    ->name("{$prefix}.profile");

Route::patch('settings/profile', [ProfileController::class, 'update'])
    ->name("{$prefix}.profile.update");

Route::delete('settings/profile', [ProfileController::class, 'destroy'])
    ->name("{$prefix}.profile.destroy");

Route::get('settings/password', [PasswordController::class, 'edit'])
    ->name("{$prefix}.password");

Route::put('settings/password', [PasswordController::class, 'update'])
    ->middleware('throttle:6,1')
    ->name("{$prefix}.password.update");

Route::get('settings/appearance', function () {
    return Inertia::render('settings/appearance');
})->name("{$prefix}.appearance");
