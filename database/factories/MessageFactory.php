<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'sender_role' => fake()->randomElement([
                Message::SENDER_ROLE_MANAGER,
                Message::SENDER_ROLE_PARTICIPANT,
            ]),
            'body' => fake()->paragraph(),
        ];
    }

    /**
     * Configure the message as sent by the manager.
     */
    public function fromManager(): static
    {
        return $this->state(fn (array $attributes) => [
            'sender_role' => Message::SENDER_ROLE_MANAGER,
        ]);
    }

    /**
     * Configure the message as sent by the participant.
     */
    public function fromParticipant(): static
    {
        return $this->state(fn (array $attributes) => [
            'sender_role' => Message::SENDER_ROLE_PARTICIPANT,
        ]);
    }

    /**
     * Use a short message body.
     */
    public function short(): static
    {
        return $this->state(fn (array $attributes) => [
            'body' => fake()->sentence(),
        ]);
    }

    /**
     * Use a long message body.
     */
    public function long(): static
    {
        return $this->state(fn (array $attributes) => [
            'body' => fake()->paragraphs(3, true),
        ]);
    }
}
