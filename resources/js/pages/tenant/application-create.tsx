import {
    DetailsStep,
    EmergencyStep,
    EmploymentIncomeStep,
    PersonalInfoStep,
    ReferencesStep,
    ReviewStep,
} from '@/components/application-wizard/steps';
import { WizardNavigation, WizardProgress } from '@/components/wizard';
import { useApplicationWizard, type ApplicationStep, type DraftApplication } from '@/hooks/useApplicationWizard';
import { TenantLayout } from '@/layouts/tenant-layout';
import { type SharedData, type TenantProfile } from '@/types';
import type { Property } from '@/types/dashboard';
import { translate } from '@/utils/translate-utils';
import { Head, usePage } from '@inertiajs/react';
import { Bath, Bed, Car, MapPin, Ruler, User } from 'lucide-react';
import { useCallback, useMemo } from 'react';

/**
 * Format a number by removing unnecessary trailing zeros.
 * e.g., 1.0 -> 1, 1.50 -> 1.5, 1.25 -> 1.25
 */
function formatNumber(value: number | string | null | undefined): string {
    if (value === null || value === undefined) return '';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';
    // Convert to string, which removes trailing zeros after decimal point
    return num.toString();
}

interface ApplicationCreateProps extends SharedData {
    property: Property;
    tenantProfile: TenantProfile;
    draftApplication?: DraftApplication | null;
    token?: string | null;
}

export default function ApplicationCreate() {
    const { property, tenantProfile, draftApplication, token, translations } = usePage<ApplicationCreateProps>().props;
    const t = useCallback(
        (key: string, params?: Record<string, string | number>) => translate(translations, `wizard.application.${key}`, params),
        [translations],
    );

    // Build translated step configs
    const translatedSteps = useMemo(() => {
        const stepIds: ApplicationStep[] = ['personal', 'employment', 'details', 'references', 'emergency', 'review'];
        return stepIds.map((id) => ({
            id,
            title: translate(translations, `wizard.application.steps.${id}.title`),
            shortTitle: translate(translations, `wizard.application.steps.${id}.shortTitle`),
            description: translate(translations, `wizard.application.steps.${id}.description`),
            optional: id === 'references' || id === 'emergency',
        }));
    }, [translations]);

    const wizard = useApplicationWizard({
        propertyId: property.id,
        tenantProfile,
        draftApplication,
        token,
        steps: translatedSteps,
    });

    // Handle blur to trigger validation and autosave
    const handleBlur = useCallback(() => {
        wizard.validateCurrentStep();
        wizard.saveNow();
    }, [wizard]);

    // Handle blur for a specific field - marks as touched and validates
    const handleFieldBlur = useCallback(
        (field: string) => {
            wizard.markFieldTouched(field);
            wizard.validateCurrentStep();
            wizard.saveNow();
        },
        [wizard],
    );

    // Existing document file names, URLs, and metadata for display
    const metadata = tenantProfile?.documents_metadata || {};
    const existingDocuments = {
        id_document_front: tenantProfile?.id_document_front_original_name,
        id_document_front_url: tenantProfile?.id_document_front_url,
        id_document_front_size: metadata.id_document_front?.size,
        id_document_front_uploaded_at: metadata.id_document_front?.lastModified,
        id_document_back: tenantProfile?.id_document_back_original_name,
        id_document_back_url: tenantProfile?.id_document_back_url,
        id_document_back_size: metadata.id_document_back?.size,
        id_document_back_uploaded_at: metadata.id_document_back?.lastModified,
        employment_contract: tenantProfile?.employment_contract_original_name,
        employment_contract_url: tenantProfile?.employment_contract_url,
        employment_contract_size: metadata.employment_contract?.size,
        employment_contract_uploaded_at: metadata.employment_contract?.lastModified,
        payslip_1: tenantProfile?.payslip_1_original_name,
        payslip_1_url: tenantProfile?.payslip_1_url,
        payslip_1_size: metadata.payslip_1?.size,
        payslip_1_uploaded_at: metadata.payslip_1?.lastModified,
        payslip_2: tenantProfile?.payslip_2_original_name,
        payslip_2_url: tenantProfile?.payslip_2_url,
        payslip_2_size: metadata.payslip_2?.size,
        payslip_2_uploaded_at: metadata.payslip_2?.lastModified,
        payslip_3: tenantProfile?.payslip_3_original_name,
        payslip_3_url: tenantProfile?.payslip_3_url,
        payslip_3_size: metadata.payslip_3?.size,
        payslip_3_uploaded_at: metadata.payslip_3?.lastModified,
        student_proof: tenantProfile?.student_proof_original_name,
        student_proof_url: tenantProfile?.student_proof_url,
        student_proof_size: metadata.student_proof?.size,
        student_proof_uploaded_at: metadata.student_proof?.lastModified,
        other_income_proof: tenantProfile?.other_income_proof_original_name,
        other_income_proof_url: tenantProfile?.other_income_proof_url,
        other_income_proof_size: metadata.other_income_proof?.size,
        other_income_proof_uploaded_at: metadata.other_income_proof?.lastModified,
        guarantor_id: tenantProfile?.guarantor_id_original_name,
        guarantor_id_url: tenantProfile?.guarantor_id_url,
        guarantor_id_size: metadata.guarantor_id?.size,
        guarantor_id_uploaded_at: metadata.guarantor_id?.lastModified,
        guarantor_proof_income: tenantProfile?.guarantor_proof_income_original_name,
        guarantor_proof_income_url: tenantProfile?.guarantor_proof_income_url,
        guarantor_proof_income_size: metadata.guarantor_proof_income?.size,
        guarantor_proof_income_uploaded_at: metadata.guarantor_proof_income?.lastModified,
    };

    // Handle edit from review step
    const handleEditStep = useCallback(
        (step: string) => {
            wizard.goToStep(step as ApplicationStep);
        },
        [wizard],
    );

    // Render current step content
    const renderStep = () => {
        switch (wizard.currentStep) {
            case 'personal':
                return (
                    <PersonalInfoStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        onBlur={handleBlur}
                        onFieldBlur={handleFieldBlur}
                        existingDocuments={existingDocuments}
                    />
                );
            case 'employment':
                return (
                    <EmploymentIncomeStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        onBlur={handleBlur}
                        existingDocuments={existingDocuments}
                    />
                );
            case 'details':
                return (
                    <DetailsStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        addOccupant={wizard.addOccupant}
                        removeOccupant={wizard.removeOccupant}
                        updateOccupant={wizard.updateOccupant}
                        addPet={wizard.addPet}
                        removePet={wizard.removePet}
                        updatePet={wizard.updatePet}
                        onBlur={handleBlur}
                    />
                );
            case 'references':
                return (
                    <ReferencesStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        addReference={wizard.addReference}
                        removeReference={wizard.removeReference}
                        updateReference={wizard.updateReference}
                        onBlur={handleBlur}
                    />
                );
            case 'emergency':
                return (
                    <EmergencyStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        onBlur={handleBlur}
                        hasProfileEmergencyContact={!!tenantProfile?.emergency_contact_name}
                    />
                );
            case 'review':
                return <ReviewStep data={wizard.data} onEditStep={handleEditStep} />;
            default:
                return null;
        }
    };

    // Handle next step with validation feedback
    const handleNextStep = useCallback((): boolean => {
        const success = wizard.goToNextStep();
        if (!success) {
            wizard.markAllCurrentStepFieldsTouched();
        }
        return success;
    }, [wizard]);

    return (
        <TenantLayout>
            <Head title={t('page.metaTitle', { property: property.title })} />
            {/* Title */}
            <div className="mb-6 text-center">
                <h1 className="mb-2 text-3xl font-bold">{t('page.title', { property: property.title })}</h1>
                <p className="text-sm text-muted-foreground">{wizard.currentStepConfig.description}</p>
            </div>

            {/* Progress Stepper */}
            <div className="mb-8">
                <WizardProgress<ApplicationStep>
                    steps={wizard.steps}
                    currentStep={wizard.currentStep}
                    currentStepIndex={wizard.currentStepIndex}
                    maxStepReached={wizard.maxStepReached}
                    onStepClick={wizard.goToStep}
                    canGoToStep={wizard.canGoToStep}
                />
            </div>

            {/* Two-column layout with fixed widths */}
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[800px_350px]">
                {/* Main Form Content - Fixed width */}
                <div className="order-2 lg:order-1">
                    <div className="flex flex-col rounded-lg border border-border bg-card">
                        {/* Step content */}
                        <div className="flex-1 p-6">{renderStep()}</div>

                        {/* Navigation footer */}
                        <WizardNavigation
                            onBack={wizard.goToPreviousStep}
                            onNext={handleNextStep}
                            onSubmit={wizard.submit}
                            isFirstStep={wizard.isFirstStep}
                            isLastStep={wizard.isLastStep}
                            isSubmitting={wizard.isSubmitting}
                            submitLabel={t('nav.submitApplication')}
                            submittingLabel={t('nav.submitting')}
                        />
                    </div>
                </div>

                {/* Property Summary Sidebar - Fixed width */}
                <div className="order-1 space-y-4 lg:order-2">
                    {/* Property Manager Card */}
                    {property.property_manager && (
                        <div className="rounded-lg border border-border bg-card p-4">
                            <div className="flex items-center gap-3">
                                {property.property_manager.profile_picture_url ? (
                                    <img
                                        src={property.property_manager.profile_picture_url}
                                        alt={property.property_manager.user?.full_name || t('sidebar.propertyManager')}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <User className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">
                                        {property.property_manager.user?.full_name || t('sidebar.propertyManager')}
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {property.property_manager.type === 'professional' && property.property_manager.company_name
                                            ? property.property_manager.company_name
                                            : t('sidebar.privateLandlord')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Property Details Card */}
                    <div className="rounded-lg border border-border bg-card">
                        {property.main_image_url && (
                            <div className="overflow-hidden rounded-t-lg">
                                <img src={property.main_image_url} alt={property.title} className="h-56 w-full object-cover" />
                            </div>
                        )}

                        <div className="space-y-3 p-6">
                            <div className="flex items-start gap-2 text-sm">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <div>
                                    <p>
                                        {property.house_number} {property.street_name}
                                    </p>
                                    <p>
                                        {property.city}, {property.postal_code}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-border pt-3">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm text-muted-foreground">{t('sidebar.monthlyRent')}</span>
                                    <span className="text-xl font-bold text-foreground">{property.formatted_rent}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-sm">
                                {property.bedrooms !== null && property.bedrooms !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <Bed className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">{t('sidebar.bedrooms')}</p>
                                            <p className="font-medium">{formatNumber(property.bedrooms)}</p>
                                        </div>
                                    </div>
                                )}
                                {property.bathrooms !== null && property.bathrooms !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <Bath className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">{t('sidebar.bathrooms')}</p>
                                            <p className="font-medium">{formatNumber(property.bathrooms)}</p>
                                        </div>
                                    </div>
                                )}
                                {property.size !== null && property.size !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <Ruler className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">{t('sidebar.size')}</p>
                                            <p className="font-medium">{formatNumber(property.size)} m²</p>
                                        </div>
                                    </div>
                                )}
                                {((property.parking_spots_interior ?? 0) > 0 || (property.parking_spots_exterior ?? 0) > 0) && (
                                    <div className="flex items-center gap-2">
                                        <Car className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-muted-foreground">{t('sidebar.parking')}</p>
                                            <p className="font-medium">
                                                {t('sidebar.spots', {
                                                    count: (property.parking_spots_interior ?? 0) + (property.parking_spots_exterior ?? 0),
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {property.available_from && (
                                    <div>
                                        <p className="text-muted-foreground">{t('sidebar.available')}</p>
                                        <p className="font-medium">
                                            {new Date(property.available_from).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {(property.pets_allowed || property.smoking_allowed) && (
                                <div className="border-t border-border pt-3 text-sm">
                                    <p className="mb-1 font-medium">{t('sidebar.allowed')}</p>
                                    <div className="space-y-1">
                                        {property.pets_allowed && <p className="text-green-600 dark:text-green-400">{t('sidebar.petsAllowed')}</p>}
                                        {property.smoking_allowed && (
                                            <p className="text-green-600 dark:text-green-400">{t('sidebar.smokingAllowed')}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TenantLayout>
    );
}
