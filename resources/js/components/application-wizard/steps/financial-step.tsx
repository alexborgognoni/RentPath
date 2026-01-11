import { ProfileDataBanner } from '@/components/application-wizard/profile-data-banner';
import type { ApplicationWizardData } from '@/hooks/use-application-wizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import { FinancialInfoSection, type ExistingDocuments } from '../shared';

interface FinancialStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    clearTouchedFields: () => void;
    /** Per-field blur handler - called with prefixed field name (e.g., 'profile_employment_status') */
    onFieldBlur?: (field: string) => void;
    existingDocuments?: ExistingDocuments;
}

export function FinancialStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    clearTouchedFields,
    onFieldBlur,
    existingDocuments,
}: FinancialStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.financialStep.${key}`);

    // Reload tenant profile data after successful upload
    const handleUploadSuccess = useCallback(() => {
        router.reload({ only: ['tenantProfile'] });
    }, []);

    // Per-field blur handler for FinancialInfoSection
    // The section passes prefixed field names (e.g., 'profile_employer_name')
    const handleFieldBlur = useCallback(
        (field: string) => {
            markFieldTouched(field);
            onFieldBlur?.(field);
        },
        [markFieldTouched, onFieldBlur],
    );

    // Handlers for FinancialInfoSection
    const getValue = useCallback(
        (field: string) => {
            return String(data[field as keyof ApplicationWizardData] ?? '');
        },
        [data],
    );

    const setValue = useCallback(
        (field: string, value: string) => {
            updateField(field as keyof ApplicationWizardData, value as ApplicationWizardData[keyof ApplicationWizardData]);
            // Note: markFieldTouched is called on blur, not on change (per DESIGN.md)
        },
        [updateField],
    );

    const getError = useCallback(
        (field: string) => {
            return errors[field];
        },
        [errors],
    );

    const isTouched = useCallback(
        (field: string) => {
            return !!touchedFields[field];
        },
        [touchedFields],
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold">{t('title') || 'Financial Capability'}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('description') || 'Provide your employment and income details to help verify your ability to pay rent.'}
                </p>
            </div>

            {/* Profile Data Banner */}
            <ProfileDataBanner />

            <FinancialInfoSection
                entityType="tenant"
                translations={translations}
                fieldPrefix="profile_"
                getValue={getValue}
                setValue={setValue}
                getError={getError}
                isTouched={isTouched}
                onFieldBlur={handleFieldBlur}
                clearTouchedFields={clearTouchedFields}
                uploadUrl="/tenant-profile/document/upload"
                existingDocuments={existingDocuments}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    );
}
