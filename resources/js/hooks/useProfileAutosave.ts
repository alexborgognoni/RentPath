import { useCallback, useRef } from 'react';

const AUTOSAVE_URL = '/tenant-profile/autosave';
const DEBOUNCE_MS = 500;

// Fields that belong to the tenant profile (not application-specific)
const PROFILE_FIELDS = new Set([
    // Personal details
    'profile_date_of_birth',
    'profile_nationality',
    'profile_phone_country_code',
    'profile_phone_number',
    // ID Document
    'profile_id_document_type',
    'profile_id_number',
    'profile_id_issuing_country',
    'profile_id_expiry_date',
    // Immigration Status
    'profile_immigration_status',
    'profile_immigration_status_other',
    'profile_visa_type',
    'profile_visa_type_other',
    'profile_visa_expiry_date',
    // Right to Rent
    'profile_right_to_rent_share_code',
    // Current Address
    'profile_current_house_number',
    'profile_current_address_line_2',
    'profile_current_street_name',
    'profile_current_city',
    'profile_current_state_province',
    'profile_current_postal_code',
    'profile_current_country',
    // Employment
    'profile_employment_status',
    'profile_employer_name',
    'profile_job_title',
    'profile_employment_type',
    'profile_employment_start_date',
    'profile_monthly_income',
    'profile_income_currency',
    // Student
    'profile_university_name',
    'profile_program_of_study',
    'profile_expected_graduation_date',
    'profile_student_id_number',
    'profile_student_income_source',
    // Guarantor
    'profile_has_guarantor',
    'profile_guarantor_name',
    'profile_guarantor_relationship',
    'profile_guarantor_phone',
    'profile_guarantor_email',
    'profile_guarantor_address',
    'profile_guarantor_employer',
    'profile_guarantor_monthly_income',
    'profile_guarantor_income_currency',
    // Emergency Contact
    'profile_emergency_contact_name',
    'profile_emergency_contact_phone',
    'profile_emergency_contact_relationship',
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

            console.log('[Autosave] Sending fields:', fieldsToSave);

            const response = await fetch(AUTOSAVE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify(fieldsToSave),
            });

            const result = await response.json();
            console.log('[Autosave] Response:', result);
        } catch (error) {
            // Silently fail - autosave is best-effort
            console.error('[Autosave] Failed:', error);
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
            if (!isProfileField(fieldName)) {
                console.log('[Autosave] Field not in profile fields:', fieldName);
                return;
            }

            console.log('[Autosave] Queuing field:', fieldName, '=', value);
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
