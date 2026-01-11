<?php

namespace App\Http\Requests\Application;

use App\Http\Requests\Application\Steps\AdditionalStepRequest;
use App\Http\Requests\Application\Steps\ConsentStepRequest;
use App\Http\Requests\Application\Steps\FinancialStepRequest;
use App\Http\Requests\Application\Steps\HistoryStepRequest;
use App\Http\Requests\Application\Steps\HouseholdStepRequest;
use App\Http\Requests\Application\Steps\IdentityStepRequest;
use App\Http\Requests\Application\Steps\SupportStepRequest;
use App\Http\Requests\Traits\ApplicationValidationRules;
use App\Models\Application;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Application draft save validation.
 *
 * For Precognition requests: Validates fields strictly using step rules.
 * For normal saves: Uses relaxed rules to allow saving incomplete drafts.
 */
class SaveApplicationDraftRequest extends FormRequest
{
    use ApplicationValidationRules;

    protected ?Application $application = null;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function setApplication(Application $application): static
    {
        $this->application = $application;

        return $this;
    }

    public function rules(): array
    {
        // For Precognition requests, use strict step rules for validation
        if ($this->isPrecognitive()) {
            return $this->precognitionRules();
        }

        // For normal saves (autosave), use relaxed rules
        return $this->draftRules();
    }

    /**
     * Relaxed rules for draft autosave - allows incomplete/invalid data.
     * This preserves user work even if data is incomplete.
     * The backend service calculates maxValidStep based on actual validation.
     */
    private function draftRules(): array
    {
        // Very relaxed - just validate data types, not ranges/requirements
        // This allows saving draft with any data state
        return [
            'current_step' => 'nullable|integer',
            'invited_via_token' => 'nullable|string|max:64',
        ];
    }

    /**
     * Strict rules for Precognition validation - validates step fields.
     */
    private function precognitionRules(): array
    {
        return array_merge(
            $this->getStepRules(IdentityStepRequest::class),
            $this->getStepRules(HouseholdStepRequest::class),
            $this->getStepRules(FinancialStepRequest::class),
            $this->getStepRules(SupportStepRequest::class),
            $this->getStepRules(HistoryStepRequest::class),
            $this->getStepRules(AdditionalStepRequest::class),
            $this->getStepRules(ConsentStepRequest::class),
            [
                'current_step' => 'nullable|integer|min:1|max:8',
                'invited_via_token' => 'nullable|string|max:64',
            ]
        );
    }

    public function messages(): array
    {
        return array_merge(
            $this->getStepMessages(IdentityStepRequest::class),
            $this->getStepMessages(HouseholdStepRequest::class),
            $this->getStepMessages(FinancialStepRequest::class),
            $this->getStepMessages(SupportStepRequest::class),
            $this->getStepMessages(HistoryStepRequest::class),
            $this->getStepMessages(AdditionalStepRequest::class),
            $this->getStepMessages(ConsentStepRequest::class),
        );
    }

    /**
     * Get rules from a step request class.
     */
    private function getStepRules(string $requestClass): array
    {
        $request = new $requestClass;
        $request->merge($this->all());

        if (method_exists($request, 'setApplication') && $this->application) {
            $request->setApplication($this->application);
        }

        return $request->rules();
    }

    /**
     * Get messages from a step request class.
     */
    private function getStepMessages(string $requestClass): array
    {
        return (new $requestClass)->messages();
    }
}
