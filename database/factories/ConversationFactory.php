<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Lead;
use App\Models\PropertyManager;
use App\Models\TenantProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'property_manager_id' => PropertyManager::factory(),
            'participant_type' => Conversation::PARTICIPANT_TYPE_TENANT,
            'participant_id' => TenantProfile::factory(),
            'last_message_at' => null,
            'manager_last_read_at' => null,
            'participant_last_read_at' => null,
        ];
    }

    /**
     * Configure the conversation to be with a lead.
     */
    public function withLead(?Lead $lead = null): static
    {
        return $this->state(function (array $attributes) use ($lead) {
            $lead = $lead ?? Lead::factory()->create();

            return [
                'participant_type' => Conversation::PARTICIPANT_TYPE_LEAD,
                'participant_id' => $lead->id,
            ];
        });
    }

    /**
     * Configure the conversation to be with a tenant.
     */
    public function withTenant(?TenantProfile $tenant = null): static
    {
        return $this->state(function (array $attributes) use ($tenant) {
            $tenant = $tenant ?? TenantProfile::factory()->create();

            return [
                'participant_type' => Conversation::PARTICIPANT_TYPE_TENANT,
                'participant_id' => $tenant->id,
            ];
        });
    }

    /**
     * Add a recent message to the conversation.
     */
    public function withRecentMessage(): static
    {
        return $this->state(fn (array $attributes) => [
            'last_message_at' => now(),
        ]);
    }

    /**
     * Mark as read by the manager.
     */
    public function readByManager(): static
    {
        return $this->state(fn (array $attributes) => [
            'manager_last_read_at' => now(),
        ]);
    }

    /**
     * Mark as read by the participant.
     */
    public function readByParticipant(): static
    {
        return $this->state(fn (array $attributes) => [
            'participant_last_read_at' => now(),
        ]);
    }
}
