import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, FileCheck, Shield } from 'lucide-react';
import { useEffect } from 'react';

interface ConsentStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
}

export function ConsentStep({ data, errors, touchedFields, updateField, markFieldTouched, onBlur }: ConsentStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.consentStep.${key}`);

    // Auto-capture signature date and IP when component mounts
    useEffect(() => {
        if (!data.signature_date) {
            updateField('signature_date', new Date().toISOString());
        }
        // Note: IP address should be captured on the server side for security
    }, []);

    const handleCheckboxChange = (field: keyof ApplicationWizardData, checked: boolean) => {
        updateField(field, checked);
        markFieldTouched(field);
        onBlur();
    };

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    // Check if all required consents are given per PLAN.md
    const allRequiredConsentsGiven =
        data.declaration_accuracy &&
        data.consent_screening &&
        data.consent_data_processing &&
        data.consent_reference_contact &&
        data.digital_signature?.trim();

    const showError = (field: string) => touchedFields[field] && errors[field];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('title') || 'Declarations & Consent'}</h2>
            <p className="text-muted-foreground">
                {t('description') || 'Please review and accept the following declarations before submitting your application.'}
            </p>

            {/* Important Notice */}
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <div className="space-y-1 text-sm">
                        <p className="font-medium text-amber-800 dark:text-amber-200">{t('notice.title') || 'Important Information'}</p>
                        <p className="text-amber-700 dark:text-amber-300">
                            {t('notice.description') ||
                                'By submitting this application, you agree to the terms below. Your information will be processed in accordance with GDPR and applicable data protection laws.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Required Declarations Section */}
            <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t('declarations.title') || 'Required Declarations'}</h3>
                    <span className="text-xs text-destructive">({t('required') || 'Required'})</span>
                </div>

                <div className="space-y-4">
                    {/* Declaration of Accuracy */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                        <input
                            type="checkbox"
                            checked={data.declaration_accuracy || false}
                            onChange={(e) => handleCheckboxChange('declaration_accuracy', e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-medium">
                                {t('declarations.accuracy.label') || 'I confirm that all information provided is true and accurate'}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('declarations.accuracy.description') ||
                                    'I declare that all information provided in this application is complete, true, and accurate to the best of my knowledge. I understand that providing false information may result in the rejection of my application or termination of any resulting tenancy.'}
                            </p>
                        </div>
                        {data.declaration_accuracy && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
                    </label>
                    {showError('declaration_accuracy') && <p className="text-sm text-destructive">{errors.declaration_accuracy}</p>}

                    {/* Consent to Screening */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                        <input
                            type="checkbox"
                            checked={data.consent_screening || false}
                            onChange={(e) => handleCheckboxChange('consent_screening', e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-medium">{t('declarations.screening.label') || 'I consent to background and credit screening'}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('declarations.screening.description') ||
                                    'I authorize the landlord/property manager and their agents to conduct credit checks, background checks, and verification of my employment and rental history as part of this application.'}
                            </p>
                        </div>
                        {data.consent_screening && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
                    </label>
                    {showError('consent_screening') && <p className="text-sm text-destructive">{errors.consent_screening}</p>}

                    {/* Consent to Data Processing (GDPR) */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                        <input
                            type="checkbox"
                            checked={data.consent_data_processing || false}
                            onChange={(e) => handleCheckboxChange('consent_data_processing', e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-medium">{t('declarations.dataProcessing.label') || 'I consent to processing of my personal data'}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('declarations.dataProcessing.description') ||
                                    'I consent to the collection, processing, and storage of my personal data as described in the Privacy Policy for the purpose of evaluating my rental application.'}
                            </p>
                        </div>
                        {data.consent_data_processing && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
                    </label>
                    {showError('consent_data_processing') && <p className="text-sm text-destructive">{errors.consent_data_processing}</p>}

                    {/* Consent to Contact References */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                        <input
                            type="checkbox"
                            checked={data.consent_reference_contact || false}
                            onChange={(e) => handleCheckboxChange('consent_reference_contact', e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-medium">
                                {t('declarations.referenceContact.label') || 'I consent to contacting the references I have provided'}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('declarations.referenceContact.description') ||
                                    'I authorize the landlord/property manager to contact the references I have provided, including previous landlords and employers, to verify the information in my application.'}
                            </p>
                        </div>
                        {data.consent_reference_contact && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
                    </label>
                    {showError('consent_reference_contact') && <p className="text-sm text-destructive">{errors.consent_reference_contact}</p>}
                </div>
            </div>

            {/* Optional Consents Section */}
            <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">{t('optionalConsents.title') || 'Optional Consents'}</h3>
                    <span className="text-xs text-muted-foreground">({t('optional') || 'Optional'})</span>
                </div>

                <div className="space-y-4">
                    {/* Consent to Data Sharing */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                        <input
                            type="checkbox"
                            checked={data.consent_data_sharing || false}
                            onChange={(e) => handleCheckboxChange('consent_data_sharing', e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-medium">
                                {t('optionalConsents.dataSharing.label') || 'I consent to sharing my application with other properties'}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('optionalConsents.dataSharing.description') ||
                                    'If this application is not successful, I consent to my application being shared with other landlords who may have suitable properties available.'}
                            </p>
                        </div>
                        {data.consent_data_sharing && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
                    </label>

                    {/* Consent to Marketing */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                        <input
                            type="checkbox"
                            checked={data.consent_marketing || false}
                            onChange={(e) => handleCheckboxChange('consent_marketing', e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0"
                        />
                        <div className="flex-1">
                            <p className="font-medium">{t('optionalConsents.marketing.label') || 'I consent to receive marketing communications'}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('optionalConsents.marketing.description') ||
                                    'I consent to receive emails about new properties and rental opportunities that may be of interest to me.'}
                            </p>
                        </div>
                        {data.consent_marketing && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
                    </label>
                </div>
            </div>

            {/* Digital Signature Section */}
            <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t('signature.title') || 'Digital Signature'}</h3>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                    {t('signature.description') || 'Please type your full legal name below to sign this application electronically.'}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('signature.fullName') || 'Full Legal Name'} <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.digital_signature || ''}
                            onChange={(e) => handleFieldChange('digital_signature', e.target.value)}
                            onBlur={onBlur}
                            placeholder={t('signature.fullNamePlaceholder') || 'Type your full legal name'}
                            className={`w-full rounded-lg border px-4 py-2 ${
                                showError('digital_signature') ? 'border-destructive bg-destructive/5' : 'border-border bg-background'
                            }`}
                        />
                        {showError('digital_signature') && <p className="mt-1 text-sm text-destructive">{errors.digital_signature}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('signature.date') || 'Date'}</label>
                        <input
                            type="text"
                            value={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            disabled
                            className="w-full rounded-lg border border-border bg-muted px-4 py-2 text-muted-foreground"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">{t('signature.dateNote') || 'Auto-filled for your records'}</p>
                    </div>
                </div>
            </div>

            {/* Status Summary */}
            <div
                className={`rounded-lg border p-4 ${allRequiredConsentsGiven ? 'border-green-500/50 bg-green-500/10' : 'border-border bg-muted/30'}`}
            >
                <div className="flex items-center gap-3">
                    {allRequiredConsentsGiven ? (
                        <>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <p className="font-medium text-green-700 dark:text-green-300">
                                {t('status.complete') || 'All required declarations completed. You may proceed.'}
                            </p>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="h-5 w-5 text-muted-foreground" />
                            <p className="text-muted-foreground">
                                {t('status.incomplete') || 'Please complete all required declarations above to continue.'}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
