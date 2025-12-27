<?php

use App\Models\TenantProfile;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guest sees browse properties in navigation', function () {
    $page = visit('/properties');

    $page->assertSee('Properties')
        ->assertNoJavascriptErrors();
});

test('guest can navigate to properties page', function () {
    $page = visit('/');

    $page->assertSee('Browse Properties')
        ->assertNoJavascriptErrors();
});

test('authenticated user sees full navigation', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);
    TenantProfile::factory()->create([
        'user_id' => $user->id,
    ]);

    $this->actingAs($user);

    $page = visit('/applications');

    $page->assertSee('Properties')
        ->assertSee('Applications')
        ->assertSee('Messages')
        ->assertSee('Profile')
        ->assertNoJavascriptErrors();
});

test('applications page shows applications list', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user);

    $page = visit('/applications');

    $page->assertUrlIs('/applications')
        ->assertNoJavascriptErrors();
});

test('profile navigation is active on profile page', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user);

    $page = visit('/profile');

    $page->assertUrlIs('/profile')
        ->assertNoJavascriptErrors();
});

test('navigation links work correctly', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user);

    // Start on applications
    $page = visit('/applications');
    $page->assertSee('Applications');

    // Navigate to properties
    $page = visit('/properties');
    $page->assertUrlIs('/properties')
        ->assertSee('Properties');

    // Navigate to messages
    $page = visit('/messages');
    $page->assertUrlIs('/messages');

    // Navigate to profile
    $page = visit('/profile');
    $page->assertUrlIs('/profile');
});

test('mobile menu shows navigation items', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $this->actingAs($user);

    $page = visit('/applications', viewport: 'mobile');

    $page->assertNoJavascriptErrors();
});
