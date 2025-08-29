<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyManagerController;

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');

Route::post('/locale', function (Request $request) {
    $locale = $request->input('locale');
    if (in_array($locale, ['en', 'fr', 'de', 'nl'])) {
        session(['locale' => $locale]);
    }
    return response()->json(['locale' => session('locale')]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('property/{property}', [PropertyController::class, 'show'])->name('property.show');

    // Property manager routes
    Route::get('setup-profile', [PropertyManagerController::class, 'create'])
        ->name('property-manager.create');
    Route::post('setup-profile', [PropertyManagerController::class, 'store'])
        ->name('property-manager.store');
    Route::get('edit-profile', [PropertyManagerController::class, 'edit'])
        ->name('property-manager.edit');
    Route::put('edit-profile', [PropertyManagerController::class, 'update'])
        ->name('property-manager.update');

    // Property resource routes
    Route::resource('properties', PropertyController::class);

    // API routes for properties
    Route::get('api/properties/token/{token}', [PropertyController::class, 'findByToken'])
        ->name('properties.findByToken');

    // Secure image serving routes
    Route::get('properties/{property}/image', [PropertyController::class, 'showImage'])
        ->name('properties.image');
    Route::get('properties/{property}/image/signed', [PropertyController::class, 'showImageSigned'])
        ->name('properties.image.signed');

    // Image upload routes
    Route::post('api/images/upload', [ImageUploadController::class, 'upload'])
        ->name('images.upload');
    Route::delete('api/images/delete', [ImageUploadController::class, 'delete'])
        ->name('images.delete');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
