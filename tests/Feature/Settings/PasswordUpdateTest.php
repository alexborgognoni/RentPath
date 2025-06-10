***REMOVED***

***REMOVED***
***REMOVED***

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('password can be updated', function () ***REMOVED***
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/settings/password')
        ->put('/settings/password', [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
***REMOVED***

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/password');

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
***REMOVED***);

test('correct password must be provided to update password', function () ***REMOVED***
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/settings/password')
        ->put('/settings/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
***REMOVED***

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect('/settings/password');
***REMOVED***);