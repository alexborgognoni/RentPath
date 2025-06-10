***REMOVED***

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('registration screen can be rendered', function () ***REMOVED***
    $response = $this->get('/register');

    $response->assertStatus(200);
***REMOVED***);

test('new users can register', function () ***REMOVED***
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
***REMOVED***);