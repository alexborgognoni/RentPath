<?php

namespace App\Http\Requests\Application\Steps;

use App\Http\Requests\Traits\ApplicationValidationRules;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Step 6: Additional Information
 *
 * Validates optional additional info and documents.
 */
class AdditionalStepRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'additional_information' => 'nullable|string|max:2000',
            'additional_documents' => 'nullable|array',
            'additional_documents.*' => 'file|mimes:pdf,jpeg,png,jpg|max:20480',

            // Legacy document fields
            'application_id_document' => $this->fileRule(),
            'application_proof_of_income' => $this->fileRule(),
            'application_reference_letter' => $this->fileRule(),
        ];
    }

    public function messages(): array
    {
        return [
            'additional_information.max' => 'Additional information cannot exceed 2000 characters',
            'additional_documents.*.mimes' => 'Documents must be PDF, JPEG, or PNG format',
            'additional_documents.*.max' => 'Each document must be less than 20MB',
        ];
    }
}
