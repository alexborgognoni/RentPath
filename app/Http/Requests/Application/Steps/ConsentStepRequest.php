<?php

namespace App\Http\Requests\Application\Steps;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Step 7: Declarations & Consent
 *
 * Validates required declarations and digital signature.
 */
class ConsentStepRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            // Required Declarations (must all be accepted)
            'declaration_accuracy' => 'required|boolean|accepted',
            'consent_screening' => 'required|boolean|accepted',
            'consent_data_processing' => 'required|boolean|accepted',
            'consent_reference_contact' => 'required|boolean|accepted',

            // Optional Consents
            'consent_data_sharing' => 'nullable|boolean',
            'consent_marketing' => 'nullable|boolean',

            // Digital Signature
            'digital_signature' => 'required|string|max:200',
        ];
    }

    public function messages(): array
    {
        return [
            'declaration_accuracy.required' => 'You must confirm the accuracy of your information',
            'declaration_accuracy.accepted' => 'You must confirm the accuracy of your information',
            'consent_screening.required' => 'You must consent to background screening',
            'consent_screening.accepted' => 'You must consent to background screening',
            'consent_data_processing.required' => 'You must consent to data processing',
            'consent_data_processing.accepted' => 'You must consent to data processing',
            'consent_reference_contact.required' => 'You must consent to reference contact',
            'consent_reference_contact.accepted' => 'You must consent to reference contact',
            'digital_signature.required' => 'Digital signature is required',
            'digital_signature.max' => 'Signature cannot exceed 200 characters',
        ];
    }
}
