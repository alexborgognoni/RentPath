<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/index');
    }

    public function properties(Request $request)
    {
        return Inertia::render('dashboard/properties', [
            'properties' => Property::all()->toArray($request)
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
