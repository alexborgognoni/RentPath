<?php

use App\Models\Conversation;
use App\Models\Lead;
use App\Models\Message;
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
    $this->tenantUrl = "http://{$domain}";

    // Create property manager
    $this->pmUser = User::factory()->create(['email_verified_at' => now()]);
    $this->propertyManager = PropertyManager::factory()->create([
        'user_id' => $this->pmUser->id,
        'profile_verified_at' => now(),
    ]);
    $this->property = Property::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
    ]);

    // Create a lead for this property manager
    $this->lead = Lead::factory()->create([
        'property_id' => $this->property->id,
        'email' => 'lead@example.com',
        'first_name' => 'John',
        'last_name' => 'Doe',
    ]);

    // Create a tenant user
    $this->tenantUser = User::factory()->create([
        'email' => 'tenant@example.com',
        'email_verified_at' => now(),
    ]);
    $this->tenantProfile = TenantProfile::factory()->create([
        'user_id' => $this->tenantUser->id,
    ]);

    // Create another property manager for unauthorized tests
    $this->otherPmUser = User::factory()->create(['email_verified_at' => now()]);
    $this->otherPropertyManager = PropertyManager::factory()->create([
        'user_id' => $this->otherPmUser->id,
        'profile_verified_at' => now(),
    ]);
});

// ========== Manager Message Tests ==========

test('manager can view messages index', function () {
    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/messages");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('manager/messages/index')
        ->has('conversations')
    );
});

test('manager can start a conversation with a lead', function () {
    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/messages/start", [
            'participant_type' => 'lead',
            'participant_id' => $this->lead->id,
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('conversations', [
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
    ]);
});

test('manager can start a conversation with a tenant', function () {
    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/messages/start", [
            'participant_type' => 'tenant',
            'participant_id' => $this->tenantUser->id,
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('conversations', [
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'tenant',
        'participant_id' => $this->tenantUser->id,
    ]);
});

test('manager can view a conversation', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
    ]);

    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/messages/{$conversation->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('manager/messages/show')
        ->has('conversation')
        ->has('messages')
    );
});

test('manager cannot view another managers conversation', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->otherPropertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
    ]);

    $response = $this->actingAs($this->pmUser)
        ->get("{$this->managerUrl}/messages/{$conversation->id}");

    $response->assertForbidden();
});

test('manager can send a message in a conversation', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
    ]);

    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/messages/{$conversation->id}", [
            'body' => 'Hello, I am interested in showing you the property.',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('messages', [
        'conversation_id' => $conversation->id,
        'sender_role' => 'manager',
        'body' => 'Hello, I am interested in showing you the property.',
    ]);
});

test('manager cannot send a message without body', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
    ]);

    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/messages/{$conversation->id}", [
            'body' => '',
        ]);

    $response->assertSessionHasErrors('body');
});

test('manager can get unread message count', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
        'manager_last_read_at' => now()->subHour(),
        'last_message_at' => now(),
    ]);

    // Create a message after manager's last read
    Message::factory()->create([
        'conversation_id' => $conversation->id,
        'sender_role' => 'participant',
        'created_at' => now(),
    ]);

    $response = $this->actingAs($this->pmUser)
        ->getJson("{$this->managerUrl}/api/messages/unread-count");

    $response->assertSuccessful();
    $response->assertJson(['count' => 1]);
});

test('starting conversation with same participant returns existing conversation', function () {
    $existingConversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
    ]);

    $response = $this->actingAs($this->pmUser)
        ->post("{$this->managerUrl}/messages/start", [
            'participant_type' => 'lead',
            'participant_id' => $this->lead->id,
        ]);

    $response->assertRedirectToRoute('manager.messages.show', ['conversation' => $existingConversation->id]);

    // Should not create a new conversation
    expect(Conversation::where('property_manager_id', $this->propertyManager->id)->count())->toBe(1);
});

// ========== Tenant Message Tests ==========

test('tenant can view messages index', function () {
    $response = $this->actingAs($this->tenantUser)
        ->get("{$this->tenantUrl}/messages");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tenant/messages/index')
        ->has('conversations')
    );
});

test('tenant can view their conversation', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'tenant',
        'participant_id' => $this->tenantUser->id,
    ]);

    $response = $this->actingAs($this->tenantUser)
        ->get("{$this->tenantUrl}/messages/{$conversation->id}");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('tenant/messages/show')
        ->has('conversation')
        ->has('messages')
    );
});

test('tenant cannot view another tenants conversation', function () {
    $otherTenantUser = User::factory()->create(['email_verified_at' => now()]);

    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'tenant',
        'participant_id' => $otherTenantUser->id,
    ]);

    $response = $this->actingAs($this->tenantUser)
        ->get("{$this->tenantUrl}/messages/{$conversation->id}");

    $response->assertForbidden();
});

test('tenant can send a message in their conversation', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'tenant',
        'participant_id' => $this->tenantUser->id,
    ]);

    $response = $this->actingAs($this->tenantUser)
        ->post("{$this->tenantUrl}/messages/{$conversation->id}", [
            'body' => 'Hi, I have a question about the property.',
        ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('messages', [
        'conversation_id' => $conversation->id,
        'sender_role' => 'participant',
        'body' => 'Hi, I have a question about the property.',
    ]);
});

test('tenant cannot send message in a conversation they do not belong to', function () {
    $otherTenantUser = User::factory()->create(['email_verified_at' => now()]);

    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'tenant',
        'participant_id' => $otherTenantUser->id,
    ]);

    $response = $this->actingAs($this->tenantUser)
        ->post("{$this->tenantUrl}/messages/{$conversation->id}", [
            'body' => 'This should fail.',
        ]);

    $response->assertForbidden();
});

test('tenant can get unread message count', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'tenant',
        'participant_id' => $this->tenantUser->id,
        'participant_last_read_at' => now()->subHour(),
        'last_message_at' => now(),
    ]);

    // Create a message after participant's last read
    Message::factory()->create([
        'conversation_id' => $conversation->id,
        'sender_role' => 'manager',
        'created_at' => now(),
    ]);

    $response = $this->actingAs($this->tenantUser)
        ->getJson("{$this->tenantUrl}/api/messages/unread-count");

    $response->assertSuccessful();
    $response->assertJson(['count' => 1]);
});

// ========== Conversation Model Tests ==========

test('conversation marks as read by manager', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
        'manager_last_read_at' => null,
    ]);

    $conversation->markAsReadByManager();

    expect($conversation->fresh()->manager_last_read_at)->not->toBeNull();
});

test('conversation marks as read by participant', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'tenant',
        'participant_id' => $this->tenantUser->id,
        'participant_last_read_at' => null,
    ]);

    $conversation->markAsReadByParticipant();

    expect($conversation->fresh()->participant_last_read_at)->not->toBeNull();
});

test('message updates conversation last_message_at', function () {
    $conversation = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
        'last_message_at' => null,
    ]);

    Message::factory()->create([
        'conversation_id' => $conversation->id,
    ]);

    expect($conversation->fresh()->last_message_at)->not->toBeNull();
});

test('getOrCreateBetween returns existing conversation', function () {
    $existing = Conversation::factory()->create([
        'property_manager_id' => $this->propertyManager->id,
        'participant_type' => 'lead',
        'participant_id' => $this->lead->id,
    ]);

    $found = Conversation::getOrCreateBetween($this->propertyManager->id, 'lead', $this->lead->id);

    expect($found->id)->toBe($existing->id);
    expect(Conversation::count())->toBe(1);
});

test('getOrCreateBetween creates new conversation', function () {
    $conversation = Conversation::getOrCreateBetween($this->propertyManager->id, 'lead', $this->lead->id);

    expect($conversation->property_manager_id)->toBe($this->propertyManager->id);
    expect($conversation->participant_type)->toBe('lead');
    expect($conversation->participant_id)->toBe($this->lead->id);
    expect(Conversation::count())->toBe(1);
});
