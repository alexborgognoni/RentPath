<?php

namespace App\Http\Requests\Property\Steps;

use App\Http\Requests\Traits\PropertyValidationRules;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 5: Energy
 *
 * All fields optional.
 */
class EnergyStepRequest extends FormRequest
{
    use PropertyValidationRules;

    protected ?Property $property = null;

    public function authorize(): bool
    {
        return auth()->check();
    }

    public function setProperty(Property $property): static
    {
        $this->property = $property;

        return $this;
    }

    public function rules(): array
    {
        return [
            'energy_class' => ['nullable', Rule::in(self::$energyClasses)],
            'thermal_insulation_class' => ['nullable', Rule::in(self::$thermalInsulationClasses)],
            'heating_type' => ['nullable', Rule::in(self::$heatingTypes)],
        ];
    }

    public function messages(): array
    {
        return [
            'energy_class.in' => 'Please select a valid energy class',
            'thermal_insulation_class.in' => 'Please select a valid thermal insulation class',
            'heating_type.in' => 'Please select a valid heating type',
        ];
    }
}
