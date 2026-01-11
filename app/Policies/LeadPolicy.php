<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;

class LeadPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->propertyManager !== null;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Lead $lead): bool
    {
        return $this->ownsLead($user, $lead);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->propertyManager !== null;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Lead $lead): bool
    {
        return $this->ownsLead($user, $lead);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Lead $lead): bool
    {
        return $this->ownsLead($user, $lead);
    }

    /**
     * Determine whether the user can archive the lead.
     */
    public function archive(User $user, Lead $lead): bool
    {
        return $this->ownsLead($user, $lead);
    }

    /**
     * Determine whether the user can resend invite to the lead.
     */
    public function resend(User $user, Lead $lead): bool
    {
        return $this->ownsLead($user, $lead);
    }

    /**
     * Check if user's property manager owns this lead's property.
     */
    private function ownsLead(User $user, Lead $lead): bool
    {
        $propertyManager = $user->propertyManager;

        return $propertyManager && $lead->property->property_manager_id === $propertyManager->id;
    }
}
