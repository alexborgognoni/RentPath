<?php

use App\Models\Property;
use App\Models\PropertyManager;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

/**
 * Helper function to build manager subdomain URL
 */
function managerUrl(string $path): string
{
    $domain = config('app.domain');
    $appUrl = config('app.url');
    $managerUrl = 'http://manager.'.$domain;

    if (parse_url($appUrl, PHP_URL_PORT)) {
        $managerUrl .= ':'.parse_url($appUrl, PHP_URL_PORT);
    }

    return $managerUrl.$path;
}

beforeEach(function () {
    // Create property manager with verified profile
    $pmUser = User::factory()->create(['email_verified_at' => now()]);
    $this->propertyManager = PropertyManager::factory()->create([
        'user_id' => $pmUser->id,
        'profile_verified_at' => now(),
    ]);
    $this->user = $pmUser;
});

// ============================================================================
// Draft Creation Tests
// ============================================================================

describe('Draft Creation', function () {
    test('it creates a draft with minimal data', function () {
        $response = $this->actingAs($this->user)
            ->withHeaders(['X-Inertia' => 'true'])
            ->post(managerUrl('/properties/draft'), [
                'type' => 'apartment',
                'subtype' => 'studio',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('properties', [
            'property_manager_id' => $this->propertyManager->id,
            'type' => 'apartment',
            'subtype' => 'studio',
            'status' => 'draft',
        ]);
    });

    test('it rejects draft creation without property manager profile', function () {
        $userWithoutPM = User::factory()->create(['email_verified_at' => now()]);

        $response = $this->actingAs($userWithoutPM)
            ->withHeaders(['X-Inertia' => 'true'])
            ->post(managerUrl('/properties/draft'), [
                'type' => 'apartment',
                'subtype' => 'studio',
            ]);

        $response->assertStatus(403);
    });

    // Note: Type validation is done by the frontend and on autosave/publish.
    // The createDraft endpoint doesn't validate type because users select from a dropdown
    // and can't enter invalid values. Invalid types would hit database constraint.
});

// ============================================================================
// Draft Autosave Validation Tests
// ============================================================================

describe('Draft Autosave Validation', function () {
    beforeEach(function () {
        $this->draft = Property::factory()->create([
            'property_manager_id' => $this->propertyManager->id,
            'status' => 'draft',
            'wizard_step' => 1,
            'type' => 'apartment',
            'subtype' => 'studio',
            'title' => null,
            'house_number' => null,
            'street_name' => null,
            'city' => null,
            'postal_code' => null,
        ]);
    });

    test('it saves valid draft data', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'wizard_step' => 2,
            ]);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'draft']);

        $this->draft->refresh();
        expect($this->draft->house_number)->toBe('123');
        expect($this->draft->street_name)->toBe('Main Street');
        expect($this->draft->city)->toBe('Zurich');
    });

    test('it enforces max length constraints on house_number', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'house_number' => str_repeat('x', 25), // Max is 20
                'wizard_step' => 2,
            ]);

        $response->assertSessionHasErrors(['house_number']);
    });

    test('it enforces max length constraints on street_name', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'street_name' => str_repeat('x', 260), // Max is 255
                'wizard_step' => 2,
            ]);

        $response->assertSessionHasErrors(['street_name']);
    });

    test('it enforces max length constraints on city', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'city' => str_repeat('x', 105), // Max is 100
                'wizard_step' => 2,
            ]);

        $response->assertSessionHasErrors(['city']);
    });

    test('it enforces country code length of 2', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'country' => 'CHE', // Must be exactly 2 chars
                'wizard_step' => 2,
            ]);

        $response->assertSessionHasErrors(['country']);
    });

    test('it validates bedroom range', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'bedrooms' => 25, // Max is 20
                'wizard_step' => 3,
            ]);

        $response->assertSessionHasErrors(['bedrooms']);
    });

    test('it validates bathroom range', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'bathrooms' => 15, // Max is 10
                'wizard_step' => 3,
            ]);

        $response->assertSessionHasErrors(['bathrooms']);
    });

    test('it validates year_built range', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'year_built' => 1700, // Min is 1800
                'wizard_step' => 3,
            ]);

        $response->assertSessionHasErrors(['year_built']);
    });

    test('it validates year_built cannot be in future', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'year_built' => date('Y') + 1,
                'wizard_step' => 3,
            ]);

        $response->assertSessionHasErrors(['year_built']);
    });

    test('it validates rent_amount range', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'rent_amount' => 1000001, // Max is 999999.99
                'wizard_step' => 6,
            ]);

        $response->assertSessionHasErrors(['rent_amount']);
    });

    test('it validates rent_currency values', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'rent_currency' => 'btc', // Not a valid currency
                'wizard_step' => 6,
            ]);

        $response->assertSessionHasErrors(['rent_currency']);
    });

    test('it validates energy_class values', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'energy_class' => 'Z', // Not valid, should be A+ through G
                'wizard_step' => 5,
            ]);

        $response->assertSessionHasErrors(['energy_class']);
    });

    test('it validates heating_type values', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'heating_type' => 'nuclear', // Not valid
                'wizard_step' => 5,
            ]);

        $response->assertSessionHasErrors(['heating_type']);
    });

    test('it validates title max length', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'title' => str_repeat('x', 260), // Max is 255
                'wizard_step' => 7,
            ]);

        $response->assertSessionHasErrors(['title']);
    });

    test('it prevents autosave on non-draft properties', function () {
        $this->draft->update(['status' => 'available']);

        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'title' => 'Updated Title',
                'wizard_step' => 7,
            ]);

        $response->assertStatus(400);
    });

    test('it prevents autosave by non-owner', function () {
        $otherUser = User::factory()->create(['email_verified_at' => now()]);
        PropertyManager::factory()->create([
            'user_id' => $otherUser->id,
            'profile_verified_at' => now(),
        ]);

        $response = $this->actingAs($otherUser)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'title' => 'Hacked Title',
                'wizard_step' => 7,
            ]);

        $response->assertStatus(403);
    });
});

// ============================================================================
// Publish Validation Tests
// ============================================================================

describe('Publish Validation', function () {
    beforeEach(function () {
        $this->draft = Property::factory()->create([
            'property_manager_id' => $this->propertyManager->id,
            'status' => 'draft',
            'wizard_step' => 7,
            'type' => 'apartment',
            'subtype' => 'studio',
            // Intentionally missing required fields
            'title' => null,
            'house_number' => null,
            'street_name' => null,
            'city' => null,
            'postal_code' => null,
            'bedrooms' => 0,
            'bathrooms' => 0,
            'rent_amount' => 0,
        ]);
    });

    test('it requires all mandatory fields to publish', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                // Missing required fields
            ]);

        $response->assertSessionHasErrors([
            'title',
            'house_number',
            'street_name',
            'city',
            'postal_code',
            'type',
            'subtype',
            'bedrooms',
            'bathrooms',
            'rent_amount',
            'rent_currency',
        ]);
    });

    test('it requires title to publish', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
                // Missing title
            ]);

        $response->assertSessionHasErrors(['title']);
    });

    test('it requires house_number to publish', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Test Property',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
                // Missing house_number
            ]);

        $response->assertSessionHasErrors(['house_number']);
    });

    test('it requires rent_amount greater than 0 to publish', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Test Property',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 0, // Invalid: must be > 0
                'rent_currency' => 'eur',
            ]);

        $response->assertSessionHasErrors(['rent_amount']);
    });

    test('it validates subtype matches type on publish', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'villa', // Invalid: villa is for house type
                'title' => 'Test Property',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
            ]);

        $response->assertSessionHasErrors(['subtype']);
    });

    test('it publishes successfully with all valid data', function () {
        Storage::fake('private');

        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Beautiful Studio in Zurich',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'size' => 45, // Required for apartments
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
                'images' => [UploadedFile::fake()->create('property.jpg', 100, 'image/jpeg')],
            ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->draft->refresh();
        expect($this->draft->status)->toBe('inactive');
        expect($this->draft->title)->toBe('Beautiful Studio in Zurich');
    });

    test('it prevents publishing non-draft properties', function () {
        $this->draft->update(['status' => 'available']);

        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Test Property',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
            ]);

        $response->assertStatus(400);
    });

    test('it prevents publishing by non-owner', function () {
        $otherUser = User::factory()->create(['email_verified_at' => now()]);
        PropertyManager::factory()->create([
            'user_id' => $otherUser->id,
            'profile_verified_at' => now(),
        ]);

        $response = $this->actingAs($otherUser)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Test Property',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
            ]);

        $response->assertStatus(403);
    });
});

// ============================================================================
// Update Published Property Validation Tests
// ============================================================================

describe('Update Published Property Validation', function () {
    beforeEach(function () {
        $this->property = Property::factory()->create([
            'property_manager_id' => $this->propertyManager->id,
            'status' => 'available',
        ]);
    });

    test('it updates property with valid data', function () {
        Storage::fake('private');

        $response = $this->actingAs($this->user)
            ->put(managerUrl("/properties/{$this->property->id}"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Updated Title',
                'house_number' => '456',
                'street_name' => 'New Street',
                'city' => 'Geneva',
                'postal_code' => '1200',
                'country' => 'CH',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'size' => 55, // Required for apartments
                'rent_amount' => 2000,
                'rent_currency' => 'chf',
                'images' => [UploadedFile::fake()->create('property.jpg', 100, 'image/jpeg')],
            ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->property->refresh();
        expect($this->property->title)->toBe('Updated Title');
        expect($this->property->city)->toBe('Geneva');
    });

    test('it validates required fields on update', function () {
        $response = $this->actingAs($this->user)
            ->put(managerUrl("/properties/{$this->property->id}"), [
                // Missing required fields
            ]);

        $response->assertSessionHasErrors(['title', 'house_number', 'street_name']);
    });

    test('it prevents update by non-owner', function () {
        $otherUser = User::factory()->create(['email_verified_at' => now()]);
        PropertyManager::factory()->create([
            'user_id' => $otherUser->id,
            'profile_verified_at' => now(),
        ]);

        $response = $this->actingAs($otherUser)
            ->put(managerUrl("/properties/{$this->property->id}"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Hacked Title',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
            ]);

        $response->assertStatus(403);
    });

    test('it validates available_date is not in the past', function () {
        $response = $this->actingAs($this->user)
            ->put(managerUrl("/properties/{$this->property->id}"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Test Property',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
                'available_date' => now()->subDays(5)->format('Y-m-d'), // Past date
            ]);

        $response->assertSessionHasErrors(['available_date']);
    });
});

// ============================================================================
// Type/Subtype Validation Tests
// ============================================================================

describe('Type and Subtype Validation', function () {
    beforeEach(function () {
        $this->draft = Property::factory()->create([
            'property_manager_id' => $this->propertyManager->id,
            'status' => 'draft',
            'wizard_step' => 1,
        ]);
    });

    test('it accepts valid apartment subtypes', function () {
        $validSubtypes = ['studio', 'loft', 'duplex', 'triplex', 'penthouse', 'serviced'];

        foreach ($validSubtypes as $subtype) {
            $response = $this->actingAs($this->user)
                ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                    'type' => 'apartment',
                    'subtype' => $subtype,
                    'wizard_step' => 1,
                ]);

            $response->assertStatus(200);
        }
    });

    test('it accepts valid house subtypes', function () {
        $validSubtypes = ['detached', 'semi-detached', 'villa', 'bungalow'];

        foreach ($validSubtypes as $subtype) {
            $response = $this->actingAs($this->user)
                ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                    'type' => 'house',
                    'subtype' => $subtype,
                    'wizard_step' => 1,
                ]);

            $response->assertStatus(200);
        }
    });

    test('it accepts valid room subtypes', function () {
        $validSubtypes = ['private_room', 'student_room', 'co-living'];

        foreach ($validSubtypes as $subtype) {
            $response = $this->actingAs($this->user)
                ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                    'type' => 'room',
                    'subtype' => $subtype,
                    'wizard_step' => 1,
                ]);

            $response->assertStatus(200);
        }
    });

    test('it accepts valid commercial subtypes', function () {
        $validSubtypes = ['office', 'retail'];

        foreach ($validSubtypes as $subtype) {
            $response = $this->actingAs($this->user)
                ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                    'type' => 'commercial',
                    'subtype' => $subtype,
                    'wizard_step' => 1,
                ]);

            $response->assertStatus(200);
        }
    });

    test('it accepts valid industrial subtypes', function () {
        $validSubtypes = ['warehouse', 'factory'];

        foreach ($validSubtypes as $subtype) {
            $response = $this->actingAs($this->user)
                ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                    'type' => 'industrial',
                    'subtype' => $subtype,
                    'wizard_step' => 1,
                ]);

            $response->assertStatus(200);
        }
    });

    test('it accepts valid parking subtypes', function () {
        $validSubtypes = ['garage', 'indoor_spot', 'outdoor_spot'];

        foreach ($validSubtypes as $subtype) {
            $response = $this->actingAs($this->user)
                ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                    'type' => 'parking',
                    'subtype' => $subtype,
                    'wizard_step' => 1,
                ]);

            $response->assertStatus(200);
        }
    });

    test('it rejects invalid property type', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'type' => 'spaceship',
                'subtype' => 'studio',
                'wizard_step' => 1,
            ]);

        $response->assertSessionHasErrors(['type']);
    });

    test('it rejects invalid subtype', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'type' => 'apartment',
                'subtype' => 'mansion', // Not a valid apartment subtype
                'wizard_step' => 1,
            ]);

        $response->assertSessionHasErrors(['subtype']);
    });
});

// ============================================================================
// Error Message Consistency Tests
// ============================================================================

describe('Error Message Consistency', function () {
    beforeEach(function () {
        $this->draft = Property::factory()->create([
            'property_manager_id' => $this->propertyManager->id,
            'status' => 'draft',
            'wizard_step' => 1,
        ]);
    });

    test('it returns correct error message for required title', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
            ]);

        $response->assertSessionHasErrors(['title' => 'Property title is required']);
    });

    test('it returns correct error message for required house_number', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Test',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
            ]);

        $response->assertSessionHasErrors(['house_number' => 'House/building number is required']);
    });

    test('it returns correct error message for max length violations', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'house_number' => str_repeat('x', 25),
                'wizard_step' => 2,
            ]);

        $response->assertSessionHasErrors(['house_number' => 'House number cannot exceed 20 characters']);
    });

    test('it returns correct error message for rent_amount minimum', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Test',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 0,
                'rent_currency' => 'eur',
            ]);

        $response->assertSessionHasErrors(['rent_amount' => 'Rent amount must be greater than 0']);
    });

    test('it returns correct error message for invalid type', function () {
        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$this->draft->id}/publish"), [
                'type' => 'invalid',
                'subtype' => 'studio',
                'title' => 'Test',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rent_amount' => 1500,
                'rent_currency' => 'eur',
            ]);

        $response->assertSessionHasErrors(['type' => 'Please select a valid property type']);
    });
});

// ============================================================================
// Boolean Field Conversion Tests
// ============================================================================

describe('Boolean Field Conversion', function () {
    beforeEach(function () {
        $this->draft = Property::factory()->create([
            'property_manager_id' => $this->propertyManager->id,
            'status' => 'draft',
            'wizard_step' => 1,
        ]);
    });

    test('it converts string boolean values to actual booleans', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'has_elevator' => '1',
                'kitchen_equipped' => '1',
                'has_garden' => '0',
                'wizard_step' => 4,
            ]);

        $response->assertStatus(200);

        $this->draft->refresh();
        expect($this->draft->has_elevator)->toBe(true);
        expect($this->draft->kitchen_equipped)->toBe(true);
        expect($this->draft->has_garden)->toBe(false);
    });

    test('it handles boolean true/false values', function () {
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$this->draft->id}/draft"), [
                'has_elevator' => true,
                'kitchen_equipped' => false,
                'wizard_step' => 4,
            ]);

        $response->assertStatus(200);

        $this->draft->refresh();
        expect($this->draft->has_elevator)->toBe(true);
        expect($this->draft->kitchen_equipped)->toBe(false);
    });
});

// ============================================================================
// Complete Wizard Flow Test
// ============================================================================

describe('Complete Wizard Flow', function () {
    test('it completes full wizard flow from draft to publish', function () {
        // Step 1: Create draft with type/subtype
        $response = $this->actingAs($this->user)
            ->withHeaders(['X-Inertia' => 'true'])
            ->post(managerUrl('/properties/draft'), [
                'type' => 'apartment',
                'subtype' => 'studio',
            ]);

        $response->assertStatus(200);
        $propertyId = $response->json('id');

        // Step 2: Add location
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$propertyId}/draft"), [
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'wizard_step' => 2,
            ]);

        $response->assertStatus(200);

        // Step 3: Add specifications
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$propertyId}/draft"), [
                'bedrooms' => 1,
                'bathrooms' => 1,
                'size' => 45,
                'wizard_step' => 3,
            ]);

        $response->assertStatus(200);

        // Step 4: Add amenities
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$propertyId}/draft"), [
                'kitchen_equipped' => true,
                'has_elevator' => true,
                'wizard_step' => 4,
            ]);

        $response->assertStatus(200);

        // Step 5: Add energy (optional, skip)
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$propertyId}/draft"), [
                'wizard_step' => 5,
            ]);

        $response->assertStatus(200);

        // Step 6: Add pricing
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$propertyId}/draft"), [
                'rent_amount' => 1800,
                'rent_currency' => 'chf',
                'wizard_step' => 6,
            ]);

        $response->assertStatus(200);

        // Step 7: Add media
        $response = $this->actingAs($this->user)
            ->patch(managerUrl("/properties/{$propertyId}/draft"), [
                'title' => 'Cozy Studio in Zurich Center',
                'description' => 'A beautiful studio apartment in the heart of Zurich.',
                'wizard_step' => 7,
            ]);

        $response->assertStatus(200);

        // Step 8: Publish
        Storage::fake('private');

        $response = $this->actingAs($this->user)
            ->post(managerUrl("/properties/{$propertyId}/publish"), [
                'type' => 'apartment',
                'subtype' => 'studio',
                'title' => 'Cozy Studio in Zurich Center',
                'description' => 'A beautiful studio apartment in the heart of Zurich.',
                'house_number' => '123',
                'street_name' => 'Main Street',
                'city' => 'Zurich',
                'postal_code' => '8001',
                'country' => 'CH',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'size' => 45,
                'kitchen_equipped' => '1',
                'has_elevator' => '1',
                'rent_amount' => 1800,
                'rent_currency' => 'chf',
                'images' => [UploadedFile::fake()->create('property.jpg', 100, 'image/jpeg')],
            ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        // Verify property is published
        $property = Property::find($propertyId);
        expect($property->status)->toBe('inactive');
        expect($property->title)->toBe('Cozy Studio in Zurich Center');
        expect((float) $property->rent_amount)->toBe(1800.0);
    });
});
