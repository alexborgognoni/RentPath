<?php

use App\Models\Application;
use App\Models\Property;
use App\Models\PropertyManager;
use App\Models\TenantProfile;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    // Create property manager and property
    $pmUser = User::factory()->create(['email_verified_at' => now()]);
    $propertyManager = PropertyManager::factory()->create([
        'user_id' => $pmUser->id,
        'profile_verified_at' => now(),
    ]);
    $this->property = Property::factory()->create([
        'property_manager_id' => $propertyManager->id,
    ]);
});

test('guest cannot access applications list', function () {
    $response = $this->get('/applications');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toStartWith(config('app.url').'/login');
});

test('authenticated user can access applications list', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/applications');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page->component('tenant/applications'));
});

test('applications list shows user applications', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $tenantProfile = TenantProfile::factory()->create([
        'user_id' => $user->id,
        'profile_verified_at' => now(),
    ]);

    Application::factory()->create([
        'tenant_profile_id' => $tenantProfile->id,
        'property_id' => $this->property->id,
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($user)->get('/applications');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/applications')
            ->has('applications', 1)
    );
});

test('applications list shows empty state for user without applications', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/applications');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/applications')
            ->has('applications', 0)
    );
});

test('applications list can be filtered by status', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $tenantProfile = TenantProfile::factory()->create([
        'user_id' => $user->id,
        'profile_verified_at' => now(),
    ]);

    // Create applications with different statuses
    Application::factory()->create([
        'tenant_profile_id' => $tenantProfile->id,
        'property_id' => $this->property->id,
        'status' => 'submitted',
    ]);

    Application::factory()->create([
        'tenant_profile_id' => $tenantProfile->id,
        'property_id' => Property::factory()->create([
            'property_manager_id' => $this->property->property_manager_id,
        ])->id,
        'status' => 'approved',
    ]);

    // Filter by approved status
    $response = $this->actingAs($user)->get('/applications?status=approved');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/applications')
            ->has('applications', 1)
            ->where('filters.status', 'approved')
    );
});

test('applications list can be searched by property title', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $tenantProfile = TenantProfile::factory()->create([
        'user_id' => $user->id,
        'profile_verified_at' => now(),
    ]);

    // Create property with specific title
    $searchableProperty = Property::factory()->create([
        'property_manager_id' => $this->property->property_manager_id,
        'title' => 'Unique Amsterdam Apartment',
    ]);

    Application::factory()->create([
        'tenant_profile_id' => $tenantProfile->id,
        'property_id' => $searchableProperty->id,
        'status' => 'submitted',
    ]);

    Application::factory()->create([
        'tenant_profile_id' => $tenantProfile->id,
        'property_id' => $this->property->id,
        'status' => 'submitted',
    ]);

    // Search for the specific property
    $response = $this->actingAs($user)->get('/applications?search=Amsterdam');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/applications')
            ->has('applications', 1)
            ->where('filters.search', 'Amsterdam')
    );
});

test('applications list does not show other users applications', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    $otherUser = User::factory()->create(['email_verified_at' => now()]);

    $tenantProfile = TenantProfile::factory()->create([
        'user_id' => $user->id,
        'profile_verified_at' => now(),
    ]);

    $otherTenantProfile = TenantProfile::factory()->create([
        'user_id' => $otherUser->id,
        'profile_verified_at' => now(),
    ]);

    // Create application for current user
    Application::factory()->create([
        'tenant_profile_id' => $tenantProfile->id,
        'property_id' => $this->property->id,
        'status' => 'submitted',
    ]);

    // Create application for other user
    Application::factory()->create([
        'tenant_profile_id' => $otherTenantProfile->id,
        'property_id' => Property::factory()->create([
            'property_manager_id' => $this->property->property_manager_id,
        ])->id,
        'status' => 'submitted',
    ]);

    $response = $this->actingAs($user)->get('/applications');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/applications')
            ->has('applications', 1) // Only user's own application
    );
});

test('applications list returns default filters', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/applications');

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tenant/applications')
            ->has('filters')
            ->where('filters.status', 'all')
            ->where('filters.search', '')
    );
});
