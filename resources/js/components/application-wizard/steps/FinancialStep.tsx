import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import { FinancialInfoSection, type ExistingDocuments } from '../shared';

interface FinancialStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    existingDocuments?: ExistingDocuments;
}

export function FinancialStep({ data, errors, touchedFields, updateField, markFieldTouched, onBlur, existingDocuments }: FinancialStepProps) {
    const { translations } = usePage<SharedData>().props;

    // Reload tenant profile data after successful upload
    const handleUploadSuccess = useCallback(() => {
        router.reload({ only: ['tenantProfile'] });
    }, []);

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
            markFieldTouched(field);
        },
        [updateField, markFieldTouched],
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
            <FinancialInfoSection
                entityType="tenant"
                translations={translations}
                fieldPrefix="profile_"
                getValue={getValue}
                setValue={setValue}
                getError={getError}
                isTouched={isTouched}
                onBlur={onBlur}
                uploadUrl="/tenant-profile/document/upload"
                existingDocuments={existingDocuments}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    );
}
