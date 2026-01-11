<?php

namespace App\Http\Requests\Property;

use App\Http\Requests\Traits\PropertyValidationRules;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation for saving property drafts (autosave).
 *
 * Uses relaxed validation - most fields are nullable since drafts
 * can be incomplete. The wizard step is tracked to enable step-locking.
 */
class SavePropertyDraftRequest extends FormRequest
{
    use PropertyValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $property = $this->route('property');
        $propertyManager = $this->user()->propertyManager;

        // Must have a property manager profile
        if (! $propertyManager) {
            return false;
        }

        // Must own this property
        if ($property->property_manager_id !== $propertyManager->id) {
            return false;
        }

        // Can only autosave drafts
        if ($property->status !== 'draft') {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return $this->draftRules();
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return $this->validationMessages();
    }

    /**
     * Get the validated data with boolean conversions applied.
     */
    public function validatedWithBooleans(): array
    {
        return $this->convertBooleanFields($this->validated());
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        $property = $this->route('property');

        if ($property && $property->status !== 'draft') {
            abort(400, 'Can only autosave draft properties');
        }

        abort(403);
    }
}
