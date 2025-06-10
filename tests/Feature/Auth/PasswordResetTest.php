***REMOVED***

***REMOVED***
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('reset password link screen can be rendered', function () ***REMOVED***
    $response = $this->get('/forgot-password');

    $response->assertStatus(200);
***REMOVED***);

test('reset password link can be requested', function () ***REMOVED***
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class);
***REMOVED***);

test('reset password screen can be rendered', function () ***REMOVED***
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) ***REMOVED***
        $response = $this->get('/reset-password/'.$notification->token);

        $response->assertStatus(200);

        return true;
***REMOVED***);
***REMOVED***);

test('password can be reset with valid token', function () ***REMOVED***
    Notification::fake();

    $user = User::factory()->create();

    $this->post('/forgot-password', ['email' => $user->email]);

    Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) ***REMOVED***
        $response = $this->post('/reset-password', [
            'token' => $notification->token,
            'email' => $user->email,
            'password' => 'password',
            'password_confirmation' => 'password',
***REMOVED***

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('login'));

        return true;
***REMOVED***);
***REMOVED***);