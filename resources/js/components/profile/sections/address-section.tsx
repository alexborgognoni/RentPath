import { AddressForm, type AddressData } from '@/components/ui/address-form';
import type { ProfileFormData, UseProfileFormReturn } from '@/hooks/use-profile-form';
import { useCallback, useMemo } from 'react';

interface AddressSectionProps {
    form: UseProfileFormReturn;
}

/**
 * Wrapper around AddressForm for the profile page.
 * Maps ProfileFormData (current_* fields) to AddressData format.
 */
export function AddressSection({ form }: AddressSectionProps) {
    // Map profile form data to AddressData
    const addressData: AddressData = useMemo(
        () => ({
            street_name: form.data.current_street_name,
            house_number: form.data.current_house_number,
            address_line_2: form.data.current_address_line_2,
            city: form.data.current_city,
            state_province: form.data.current_state_province,
            postal_code: form.data.current_postal_code,
            country: form.data.current_country,
        }),
        [form.data],
    );

    // Handle field changes - map address fields to current_* profile fields
    const handleChange = useCallback(
        (field: keyof AddressData, value: string) => {
            const fieldMap: Record<keyof AddressData, keyof ProfileFormData> = {
                street_name: 'current_street_name',
                house_number: 'current_house_number',
                address_line_2: 'current_address_line_2',
                city: 'current_city',
                state_province: 'current_state_province',
                postal_code: 'current_postal_code',
                country: 'current_country',
            };
            form.setField(fieldMap[field], value);
        },
        [form],
    );

    // Handle field blur for validation
    const handleFieldBlur = useCallback(
        (field: keyof AddressData) => {
            const fieldMap: Record<keyof AddressData, string> = {
                street_name: 'current_street_name',
                house_number: 'current_house_number',
                address_line_2: 'current_address_line_2',
                city: 'current_city',
                state_province: 'current_state_province',
                postal_code: 'current_postal_code',
                country: 'current_country',
            };
            const profileField = fieldMap[field];
            form.markFieldTouched(profileField);
            form.validateField(profileField);
        },
        [form],
    );

    return (
        <AddressForm
            data={addressData}
            onChange={handleChange}
            onFieldBlur={handleFieldBlur}
            errors={form.errors}
            touchedFields={form.touchedFields}
            fieldPrefix="current"
        />
    );
}
