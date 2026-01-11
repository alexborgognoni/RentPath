<?php

namespace App\Http\Requests\Property\Steps;

use App\Http\Requests\Traits\PropertyValidationRules;
use App\Models\Property;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Step 6: Pricing
 */
class PricingStepRequest extends FormRequest
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
            'rent_amount' => 'required|numeric|min:'.self::$constraints['rent_amount']['min'].'|max:'.self::$constraints['rent_amount']['max'],
            'rent_currency' => ['required', Rule::in(self::$currencies)],
            'available_date' => 'nullable|date|after_or_equal:today',
        ];
    }

    public function messages(): array
    {
        return [
            'rent_amount.required' => 'Rent amount is required',
            'rent_amount.min' => 'Rent amount must be greater than 0',
            'rent_amount.max' => 'Rent amount cannot exceed '.number_format(self::$constraints['rent_amount']['max']),
            'rent_amount.numeric' => 'Rent amount must be a valid number',
            'rent_currency.required' => 'Currency is required',
            'rent_currency.in' => 'Please select a valid currency',
            'available_date.date' => 'Please enter a valid date',
            'available_date.after_or_equal' => 'Available date must be today or in the future',
        ];
    }
}
