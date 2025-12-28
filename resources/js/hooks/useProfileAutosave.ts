import { useCallback, useRef } from 'react';

const AUTOSAVE_URL = '/tenant-profile/autosave';
const DEBOUNCE_MS = 500;

// Fields that belong to the tenant profile (not application-specific)
const PROFILE_FIELDS = new Set([
    'profile_date_of_birth',
    'profile_nationality',
    'profile_phone_country_code',
    'profile_phone_number',
    'profile_current_house_number',
    'profile_current_address_line_2',
    'profile_current_street_name',
    'profile_current_city',
    'profile_current_state_province',
    'profile_current_postal_code',
    'profile_current_country',
    'profile_employment_status',
    'profile_employer_name',
    'profile_job_title',
    'profile_employment_type',
    'profile_employment_start_date',
    'profile_monthly_income',
    'profile_income_currency',
    'profile_university_name',
    'profile_program_of_study',
    'profile_expected_graduation_date',
    'profile_student_income_source',
    'profile_has_guarantor',
    'profile_guarantor_name',
    'profile_guarantor_relationship',
    'profile_guarantor_phone',
    'profile_guarantor_email',
    'profile_guarantor_address',
    'profile_guarantor_employer',
    'profile_guarantor_monthly_income',
]);

export function isProfileField(fieldName: string): boolean {
    return PROFILE_FIELDS.has(fieldName);
}

interface UseProfileAutosaveReturn {
    autosaveField: (fieldName: string, value: unknown) => void;
    autosaveFields: (fields: Record<string, unknown>) => void;
    isProfileField: (fieldName: string) => boolean;
}

export function useProfileAutosave(): UseProfileAutosaveReturn {
    const pendingFields = useRef<Record<string, unknown>>({});
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSaving = useRef(false);

    const doSave = useCallback(async () => {
        if (Object.keys(pendingFields.current).length === 0) return;
        if (isSaving.current) return;

        isSaving.current = true;
        const fieldsToSave = { ...pendingFields.current };
        pendingFields.current = {};

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            await fetch(AUTOSAVE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify(fieldsToSave),
            });
        } catch (error) {
            // Silently fail - autosave is best-effort
            console.error('Profile autosave failed:', error);
        } finally {
            isSaving.current = false;

            // If more fields accumulated while saving, trigger another save
            if (Object.keys(pendingFields.current).length > 0) {
                doSave();
            }
        }
    }, []);

    const scheduleSave = useCallback(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(doSave, DEBOUNCE_MS);
    }, [doSave]);

    const autosaveField = useCallback(
        (fieldName: string, value: unknown) => {
            if (!isProfileField(fieldName)) return;

            pendingFields.current[fieldName] = value;
            scheduleSave();
        },
        [scheduleSave],
    );

    const autosaveFields = useCallback(
        (fields: Record<string, unknown>) => {
            let hasProfileFields = false;
            for (const [key, value] of Object.entries(fields)) {
                if (isProfileField(key)) {
                    pendingFields.current[key] = value;
                    hasProfileFields = true;
                }
            }
            if (hasProfileFields) {
                scheduleSave();
            }
        },
        [scheduleSave],
    );

    return {
        autosaveField,
        autosaveFields,
        isProfileField,
    };
}
