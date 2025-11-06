<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Settings routes - same paths on both tenant and manager domains
// No route names to avoid conflicts - use relative paths instead
Route::get('settings', function () {
    return redirect('/settings/profile');
});

Route::get('settings/profile', [ProfileController::class, 'edit']);

Route::patch('settings/profile', [ProfileController::class, 'update']);

Route::delete('settings/profile', [ProfileController::class, 'destroy']);

Route::get('settings/password', [PasswordController::class, 'edit']);

Route::put('settings/password', [PasswordController::class, 'update'])
    ->middleware('throttle:6,1');
