import { useCallback, useRef } from 'react';

const AUTOSAVE_URL = '/tenant-profile/autosave';
const DEBOUNCE_MS = 500;

// Fields that belong to the tenant profile (not application-specific)
const PROFILE_FIELDS = new Set([
    // Personal details
    'profile_date_of_birth',
    'profile_middle_name',
    'profile_nationality',
    'profile_phone_country_code',
    'profile_phone_number',
    'profile_bio',
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
    'profile_work_permit_number',
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

    // ===== Employment & Income (Expanded) =====
    'profile_employment_status',
    'profile_income_currency',

    // Employed fields
    'profile_employer_name',
    'profile_job_title',
    'profile_employment_type',
    'profile_employment_start_date',
    'profile_gross_annual_income',
    'profile_net_monthly_income',
    'profile_monthly_income', // Legacy field
    'profile_pay_frequency',
    'profile_employment_contract_type',
    'profile_employment_end_date',
    'profile_probation_end_date',
    'profile_employer_address',
    'profile_employer_phone',

    // Self-employed fields
    'profile_business_name',
    'profile_business_type',
    'profile_business_registration_number',
    'profile_business_start_date',
    'profile_gross_annual_revenue',

    // Student fields
    'profile_university_name',
    'profile_program_of_study',
    'profile_expected_graduation_date',
    'profile_student_id_number',
    'profile_student_income_source',
    'profile_student_income_source_type',
    'profile_student_income_source_other',
    'profile_student_monthly_income',

    // Retired fields
    'profile_pension_type',
    'profile_pension_provider',
    'profile_pension_monthly_income',
    'profile_retirement_other_income',

    // Unemployed fields
    'profile_receiving_unemployment_benefits',
    'profile_unemployment_benefits_amount',
    'profile_unemployed_income_source',
    'profile_unemployed_income_source_other',

    // Other employment situation fields
    'profile_other_employment_situation',
    'profile_other_employment_situation_details',
    'profile_expected_return_to_work',
    'profile_other_situation_monthly_income',
    'profile_other_situation_income_source',

    // Additional income
    'profile_has_additional_income',
    'profile_additional_income_sources',

    // Rental History (Credit & Background)
    'profile_authorize_credit_check',
    'profile_authorize_background_check',
    'profile_credit_check_provider_preference',
    'profile_has_ccjs_or_bankruptcies',
    'profile_ccj_bankruptcy_details',
    'profile_has_eviction_history',
    'profile_eviction_details',

    // Rental History (Current Situation)
    'profile_current_living_situation',
    'profile_current_address_move_in_date',
    'profile_current_monthly_rent',
    'profile_current_rent_currency',
    'profile_current_landlord_name',
    'profile_current_landlord_contact',
    'profile_reason_for_moving',
    'profile_reason_for_moving_other',

    // Previous Addresses & References
    'profile_previous_addresses',
    'profile_landlord_references',
    'profile_other_references',
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

            const response = await fetch(AUTOSAVE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify(fieldsToSave),
            });

            await response.json();
        } catch {
            // Silently fail - autosave is best-effort
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
                return;
            }

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
