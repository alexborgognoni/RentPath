<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /**
     * Determine whether the user can view any models (tenant view).
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model as tenant.
     */
    public function viewAsTenant(User $user, Application $application): bool
    {
        return $this->ownedByTenant($user, $application);
    }

    /**
     * Determine whether the user can update the model as tenant.
     */
    public function updateAsTenant(User $user, Application $application): bool
    {
        return $this->ownedByTenant($user, $application)
            && $application->status === 'draft';
    }

    /**
     * Determine whether the user can withdraw the application.
     */
    public function withdraw(User $user, Application $application): bool
    {
        return $this->ownedByTenant($user, $application)
            && in_array($application->status, ['submitted', 'under_review']);
    }

    /**
     * Determine whether the user can delete the model as tenant.
     */
    public function deleteAsTenant(User $user, Application $application): bool
    {
        return $this->ownedByTenant($user, $application)
            && in_array($application->status, ['draft', 'withdrawn', 'rejected']);
    }

    /**
     * Determine whether the user can upload documents to the application.
     */
    public function uploadDocument(User $user, Application $application): bool
    {
        return $this->ownedByTenant($user, $application);
    }

    /**
     * Determine whether the user can view the model as manager.
     */
    public function viewAsManager(User $user, Application $application): bool
    {
        return $this->ownedByManager($user, $application);
    }

    /**
     * Determine whether the user can view any applications as manager.
     */
    public function viewAnyAsManager(User $user): bool
    {
        return $user->propertyManager !== null;
    }

    /**
     * Determine whether the user can update status as manager.
     */
    public function updateStatus(User $user, Application $application): bool
    {
        return $this->ownedByManager($user, $application);
    }

    /**
     * Determine whether the user can approve the application.
     */
    public function approve(User $user, Application $application): bool
    {
        return $this->ownedByManager($user, $application);
    }

    /**
     * Determine whether the user can reject the application.
     */
    public function reject(User $user, Application $application): bool
    {
        return $this->ownedByManager($user, $application);
    }

    /**
     * Check if application is owned by tenant (user's tenant profile).
     */
    private function ownedByTenant(User $user, Application $application): bool
    {
        $tenantProfile = $user->tenantProfile;

        return $tenantProfile && $application->tenant_profile_id === $tenantProfile->id;
    }

    /**
     * Check if application's property is owned by user's property manager.
     */
    private function ownedByManager(User $user, Application $application): bool
    {
        $propertyManager = $user->propertyManager;

        return $propertyManager && $application->property->property_manager_id === $propertyManager->id;
    }
}
