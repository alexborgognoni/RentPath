<?php

use App\Models\Application;
use App\Models\Property;
use App\Models\PropertyManager;
use App\Models\TenantProfile;
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

    // Create a submitted application
    $tenantUser = User::factory()->create(['email_verified_at' => now()]);
    $tenantProfile = TenantProfile::factory()->create([
        'user_id' => $tenantUser->id,
        'profile_verified_at' => now(),
    ]);
    $this->application = Application::factory()->create([
        'property_id' => $this->property->id,
        'tenant_profile_id' => $tenantProfile->id,
        'status' => 'submitted',
        'submitted_at' => now(),
        'desired_move_in_date' => now()->addDays(30),
        'lease_duration_months' => 12,
    ]);

    // Create another property manager for unauthorized tests
    $otherPmUser = User::factory()->create(['email_verified_at' => now()]);
    $this->otherPropertyManager = PropertyManager::factory()->create([
        'user_id' => $otherPmUser->id,
        'profile_verified_at' => now(),
    ]);
    $this->otherPmUser = $otherPmUser;
});

test('manager can view applications list', function () {
    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/applications");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('manager/applications')
        ->has('applications', 1)
        ->has('properties')
    );
});

test('manager can filter applications by property', function () {
    // Create another property with no applications
    $otherProperty = Property::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
    ]);

    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/applications?property={$this->property->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('manager/applications')
        ->has('applications', 1)
        ->where('selectedPropertyId', $this->property->id)
    );
});

test('manager can view single application', function () {
    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/applications/{$this->application->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('manager/application')
        ->has('application')
        ->has('allowedTransitions')
    );
});

test('manager cannot view application for another managers property', function () {
    $response = $this->actingAs($this->otherPmUser)
        ->get("{$this->managerUrl}/applications/{$this->application->id}");

    $response->assertForbidden();
});

test('manager can update application status from submitted to under_review', function () {
    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/applications/{$this->application->id}/status", [
            'status' => 'under_review',
            'notes' => 'Starting review',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('applications', [
        'id' => $this->application->id,
        'status' => 'under_review',
    ]);
});

test('manager can schedule visit for application under review', function () {
    $this->application->update(['status' => 'under_review', 'reviewed_at' => now()]);

    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/applications/{$this->application->id}/status", [
            'status' => 'visit_scheduled',
            'notes' => 'Scheduled for next week',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('applications', [
        'id' => $this->application->id,
        'status' => 'visit_scheduled',
    ]);
});

test('manager can approve application after visit', function () {
    $this->application->update([
        'status' => 'visit_completed',
        'reviewed_at' => now(),
        'visit_scheduled_at' => now()->subDays(1),
        'visit_completed_at' => now(),
    ]);

    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/applications/{$this->application->id}/status", [
            'status' => 'approved',
            'notes' => 'Excellent candidate',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('applications', [
        'id' => $this->application->id,
        'status' => 'approved',
    ]);
});

test('manager can reject application', function () {
    $this->application->update(['status' => 'under_review', 'reviewed_at' => now()]);

    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/applications/{$this->application->id}/status", [
            'status' => 'rejected',
            'notes' => 'Income too low',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('applications', [
        'id' => $this->application->id,
        'status' => 'rejected',
    ]);
});

test('manager cannot perform invalid status transition', function () {
    // Cannot go directly from submitted to approved
    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/applications/{$this->application->id}/status", [
            'status' => 'approved',
            'notes' => 'Trying to skip steps',
        ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');

    // Status should remain unchanged
    $this->assertDatabaseHas('applications', [
        'id' => $this->application->id,
        'status' => 'submitted',
    ]);
});

test('manager can archive application', function () {
    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/applications/{$this->application->id}/status", [
            'status' => 'archived',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('applications', [
        'id' => $this->application->id,
        'status' => 'archived',
    ]);
});

test('manager can mark approved application as leased', function () {
    $this->application->update([
        'status' => 'approved',
        'approved_at' => now(),
        'approved_by_user_id' => $this->pmUser->id,
    ]);

    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/applications/{$this->application->id}/status", [
            'status' => 'leased',
            'notes' => 'Lease signed',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('applications', [
        'id' => $this->application->id,
        'status' => 'leased',
    ]);

    // Property should also be marked as leased
    $this->assertDatabaseHas('properties', [
        'id' => $this->property->id,
        'status' => 'leased',
    ]);
});

test('other manager cannot update application status', function () {
    $response = $this->actingAs($this->otherPmUser)
        ->post("{$this->managerUrl}/applications/{$this->application->id}/status", [
            'status' => 'under_review',
        ]);

    $response->assertForbidden();

    // Status should remain unchanged
    $this->assertDatabaseHas('applications', [
        'id' => $this->application->id,
        'status' => 'submitted',
    ]);
});
