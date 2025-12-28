<?php

use App\Rules\ValidPostalCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

beforeEach(function () {
    // Reset request for each test
    App::instance('request', new Request);
});

test('valid Netherlands postal codes pass validation', function () {
    request()->merge(['current_country' => 'NL']);
    $rule = new ValidPostalCode('current_country');
    $passed = true;

    $validCodes = ['1012 AB', '1012AB', '9999 ZZ', '0000 AA'];

    foreach ($validCodes as $code) {
        $rule->validate('postal_code', $code, function () use (&$passed) {
            $passed = false;
        });
        expect($passed)->toBeTrue();
    }
});

test('invalid Netherlands postal codes fail validation', function () {
    request()->merge(['current_country' => 'NL']);
    $rule = new ValidPostalCode('current_country');

    $invalidCodes = ['12345', 'ABCD 12', '1012', '10123 AB'];

    foreach ($invalidCodes as $code) {
        $failed = false;
        $rule->validate('postal_code', $code, function () use (&$failed) {
            $failed = true;
        });
        expect($failed)->toBeTrue();
    }
});

test('valid US ZIP codes pass validation', function () {
    request()->merge(['current_country' => 'US']);
    $rule = new ValidPostalCode('current_country');

    $validCodes = ['12345', '12345-6789', '00000', '99999'];

    foreach ($validCodes as $code) {
        $passed = true;
        $rule->validate('postal_code', $code, function () use (&$passed) {
            $passed = false;
        });
        expect($passed)->toBeTrue();
    }
});

test('invalid US ZIP codes fail validation', function () {
    request()->merge(['current_country' => 'US']);
    $rule = new ValidPostalCode('current_country');

    $invalidCodes = ['1234', '123456', '12345-', '12345-123'];

    foreach ($invalidCodes as $code) {
        $failed = false;
        $rule->validate('postal_code', $code, function () use (&$failed) {
            $failed = true;
        });
        expect($failed)->toBeTrue();
    }
});

test('valid UK postcodes pass validation', function () {
    request()->merge(['current_country' => 'GB']);
    $rule = new ValidPostalCode('current_country');

    $validCodes = ['SW1A 1AA', 'EC1A 1BB', 'M1 1AE', 'W1J 0BD'];

    foreach ($validCodes as $code) {
        $passed = true;
        $rule->validate('postal_code', $code, function () use (&$passed) {
            $passed = false;
        });
        expect($passed)->toBeTrue();
    }
});

test('valid German postal codes pass validation', function () {
    request()->merge(['current_country' => 'DE']);
    $rule = new ValidPostalCode('current_country');

    $validCodes = ['12345', '00000', '99999'];

    foreach ($validCodes as $code) {
        $passed = true;
        $rule->validate('postal_code', $code, function () use (&$passed) {
            $passed = false;
        });
        expect($passed)->toBeTrue();
    }
});

test('valid Canadian postal codes pass validation', function () {
    request()->merge(['current_country' => 'CA']);
    $rule = new ValidPostalCode('current_country');

    $validCodes = ['K1A 0B1', 'K1A0B1', 'M5V 3L9', 'V6B 4Y8'];

    foreach ($validCodes as $code) {
        $passed = true;
        $rule->validate('postal_code', $code, function () use (&$passed) {
            $passed = false;
        });
        expect($passed)->toBeTrue();
    }
});

test('empty postal code passes validation', function () {
    request()->merge(['current_country' => 'NL']);
    $rule = new ValidPostalCode('current_country');
    $passed = true;

    $rule->validate('postal_code', '', function () use (&$passed) {
        $passed = false;
    });

    expect($passed)->toBeTrue();
});

test('unknown country codes pass validation', function () {
    request()->merge(['current_country' => 'XX']);
    $rule = new ValidPostalCode('current_country');
    $passed = true;

    $rule->validate('postal_code', 'anything123', function () use (&$passed) {
        $passed = false;
    });

    expect($passed)->toBeTrue();
});

test('missing country code passes validation', function () {
    request()->merge(['current_country' => null]);
    $rule = new ValidPostalCode('current_country');
    $passed = true;

    $rule->validate('postal_code', '12345', function () use (&$passed) {
        $passed = false;
    });

    expect($passed)->toBeTrue();
});

test('valid Swiss postal codes pass validation', function () {
    request()->merge(['current_country' => 'CH']);
    $rule = new ValidPostalCode('current_country');

    $validCodes = ['8001', '1234', '9999'];

    foreach ($validCodes as $code) {
        $passed = true;
        $rule->validate('postal_code', $code, function () use (&$passed) {
            $passed = false;
        });
        expect($passed)->toBeTrue();
    }
});

test('valid Australian postal codes pass validation', function () {
    request()->merge(['current_country' => 'AU']);
    $rule = new ValidPostalCode('current_country');

    $validCodes = ['2000', '3000', '4000'];

    foreach ($validCodes as $code) {
        $passed = true;
        $rule->validate('postal_code', $code, function () use (&$passed) {
            $passed = false;
        });
        expect($passed)->toBeTrue();
    }
});
