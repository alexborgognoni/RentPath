<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Http\Resources\PropertyResource;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/index');
    }

    public function properties(Request $request)
    {
        return Inertia::render('dashboard/properties', [
            'properties' => PropertyResource::collection(Property::all())->toArray($request)
        ]);
    }

    public function applications()
    {
        return Inertia::render('dashboard/applications');
    }

    public function tenants()
    {
        return Inertia::render('dashboard/tenants');
    }
}
