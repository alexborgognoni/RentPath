***REMOVED***

***REMOVED***

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () ***REMOVED***
    $this->get('/dashboard')->assertRedirect('/login');
***REMOVED***);

test('authenticated users can visit the dashboard', function () ***REMOVED***
    $this->actingAs($user = User::factory()->create());

    $this->get('/dashboard')->assertOk();
***REMOVED***);