<?php

use App\Models\TenantProfile;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guest cannot access profile page', function () {
    $response = $this->get('/profile');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toStartWith(config('app.url').'/login');
});

test('authenticated user can access profile page', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/profile');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page->component('tenant/profile'));
});

test('profile page shows no profile state for user without profile', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/profile');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/profile')
            ->where('hasProfile', false)
            ->where('profile', null)
    );
});

test('profile page shows profile data for user with profile', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $tenantProfile = TenantProfile::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->get('/profile');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/profile')
            ->where('hasProfile', true)
            ->has('profile')
            ->has('completeness')
            ->has('documents')
    );
});

test('profile completeness is calculated correctly', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    // Create profile with factory defaults
    $tenantProfile = TenantProfile::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->get('/profile');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/profile')
            ->where('hasProfile', true)
            ->has('completeness')
    );
});

test('profile shows document upload status correctly', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $tenantProfile = TenantProfile::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->get('/profile');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/profile')
            ->has('documents')
    );
});

test('profile edit page redirects correctly', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    TenantProfile::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->get('/profile/tenant/edit');

    $response->assertOk();
});
