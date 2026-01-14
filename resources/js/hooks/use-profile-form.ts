import axios from '@/lib/axios';
import type { TenantProfile } from '@/types';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type AutosaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export type SectionId = 'personal' | 'address' | 'identity' | 'employment' | 'documents';

export interface SectionStatus {
    id: SectionId;
    title: string;
    isComplete: boolean;
    isRequired: boolean;
    fieldCount: number;
    completedFields: number;
}

export interface DocumentMetadata {
    originalName: string;
    url?: string;
    size?: number;
    uploadedAt?: number;
}

export interface ProfileDocuments {
    id_document_front?: DocumentMetadata | null;
    id_document_back?: DocumentMetadata | null;
    residence_permit_document?: DocumentMetadata | null;
    right_to_rent_document?: DocumentMetadata | null;
    employment_contract?: DocumentMetadata | null;
    payslip_1?: DocumentMetadata | null;
    payslip_2?: DocumentMetadata | null;
    payslip_3?: DocumentMetadata | null;
    student_proof?: DocumentMetadata | null;
    other_income_proof?: DocumentMetadata | null;
    pension_statement?: DocumentMetadata | null;
}

export interface ProfileFormData {
    // Personal info
    date_of_birth: string;
    middle_name: string;
    nationality: string;
    phone_country_code: string;
    phone_number: string;
    bio: string;

    // ID Document
    id_document_type: string;
    id_number: string;
    id_issuing_country: string;
    id_expiry_date: string;

    // Immigration Status
    immigration_status: string;
    immigration_status_other: string;
    visa_type: string;
    visa_type_other: string;
    visa_expiry_date: string;
    work_permit_number: string;

    // Right to Rent
    right_to_rent_share_code: string;

    // Current Address
    current_house_number: string;
    current_address_line_2: string;
    current_street_name: string;
    current_city: string;
    current_state_province: string;
    current_postal_code: string;
    current_country: string;

    // Employment
    employment_status: string;
    income_currency: string;

    // Employed fields
    employer_name: string;
    job_title: string;
    employment_type: string;
    employment_start_date: string;
    gross_annual_income: string;
    net_monthly_income: string;
    monthly_income: string;
    pay_frequency: string;
    employment_contract_type: string;
    employment_end_date: string;
    probation_end_date: string;
    employer_address: string;
    employer_phone: string;

    // Self-employed fields
    business_name: string;
    business_type: string;
    business_registration_number: string;
    business_start_date: string;
    gross_annual_revenue: string;

    // Student fields
    university_name: string;
    program_of_study: string;
    expected_graduation_date: string;
    student_id_number: string;
    student_income_source: string;
    student_income_source_type: string;
    student_income_source_other: string;
    student_monthly_income: string;

    // Retired fields
    pension_type: string;
    pension_provider: string;
    pension_monthly_income: string;
    retirement_other_income: string;

    // Unemployed fields
    receiving_unemployment_benefits: boolean;
    unemployment_benefits_amount: string;
    unemployed_income_source: string;
    unemployed_income_source_other: string;

    // Other employment situation fields
    other_employment_situation: string;
    other_employment_situation_details: string;
    expected_return_to_work: string;
    other_situation_monthly_income: string;
    other_situation_income_source: string;

    // Additional income
    has_additional_income: boolean;
}

export interface UseProfileFormOptions {
    initialProfile: TenantProfile | null;
    profileDocuments: ProfileDocuments;
    validationRoute?: string;
    autosaveRoute?: string;
    autosaveDebounceMs?: number;
}

export interface UseProfileFormReturn {
    // Data
    data: ProfileFormData;
    setField: <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => void;
    setFields: (updates: Partial<ProfileFormData>) => void;

    // Validation (Precognition-based)
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    validateField: (field: string) => Promise<void>;
    markFieldTouched: (field: string) => void;
    clearFieldError: (field: string) => void;
    hasErrors: boolean;

    // Autosave
    autosaveStatus: AutosaveStatus;
    lastSavedAt: Date | null;
    saveNow: () => Promise<void>;
    hasUserInteracted: boolean;

    // Section management
    expandedSections: Set<SectionId>;
    toggleSection: (id: SectionId) => void;
    expandSection: (id: SectionId) => void;
    collapseSection: (id: SectionId) => void;

    // Completeness
    completeness: number;
    sectionStatuses: SectionStatus[];
    nextSuggestion: string | null;

    // Document uploads
    handleUploadSuccess: (documentType: string) => void;
    existingDocuments: ProfileDocuments;

    // Focus management
    focusFirstInvalidField: () => void;
}

const SECTION_TITLES: Record<SectionId, string> = {
    personal: 'Personal Information',
    address: 'Current Address',
    identity: 'Identity Documents',
    employment: 'Employment & Income',
    documents: 'Supporting Documents',
};

// Helper to safely get a string property from profile
function getStr(profile: TenantProfile | null, key: string): string {
    if (!profile) return '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (profile as any)[key];
    return typeof value === 'string' ? value : '';
}

// Helper to safely get a numeric property as string from profile
function getNum(profile: TenantProfile | null, key: string): string {
    if (!profile) return '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (profile as any)[key];
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') return value;
    return '';
}

// Helper to safely get a boolean property from profile
function getBool(profile: TenantProfile | null, key: string): boolean {
    if (!profile) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((profile as any)[key]);
}

/**
 * Convert TenantProfile to flat form data structure.
 */
function flattenProfileData(profile: TenantProfile | null): ProfileFormData {
    return {
        // Personal info
        date_of_birth: profile?.date_of_birth || '',
        middle_name: getStr(profile, 'middle_name'),
        nationality: profile?.nationality || '',
        phone_country_code: profile?.phone_country_code || '+31',
        phone_number: profile?.phone_number || '',
        bio: getStr(profile, 'bio'),

        // ID Document
        id_document_type: getStr(profile, 'id_document_type'),
        id_number: getStr(profile, 'id_number'),
        id_issuing_country: getStr(profile, 'id_issuing_country'),
        id_expiry_date: getStr(profile, 'id_expiry_date'),

        // Immigration Status
        immigration_status: getStr(profile, 'immigration_status'),
        immigration_status_other: getStr(profile, 'immigration_status_other'),
        visa_type: getStr(profile, 'visa_type'),
        visa_type_other: getStr(profile, 'visa_type_other'),
        visa_expiry_date: getStr(profile, 'visa_expiry_date'),
        work_permit_number: getStr(profile, 'work_permit_number'),

        // Right to Rent
        right_to_rent_share_code: getStr(profile, 'right_to_rent_share_code'),

        // Current Address
        current_house_number: profile?.current_house_number || '',
        current_address_line_2: profile?.current_address_line_2 || '',
        current_street_name: profile?.current_street_name || '',
        current_city: profile?.current_city || '',
        current_state_province: profile?.current_state_province || '',
        current_postal_code: profile?.current_postal_code || '',
        current_country: profile?.current_country || '',

        // Employment
        employment_status: profile?.employment_status || '',
        income_currency: profile?.income_currency || 'eur',

        // Employed fields
        employer_name: profile?.employer_name || '',
        job_title: profile?.job_title || '',
        employment_type: profile?.employment_type || '',
        employment_start_date: profile?.employment_start_date || '',
        gross_annual_income: getNum(profile, 'gross_annual_income'),
        net_monthly_income: getNum(profile, 'net_monthly_income'),
        monthly_income: profile?.monthly_income?.toString() || '',
        pay_frequency: getStr(profile, 'pay_frequency'),
        employment_contract_type: getStr(profile, 'employment_contract_type'),
        employment_end_date: getStr(profile, 'employment_end_date'),
        probation_end_date: getStr(profile, 'probation_end_date'),
        employer_address: getStr(profile, 'employer_address'),
        employer_phone: getStr(profile, 'employer_phone'),

        // Self-employed fields
        business_name: getStr(profile, 'business_name'),
        business_type: getStr(profile, 'business_type'),
        business_registration_number: getStr(profile, 'business_registration_number'),
        business_start_date: getStr(profile, 'business_start_date'),
        gross_annual_revenue: getNum(profile, 'gross_annual_revenue'),

        // Student fields
        university_name: profile?.university_name || '',
        program_of_study: profile?.program_of_study || '',
        expected_graduation_date: profile?.expected_graduation_date || '',
        student_id_number: getStr(profile, 'student_id_number'),
        student_income_source: profile?.student_income_source || '',
        student_income_source_type: getStr(profile, 'student_income_source_type'),
        student_income_source_other: getStr(profile, 'student_income_source_other'),
        student_monthly_income: getNum(profile, 'student_monthly_income'),

        // Retired fields
        pension_type: getStr(profile, 'pension_type'),
        pension_provider: getStr(profile, 'pension_provider'),
        pension_monthly_income: getNum(profile, 'pension_monthly_income'),
        retirement_other_income: getNum(profile, 'retirement_other_income'),

        // Unemployed fields
        receiving_unemployment_benefits: getBool(profile, 'receiving_unemployment_benefits'),
        unemployment_benefits_amount: getNum(profile, 'unemployment_benefits_amount'),
        unemployed_income_source: getStr(profile, 'unemployed_income_source'),
        unemployed_income_source_other: getStr(profile, 'unemployed_income_source_other'),

        // Other employment situation fields
        other_employment_situation: getStr(profile, 'other_employment_situation'),
        other_employment_situation_details: getStr(profile, 'other_employment_situation_details'),
        expected_return_to_work: getStr(profile, 'expected_return_to_work'),
        other_situation_monthly_income: getNum(profile, 'other_situation_monthly_income'),
        other_situation_income_source: getStr(profile, 'other_situation_income_source'),

        // Additional income
        has_additional_income: getBool(profile, 'has_additional_income'),
    };
}

/**
 * Check if a field has a non-empty value.
 */
function hasValue(data: ProfileFormData, field: string): boolean {
    const value = data[field as keyof ProfileFormData];
    if (typeof value === 'boolean') return true;
    if (typeof value === 'string') return value.trim() !== '';
    return value !== null && value !== undefined;
}

/**
 * Calculate profile completeness with section-level detail.
 */
function calculateCompleteness(
    data: ProfileFormData,
    documents: ProfileDocuments,
): { completeness: number; sectionStatuses: SectionStatus[]; nextSuggestion: string | null } {
    const sectionStatuses: SectionStatus[] = [];

    // Personal section
    const personalFields = ['date_of_birth', 'nationality', 'phone_number'];
    const personalCompleted = personalFields.filter((f) => hasValue(data, f)).length;
    sectionStatuses.push({
        id: 'personal',
        title: SECTION_TITLES.personal,
        isComplete: personalCompleted === personalFields.length,
        isRequired: true,
        fieldCount: personalFields.length,
        completedFields: personalCompleted,
    });

    // Address section
    const addressFields = ['current_street_name', 'current_house_number', 'current_city', 'current_postal_code', 'current_country'];
    const addressCompleted = addressFields.filter((f) => hasValue(data, f)).length;
    sectionStatuses.push({
        id: 'address',
        title: SECTION_TITLES.address,
        isComplete: addressCompleted === addressFields.length,
        isRequired: true,
        fieldCount: addressFields.length,
        completedFields: addressCompleted,
    });

    // Identity section
    const identityComplete = Boolean(documents.id_document_front && documents.id_document_back);
    sectionStatuses.push({
        id: 'identity',
        title: SECTION_TITLES.identity,
        isComplete: identityComplete,
        isRequired: true,
        fieldCount: 2,
        completedFields: (documents.id_document_front ? 1 : 0) + (documents.id_document_back ? 1 : 0),
    });

    // Employment section
    let employmentFields: string[] = ['employment_status'];
    const status = data.employment_status;

    if (status === 'employed' || status === 'self_employed') {
        employmentFields = [...employmentFields, 'employer_name', 'job_title', 'monthly_income'];
    } else if (status === 'student') {
        employmentFields = [...employmentFields, 'university_name', 'program_of_study'];
    }

    const employmentCompleted = employmentFields.filter((f) => hasValue(data, f)).length;
    sectionStatuses.push({
        id: 'employment',
        title: SECTION_TITLES.employment,
        isComplete: employmentCompleted === employmentFields.length,
        isRequired: true,
        fieldCount: employmentFields.length,
        completedFields: employmentCompleted,
    });

    // Documents section - based on employment status
    let requiredDocs: (keyof ProfileDocuments)[] = [];
    if (status === 'employed' || status === 'self_employed') {
        requiredDocs = ['employment_contract', 'payslip_1'];
    } else if (status === 'student') {
        requiredDocs = ['student_proof'];
    }

    const docsCompleted = requiredDocs.filter((d) => documents[d]).length;
    sectionStatuses.push({
        id: 'documents',
        title: SECTION_TITLES.documents,
        isComplete: requiredDocs.length === 0 || docsCompleted === requiredDocs.length,
        isRequired: requiredDocs.length > 0,
        fieldCount: requiredDocs.length,
        completedFields: docsCompleted,
    });

    // Calculate overall completeness
    const totalWeight = sectionStatuses.reduce((sum, s) => sum + (s.isRequired ? s.fieldCount : 0), 0);
    const earnedWeight = sectionStatuses.reduce((sum, s) => sum + (s.isRequired ? s.completedFields : 0), 0);
    const completeness = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

    // Find next suggestion
    const incompleteSection = sectionStatuses.find((s) => !s.isComplete && s.isRequired);
    const nextSuggestion = incompleteSection ? `Complete your ${incompleteSection.title.toLowerCase()} to improve your profile` : null;

    return { completeness, sectionStatuses, nextSuggestion };
}

/**
 * Profile form hook with autosave and Precognition validation.
 *
 * Adapts patterns from useWizardPrecognition for non-wizard context.
 */
export function useProfileForm({
    initialProfile,
    profileDocuments,
    validationRoute = '/tenant-profile/draft',
    autosaveRoute = '/tenant-profile/autosave',
    autosaveDebounceMs = 500,
}: UseProfileFormOptions): UseProfileFormReturn {
    // Form data state
    const [data, setData] = useState<ProfileFormData>(() => flattenProfileData(initialProfile));
    const [existingDocuments, setExistingDocuments] = useState<ProfileDocuments>(profileDocuments);

    // Validation state
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

    // Autosave state
    const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const pendingFieldsRef = useRef<Record<string, unknown>>({});
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isSavingRef = useRef(false);

    // Section expansion state - auto-expand first incomplete section
    const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(() => {
        const { sectionStatuses } = calculateCompleteness(flattenProfileData(initialProfile), profileDocuments);
        const firstIncomplete = sectionStatuses.find((s) => !s.isComplete && s.isRequired);
        return new Set([firstIncomplete?.id || 'personal']);
    });

    // Precognition validation for single field
    const validateField = useCallback(
        async (field: string) => {
            try {
                await axios.patch(validationRoute, data, {
                    headers: {
                        Precognition: 'true',
                        'Precognition-Validate-Only': field,
                    },
                });
                // 204 = valid, clear error
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next[field];
                    return next;
                });
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 422) {
                    const fieldErrors = error.response.data?.errors || {};
                    if (fieldErrors[field]) {
                        setErrors((prev) => ({
                            ...prev,
                            [field]: Array.isArray(fieldErrors[field]) ? fieldErrors[field][0] : fieldErrors[field],
                        }));
                    }
                }
                // Other errors (network, 500) - log but don't block
            }
        },
        [data, validationRoute],
    );

    // Autosave execution
    const doAutosave = useCallback(async () => {
        if (Object.keys(pendingFieldsRef.current).length === 0) return;
        if (isSavingRef.current) return;

        isSavingRef.current = true;
        setAutosaveStatus('saving');

        const fieldsToSave = { ...pendingFieldsRef.current };
        pendingFieldsRef.current = {};

        try {
            await axios.post(autosaveRoute, fieldsToSave);
            setAutosaveStatus('saved');
            setLastSavedAt(new Date());
        } catch {
            setAutosaveStatus('error');
            // Re-queue failed fields
            Object.assign(pendingFieldsRef.current, fieldsToSave);
        } finally {
            isSavingRef.current = false;

            // If more fields accumulated while saving, trigger another save
            if (Object.keys(pendingFieldsRef.current).length > 0) {
                doAutosave();
            }
        }
    }, [autosaveRoute]);

    // Schedule autosave with debounce
    const scheduleAutosave = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        setAutosaveStatus('pending');
        debounceTimerRef.current = setTimeout(doAutosave, autosaveDebounceMs);
    }, [doAutosave, autosaveDebounceMs]);

    // Field update with autosave trigger
    const setField = useCallback(
        <K extends keyof ProfileFormData>(field: K, value: ProfileFormData[K]) => {
            setHasUserInteracted(true);
            setData((prev) => ({ ...prev, [field]: value }));
            pendingFieldsRef.current[field] = value;
            scheduleAutosave();
            // Clear error on change
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field as string];
                return next;
            });
        },
        [scheduleAutosave],
    );

    // Update multiple fields
    const setFields = useCallback(
        (updates: Partial<ProfileFormData>) => {
            setHasUserInteracted(true);
            setData((prev) => ({ ...prev, ...updates }));
            Object.assign(pendingFieldsRef.current, updates);
            scheduleAutosave();
            setErrors((prev) => {
                const next = { ...prev };
                Object.keys(updates).forEach((key) => delete next[key]);
                return next;
            });
        },
        [scheduleAutosave],
    );

    // Mark field as touched
    const markFieldTouched = useCallback((field: string) => {
        setTouchedFields((prev) => ({ ...prev, [field]: true }));
    }, []);

    // Clear field error
    const clearFieldError = useCallback((field: string) => {
        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    // Section management
    const toggleSection = useCallback((id: SectionId) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const expandSection = useCallback((id: SectionId) => {
        setExpandedSections((prev) => new Set([...prev, id]));
    }, []);

    const collapseSection = useCallback((id: SectionId) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }, []);

    // Completeness calculation
    const { completeness, sectionStatuses, nextSuggestion } = useMemo(
        () => calculateCompleteness(data, existingDocuments),
        [data, existingDocuments],
    );

    // Document upload handler - partial reload without losing state
    const handleUploadSuccess = useCallback((documentType: string) => {
        // Update existing documents optimistically
        // The actual document data will be refreshed on next page load
        // For now, we just mark it as present
        setExistingDocuments((prev) => ({
            ...prev,
            [documentType]: { originalName: 'Uploaded' },
        }));
    }, []);

    // Manual save trigger
    const saveNow = useCallback(async () => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        await doAutosave();
    }, [doAutosave]);

    // Focus first invalid field
    const focusFirstInvalidField = useCallback(() => {
        setTimeout(() => {
            const invalidElement = document.querySelector('[aria-invalid="true"]') as HTMLElement | null;
            if (invalidElement) {
                invalidElement.focus();
                invalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 50);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Sync existingDocuments with profileDocuments prop changes
    useEffect(() => {
        setExistingDocuments(profileDocuments);
    }, [profileDocuments]);

    return {
        // Data
        data,
        setField,
        setFields,

        // Validation
        errors,
        touchedFields,
        validateField,
        markFieldTouched,
        clearFieldError,
        hasErrors: Object.keys(errors).length > 0,

        // Autosave
        autosaveStatus,
        lastSavedAt,
        saveNow,
        hasUserInteracted,

        // Section management
        expandedSections,
        toggleSection,
        expandSection,
        collapseSection,

        // Completeness
        completeness,
        sectionStatuses,
        nextSuggestion,

        // Documents
        handleUploadSuccess,
        existingDocuments,

        // Focus
        focusFirstInvalidField,
    };
}
