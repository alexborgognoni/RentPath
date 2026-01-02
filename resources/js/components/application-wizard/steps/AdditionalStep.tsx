import { FileUpload, type UploadedFile } from '@/components/ui/file-upload';
import { OptionalBadge } from '@/components/ui/optional-badge';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { ChevronDown, ChevronUp, FileText, Info, Upload } from 'lucide-react';
import { useState } from 'react';

interface AdditionalStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    propertyId: number;
}

export function AdditionalStep({ data, errors, touchedFields, updateField, markFieldTouched, onBlur, propertyId }: AdditionalStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.additionalStep.${key}`);

    const [expandedSections, setExpandedSections] = useState({
        documents: true,
        notes: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    // Get existing additional documents from data (if any)
    const existingDocuments: UploadedFile[] = data.additional_documents || [];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('title') || 'Additional Information'}</h2>
            <p className="text-muted-foreground">
                {t('description') || 'Upload any additional documents or provide extra information to strengthen your application.'}
            </p>

            {/* Information Card */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="space-y-2 text-sm">
                        <p>
                            {t('info.purpose') ||
                                'This step is optional. You can upload additional documents like bank statements, tax returns, or any other supporting documentation that may help your application.'}
                        </p>
                        <p className="text-muted-foreground">
                            {t('info.optional') || "Skip this step if you don't have any additional documents to upload."}
                        </p>
                    </div>
                </div>
            </div>

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
                            onChange={(e) => handleFieldChange('additional_information', e.target.value)}
                            onBlur={onBlur}
                            rows={4}
                            maxLength={2000}
                            placeholder={t('notes.placeholder') || 'Add any additional information you would like to share...'}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                        />
                        <p className="text-xs text-muted-foreground">
                            {t('notes.characters')
                                .replace(':count', (data.additional_information?.length || 0).toString())
                                .replace(':max', '2000') || `${data.additional_information?.length || 0} / 2000 characters`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
