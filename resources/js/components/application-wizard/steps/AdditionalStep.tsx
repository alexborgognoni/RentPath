import { FileUpload } from '@/components/ui/file-upload';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { FileText, Info, Upload } from 'lucide-react';

interface AdditionalStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
}

export function AdditionalStep({ data, errors, touchedFields, updateField, markFieldTouched, onBlur }: AdditionalStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.additionalStep.${key}`);

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

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

            {/* Additional Documents Section */}
            <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t('documents.title') || 'Supporting Documents'}</h3>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t('optional') || 'Optional'}</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                    {t('documents.description') || 'Upload additional documents that may support your application.'}
                </p>

                <div className="space-y-4">
                    {/* Bank Statements */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('documents.bankStatements') || 'Bank Statements'}{' '}
                            <span className="text-muted-foreground">({t('optional') || 'Optional'})</span>
                        </label>
                        <p className="mb-2 text-xs text-muted-foreground">
                            {t('documents.bankStatementsDesc') || 'Last 3 months of bank statements showing income deposits'}
                        </p>
                        <FileUpload
                            documentType="additional_bank_statements"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={{
                                'application/pdf': ['.pdf'],
                                'image/*': ['.png', '.jpg', '.jpeg'],
                            }}
                            maxSize={20 * 1024 * 1024}
                            description={{
                                fileTypes: 'PDF, PNG, JPG',
                                maxFileSize: '20MB',
                            }}
                            onUploadSuccess={() => markFieldTouched('additional_bank_statements')}
                            error={touchedFields.additional_bank_statements ? errors.additional_bank_statements : undefined}
                        />
                    </div>

                    {/* Tax Returns */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('documents.taxReturns') || 'Tax Returns'}{' '}
                            <span className="text-muted-foreground">({t('optional') || 'Optional'})</span>
                        </label>
                        <p className="mb-2 text-xs text-muted-foreground">
                            {t('documents.taxReturnsDesc') || 'Most recent tax return or tax assessment'}
                        </p>
                        <FileUpload
                            documentType="additional_tax_returns"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={{
                                'application/pdf': ['.pdf'],
                                'image/*': ['.png', '.jpg', '.jpeg'],
                            }}
                            maxSize={20 * 1024 * 1024}
                            description={{
                                fileTypes: 'PDF, PNG, JPG',
                                maxFileSize: '20MB',
                            }}
                            onUploadSuccess={() => markFieldTouched('additional_tax_returns')}
                            error={touchedFields.additional_tax_returns ? errors.additional_tax_returns : undefined}
                        />
                    </div>

                    {/* Other Supporting Documents */}
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('documents.otherDocuments') || 'Other Documents'}{' '}
                            <span className="text-muted-foreground">({t('optional') || 'Optional'})</span>
                        </label>
                        <p className="mb-2 text-xs text-muted-foreground">
                            {t('documents.otherDocumentsDesc') || 'Any other relevant documents (recommendation letters, proof of savings, etc.)'}
                        </p>
                        <FileUpload
                            documentType="additional_other_documents"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={{
                                'application/pdf': ['.pdf'],
                                'image/*': ['.png', '.jpg', '.jpeg'],
                            }}
                            maxSize={20 * 1024 * 1024}
                            description={{
                                fileTypes: 'PDF, PNG, JPG',
                                maxFileSize: '20MB',
                            }}
                            onUploadSuccess={() => markFieldTouched('additional_other_documents')}
                            error={touchedFields.additional_other_documents ? errors.additional_other_documents : undefined}
                        />
                    </div>
                </div>
            </div>

            {/* Additional Notes Section */}
            <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t('notes.title')}</h3>
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t('optional')}</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{t('notes.description')}</p>

                <div>
                    <textarea
                        value={data.additional_notes || ''}
                        onChange={(e) => handleFieldChange('additional_notes', e.target.value)}
                        onBlur={onBlur}
                        rows={4}
                        maxLength={2000}
                        placeholder={t('notes.placeholder')}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                        {t('notes.characters')
                            .replace(':count', (data.additional_notes?.length || 0).toString())
                            .replace(':max', '2000')}
                    </p>
                </div>
            </div>
        </div>
    );
}
