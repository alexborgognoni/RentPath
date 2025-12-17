import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { Trash2, Upload } from 'lucide-react';

interface DocumentsStepProps {
    data: ApplicationWizardData;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    uploadProgress: number | null;
}

export function DocumentsStep({ data, updateField, uploadProgress }: DocumentsStepProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Additional Documents (Optional)</h2>
            <p className="text-sm text-muted-foreground">
                Your tenant profile already includes your ID and income verification. You can optionally upload newer documents here.
            </p>

            <div className="space-y-6">
                {/* ID Document Upload */}
                <div>
                    <label className="mb-2 block text-sm font-medium">Updated ID Document (Optional)</label>
                    <div className="mt-2 flex justify-center rounded-md border border-dashed border-border px-6 pt-5 pb-6">
                        <div className="w-full space-y-1 text-center">
                            <label htmlFor="application_id_document" className="cursor-pointer">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            </label>
                            <div className="flex justify-center text-sm text-muted-foreground">
                                <label
                                    htmlFor="application_id_document"
                                    className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                                >
                                    <span>{data.application_id_document ? 'Replace file' : 'Upload a file'}</span>
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <input
                                id="application_id_document"
                                name="application_id_document"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="sr-only"
                                onChange={(e) => updateField('application_id_document', e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 20MB</p>
                            {data.application_id_document && (
                                <div className="mt-3 w-full overflow-hidden px-4">
                                    <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background px-3 py-2 shadow-sm">
                                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                                            {data.application_id_document.name}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => updateField('application_id_document', null)}
                                            className="flex-shrink-0 cursor-pointer text-destructive hover:text-destructive/80"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Proof of Income Upload */}
                <div>
                    <label className="mb-2 block text-sm font-medium">Updated Proof of Income (Optional)</label>
                    <div className="mt-2 flex justify-center rounded-md border border-dashed border-border px-6 pt-5 pb-6">
                        <div className="w-full space-y-1 text-center">
                            <label htmlFor="application_proof_of_income" className="cursor-pointer">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            </label>
                            <div className="flex justify-center text-sm text-muted-foreground">
                                <label
                                    htmlFor="application_proof_of_income"
                                    className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                                >
                                    <span>{data.application_proof_of_income ? 'Replace file' : 'Upload a file'}</span>
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <input
                                id="application_proof_of_income"
                                name="application_proof_of_income"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="sr-only"
                                onChange={(e) => updateField('application_proof_of_income', e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 20MB</p>
                            {data.application_proof_of_income && (
                                <div className="mt-3 w-full overflow-hidden px-4">
                                    <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background px-3 py-2 shadow-sm">
                                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                                            {data.application_proof_of_income.name}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => updateField('application_proof_of_income', null)}
                                            className="flex-shrink-0 cursor-pointer text-destructive hover:text-destructive/80"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Reference Letter Upload */}
                <div>
                    <label className="mb-2 block text-sm font-medium">Reference Letter (Optional)</label>
                    <div className="mt-2 flex justify-center rounded-md border border-dashed border-border px-6 pt-5 pb-6">
                        <div className="w-full space-y-1 text-center">
                            <label htmlFor="application_reference_letter" className="cursor-pointer">
                                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            </label>
                            <div className="flex justify-center text-sm text-muted-foreground">
                                <label
                                    htmlFor="application_reference_letter"
                                    className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                                >
                                    <span>{data.application_reference_letter ? 'Replace file' : 'Upload a file'}</span>
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <input
                                id="application_reference_letter"
                                name="application_reference_letter"
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                className="sr-only"
                                onChange={(e) => updateField('application_reference_letter', e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 20MB</p>
                            {data.application_reference_letter && (
                                <div className="mt-3 w-full overflow-hidden px-4">
                                    <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background px-3 py-2 shadow-sm">
                                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                                            {data.application_reference_letter.name}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => updateField('application_reference_letter', null)}
                                            className="flex-shrink-0 cursor-pointer text-destructive hover:text-destructive/80"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {uploadProgress !== null && (
                <div className="mt-4">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                </div>
            )}
        </div>
    );
}
