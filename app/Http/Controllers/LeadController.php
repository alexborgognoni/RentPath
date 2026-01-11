<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use App\Models\Lead;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeadController extends Controller
{
    /**
     * Display a listing of leads for the property manager.
     */
    public function index(Request $request)
    {
        $propertyManager = Auth::user()->propertyManager;

        if (! $propertyManager) {
            abort(403, 'You must be a property manager to access leads.');
        }

        // Get all property IDs for this manager
        $propertyIds = Property::where('property_manager_id', $propertyManager->id)->pluck('id');

        // Build query for leads
        $query = Lead::whereIn('property_id', $propertyIds)
            ->with(['property', 'user', 'application']);

        // Filter by property if specified
        if ($request->filled('property')) {
            $query->where('property_id', $request->input('property'));
        }

        // Filter by status if specified
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by source if specified
        if ($request->filled('source')) {
            $query->where('source', $request->input('source'));
        }

        // Search by email or name
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        // Get leads ordered by most recent
        $leads = $query->orderBy('created_at', 'desc')->get();

        // Get properties for filter dropdown
        $properties = Property::where('property_manager_id', $propertyManager->id)
            ->select('id', 'title')
            ->orderBy('title')
            ->get();

        return Inertia::render('manager/leads', [
            'leads' => $leads,
            'properties' => $properties,
            'filters' => [
                'property' => $request->input('property'),
                'status' => $request->input('status'),
                'source' => $request->input('source'),
                'search' => $request->input('search'),
            ],
            'statusOptions' => Lead::getStatusOptions(),
            'sourceOptions' => Lead::getSourceOptions(),
        ]);
    }

    /**
     * Store a newly created lead (invite to apply).
     */
    public function store(StoreLeadRequest $request)
    {
        $propertyManager = Auth::user()->propertyManager;
        $validated = $request->validated();

        // Verify property belongs to manager
        $property = Property::findOrFail($validated['property_id']);
        if ($property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        // Check if lead already exists for this email + property
        $existingLead = Lead::where('property_id', $property->id)
            ->where('email', $validated['email'])
            ->first();

        if ($existingLead) {
            return back()->withErrors(['email' => 'A lead with this email already exists for this property.']);
        }

        // Create the lead
        $lead = Lead::create([
            'property_id' => $property->id,
            'email' => $validated['email'],
            'first_name' => $validated['first_name'] ?? null,
            'last_name' => $validated['last_name'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'token' => Lead::generateToken(),
            'source' => $validated['source'] ?? Lead::SOURCE_MANUAL,
            'status' => Lead::STATUS_INVITED,
            'notes' => $validated['notes'] ?? null,
            'invited_at' => now(),
        ]);

        // TODO: Send invite email if source is 'invite'
        // if ($validated['source'] === Lead::SOURCE_INVITE) {
        //     $lead->sendInviteEmail();
        // }

        return redirect()->route('manager.leads.index')
            ->with('success', 'Lead created successfully.');
    }

    /**
     * Display the specified lead.
     */
    public function show(Lead $lead)
    {
        $propertyManager = Auth::user()->propertyManager;

        // Verify lead's property belongs to manager
        if ($lead->property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $lead->load(['property', 'user', 'application', 'inviteToken']);

        return Inertia::render('manager/lead', [
            'lead' => $lead,
            'statusOptions' => Lead::getStatusOptions(),
            'sourceOptions' => Lead::getSourceOptions(),
        ]);
    }

    /**
     * Update the specified lead.
     */
    public function update(UpdateLeadRequest $request, Lead $lead)
    {
        $propertyManager = Auth::user()->propertyManager;

        // Verify lead's property belongs to manager
        if ($lead->property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $validated = $request->validated();

        $lead->update($validated);

        return back()->with('success', 'Lead updated successfully.');
    }

    /**
     * Remove the specified lead.
     */
    public function destroy(Lead $lead)
    {
        $propertyManager = Auth::user()->propertyManager;

        // Verify lead's property belongs to manager
        if ($lead->property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $lead->delete();

        return redirect()->route('manager.leads.index')
            ->with('success', 'Lead deleted successfully.');
    }

    /**
     * Resend invite email to lead.
     */
    public function resendInvite(Lead $lead)
    {
        $propertyManager = Auth::user()->propertyManager;

        // Verify lead's property belongs to manager
        if ($lead->property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        // TODO: Send invite email
        // $lead->sendInviteEmail();

        $lead->update(['invited_at' => now()]);

        return back()->with('success', 'Invite resent successfully.');
    }

    /**
     * Archive the specified lead.
     */
    public function archive(Lead $lead)
    {
        $propertyManager = Auth::user()->propertyManager;

        // Verify lead's property belongs to manager
        if ($lead->property->property_manager_id !== $propertyManager->id) {
            abort(403);
        }

        $lead->archive();

        return back()->with('success', 'Lead archived successfully.');
    }
}
