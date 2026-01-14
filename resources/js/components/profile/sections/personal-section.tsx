import { PersonalDetailsSection, type PersonalDetailsData } from '@/components/application-wizard/shared/personal-details-section';
import type { ProfileFormData, UseProfileFormReturn } from '@/hooks/use-profile-form';
import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

interface PersonalSectionProps {
    form: UseProfileFormReturn;
    user: {
        first_name?: string;
        last_name?: string;
        email: string;
    };
}

/**
 * Wrapper around PersonalDetailsSection for the profile page.
 * Maps ProfileFormData to the shared section's data format.
 */
export function PersonalSection({ form, user }: PersonalSectionProps) {
    const { translations } = usePage<SharedData>().props;

    // Map profile form data to PersonalDetailsData
    const personalData: PersonalDetailsData = useMemo(
        () => ({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email,
            date_of_birth: form.data.date_of_birth,
            nationality: form.data.nationality,
            phone_number: form.data.phone_number,
            phone_country_code: form.data.phone_country_code,
            bio: form.data.bio,
        }),
        [user, form.data],
    );

    // Handle field changes - map back to profile form data
    const handleChange = useCallback(
        (field: keyof PersonalDetailsData, value: string) => {
            // Map personal fields to profile fields (they have same names)
            const profileField = field as keyof ProfileFormData;
            form.setField(profileField, value as ProfileFormData[typeof profileField]);
        },
        [form],
    );

    // Handle field blur for validation
    const handleFieldBlur = useCallback(
        (field: keyof PersonalDetailsData) => {
            form.markFieldTouched(field);
            form.validateField(field);
        },
        [form],
    );

    return (
        <PersonalDetailsSection
            data={personalData}
            onChange={handleChange}
            onFieldBlur={handleFieldBlur}
            errors={form.errors}
            touchedFields={form.touchedFields}
            translations={translations}
            disabledFields={{
                first_name: true,
                last_name: true,
                email: true,
            }}
        />
    );
}
