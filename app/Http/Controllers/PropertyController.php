<?php

namespace App\Http\Controllers;

use App\Http\Requests\Property\StorePropertyRequest;
use App\Models\Property;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PropertyController extends Controller
{
    public function show(Property $property)
    {
        return Inertia::render('dashboard/property_details', [
            'property' => $property
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/create_property');
    }

    public function store(StorePropertyRequest $request)
    {
        $property = Property::create($request->validated());

        return Redirect::route('dashboard.properties.show', $property->id);
    }

    public function edit($property_id)
    {
        $property = Property::findOrFail($property_id);

        return Inertia::render('dashboard/edit_property', [
            'property' => $property,
        ]);
    }
}
