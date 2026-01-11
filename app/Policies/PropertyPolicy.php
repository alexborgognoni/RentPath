<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
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
    public function view(User $user, Property $property): bool
    {
        return $this->ownsProperty($user, $property);
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
    public function update(User $user, Property $property): bool
    {
        return $this->ownsProperty($user, $property);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Property $property): bool
    {
        return $this->ownsProperty($user, $property);
    }

    /**
     * Determine whether the user can publish the property.
     */
    public function publish(User $user, Property $property): bool
    {
        return $this->ownsProperty($user, $property);
    }

    /**
     * Determine whether the user can manage invite tokens for the property.
     */
    public function manageTokens(User $user, Property $property): bool
    {
        return $this->ownsProperty($user, $property);
    }

    /**
     * Check if user's property manager owns this property.
     */
    private function ownsProperty(User $user, Property $property): bool
    {
        $propertyManager = $user->propertyManager;

        return $propertyManager && $property->property_manager_id === $propertyManager->id;
    }
}
