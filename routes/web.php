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
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();
        
        // Check if user has a property manager profile
        $propertyManager = $user->propertyManager;
        if (!$propertyManager) {
            return redirect()->route('profile.setup');
        }
        
        // Check if profile is verified
        if (!$propertyManager->isVerified()) {
            return redirect()->route('profile.unverified');
        }
        
        // Get user's properties
        $properties = $user->properties()->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('dashboard', [
            'properties' => $properties
        ]);
    })->name('dashboard');

    Route::get('property/{property}', [PropertyController::class, 'show'])->name('property.show');

    // Property manager routes
    Route::get('profile', function (Request $request) {
        $user = $request->user();
        $propertyManager = $user->propertyManager;
        
        // If no profile exists, redirect to setup
        if (!$propertyManager) {
            return redirect()->route('profile.setup');
        }
        
        // If profile exists and is submitted, redirect to unverified
        return redirect()->route('profile.unverified');
    })->name('profile');
    
    Route::get('profile/setup', [PropertyManagerController::class, 'create'])
        ->name('profile.setup');
    Route::post('profile/setup', [PropertyManagerController::class, 'store'])
        ->name('property-manager.store');
    Route::get('profile/unverified', function (Request $request) {
        $user = $request->user();
        $propertyManager = $user->propertyManager;
        
        // If no profile exists, redirect to setup
        if (!$propertyManager) {
            return redirect()->route('profile.setup');
        }
        
        // If editing is requested, show the edit form
        if ($request->get('edit')) {
            return Inertia::render('profile-setup', [
                'propertyManager' => $propertyManager,
                'user' => $user,
                'isEditing' => true,
                'rejectionReason' => $propertyManager->rejection_reason,
                'rejectedFields' => $propertyManager->rejected_fields ?? [],
            ]);
        }
        
        return Inertia::render('profile-unverified', [
            'isRejected' => $propertyManager ? $propertyManager->isRejected() : false,
            'rejectionReason' => $propertyManager ? $propertyManager->rejection_reason : null,
        ]);
    })->name('profile.unverified');
    Route::get('edit-profile', [PropertyManagerController::class, 'edit'])
        ->name('property-manager.edit');
    Route::put('edit-profile', [PropertyManagerController::class, 'update'])
        ->name('property-manager.update');
    Route::get('property-manager/document/{type}', [PropertyManagerController::class, 'serveDocument'])
        ->name('property-manager.document');

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
