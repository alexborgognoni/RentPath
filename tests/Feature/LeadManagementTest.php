<?php

use App\Models\Lead;
use App\Models\Property;
use App\Models\PropertyManager;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    // Build manager URL using config values
    $domain = config('app.domain');
    $managerSubdomain = config('app.manager_subdomain');
    $this->managerUrl = "http://{$managerSubdomain}.{$domain}";

    // Create property manager
    $this->pmUser = User::factory()->create(['email_verified_at' => now()]);
    $this->propertyManager = PropertyManager::factory()->create([
        'user_id' => $this->pmUser->id,
        'profile_verified_at' => now(),
    ]);
    $this->property = Property::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
    ]);

    // Create a lead
    $this->lead = Lead::factory()->create([
        'property_id' => $this->property->id,
        'email' => 'lead@example.com',
        'first_name' => 'John',
        'last_name' => 'Doe',
        'status' => Lead::STATUS_INVITED,
        'source' => Lead::SOURCE_MANUAL,
    ]);

    // Create another property manager for unauthorized tests
    $otherPmUser = User::factory()->create(['email_verified_at' => now()]);
    $this->otherPropertyManager = PropertyManager::factory()->create([
        'user_id' => $otherPmUser->id,
        'profile_verified_at' => now(),
    ]);
    $this->otherPmUser = $otherPmUser;
});

test('manager can view leads list', function () {
    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/leads");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('leads')
        ->has('leads', 1)
        ->has('properties')
        ->has('statusOptions')
        ->has('sourceOptions')
    );
});

test('manager can filter leads by property', function () {
    // Create another property with a different lead
    $otherProperty = Property::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
    ]);
    Lead::factory()->create([
        'property_id' => $otherProperty->id,
        'email' => 'other@example.com',
    ]);

    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/leads?property={$this->property->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('leads')
        ->has('leads', 1)
    );
});

test('manager can filter leads by status', function () {
    // Create a lead with different status
    Lead::factory()->create([
        'property_id' => $this->property->id,
        'email' => 'viewed@example.com',
        'status' => Lead::STATUS_VIEWED,
    ]);

    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/leads?status=invited");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('leads')
        ->has('leads', 1)
    );
});

test('manager can search leads by email', function () {
    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/leads?search=lead@example");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('leads')
        ->has('leads', 1)
    );
});

test('manager can view single lead', function () {
    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/leads/{$this->lead->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('lead')
        ->has('lead')
        ->has('statusOptions')
        ->has('sourceOptions')
    );
});

test('manager cannot view lead for another managers property', function () {
    $response = $this->actingAs($this->otherPmUser)
        ->get("{$this->managerUrl}/leads/{$this->lead->id}");

    $response->assertForbidden();
});

test('manager can create a new lead', function () {
    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/leads", [
            'property_id' => $this->property->id,
            'email' => 'newlead@example.com',
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'source' => Lead::SOURCE_INVITE,
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('leads', [
        'property_id' => $this->property->id,
        'email' => 'newlead@example.com',
        'first_name' => 'Jane',
        'last_name' => 'Smith',
        'status' => Lead::STATUS_INVITED,
    ]);
});

test('manager cannot create duplicate lead for same property', function () {
    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/leads", [
            'property_id' => $this->property->id,
            'email' => 'lead@example.com', // Same email as existing lead
            'first_name' => 'Another',
            'last_name' => 'Person',
        ]);

    $response->assertSessionHasErrors('email');
});

test('manager can update lead notes', function () {
    $response = $this->actingAs($this->pmUser)
        ->put("{$this->managerUrl}/leads/{$this->lead->id}", [
            'notes' => 'Very promising candidate',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('leads', [
        'id' => $this->lead->id,
        'notes' => 'Very promising candidate',
    ]);
});

test('manager can archive a lead', function () {
    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/leads/{$this->lead->id}/archive");

    $response->assertRedirect();

    $this->assertDatabaseHas('leads', [
        'id' => $this->lead->id,
        'status' => Lead::STATUS_ARCHIVED,
    ]);
});

test('manager can resend invite', function () {
    $originalInvitedAt = $this->lead->invited_at;

    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/leads/{$this->lead->id}/resend");

    $response->assertRedirect();

    $this->lead->refresh();
    expect($this->lead->invited_at)->not->toBe($originalInvitedAt);
});

test('manager can delete a lead', function () {
    $response = $this->actingAs($this->pmUser)
        ->delete("{$this->managerUrl}/leads/{$this->lead->id}");

    $response->assertRedirect();

    $this->assertDatabaseMissing('leads', [
        'id' => $this->lead->id,
    ]);
});

test('other manager cannot delete lead', function () {
    $response = $this->actingAs($this->otherPmUser)
        ->delete("{$this->managerUrl}/leads/{$this->lead->id}");

    $response->assertForbidden();

    $this->assertDatabaseHas('leads', [
        'id' => $this->lead->id,
    ]);
});

test('lead status transitions correctly through lifecycle', function () {
    // Start as invited
    expect($this->lead->status)->toBe(Lead::STATUS_INVITED);

    // Simulate viewing
    $this->lead->update([
        'status' => Lead::STATUS_VIEWED,
        'viewed_at' => now(),
    ]);
    expect($this->lead->fresh()->status)->toBe(Lead::STATUS_VIEWED);

    // Simulate drafting
    $this->lead->update(['status' => Lead::STATUS_DRAFTING]);
    expect($this->lead->fresh()->status)->toBe(Lead::STATUS_DRAFTING);

    // Simulate applied
    $this->lead->update(['status' => Lead::STATUS_APPLIED]);
    expect($this->lead->fresh()->status)->toBe(Lead::STATUS_APPLIED);

    // Simulate archived
    $this->lead->archive();
    expect($this->lead->fresh()->status)->toBe(Lead::STATUS_ARCHIVED);
});

test('lead has correct full name accessor', function () {
    expect($this->lead->full_name)->toBe('John Doe');

    $noNameLead = Lead::factory()->create([
        'property_id' => $this->property->id,
        'email' => 'noname@example.com',
        'first_name' => null,
        'last_name' => null,
    ]);

    expect($noNameLead->full_name)->toBeNull();
});
