import { Button } from '@/components/ui/button';
import { CountrySelect } from '@/components/ui/country-select';
import { CurrencySelect } from '@/components/ui/currency-select';
import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { NationalitySelect } from '@/components/ui/nationality-select';
import { PhoneInput } from '@/components/ui/phone-input';
import { SaveStatus } from '@/components/ui/save-status';
import { Select } from '@/components/ui/select';
import { StateProvinceSelect } from '@/components/ui/state-province-select';
import type { AutosaveStatus } from '@/hooks/usePropertyWizard';
import { TenantLayout } from '@/layouts/tenant-layout';
import type { SharedData, TenantProfile } from '@/types';
import {
    getPostalCodeLabel,
    getPostalCodePlaceholder,
    getStateProvinceLabel,
    hasStateProvinceOptions,
    requiresStateProvince,
} from '@/utils/address-validation';
import { translate } from '@/utils/translate-utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, CheckCircle, ChevronDown, Circle, FileText, GraduationCap, Home, Phone, Shield, User, UserCheck } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

interface DocumentMetadata {
    originalName: string;
    url?: string;
    size?: number;
    uploadedAt?: number;
}

interface ProfileDocuments {
    id_document_front?: DocumentMetadata | null;
    id_document_back?: DocumentMetadata | null;
    employment_contract?: DocumentMetadata | null;
    payslip_1?: DocumentMetadata | null;
    payslip_2?: DocumentMetadata | null;
    payslip_3?: DocumentMetadata | null;
    student_proof?: DocumentMetadata | null;
    other_income_proof?: DocumentMetadata | null;
    guarantor_id?: DocumentMetadata | null;
    guarantor_proof_income?: DocumentMetadata | null;
}

interface ProfilePageProps {
    profile: TenantProfile | null;
    hasProfile: boolean;
    completeness: number;
    documents: {
        id_document: boolean;
        proof_of_income: boolean;
        reference_letter: boolean;
    };
    profileDocuments?: ProfileDocuments;
}

type SectionId = 'personal' | 'address' | 'identity' | 'employment' | 'documents' | 'guarantor' | 'emergency';

interface SectionConfig {
    id: SectionId;
    title: string;
    icon: React.ElementType;
    isComplete: (profile: TenantProfile | null) => boolean;
    isVisible: (profile: TenantProfile | null) => boolean;
}

const EMPLOYMENT_STATUS_ICONS = {
    employed: Briefcase,
    self_employed: Briefcase,
    student: GraduationCap,
    unemployed: UserCheck,
    retired: UserCheck,
} as const;

export default function ProfilePage({ profile, hasProfile, completeness, profileDocuments }: ProfilePageProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `tenant.profile.${key}`);
    const tEdit = (key: string) => translate(translations, `tenant.profile.edit.${key}`);

    // State management
    const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(new Set(['personal']));
    const [editingSections, setEditingSections] = useState<Set<SectionId>>(new Set());
    const [saveStatus, setSaveStatus] = useState<AutosaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

    // Form data - local state for editing
    const [formData, setFormData] = useState(() => ({
        // Personal info
        date_of_birth: profile?.date_of_birth || '',
        nationality: profile?.nationality || '',
        phone_country_code: profile?.phone_country_code || '+31',
        phone_number: profile?.phone_number || '',
        // Address
        current_house_number: profile?.current_house_number || '',
        current_street_name: profile?.current_street_name || '',
        current_address_line_2: profile?.current_address_line_2 || '',
        current_city: profile?.current_city || '',
        current_state_province: profile?.current_state_province || '',
        current_postal_code: profile?.current_postal_code || '',
        current_country: profile?.current_country || '',
        // Employment
        employment_status: profile?.employment_status || '',
        employer_name: profile?.employer_name || '',
        job_title: profile?.job_title || '',
        employment_type: profile?.employment_type || '',
        employment_start_date: profile?.employment_start_date || '',
        monthly_income: profile?.monthly_income?.toString() || '',
        income_currency: profile?.income_currency || 'eur',
        // Student
        university_name: profile?.university_name || '',
        program_of_study: profile?.program_of_study || '',
        expected_graduation_date: profile?.expected_graduation_date || '',
        student_income_source: profile?.student_income_source || '',
        // Guarantor
        has_guarantor: profile?.has_guarantor || false,
        guarantor_first_name: profile?.guarantor_first_name || '',
        guarantor_last_name: profile?.guarantor_last_name || '',
        guarantor_relationship: profile?.guarantor_relationship || '',
        guarantor_relationship_other: profile?.guarantor_relationship_other || '',
        guarantor_phone_country_code: profile?.guarantor_phone_country_code || '',
        guarantor_phone_number: profile?.guarantor_phone_number || '',
        guarantor_email: profile?.guarantor_email || '',
        guarantor_street_name: profile?.guarantor_street_name || '',
        guarantor_house_number: profile?.guarantor_house_number || '',
        guarantor_address_line_2: profile?.guarantor_address_line_2 || '',
        guarantor_city: profile?.guarantor_city || '',
        guarantor_postal_code: profile?.guarantor_postal_code || '',
        guarantor_country: profile?.guarantor_country || '',
        guarantor_employment_status: profile?.guarantor_employment_status || '',
        guarantor_employer_name: profile?.guarantor_employer_name || '',
        guarantor_job_title: profile?.guarantor_job_title || '',
        guarantor_employment_type: profile?.guarantor_employment_type || '',
        guarantor_employment_start_date: profile?.guarantor_employment_start_date || '',
        guarantor_university_name: profile?.guarantor_university_name || '',
        guarantor_program_of_study: profile?.guarantor_program_of_study || '',
        guarantor_expected_graduation_date: profile?.guarantor_expected_graduation_date || '',
        guarantor_student_income_source: profile?.guarantor_student_income_source || '',
        guarantor_monthly_income: profile?.guarantor_monthly_income?.toString() || '',
        guarantor_income_currency: profile?.guarantor_income_currency || 'eur',
        // Emergency contact
        emergency_contact_name: profile?.emergency_contact_name || '',
        emergency_contact_phone: profile?.emergency_contact_phone || '',
        emergency_contact_relationship: profile?.emergency_contact_relationship || '',
    }));

    // Autosave debounce
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingFieldsRef = useRef<Record<string, unknown>>({});

    // Section configurations
    const sections: SectionConfig[] = useMemo(
        () => [
            {
                id: 'personal',
                title: t('personal_info') || 'Personal Information',
                icon: User,
                isComplete: (p) => !!(p?.date_of_birth && p?.nationality && p?.phone_number),
                isVisible: () => true,
            },
            {
                id: 'address',
                title: t('current_address') || 'Current Address',
                icon: Home,
                isComplete: (p) => !!(p?.current_street_name && p?.current_city && p?.current_postal_code && p?.current_country),
                isVisible: () => true,
            },
            {
                id: 'identity',
                title: tEdit('identity_documents') || 'Identity Documents',
                icon: Shield,
                isComplete: (p) => !!(p?.id_document_front_path && p?.id_document_back_path),
                isVisible: () => true,
            },
            {
                id: 'employment',
                title: t('employment') || 'Employment & Income',
                icon: Briefcase,
                isComplete: (p) => !!p?.employment_status,
                isVisible: () => true,
            },
            {
                id: 'documents',
                title: tEdit('employment_documents') || 'Employment Documents',
                icon: FileText,
                isComplete: (p) => {
                    if (p?.employment_status === 'employed' || p?.employment_status === 'self_employed') {
                        return !!(p?.employment_contract_path && p?.payslip_1_path);
                    }
                    if (p?.employment_status === 'student') {
                        return !!p?.student_proof_path;
                    }
                    return true;
                },
                isVisible: (p) => !!p?.employment_status,
            },
            {
                id: 'guarantor',
                title: tEdit('guarantor_info') || 'Guarantor Information',
                icon: UserCheck,
                isComplete: (p) => {
                    if (!p?.has_guarantor) return true;
                    return !!(p?.guarantor_first_name && p?.guarantor_last_name && p?.guarantor_relationship);
                },
                isVisible: () => true,
            },
            {
                id: 'emergency',
                title: tEdit('emergency_contact') || 'Emergency Contact',
                icon: Phone,
                isComplete: (p) => !!(p?.emergency_contact_name && p?.emergency_contact_phone),
                isVisible: () => true,
            },
        ],
        [translations],
    );

    // Employment options
    const EMPLOYMENT_STATUSES = useMemo(
        () => [
            { value: 'employed', label: t('employment_types.employed') || 'Employed', icon: EMPLOYMENT_STATUS_ICONS.employed },
            {
                value: 'self_employed',
                label: t('employment_types.self_employed') || 'Self Employed',
                icon: EMPLOYMENT_STATUS_ICONS.self_employed,
            },
            { value: 'student', label: t('employment_types.student') || 'Student', icon: EMPLOYMENT_STATUS_ICONS.student },
            {
                value: 'unemployed',
                label: t('employment_types.unemployed') || 'Unemployed',
                icon: EMPLOYMENT_STATUS_ICONS.unemployed,
            },
            { value: 'retired', label: t('employment_types.retired') || 'Retired', icon: EMPLOYMENT_STATUS_ICONS.retired },
        ],
        [translations],
    );

    const EMPLOYMENT_TYPES = useMemo(
        () => [
            { value: 'full_time', label: tEdit('employment_types.full_time') || 'Full Time' },
            { value: 'part_time', label: tEdit('employment_types.part_time') || 'Part Time' },
            { value: 'contract', label: tEdit('employment_types.contract') || 'Contract' },
            { value: 'temporary', label: tEdit('employment_types.temporary') || 'Temporary' },
        ],
        [translations],
    );

    const GUARANTOR_RELATIONSHIPS = useMemo(
        () => [
            { value: 'Parent', label: tEdit('guarantor.relationships.parent') || 'Parent' },
            { value: 'Grandparent', label: tEdit('guarantor.relationships.grandparent') || 'Grandparent' },
            { value: 'Sibling', label: tEdit('guarantor.relationships.sibling') || 'Sibling' },
            { value: 'Spouse', label: tEdit('guarantor.relationships.spouse') || 'Spouse' },
            { value: 'Partner', label: tEdit('guarantor.relationships.partner') || 'Partner' },
            { value: 'Other Family', label: tEdit('guarantor.relationships.other_family') || 'Other Family' },
            { value: 'Friend', label: tEdit('guarantor.relationships.friend') || 'Friend' },
            { value: 'Employer', label: tEdit('guarantor.relationships.employer') || 'Employer' },
            { value: 'Other', label: tEdit('guarantor.relationships.other') || 'Other' },
        ],
        [translations],
    );

    // Address field helpers
    const currentCountry = formData.current_country;
    const postalCodeLabel = useMemo(() => getPostalCodeLabel(currentCountry), [currentCountry]);
    const postalCodePlaceholder = useMemo(() => getPostalCodePlaceholder(currentCountry), [currentCountry]);
    const stateProvinceLabel = useMemo(() => getStateProvinceLabel(currentCountry), [currentCountry]);
    const showStateProvince = useMemo(() => hasStateProvinceOptions(currentCountry), [currentCountry]);
    const stateProvinceRequired = useMemo(() => requiresStateProvince(currentCountry), [currentCountry]);

    // Derived state
    const isEmployed = formData.employment_status === 'employed' || formData.employment_status === 'self_employed';
    const isStudent = formData.employment_status === 'student';
    const isUnemployedOrRetired = formData.employment_status === 'unemployed' || formData.employment_status === 'retired';

    // Toggle section expansion
    const toggleSection = (sectionId: SectionId) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
            }
            return next;
        });
    };

    // Toggle section editing
    const toggleEditing = (sectionId: SectionId) => {
        setEditingSections((prev) => {
            const next = new Set(prev);
            if (next.has(sectionId)) {
                next.delete(sectionId);
            } else {
                next.add(sectionId);
                // Also expand the section when editing
                setExpandedSections((exp) => new Set([...exp, sectionId]));
            }
            return next;
        });
    };

    // Autosave function
    const doAutosave = useCallback(async () => {
        if (Object.keys(pendingFieldsRef.current).length === 0) return;

        setSaveStatus('saving');
        const fieldsToSave = { ...pendingFieldsRef.current };
        pendingFieldsRef.current = {};

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            const response = await fetch('/tenant-profile/autosave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify(fieldsToSave),
            });

            if (response.ok) {
                setSaveStatus('saved');
                setLastSavedAt(new Date());
            } else {
                setSaveStatus('error');
            }
        } catch {
            setSaveStatus('error');
        }
    }, []);

    // Schedule autosave
    const scheduleAutosave = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        setSaveStatus('pending');
        saveTimeoutRef.current = setTimeout(doAutosave, 500);
    }, [doAutosave]);

    // Update field and trigger autosave
    const updateField = useCallback(
        <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            pendingFieldsRef.current[field] = value;
            scheduleAutosave();
        },
        [scheduleAutosave],
    );

    // Handle document upload success
    const handleUploadSuccess = useCallback(() => {
        router.reload({ only: ['profile', 'profileDocuments', 'completeness', 'documents'] });
    }, []);

    // Common input class
    const getInputClass = (hasError?: boolean) =>
        `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;

    // File upload config
    const fileUploadAccept = {
        'image/*': ['.png', '.jpg', '.jpeg'],
        'application/pdf': ['.pdf'],
    };

    const fileUploadDescription = {
        fileTypes: 'PDF, PNG, JPG',
        maxFileSize: '20MB',
    };

    // Empty state
    if (!hasProfile) {
        return (
            <TenantLayout>
                <Head title={t('title') || 'My Profile'} />
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
                    <User className="mb-4 h-16 w-16 text-muted-foreground opacity-50" />
                    <h2 className="mb-2 text-xl font-semibold text-foreground">{t('empty.title') || 'No Profile Yet'}</h2>
                    <p className="mb-6 max-w-md text-muted-foreground">
                        {t('empty.description') ||
                            'Your tenant profile will be created when you submit your first application. The information you provide will be reused for future applications.'}
                    </p>
                    <Link
                        href="/properties"
                        className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                    >
                        {t('empty.cta') || 'Browse Properties'}
                    </Link>
                </div>
            </TenantLayout>
        );
    }

    // Section component
    const Section = ({ section, children }: { section: SectionConfig; children: (isEditing: boolean) => React.ReactNode }) => {
        const isExpanded = expandedSections.has(section.id);
        const isEditing = editingSections.has(section.id);
        const isComplete = section.isComplete(profile);
        const Icon = section.icon;

        if (!section.isVisible(profile)) return null;

        return (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                {/* Section Header */}
                <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/50"
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${isComplete ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}
                        >
                            <Icon className={`h-5 w-5 ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">{section.title}</h3>
                            <div className="flex items-center gap-1.5 text-sm">
                                {isComplete ? (
                                    <>
                                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                        <span className="text-green-600">{tEdit('complete') || 'Complete'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">{tEdit('incomplete') || 'Incomplete'}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isExpanded && !isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleEditing(section.id);
                                }}
                            >
                                {t('edit_button') || 'Edit'}
                            </Button>
                        )}
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="border-t border-border px-6 py-5">{children(isEditing)}</div>
                            {isEditing && (
                                <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3">
                                    <SaveStatus status={saveStatus} lastSavedAt={lastSavedAt} onSave={doAutosave} />
                                    <Button variant="outline" size="sm" onClick={() => toggleEditing(section.id)}>
                                        {tEdit('done') || 'Done'}
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    // Display field component for view mode
    const DisplayField = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="font-medium text-foreground">{value || t('not_provided') || 'Not provided'}</dd>
        </div>
    );

    return (
        <TenantLayout>
            <Head title={t('title') || 'My Profile'} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{t('title') || 'My Profile'}</h1>
                            <p className="text-muted-foreground">{t('subtitle') || 'Your tenant information for rental applications'}</p>
                        </div>
                    </div>
                </div>

                {/* Completeness Bar */}
                <div className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{t('completeness') || 'Profile Completeness'}</span>
                        <span className="text-sm font-semibold text-primary">{completeness}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                            style={{ width: `${completeness}%` }}
                        />
                    </div>
                    {completeness < 100 && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            {tEdit('completeness_hint') || 'Complete your profile to improve your application success rate.'}
                        </p>
                    )}
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {/* Personal Information Section */}
                    <Section section={sections[0]}>
                        {(isEditing) =>
                            isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                {tEdit('fields.date_of_birth') || 'Date of Birth'}
                                            </label>
                                            <DatePicker
                                                value={formData.date_of_birth}
                                                onChange={(value) => updateField('date_of_birth', value)}
                                                restriction="past"
                                                max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">{tEdit('fields.nationality') || 'Nationality'}</label>
                                            <NationalitySelect value={formData.nationality} onChange={(value) => updateField('nationality', value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">{tEdit('fields.phone') || 'Phone Number'}</label>
                                        <PhoneInput
                                            value={formData.phone_number}
                                            countryCode={formData.phone_country_code}
                                            onChange={(phone, code) => {
                                                updateField('phone_number', phone);
                                                updateField('phone_country_code', code);
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <dl className="grid gap-4 md:grid-cols-3">
                                    <DisplayField
                                        label={t('date_of_birth') || 'Date of Birth'}
                                        value={profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : null}
                                    />
                                    <DisplayField label={t('nationality') || 'Nationality'} value={profile?.nationality} />
                                    <DisplayField
                                        label={t('phone') || 'Phone'}
                                        value={profile?.phone_number ? `${profile.phone_country_code} ${profile.phone_number}` : null}
                                    />
                                </dl>
                            )
                        }
                    </Section>

                    {/* Current Address Section */}
                    <Section section={sections[1]}>
                        {(isEditing) =>
                            isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium">{tEdit('fields.street_name') || 'Street Name'}</label>
                                            <input
                                                type="text"
                                                value={formData.current_street_name}
                                                onChange={(e) => updateField('current_street_name', e.target.value)}
                                                className={getInputClass()}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">{tEdit('fields.house_number') || 'House Number'}</label>
                                            <input
                                                type="text"
                                                value={formData.current_house_number}
                                                onChange={(e) => updateField('current_house_number', e.target.value)}
                                                className={getInputClass()}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            {tEdit('fields.address_line_2') || 'Address Line 2'}{' '}
                                            <span className="text-muted-foreground">({tEdit('optional') || 'Optional'})</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.current_address_line_2}
                                            onChange={(e) => updateField('current_address_line_2', e.target.value)}
                                            className={getInputClass()}
                                        />
                                    </div>
                                    <div className={`grid gap-4 ${showStateProvince ? 'md:grid-cols-2' : ''}`}>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">{tEdit('fields.city') || 'City'}</label>
                                            <input
                                                type="text"
                                                value={formData.current_city}
                                                onChange={(e) => updateField('current_city', e.target.value)}
                                                className={getInputClass()}
                                            />
                                        </div>
                                        {showStateProvince && (
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    {stateProvinceLabel}
                                                    {!stateProvinceRequired && (
                                                        <span className="text-muted-foreground"> ({tEdit('optional') || 'Optional'})</span>
                                                    )}
                                                </label>
                                                <StateProvinceSelect
                                                    value={formData.current_state_province}
                                                    onChange={(value) => updateField('current_state_province', value)}
                                                    countryCode={currentCountry}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">{postalCodeLabel}</label>
                                            <input
                                                type="text"
                                                value={formData.current_postal_code}
                                                onChange={(e) => updateField('current_postal_code', e.target.value)}
                                                placeholder={postalCodePlaceholder}
                                                className={getInputClass()}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">{tEdit('fields.country') || 'Country'}</label>
                                            <CountrySelect
                                                value={formData.current_country}
                                                onChange={(value) => updateField('current_country', value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {profile?.current_street_name ? (
                                        <p className="text-foreground">
                                            {profile.current_house_number} {profile.current_street_name}
                                            {profile.current_address_line_2 && (
                                                <>
                                                    <br />
                                                    {profile.current_address_line_2}
                                                </>
                                            )}
                                            <br />
                                            {profile.current_city}
                                            {profile.current_state_province && `, ${profile.current_state_province}`} {profile.current_postal_code}
                                            <br />
                                            {profile.current_country}
                                        </p>
                                    ) : (
                                        <p className="text-muted-foreground">{t('not_provided') || 'Not provided'}</p>
                                    )}
                                </div>
                            )
                        }
                    </Section>

                    {/* Identity Documents Section */}
                    <Section section={sections[2]}>
                        {() => (
                            <div className="grid gap-4 md:grid-cols-2">
                                <FileUpload
                                    label={tEdit('documents.id_front') || 'ID Document (Front)'}
                                    required
                                    documentType="id_document_front"
                                    uploadUrl="/tenant-profile/document/upload"
                                    accept={fileUploadAccept}
                                    maxSize={20 * 1024 * 1024}
                                    description={fileUploadDescription}
                                    existingFile={
                                        profileDocuments?.id_document_front
                                            ? {
                                                  originalName: profileDocuments.id_document_front.originalName,
                                                  previewUrl: profileDocuments.id_document_front.url,
                                                  size: profileDocuments.id_document_front.size,
                                                  uploadedAt: profileDocuments.id_document_front.uploadedAt,
                                              }
                                            : null
                                    }
                                    onUploadSuccess={handleUploadSuccess}
                                />
                                <FileUpload
                                    label={tEdit('documents.id_back') || 'ID Document (Back)'}
                                    required
                                    documentType="id_document_back"
                                    uploadUrl="/tenant-profile/document/upload"
                                    accept={fileUploadAccept}
                                    maxSize={20 * 1024 * 1024}
                                    description={fileUploadDescription}
                                    existingFile={
                                        profileDocuments?.id_document_back
                                            ? {
                                                  originalName: profileDocuments.id_document_back.originalName,
                                                  previewUrl: profileDocuments.id_document_back.url,
                                                  size: profileDocuments.id_document_back.size,
                                                  uploadedAt: profileDocuments.id_document_back.uploadedAt,
                                              }
                                            : null
                                    }
                                    onUploadSuccess={handleUploadSuccess}
                                />
                            </div>
                        )}
                    </Section>

                    {/* Employment & Income Section */}
                    <Section section={sections[3]}>
                        {(isEditing) =>
                            isEditing ? (
                                <div className="space-y-6">
                                    {/* Employment Status Selection */}
                                    <div>
                                        <label className="mb-3 block text-sm font-medium">
                                            {tEdit('fields.employment_status') || 'Employment Status'}
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                                            {EMPLOYMENT_STATUSES.map((status) => {
                                                const Icon = status.icon;
                                                const isSelected = formData.employment_status === status.value;
                                                return (
                                                    <button
                                                        key={status.value}
                                                        type="button"
                                                        onClick={() => updateField('employment_status', status.value)}
                                                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                                                            isSelected
                                                                ? 'border-primary bg-primary/5 text-primary'
                                                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                                                        }`}
                                                    >
                                                        <Icon className="h-5 w-5" />
                                                        <span className="text-xs font-medium">{status.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Employed / Self-Employed Fields */}
                                    {isEmployed && (
                                        <div className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('fields.employer_name') || 'Employer Name'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.employer_name}
                                                        onChange={(e) => updateField('employer_name', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('fields.job_title') || 'Job Title'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.job_title}
                                                        onChange={(e) => updateField('job_title', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('fields.employment_type') || 'Employment Type'}
                                                    </label>
                                                    <Select
                                                        value={formData.employment_type}
                                                        onChange={(value) => updateField('employment_type', value)}
                                                        options={EMPLOYMENT_TYPES}
                                                        placeholder="Select type..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('fields.start_date') || 'Start Date'}
                                                    </label>
                                                    <DatePicker
                                                        value={formData.employment_start_date}
                                                        onChange={(value) => updateField('employment_start_date', value)}
                                                        max={new Date()}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    {tEdit('fields.monthly_income') || 'Monthly Income (Gross)'}
                                                </label>
                                                <div className="flex">
                                                    <CurrencySelect
                                                        value={formData.income_currency}
                                                        onChange={(value) => updateField('income_currency', value as typeof formData.income_currency)}
                                                        compact
                                                    />
                                                    <input
                                                        type="number"
                                                        value={formData.monthly_income}
                                                        onChange={(e) => updateField('monthly_income', e.target.value)}
                                                        min="0"
                                                        step="100"
                                                        className={`w-full rounded-l-none rounded-r-lg ${getInputClass()}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Student Fields */}
                                    {isStudent && (
                                        <div className="space-y-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('fields.university') || 'University'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.university_name}
                                                        onChange={(e) => updateField('university_name', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('fields.program') || 'Program of Study'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.program_of_study}
                                                        onChange={(e) => updateField('program_of_study', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('fields.graduation_date') || 'Expected Graduation'}
                                                    </label>
                                                    <DatePicker
                                                        value={formData.expected_graduation_date}
                                                        onChange={(value) => updateField('expected_graduation_date', value)}
                                                        min={new Date()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('fields.income_source') || 'Income Source'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.student_income_source}
                                                        onChange={(e) => updateField('student_income_source', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    {tEdit('fields.monthly_income') || 'Monthly Income'}
                                                </label>
                                                <div className="flex">
                                                    <CurrencySelect
                                                        value={formData.income_currency}
                                                        onChange={(value) => updateField('income_currency', value as typeof formData.income_currency)}
                                                        compact
                                                    />
                                                    <input
                                                        type="number"
                                                        value={formData.monthly_income}
                                                        onChange={(e) => updateField('monthly_income', e.target.value)}
                                                        min="0"
                                                        step="100"
                                                        className={`w-full rounded-l-none rounded-r-lg ${getInputClass()}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Unemployed / Retired Fields */}
                                    {isUnemployedOrRetired && (
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                {tEdit('fields.monthly_income') || 'Monthly Income'}
                                            </label>
                                            <div className="flex">
                                                <CurrencySelect
                                                    value={formData.income_currency}
                                                    onChange={(value) => updateField('income_currency', value as typeof formData.income_currency)}
                                                    compact
                                                />
                                                <input
                                                    type="number"
                                                    value={formData.monthly_income}
                                                    onChange={(e) => updateField('monthly_income', e.target.value)}
                                                    min="0"
                                                    step="100"
                                                    className={`w-full rounded-l-none rounded-r-lg ${getInputClass()}`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <dl className="grid gap-4 md:grid-cols-3">
                                    <DisplayField
                                        label={t('employment_status') || 'Status'}
                                        value={
                                            profile?.employment_status
                                                ? t(`employment_types.${profile.employment_status}`) || profile.employment_status.replace('_', ' ')
                                                : null
                                        }
                                    />
                                    {(profile?.employment_status === 'employed' || profile?.employment_status === 'self_employed') && (
                                        <>
                                            <DisplayField label={t('employer') || 'Employer'} value={profile?.employer_name} />
                                            <DisplayField
                                                label={t('monthly_income') || 'Monthly Income'}
                                                value={
                                                    profile?.monthly_income
                                                        ? `${profile.income_currency?.toUpperCase()} ${profile.monthly_income.toLocaleString()}`
                                                        : null
                                                }
                                            />
                                        </>
                                    )}
                                    {profile?.employment_status === 'student' && (
                                        <>
                                            <DisplayField label={tEdit('fields.university') || 'University'} value={profile?.university_name} />
                                            <DisplayField label={tEdit('fields.program') || 'Program'} value={profile?.program_of_study} />
                                        </>
                                    )}
                                </dl>
                            )
                        }
                    </Section>

                    {/* Employment Documents Section */}
                    {sections[4].isVisible(profile) && (
                        <Section section={sections[4]}>
                            {() => (
                                <div className="space-y-4">
                                    {isEmployed && (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FileUpload
                                                label={tEdit('documents.employment_contract') || 'Employment Contract'}
                                                required
                                                documentType="employment_contract"
                                                uploadUrl="/tenant-profile/document/upload"
                                                accept={fileUploadAccept}
                                                maxSize={20 * 1024 * 1024}
                                                description={fileUploadDescription}
                                                existingFile={
                                                    profileDocuments?.employment_contract
                                                        ? {
                                                              originalName: profileDocuments.employment_contract.originalName,
                                                              previewUrl: profileDocuments.employment_contract.url,
                                                              size: profileDocuments.employment_contract.size,
                                                              uploadedAt: profileDocuments.employment_contract.uploadedAt,
                                                          }
                                                        : null
                                                }
                                                onUploadSuccess={handleUploadSuccess}
                                            />
                                            <FileUpload
                                                label={tEdit('documents.payslip_1') || 'Payslip 1'}
                                                required
                                                documentType="payslip_1"
                                                uploadUrl="/tenant-profile/document/upload"
                                                accept={fileUploadAccept}
                                                maxSize={20 * 1024 * 1024}
                                                description={fileUploadDescription}
                                                existingFile={
                                                    profileDocuments?.payslip_1
                                                        ? {
                                                              originalName: profileDocuments.payslip_1.originalName,
                                                              previewUrl: profileDocuments.payslip_1.url,
                                                              size: profileDocuments.payslip_1.size,
                                                              uploadedAt: profileDocuments.payslip_1.uploadedAt,
                                                          }
                                                        : null
                                                }
                                                onUploadSuccess={handleUploadSuccess}
                                            />
                                            <FileUpload
                                                label={tEdit('documents.payslip_2') || 'Payslip 2'}
                                                required
                                                documentType="payslip_2"
                                                uploadUrl="/tenant-profile/document/upload"
                                                accept={fileUploadAccept}
                                                maxSize={20 * 1024 * 1024}
                                                description={fileUploadDescription}
                                                existingFile={
                                                    profileDocuments?.payslip_2
                                                        ? {
                                                              originalName: profileDocuments.payslip_2.originalName,
                                                              previewUrl: profileDocuments.payslip_2.url,
                                                              size: profileDocuments.payslip_2.size,
                                                              uploadedAt: profileDocuments.payslip_2.uploadedAt,
                                                          }
                                                        : null
                                                }
                                                onUploadSuccess={handleUploadSuccess}
                                            />
                                            <FileUpload
                                                label={tEdit('documents.payslip_3') || 'Payslip 3'}
                                                required
                                                documentType="payslip_3"
                                                uploadUrl="/tenant-profile/document/upload"
                                                accept={fileUploadAccept}
                                                maxSize={20 * 1024 * 1024}
                                                description={fileUploadDescription}
                                                existingFile={
                                                    profileDocuments?.payslip_3
                                                        ? {
                                                              originalName: profileDocuments.payslip_3.originalName,
                                                              previewUrl: profileDocuments.payslip_3.url,
                                                              size: profileDocuments.payslip_3.size,
                                                              uploadedAt: profileDocuments.payslip_3.uploadedAt,
                                                          }
                                                        : null
                                                }
                                                onUploadSuccess={handleUploadSuccess}
                                            />
                                        </div>
                                    )}

                                    {isStudent && (
                                        <FileUpload
                                            label={tEdit('documents.student_proof') || 'Student Enrollment Proof'}
                                            required
                                            documentType="student_proof"
                                            uploadUrl="/tenant-profile/document/upload"
                                            accept={fileUploadAccept}
                                            maxSize={20 * 1024 * 1024}
                                            description={fileUploadDescription}
                                            existingFile={
                                                profileDocuments?.student_proof
                                                    ? {
                                                          originalName: profileDocuments.student_proof.originalName,
                                                          previewUrl: profileDocuments.student_proof.url,
                                                          size: profileDocuments.student_proof.size,
                                                          uploadedAt: profileDocuments.student_proof.uploadedAt,
                                                      }
                                                    : null
                                            }
                                            onUploadSuccess={handleUploadSuccess}
                                        />
                                    )}

                                    {isUnemployedOrRetired && (
                                        <FileUpload
                                            label={
                                                formData.employment_status === 'retired'
                                                    ? tEdit('documents.pension_proof') || 'Pension Statement'
                                                    : tEdit('documents.income_proof') || 'Proof of Income'
                                            }
                                            required
                                            documentType="other_income_proof"
                                            uploadUrl="/tenant-profile/document/upload"
                                            accept={fileUploadAccept}
                                            maxSize={20 * 1024 * 1024}
                                            description={fileUploadDescription}
                                            existingFile={
                                                profileDocuments?.other_income_proof
                                                    ? {
                                                          originalName: profileDocuments.other_income_proof.originalName,
                                                          previewUrl: profileDocuments.other_income_proof.url,
                                                          size: profileDocuments.other_income_proof.size,
                                                          uploadedAt: profileDocuments.other_income_proof.uploadedAt,
                                                      }
                                                    : null
                                            }
                                            onUploadSuccess={handleUploadSuccess}
                                        />
                                    )}
                                </div>
                            )}
                        </Section>
                    )}

                    {/* Guarantor Section */}
                    <Section section={sections[5]}>
                        {(isEditing) =>
                            isEditing ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="has_guarantor"
                                            checked={formData.has_guarantor}
                                            onChange={(e) => updateField('has_guarantor', e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        <label htmlFor="has_guarantor" className="text-sm font-medium">
                                            {tEdit('guarantor.has_guarantor') || 'I have a guarantor'}
                                        </label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {tEdit('guarantor.description') ||
                                            'A guarantor can strengthen your application by providing additional financial security.'}
                                    </p>

                                    {formData.has_guarantor && (
                                        <div className="space-y-4 pt-4">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('guarantor.first_name') || 'First Name'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.guarantor_first_name}
                                                        onChange={(e) => updateField('guarantor_first_name', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('guarantor.last_name') || 'Last Name'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.guarantor_last_name}
                                                        onChange={(e) => updateField('guarantor_last_name', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('guarantor.relationship') || 'Relationship'}
                                                    </label>
                                                    <Select
                                                        value={formData.guarantor_relationship}
                                                        onChange={(value) => updateField('guarantor_relationship', value)}
                                                        options={GUARANTOR_RELATIONSHIPS}
                                                        placeholder="Select relationship..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">{tEdit('guarantor.phone') || 'Phone'}</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.guarantor_phone_number}
                                                        onChange={(e) => updateField('guarantor_phone_number', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">{tEdit('guarantor.email') || 'Email'}</label>
                                                    <input
                                                        type="email"
                                                        value={formData.guarantor_email}
                                                        onChange={(e) => updateField('guarantor_email', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">{tEdit('guarantor.city') || 'City'}</label>
                                                    <input
                                                        type="text"
                                                        value={formData.guarantor_city}
                                                        onChange={(e) => updateField('guarantor_city', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('guarantor.employer') || 'Employer'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.guarantor_employer_name}
                                                        onChange={(e) => updateField('guarantor_employer_name', e.target.value)}
                                                        className={getInputClass()}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">
                                                        {tEdit('guarantor.monthly_income') || 'Monthly Income'}
                                                    </label>
                                                    <div className="flex">
                                                        <CurrencySelect
                                                            value={formData.guarantor_income_currency}
                                                            onChange={(value) =>
                                                                updateField(
                                                                    'guarantor_income_currency',
                                                                    value as typeof formData.guarantor_income_currency,
                                                                )
                                                            }
                                                            compact
                                                        />
                                                        <input
                                                            type="number"
                                                            value={formData.guarantor_monthly_income}
                                                            onChange={(e) => updateField('guarantor_monthly_income', e.target.value)}
                                                            min="0"
                                                            step="100"
                                                            className={`w-full rounded-l-none rounded-r-lg ${getInputClass()}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Guarantor Documents */}
                                            <div className="grid gap-4 pt-4 md:grid-cols-2">
                                                <FileUpload
                                                    label={tEdit('documents.guarantor_id') || 'Guarantor ID'}
                                                    required
                                                    documentType="guarantor_id"
                                                    uploadUrl="/tenant-profile/document/upload"
                                                    accept={fileUploadAccept}
                                                    maxSize={20 * 1024 * 1024}
                                                    description={fileUploadDescription}
                                                    existingFile={
                                                        profileDocuments?.guarantor_id
                                                            ? {
                                                                  originalName: profileDocuments.guarantor_id.originalName,
                                                                  previewUrl: profileDocuments.guarantor_id.url,
                                                                  size: profileDocuments.guarantor_id.size,
                                                                  uploadedAt: profileDocuments.guarantor_id.uploadedAt,
                                                              }
                                                            : null
                                                    }
                                                    onUploadSuccess={handleUploadSuccess}
                                                />
                                                <FileUpload
                                                    label={tEdit('documents.guarantor_income') || 'Guarantor Income Proof'}
                                                    required
                                                    documentType="guarantor_proof_income"
                                                    uploadUrl="/tenant-profile/document/upload"
                                                    accept={fileUploadAccept}
                                                    maxSize={20 * 1024 * 1024}
                                                    description={fileUploadDescription}
                                                    existingFile={
                                                        profileDocuments?.guarantor_proof_income
                                                            ? {
                                                                  originalName: profileDocuments.guarantor_proof_income.originalName,
                                                                  previewUrl: profileDocuments.guarantor_proof_income.url,
                                                                  size: profileDocuments.guarantor_proof_income.size,
                                                                  uploadedAt: profileDocuments.guarantor_proof_income.uploadedAt,
                                                              }
                                                            : null
                                                    }
                                                    onUploadSuccess={handleUploadSuccess}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {profile?.has_guarantor ? (
                                        <dl className="grid gap-4 md:grid-cols-3">
                                            <DisplayField
                                                label={tEdit('guarantor.name') || 'Name'}
                                                value={
                                                    profile?.guarantor_first_name || profile?.guarantor_last_name
                                                        ? `${profile.guarantor_first_name || ''} ${profile.guarantor_last_name || ''}`.trim()
                                                        : null
                                                }
                                            />
                                            <DisplayField
                                                label={tEdit('guarantor.relationship') || 'Relationship'}
                                                value={profile?.guarantor_relationship}
                                            />
                                            <DisplayField
                                                label={tEdit('guarantor.monthly_income') || 'Monthly Income'}
                                                value={
                                                    profile?.guarantor_monthly_income
                                                        ? `${(profile.guarantor_income_currency || 'EUR').toUpperCase()} ${profile.guarantor_monthly_income.toLocaleString()}`
                                                        : null
                                                }
                                            />
                                        </dl>
                                    ) : (
                                        <p className="text-muted-foreground">{tEdit('guarantor.none') || 'No guarantor added'}</p>
                                    )}
                                </div>
                            )
                        }
                    </Section>

                    {/* Emergency Contact Section */}
                    <Section section={sections[6]}>
                        {(isEditing) =>
                            isEditing ? (
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">{tEdit('emergency.name') || 'Contact Name'}</label>
                                        <input
                                            type="text"
                                            value={formData.emergency_contact_name}
                                            onChange={(e) => updateField('emergency_contact_name', e.target.value)}
                                            className={getInputClass()}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">{tEdit('emergency.phone') || 'Phone'}</label>
                                        <input
                                            type="tel"
                                            value={formData.emergency_contact_phone}
                                            onChange={(e) => updateField('emergency_contact_phone', e.target.value)}
                                            className={getInputClass()}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">{tEdit('emergency.relationship') || 'Relationship'}</label>
                                        <input
                                            type="text"
                                            value={formData.emergency_contact_relationship}
                                            onChange={(e) => updateField('emergency_contact_relationship', e.target.value)}
                                            className={getInputClass()}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {profile?.emergency_contact_name ? (
                                        <dl className="grid gap-4 md:grid-cols-3">
                                            <DisplayField label={tEdit('emergency.name') || 'Name'} value={profile?.emergency_contact_name} />
                                            <DisplayField label={tEdit('emergency.phone') || 'Phone'} value={profile?.emergency_contact_phone} />
                                            <DisplayField
                                                label={tEdit('emergency.relationship') || 'Relationship'}
                                                value={profile?.emergency_contact_relationship}
                                            />
                                        </dl>
                                    ) : (
                                        <p className="text-muted-foreground">{tEdit('emergency.none') || 'No emergency contact added'}</p>
                                    )}
                                </div>
                            )
                        }
                    </Section>
                </div>
            </div>
        </TenantLayout>
    );
}
