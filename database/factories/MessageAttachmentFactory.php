<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MessageAttachment>
 */
class MessageAttachmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $filename = fake()->word().'.pdf';

        return [
            'message_id' => Message::factory(),
            'file_path' => 'message-attachments/'.fake()->uuid().'/'.$filename,
            'original_name' => $filename,
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(10000, 5000000),
        ];
    }

    /**
     * Configure as an image attachment.
     */
    public function image(): static
    {
        $extension = fake()->randomElement(['jpg', 'png', 'gif']);
        $filename = fake()->word().'.'.$extension;

        return $this->state(fn (array $attributes) => [
            'file_path' => 'message-attachments/'.fake()->uuid().'/'.$filename,
            'original_name' => $filename,
            'mime_type' => 'image/'.$extension,
            'size' => fake()->numberBetween(50000, 2000000),
        ]);
    }

    /**
     * Configure as a PDF attachment.
     */
    public function pdf(): static
    {
        $filename = fake()->word().'.pdf';

        return $this->state(fn (array $attributes) => [
            'file_path' => 'message-attachments/'.fake()->uuid().'/'.$filename,
            'original_name' => $filename,
            'mime_type' => 'application/pdf',
            'size' => fake()->numberBetween(100000, 5000000),
        ]);
    }

    /**
     * Configure as a document attachment.
     */
    public function document(): static
    {
        $extension = fake()->randomElement(['doc', 'docx']);
        $filename = fake()->word().'.'.$extension;

        return $this->state(fn (array $attributes) => [
            'file_path' => 'message-attachments/'.fake()->uuid().'/'.$filename,
            'original_name' => $filename,
            'mime_type' => 'application/msword',
            'size' => fake()->numberBetween(50000, 1000000),
        ]);
    }
}
