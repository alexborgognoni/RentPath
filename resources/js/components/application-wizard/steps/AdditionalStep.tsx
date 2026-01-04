import { FileUpload, type UploadedFile } from '@/components/ui/file-upload';
import { OptionalBadge } from '@/components/ui/optional-badge';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, FileText, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';

interface AdditionalStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    /** Per-field blur handler - called with field name for per-field validation */
    onFieldBlur?: (field: string) => void;
    propertyId: number;
}

export function AdditionalStep({ data, errors, touchedFields, updateField, markFieldTouched, onFieldBlur, propertyId }: AdditionalStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.additionalStep.${key}`);

    const [expandedSections, setExpandedSections] = useState({
        documents: true,
        notes: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Per-field blur handler (marks touched + triggers per-field validation)
    const handleFieldBlur = useCallback(
        (field: string) => () => {
            markFieldTouched(field);
            onFieldBlur?.(field);
        },
        [markFieldTouched, onFieldBlur],
    );

    // Get existing additional documents from data (if any)
    const existingDocuments: UploadedFile[] = data.additional_documents || [];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('title') || 'Additional Information'}</h2>
            <p className="text-muted-foreground">
                {t('description') || 'Upload any additional documents or provide extra information to strengthen your application.'}
            </p>

            {/* Supporting Documents Section - Collapsible */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('documents')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <Upload size={20} className="text-primary" />
                        <h3 className="font-semibold">{t('documents.title') || 'Supporting Documents'}</h3>
                        <OptionalBadge />
                        {existingDocuments.length > 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {existingDocuments.length}
                            </span>
                        )}
                    </div>
                    {expandedSections.documents ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.documents && (
                    <div className="space-y-4 border-t border-border p-4">
                        <FileUpload
                            documentType="additional_documents"
                            uploadUrl={`/properties/${propertyId}/apply/document`}
                            accept={{
                                'application/pdf': ['.pdf'],
                                'image/*': ['.png', '.jpg', '.jpeg'],
                            }}
                            maxSize={20 * 1024 * 1024}
                            multiple={true}
                            maxFiles={10}
                            existingFiles={existingDocuments}
                            allowDelete={true}
                            description={{
                                fileTypes: 'PDF, PNG, JPG',
                                maxFileSize: '20MB',
                                maxFiles: 10,
                            }}
                            onUploadSuccess={(file) => {
                                markFieldTouched('additional_documents');
                                // Add the new file to the data
                                const updated = [...existingDocuments, file];
                                updateField('additional_documents', updated);
                            }}
                            onFileRemove={(path) => {
                                // Remove the file from the data
                                const updated = existingDocuments.filter((f) => f.path !== path);
                                updateField('additional_documents', updated);
                                // Also call the backend to remove
                                fetch(`/properties/${propertyId}/apply/document`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                    },
                                    body: JSON.stringify({ path }),
                                });
                            }}
                            error={touchedFields.additional_documents ? errors.additional_documents : undefined}
                        />
                    </div>
                )}
            </div>

            {/* Additional Notes Section - Collapsible */}
            <div className="rounded-lg border border-border bg-card">
                <button type="button" onClick={() => toggleSection('notes')} className="flex w-full cursor-pointer items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <FileText size={20} className="text-primary" />
                        <h3 className="font-semibold">{t('notes.title') || 'Additional Notes'}</h3>
                        <OptionalBadge />
                    </div>
                    {expandedSections.notes ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.notes && (
                    <div className="space-y-4 border-t border-border p-4">
                        <textarea
                            value={data.additional_information || ''}
                            onChange={(e) => updateField('additional_information', e.target.value)}
                            onBlur={handleFieldBlur('additional_information')}
                            rows={4}
                            maxLength={2000}
                            placeholder={t('notes.placeholder') || 'Add any additional information you would like to share...'}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('notes.characters')
                                ?.replace(':count', (data.additional_information?.length || 0).toString())
                                ?.replace(':max', '2000') || `${data.additional_information?.length || 0} / 2000 characters`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
