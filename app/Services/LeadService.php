<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\Property;

class LeadService
{
    /**
     * Create a new lead for a property.
     */
    public function create(Property $property, array $data): Lead
    {
        return Lead::create([
            'property_id' => $property->id,
            'email' => $data['email'],
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'phone' => $data['phone'] ?? null,
            'token' => Lead::generateToken(),
            'source' => $data['source'] ?? Lead::SOURCE_MANUAL,
            'status' => Lead::STATUS_INVITED,
            'notes' => $data['notes'] ?? null,
            'invited_at' => now(),
        ]);
    }

    /**
     * Check if a lead already exists for the given email and property.
     */
    public function existsForProperty(Property $property, string $email): bool
    {
        return Lead::where('property_id', $property->id)
            ->where('email', $email)
            ->exists();
    }

    /**
     * Get existing lead by email and property.
     */
    public function findByEmail(Property $property, string $email): ?Lead
    {
        return Lead::where('property_id', $property->id)
            ->where('email', $email)
            ->first();
    }

    /**
     * Update lead details.
     */
    public function update(Lead $lead, array $data): Lead
    {
        $lead->update($data);

        return $lead->fresh();
    }

    /**
     * Archive a lead.
     */
    public function archive(Lead $lead): Lead
    {
        $lead->archive();

        return $lead->fresh();
    }

    /**
     * Resend invite to a lead.
     */
    public function resendInvite(Lead $lead): Lead
    {
        // TODO: Send invite email when email service is implemented
        // $lead->sendInviteEmail();

        $lead->update(['invited_at' => now()]);

        return $lead->fresh();
    }
}
