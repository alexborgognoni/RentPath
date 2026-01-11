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
use Illuminate\Foundation\Http\FormRequest;

/**
 * Full application submission validation.
 *
 * Combines all step rules for final submission validation.
 */
class SubmitApplicationRequest extends FormRequest
{
    use ApplicationValidationRules;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        // Merge rules from all steps
        return array_merge(
            $this->getStepRules(IdentityStepRequest::class),
            $this->getStepRules(HouseholdStepRequest::class),
            $this->getStepRules(FinancialStepRequest::class),
            $this->getStepRules(SupportStepRequest::class),
            $this->getStepRules(HistoryStepRequest::class),
            $this->getStepRules(AdditionalStepRequest::class),
            $this->getStepRules(ConsentStepRequest::class),
            [
                // Token tracking
                'invited_via_token' => 'nullable|string|max:64',
            ]
        );
    }

    public function messages(): array
    {
        // Merge messages from all steps
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

        // Copy request data for conditional validation
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
