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
    ]);

    // Create tenant with verified profile
    $this->tenant = User::factory()->create(['email_verified_at' => now()]);
    $this->tenantProfile = TenantProfile::factory()->create([
        'user_id' => $this->tenant->id,
        'profile_verified_at' => now(),
    ]);
});

test('it saves draft with valid step 1 data', function () {
    // Step 1 is Personal Info in the new 6-step structure
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'profile_date_of_birth' => '1990-01-01',
            'profile_nationality' => 'Dutch',
            'profile_phone_country_code' => '+31',
            'profile_phone_number' => '612345678',
            'profile_current_house_number' => '123',
            'profile_current_street_name' => 'Main Street',
            'profile_current_city' => 'Amsterdam',
            'profile_current_postal_code' => '1012AB',
            'profile_current_country' => 'NL',
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
    // Step 1 is Personal Info - missing required fields
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'profile_date_of_birth' => '', // Invalid: empty
            'profile_nationality' => '', // Invalid: empty
            'profile_phone_number' => '', // Invalid: empty
            'profile_current_house_number' => '',
            'profile_current_street_name' => '',
            'profile_current_city' => '',
            'profile_current_postal_code' => '',
            'profile_current_country' => '',
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
    // First save valid step 1 (Personal Info)
    $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'profile_date_of_birth' => '1990-01-01',
            'profile_nationality' => 'Dutch',
            'profile_phone_country_code' => '+31',
            'profile_phone_number' => '612345678',
            'profile_current_house_number' => '123',
            'profile_current_street_name' => 'Main Street',
            'profile_current_city' => 'Amsterdam',
            'profile_current_postal_code' => '1012AB',
            'profile_current_country' => 'NL',
            'current_step' => 1,
        ]);

    // Then try to save step 2 (Employment)
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            'profile_date_of_birth' => '1990-01-01',
            'profile_nationality' => 'Dutch',
            'profile_phone_country_code' => '+31',
            'profile_phone_number' => '612345678',
            'profile_current_house_number' => '123',
            'profile_current_street_name' => 'Main Street',
            'profile_current_city' => 'Amsterdam',
            'profile_current_postal_code' => '1012AB',
            'profile_current_country' => 'NL',
            'profile_employment_status' => 'unemployed',
            'profile_income_currency' => 'eur',
            'profile_has_guarantor' => false,
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
    // Step 3 (Details) requires valid step 1 and 2 first
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            // Step 1: Personal Info
            'profile_date_of_birth' => '1990-01-01',
            'profile_nationality' => 'Dutch',
            'profile_phone_country_code' => '+31',
            'profile_phone_number' => '612345678',
            'profile_current_house_number' => '123',
            'profile_current_street_name' => 'Main Street',
            'profile_current_city' => 'Amsterdam',
            'profile_current_postal_code' => '1012AB',
            'profile_current_country' => 'NL',
            // Step 2: Employment
            'profile_employment_status' => 'unemployed',
            'profile_income_currency' => 'eur',
            'profile_has_guarantor' => false,
            // Step 3: Details
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 1,
            'occupants_details' => [
                ['name' => 'John Doe', 'age' => '30', 'relationship' => 'Spouse', 'relationship_other' => ''],
            ],
            'has_pets' => false,
            'pets_details' => [],
            'current_step' => 3,
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    expect($application->current_step)->toBe(3);
});

test('it requires at least one pet when has_pets is true', function () {
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            // Step 1: Personal Info
            'profile_date_of_birth' => '1990-01-01',
            'profile_nationality' => 'Dutch',
            'profile_phone_country_code' => '+31',
            'profile_phone_number' => '612345678',
            'profile_current_house_number' => '123',
            'profile_current_street_name' => 'Main Street',
            'profile_current_city' => 'Amsterdam',
            'profile_current_postal_code' => '1012AB',
            'profile_current_country' => 'NL',
            // Step 2: Employment
            'profile_employment_status' => 'unemployed',
            'profile_income_currency' => 'eur',
            'profile_has_guarantor' => false,
            // Step 3: Details - missing pets
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => true,
            'pets_details' => [], // Invalid: no pets provided
            'current_step' => 3,
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    // Should fail step 3 validation, current_step = 2 (valid up to step 2)
    expect($application->current_step)->toBe(2);
});

test('it validates pets data when provided', function () {
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            // Step 1: Personal Info
            'profile_date_of_birth' => '1990-01-01',
            'profile_nationality' => 'Dutch',
            'profile_phone_country_code' => '+31',
            'profile_phone_number' => '612345678',
            'profile_current_house_number' => '123',
            'profile_current_street_name' => 'Main Street',
            'profile_current_city' => 'Amsterdam',
            'profile_current_postal_code' => '1012AB',
            'profile_current_country' => 'NL',
            // Step 2: Employment
            'profile_employment_status' => 'unemployed',
            'profile_income_currency' => 'eur',
            'profile_has_guarantor' => false,
            // Step 3: Details with valid pet
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => true,
            'pets_details' => [
                ['type' => 'Dog', 'type_other' => '', 'breed' => 'Labrador', 'age' => '3', 'weight' => '25'],
            ],
            'current_step' => 3,
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    expect($application->current_step)->toBe(3);
});

test('it prevents direct api calls from bypassing validation', function () {
    // Hacker tries to directly set current_step = 5 with missing required data
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply/draft", [
            // Missing step 1 required fields
            'profile_date_of_birth' => '', // Empty
            'profile_nationality' => '',
            'profile_phone_number' => '',
            'current_step' => 5, // Trying to skip to step 5
        ]);

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    // Backend validates and rejects, current_step = 0
    expect($application->current_step)->toBe(0);
});

test('final submission requires all steps valid', function () {
    // Ensure tenant profile has required documents so they're not required in request
    $this->tenantProfile->update([
        'id_document_path' => 'test/id.pdf',
        'other_income_proof_path' => 'test/income.pdf',
    ]);

    // Try to submit with all required data
    $response = $this->actingAs($this->tenant)
        ->post("/properties/{$this->property->id}/apply", [
            // Step 1: Personal Info
            'profile_date_of_birth' => '1990-01-01',
            'profile_nationality' => 'Dutch',
            'profile_phone_country_code' => '+31',
            'profile_phone_number' => '612345678',
            'profile_current_house_number' => '123',
            'profile_current_street_name' => 'Main Street',
            'profile_current_city' => 'Amsterdam',
            'profile_current_postal_code' => '1012AB',
            'profile_current_country' => 'NL',
            // Step 2: Employment (unemployed - no extra docs needed if in profile)
            'profile_employment_status' => 'unemployed',
            'profile_income_currency' => 'eur',
            'profile_has_guarantor' => false,
            // Step 3: Details
            'desired_move_in_date' => now()->addDays(7)->format('Y-m-d'),
            'lease_duration_months' => 12,
            'message_to_landlord' => '',
            'additional_occupants' => 0,
            'occupants_details' => [],
            'has_pets' => false,
            'pets_details' => [],
            // Step 4: References
            'references' => [],
        ]);

    // Should be redirected with success (all required data provided)
    $response->assertRedirect();

    $application = Application::where('tenant_profile_id', $this->tenantProfile->id)
        ->where('property_id', $this->property->id)
        ->first();

    expect($application->status)->toBe('submitted');
});
