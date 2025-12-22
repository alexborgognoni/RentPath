<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    /**
     * Determine if user can view conversation as the property manager.
     */
    public function viewAsManager(User $user, Conversation $conversation): bool
    {
        $propertyManager = $user->propertyManager;

        if (! $propertyManager) {
            return false;
        }

        return $conversation->property_manager_id === $propertyManager->id;
    }

    /**
     * Determine if user can view conversation as the participant (tenant).
     */
    public function viewAsParticipant(User $user, Conversation $conversation): bool
    {
        // Only tenants can view as participant
        if ($conversation->participant_type !== Conversation::PARTICIPANT_TYPE_TENANT) {
            return false;
        }

        // For tenants, participant_id is the user ID
        return $conversation->participant_id === $user->id;
    }

    /**
     * Determine if user can send a message in this conversation.
     * Either the property manager or the participant can send messages.
     */
    public function sendMessage(User $user, Conversation $conversation): bool
    {
        return $this->viewAsManager($user, $conversation)
            || $this->viewAsParticipant($user, $conversation);
    }
}
