<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guest cannot access dashboard', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toStartWith(config('app.url').'/login');
});

test('authenticated user is redirected from dashboard to applications', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertRedirect(route('applications.index'));
});

test('dashboard route name still works for backwards compatibility', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    // The route('dashboard') should still exist and redirect
    $this->actingAs($user);

    $dashboardUrl = route('dashboard');
    expect($dashboardUrl)->toContain('/dashboard');
});
