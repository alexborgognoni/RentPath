<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Property;

class PropertyController extends Controller
{
    public function create()
    {
        return Inertia::render('dashboard/create_property');
    }

    // Add the show method for property details
    public function show(Property $property)
    {
        return Inertia::render('dashboard/property_details', [
            'property' => $property
        ]);
    }
}
