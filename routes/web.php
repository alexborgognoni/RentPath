<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\WelcomeController::class, 'index'])->name('home');

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
    
    Route::get('property/{id}', function ($id) {
        return Inertia::render('property', ['propertyId' => $id]);
    })->name('property.show');
    
    // Property resource routes
    Route::resource('properties', App\Http\Controllers\PropertyController::class);
    
    // API routes for properties
    Route::get('api/properties/token/{token}', [App\Http\Controllers\PropertyController::class, 'findByToken'])
         ->name('properties.findByToken');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
