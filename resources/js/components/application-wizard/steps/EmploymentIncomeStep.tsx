import { FileUpload } from '@/components/ui/file-upload';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import { FinancialInfoSection } from '../shared';

interface EmploymentIncomeStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    existingDocuments?: {
        // Main tenant documents
        employment_contract?: string;
        employment_contract_url?: string;
        employment_contract_size?: number;
        employment_contract_uploaded_at?: number;
        payslip_1?: string;
        payslip_1_url?: string;
        payslip_1_size?: number;
        payslip_1_uploaded_at?: number;
        payslip_2?: string;
        payslip_2_url?: string;
        payslip_2_size?: number;
        payslip_2_uploaded_at?: number;
        payslip_3?: string;
        payslip_3_url?: string;
        payslip_3_size?: number;
        payslip_3_uploaded_at?: number;
        student_proof?: string;
        student_proof_url?: string;
        student_proof_size?: number;
        student_proof_uploaded_at?: number;
        pension_statement?: string;
        pension_statement_url?: string;
        pension_statement_size?: number;
        pension_statement_uploaded_at?: number;
        benefits_statement?: string;
        benefits_statement_url?: string;
        benefits_statement_size?: number;
        benefits_statement_uploaded_at?: number;
        other_income_proof?: string;
        other_income_proof_url?: string;
        other_income_proof_size?: number;
        other_income_proof_uploaded_at?: number;
    };
}

export function EmploymentIncomeStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    onBlur,
    existingDocuments,
}: EmploymentIncomeStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.employmentStep.${key}`);

    // Reload tenant profile data after successful upload
    const handleUploadSuccess = useCallback(() => {
        router.reload({ only: ['tenantProfile'] });
    }, []);

    const fileUploadAccept = {
        'image/*': ['.png', '.jpg', '.jpeg'],
        'application/pdf': ['.pdf'],
    };

    const fileUploadDescription = {
        fileTypes: 'PDF, PNG, JPG',
        maxFileSize: '20MB',
    };

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

    // Render document uploads based on employment status
    const renderDocuments = useCallback(
        (status: string) => {
            switch (status) {
                case 'employed':
                    return (
                        <div className="grid gap-4 md:grid-cols-2">
                            <FileUpload
                                label={t('documents.employmentContract')}
                                required
                                documentType="employment_contract"
                                uploadUrl="/tenant-profile/document/upload"
                                accept={fileUploadAccept}
                                maxSize={20 * 1024 * 1024}
                                description={fileUploadDescription}
                                existingFile={
                                    existingDocuments?.employment_contract
                                        ? {
                                              originalName: existingDocuments.employment_contract,
                                              previewUrl: existingDocuments.employment_contract_url,
                                              size: existingDocuments.employment_contract_size,
                                              uploadedAt: existingDocuments.employment_contract_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                                error={touchedFields.profile_employment_contract ? errors.profile_employment_contract : undefined}
                            />
                            <FileUpload
                                label={t('documents.payslip1')}
                                required
                                documentType="payslip_1"
                                uploadUrl="/tenant-profile/document/upload"
                                accept={fileUploadAccept}
                                maxSize={20 * 1024 * 1024}
                                description={fileUploadDescription}
                                existingFile={
                                    existingDocuments?.payslip_1
                                        ? {
                                              originalName: existingDocuments.payslip_1,
                                              previewUrl: existingDocuments.payslip_1_url,
                                              size: existingDocuments.payslip_1_size,
                                              uploadedAt: existingDocuments.payslip_1_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                                error={touchedFields.profile_payslip_1 ? errors.profile_payslip_1 : undefined}
                            />
                            <FileUpload
                                label={t('documents.payslip2')}
                                required
                                documentType="payslip_2"
                                uploadUrl="/tenant-profile/document/upload"
                                accept={fileUploadAccept}
                                maxSize={20 * 1024 * 1024}
                                description={fileUploadDescription}
                                existingFile={
                                    existingDocuments?.payslip_2
                                        ? {
                                              originalName: existingDocuments.payslip_2,
                                              previewUrl: existingDocuments.payslip_2_url,
                                              size: existingDocuments.payslip_2_size,
                                              uploadedAt: existingDocuments.payslip_2_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                                error={touchedFields.profile_payslip_2 ? errors.profile_payslip_2 : undefined}
                            />
                            <FileUpload
                                label={t('documents.payslip3')}
                                required
                                documentType="payslip_3"
                                uploadUrl="/tenant-profile/document/upload"
                                accept={fileUploadAccept}
                                maxSize={20 * 1024 * 1024}
                                description={fileUploadDescription}
                                existingFile={
                                    existingDocuments?.payslip_3
                                        ? {
                                              originalName: existingDocuments.payslip_3,
                                              previewUrl: existingDocuments.payslip_3_url,
                                              size: existingDocuments.payslip_3_size,
                                              uploadedAt: existingDocuments.payslip_3_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                                error={touchedFields.profile_payslip_3 ? errors.profile_payslip_3 : undefined}
                            />
                        </div>
                    );

                case 'student':
                    return (
                        <FileUpload
                            label={t('documents.studentProof')}
                            required
                            documentType="student_proof"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={fileUploadAccept}
                            maxSize={20 * 1024 * 1024}
                            description={fileUploadDescription}
                            existingFile={
                                existingDocuments?.student_proof
                                    ? {
                                          originalName: existingDocuments.student_proof,
                                          previewUrl: existingDocuments.student_proof_url,
                                          size: existingDocuments.student_proof_size,
                                          uploadedAt: existingDocuments.student_proof_uploaded_at,
                                      }
                                    : null
                            }
                            onUploadSuccess={handleUploadSuccess}
                            error={touchedFields.profile_student_proof ? errors.profile_student_proof : undefined}
                        />
                    );

                case 'retired':
                    return (
                        <>
                            <FileUpload
                                label={t('documents.pensionStatement')}
                                required
                                documentType="pension_statement"
                                uploadUrl="/tenant-profile/document/upload"
                                accept={fileUploadAccept}
                                maxSize={20 * 1024 * 1024}
                                description={fileUploadDescription}
                                existingFile={
                                    existingDocuments?.pension_statement
                                        ? {
                                              originalName: existingDocuments.pension_statement,
                                              previewUrl: existingDocuments.pension_statement_url,
                                              size: existingDocuments.pension_statement_size,
                                              uploadedAt: existingDocuments.pension_statement_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                                error={touchedFields.profile_pension_statement ? errors.profile_pension_statement : undefined}
                            />
                            <FileUpload
                                label={t('documents.otherIncomeProof')}
                                optional
                                documentType="other_income_proof"
                                uploadUrl="/tenant-profile/document/upload"
                                accept={fileUploadAccept}
                                maxSize={20 * 1024 * 1024}
                                description={fileUploadDescription}
                                existingFile={
                                    existingDocuments?.other_income_proof
                                        ? {
                                              originalName: existingDocuments.other_income_proof,
                                              previewUrl: existingDocuments.other_income_proof_url,
                                              size: existingDocuments.other_income_proof_size,
                                              uploadedAt: existingDocuments.other_income_proof_uploaded_at,
                                          }
                                        : null
                                }
                                onUploadSuccess={handleUploadSuccess}
                            />
                        </>
                    );

                case 'unemployed':
                    // Document depends on income source
                    if (!data.profile_unemployed_income_source) return null;
                    return (
                        <FileUpload
                            label={
                                data.profile_unemployed_income_source === 'unemployment_benefits'
                                    ? t('documents.benefitsStatement')
                                    : t('documents.otherIncomeProof')
                            }
                            required
                            documentType={
                                data.profile_unemployed_income_source === 'unemployment_benefits' ? 'benefits_statement' : 'other_income_proof'
                            }
                            uploadUrl="/tenant-profile/document/upload"
                            accept={fileUploadAccept}
                            maxSize={20 * 1024 * 1024}
                            description={fileUploadDescription}
                            existingFile={
                                data.profile_unemployed_income_source === 'unemployment_benefits'
                                    ? existingDocuments?.benefits_statement
                                        ? {
                                              originalName: existingDocuments.benefits_statement,
                                              previewUrl: existingDocuments.benefits_statement_url,
                                              size: existingDocuments.benefits_statement_size,
                                              uploadedAt: existingDocuments.benefits_statement_uploaded_at,
                                          }
                                        : null
                                    : existingDocuments?.other_income_proof
                                      ? {
                                            originalName: existingDocuments.other_income_proof,
                                            previewUrl: existingDocuments.other_income_proof_url,
                                            size: existingDocuments.other_income_proof_size,
                                            uploadedAt: existingDocuments.other_income_proof_uploaded_at,
                                        }
                                      : null
                            }
                            onUploadSuccess={handleUploadSuccess}
                            error={
                                data.profile_unemployed_income_source === 'unemployment_benefits'
                                    ? touchedFields.profile_benefits_statement
                                        ? errors.profile_benefits_statement
                                        : undefined
                                    : touchedFields.profile_other_income_proof
                                      ? errors.profile_other_income_proof
                                      : undefined
                            }
                        />
                    );

                case 'other':
                    return (
                        <FileUpload
                            label={t('documents.otherIncomeProof')}
                            required
                            documentType="other_income_proof"
                            uploadUrl="/tenant-profile/document/upload"
                            accept={fileUploadAccept}
                            maxSize={20 * 1024 * 1024}
                            description={fileUploadDescription}
                            existingFile={
                                existingDocuments?.other_income_proof
                                    ? {
                                          originalName: existingDocuments.other_income_proof,
                                          previewUrl: existingDocuments.other_income_proof_url,
                                          size: existingDocuments.other_income_proof_size,
                                          uploadedAt: existingDocuments.other_income_proof_uploaded_at,
                                      }
                                    : null
                            }
                            onUploadSuccess={handleUploadSuccess}
                            error={touchedFields.profile_other_income_proof ? errors.profile_other_income_proof : undefined}
                        />
                    );

                default:
                    return null;
            }
        },
        [existingDocuments, touchedFields, errors, handleUploadSuccess, t, data.profile_unemployed_income_source],
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
            </div>

            <FinancialInfoSection
                entityType="tenant"
                translations={translations}
                fieldPrefix="profile_"
                getValue={getValue}
                setValue={setValue}
                getError={getError}
                isTouched={isTouched}
                onBlur={onBlur}
                renderDocuments={renderDocuments}
            />
        </div>
    );
}
