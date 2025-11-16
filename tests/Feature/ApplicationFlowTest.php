<?php

use App\Models\Application;
use App\Models\Property;
use App\Models\PropertyManager;
use App\Models\TenantProfile;
use App\Models\User;

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
        'status' => 'available',
    ]);

    // Create tenant with verified profile
    $this->tenant = User::factory()->create(['email_verified_at' => now()]);
    $this->tenantProfile = TenantProfile::factory()->create([
        'user_id' => $this->tenant->id,
        'profile_verified_at' => now(),
    ]);
});

test('it saves draft with valid step 1 data', function () {
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => false,
            'pets_details' => [],
            'current_step' => 1,
        ]);

    $response->assertStatus(303);

    $this->assertDatabaseHas('applications', [
        'tenant_profile_id' => $this->tenantProfile->id,
        'property_id' => $this->property->id,
        'status' => 'draft',
        'current_step' => 1,
    ]);
});

test('it rejects invalid step 1 data and keeps current_step at 0', function () {
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => now()->subDays(5)->format('Y-m-d'), // Invalid: past date
            'lease_duration_months' => -5, // Invalid: negative
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => false,
            'pets_details' => [],
            'current_step' => 1,
        ]);

    // Should still save the data (preserve user work)
    $this->assertDatabaseHas('applications', [
        'tenant_profile_id' => $this->tenantProfile->id,
        'property_id' => $this->property->id,
        'status' => 'draft',
    ]);

    // But current_step should be 0 (no valid steps)
    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    expect($application->current_step)->toBe(0);
});

test('it allows progression to step 2 with valid step 1', function () {
    // First save valid step 1
    $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => false,
            'pets_details' => [],
            'current_step' => 1,
        ]);

    // Then try to save step 2
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => false,
            'pets_details' => [],
            'previous_landlord_name' => '',
            'references' => [],
            'current_step' => 2,
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    expect($application->current_step)->toBe(2);
});

test('it reduces current_step when breaking previous step data', function () {
    // Create application with step 2 completed
    $application = Application::create([
        'tenant_profile_id' => $this->tenantProfile->id,
        'property_id' => $this->property->id,
        'status' => 'draft',
        'current_step' => 2,
        'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
        'lease_duration_months' => 12,
        'additional_occupants' => 0,
        'occupants_details' => [],
        'has_pets' => false,
        'pets_details' => [],
    ]);

    // Now save with invalid step 1 data (going back and breaking it)
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => now()->subDays(5)->format('Y-m-d'), // Invalid
            'lease_duration_months' => -5, // Invalid
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => false,
            'pets_details' => [],
            'current_step' => 2, // Requesting step 2
        ]);

    // Data should be saved
    $application->refresh();
    expect($application->lease_duration_months)->toBe(-5);

    // But current_step should be reduced to 0 (no valid steps)
    expect($application->current_step)->toBe(0);
});

test('it validates occupants when additional_occupants gt 0', function () {
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 1,
            'occupants_details' => [
                ['name' => 'John Doe', 'age' => 30, 'relationship' => 'Spouse'],
            ],
            'has_pets' => false,
            'pets_details' => [],
            'current_step' => 1,
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    expect($application->current_step)->toBe(1);
});

test('it requires at least one pet when has_pets is true', function () {
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => true,
            'pets_details' => [], // Invalid: no pets provided
            'current_step' => 1,
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    // Should fail validation, current_step = 0
    expect($application->current_step)->toBe(0);
});

test('it validates pets data when provided', function () {
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => true,
            'pets_details' => [
                ['type' => 'Dog', 'breed' => 'Labrador', 'age' => 3, 'weight' => 25],
            ],
            'current_step' => 1,
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    expect($application->current_step)->toBe(1);
});

test('it prevents direct api calls from bypassing validation', function () {
    // Hacker tries to directly set current_step = 4 with invalid data
    $pastDate = now()->subDays(5)->format('Y-m-d'); // Clearly in the past

    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'desired_move_in_date' => $pastDate, // Invalid: past date
            'lease_duration_months' => -5, // Invalid: negative
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => false,
            'pets_details' => [],
            'current_step' => 4, // Trying to skip to step 4
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    // Backend validates and rejects, current_step = 0
    expect($application->current_step)->toBe(0);
    expect($application->lease_duration_months)->toBe(-5); // Data was saved
    expect($application->desired_move_in_date->format('Y-m-d'))->toBe($pastDate); // Data was saved
});

test('final submission requires all steps valid', function () {
    // Create draft with step 1 completed
    $application = Application::create([
        'tenant_profile_id' => $this->tenantProfile->id,
        'property_id' => $this->property->id,
        'status' => 'draft',
        'current_step' => 1,
        'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
        'lease_duration_months' => 12,
        'additional_occupants' => 0,
        'occupants_details' => [],
        'has_pets' => false,
        'pets_details' => [],
    ]);

    // Try to submit with step 1 data (missing step 2+ data if required)
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply", [
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'message_to_landlord' => '',
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => false,
            'pets_details' => [],
            'references' => [],
        ]);

    // Should be redirected with success (all required data provided)
    $response->assertRedirect();

    $application->refresh();
    expect($application->status)->toBe('submitted');
});
