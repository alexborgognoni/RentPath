<?php

namespace App\Policies;

use App\Models\TenantProfile;
use App\Models\User;

class TenantProfilePolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TenantProfile $tenantProfile): bool
    {
        return $tenantProfile->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TenantProfile $tenantProfile): bool
    {
        return $tenantProfile->user_id === $user->id;
    }

    /**
     * Determine whether the user can upload documents to the profile.
     */
    public function uploadDocument(User $user, TenantProfile $tenantProfile): bool
    {
        return $tenantProfile->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete documents from the profile.
     */
    public function deleteDocument(User $user, TenantProfile $tenantProfile): bool
    {
        return $tenantProfile->user_id === $user->id;
    }
}
