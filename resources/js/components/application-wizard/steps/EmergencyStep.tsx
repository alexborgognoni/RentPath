import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';

interface EmergencyStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    hasProfileEmergencyContact: boolean;
}

export function EmergencyStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    onBlur,
    hasProfileEmergencyContact,
}: EmergencyStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.emergencyStep.${key}`);

    const handleFieldChange = (field: keyof ApplicationWizardData, value: string) => {
        updateField(field, value);
        markFieldTouched(field);
    };

    const getFieldClass = (field: string) => {
        const hasError = touchedFields[field] && errors[field];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('title')}</h2>
            <p className="text-sm text-muted-foreground">{hasProfileEmergencyContact ? t('descriptionWithProfile') : t('descriptionNoProfile')}</p>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.name')}</label>
                    <input
                        type="text"
                        value={data.emergency_contact_name}
                        onChange={(e) => handleFieldChange('emergency_contact_name', e.target.value)}
                        onBlur={onBlur}
                        aria-invalid={!!(touchedFields.emergency_contact_name && errors.emergency_contact_name)}
                        className={getFieldClass('emergency_contact_name')}
                    />
                    {touchedFields.emergency_contact_name && errors.emergency_contact_name && (
                        <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_name}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.phone')}</label>
                    <input
                        type="tel"
                        value={data.emergency_contact_phone}
                        onChange={(e) => handleFieldChange('emergency_contact_phone', e.target.value)}
                        onBlur={onBlur}
                        aria-invalid={!!(touchedFields.emergency_contact_phone && errors.emergency_contact_phone)}
                        className={getFieldClass('emergency_contact_phone')}
                    />
                    {touchedFields.emergency_contact_phone && errors.emergency_contact_phone && (
                        <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_phone}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.relationship')}</label>
                    <input
                        type="text"
                        value={data.emergency_contact_relationship}
                        onChange={(e) => handleFieldChange('emergency_contact_relationship', e.target.value)}
                        onBlur={onBlur}
                        placeholder={t('placeholder')}
                        aria-invalid={!!(touchedFields.emergency_contact_relationship && errors.emergency_contact_relationship)}
                        className={getFieldClass('emergency_contact_relationship')}
                    />
                    {touchedFields.emergency_contact_relationship && errors.emergency_contact_relationship && (
                        <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_relationship}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
