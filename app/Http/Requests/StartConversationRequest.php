<?php

namespace App\Http\Requests;

use App\Models\Conversation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StartConversationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->propertyManager !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'participant_type' => [
                'required',
                Rule::in([
                    Conversation::PARTICIPANT_TYPE_LEAD,
                    Conversation::PARTICIPANT_TYPE_TENANT,
                ]),
            ],
            'participant_id' => ['required', 'integer'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $type = $this->input('participant_type');
            $id = $this->input('participant_id');

            if ($type === Conversation::PARTICIPANT_TYPE_LEAD) {
                if (! \App\Models\Lead::find($id)) {
                    $validator->errors()->add('participant_id', 'Lead not found.');
                }
            } elseif ($type === Conversation::PARTICIPANT_TYPE_TENANT) {
                // For tenants, we store the user_id, not tenant_profile_id
                if (! \App\Models\User::find($id)) {
                    $validator->errors()->add('participant_id', 'User not found.');
                }
            }
        });
    }
}
