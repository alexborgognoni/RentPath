import {
    AdditionalStep,
    ConsentStep,
    FinancialStep,
    HistoryStep,
    HouseholdStep,
    IdentityStep,
    ReviewStep,
    SupportStep,
} from '@/components/application-wizard/steps';
import { WizardNavigation, WizardProgress } from '@/components/wizard';
import { APPLICATION_STEPS, useApplicationWizard, type ApplicationStep, type DraftApplication } from '@/hooks/useApplicationWizard';
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

    // Build translated step configs - merge translations with fields from APPLICATION_STEPS
    const translatedSteps = useMemo(() => {
        const stepIds: ApplicationStep[] = ['identity', 'household', 'financial', 'support', 'history', 'additional', 'consent', 'review'];
        return stepIds.map((id) => {
            const baseStep = APPLICATION_STEPS.find((s) => s.id === id);
            return {
                id,
                title: translate(translations, `wizard.application.steps.${id}.title`),
                shortTitle: translate(translations, `wizard.application.steps.${id}.shortTitle`),
                optional: id === 'additional',
                fields: baseStep?.fields || [],
            };
        });
    }, [translations]);

    const wizard = useApplicationWizard({
        propertyId: property.id,
        tenantProfile,
        draftApplication,
        token,
        steps: translatedSteps,
    });

    // Generic blur handler - just triggers autosave, no validation
    // Used by legacy components that don't have field-specific blur handlers
    const handleBlur = useCallback(() => {
        wizard.saveNow();
    }, [wizard]);

    // Handle blur for a specific field - marks as touched and validates just that field
    // This follows the DESIGN.md per-field blur pattern to prevent cascade errors
    const handleFieldBlur = useCallback(
        async (field: string) => {
            wizard.markFieldTouched(field);
            await wizard.validateField(field);
            // Autosave is handled by the hook, no need to call saveNow here
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
        residence_permit_document: tenantProfile?.residence_permit_document_original_name,
        residence_permit_document_url: tenantProfile?.residence_permit_document_url,
        residence_permit_document_size: metadata.residence_permit_document?.size,
        residence_permit_document_uploaded_at: metadata.residence_permit_document?.lastModified,
        right_to_rent_document: tenantProfile?.right_to_rent_document_original_name,
        right_to_rent_document_url: tenantProfile?.right_to_rent_document_url,
        right_to_rent_document_size: metadata.right_to_rent_document?.size,
        right_to_rent_document_uploaded_at: metadata.right_to_rent_document?.lastModified,
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
        guarantor_id_front: tenantProfile?.guarantor_id_front_original_name,
        guarantor_id_front_url: tenantProfile?.guarantor_id_front_url,
        guarantor_id_front_size: metadata.guarantor_id_front?.size,
        guarantor_id_front_uploaded_at: metadata.guarantor_id_front?.lastModified,
        guarantor_id_back: tenantProfile?.guarantor_id_back_original_name,
        guarantor_id_back_url: tenantProfile?.guarantor_id_back_url,
        guarantor_id_back_size: metadata.guarantor_id_back?.size,
        guarantor_id_back_uploaded_at: metadata.guarantor_id_back?.lastModified,
        guarantor_employment_contract: tenantProfile?.guarantor_employment_contract_original_name,
        guarantor_employment_contract_url: tenantProfile?.guarantor_employment_contract_url,
        guarantor_employment_contract_size: metadata.guarantor_employment_contract?.size,
        guarantor_employment_contract_uploaded_at: metadata.guarantor_employment_contract?.lastModified,
        guarantor_payslip_1: tenantProfile?.guarantor_payslip_1_original_name,
        guarantor_payslip_1_url: tenantProfile?.guarantor_payslip_1_url,
        guarantor_payslip_1_size: metadata.guarantor_payslip_1?.size,
        guarantor_payslip_1_uploaded_at: metadata.guarantor_payslip_1?.lastModified,
        guarantor_payslip_2: tenantProfile?.guarantor_payslip_2_original_name,
        guarantor_payslip_2_url: tenantProfile?.guarantor_payslip_2_url,
        guarantor_payslip_2_size: metadata.guarantor_payslip_2?.size,
        guarantor_payslip_2_uploaded_at: metadata.guarantor_payslip_2?.lastModified,
        guarantor_payslip_3: tenantProfile?.guarantor_payslip_3_original_name,
        guarantor_payslip_3_url: tenantProfile?.guarantor_payslip_3_url,
        guarantor_payslip_3_size: metadata.guarantor_payslip_3?.size,
        guarantor_payslip_3_uploaded_at: metadata.guarantor_payslip_3?.lastModified,
        guarantor_student_proof: tenantProfile?.guarantor_student_proof_original_name,
        guarantor_student_proof_url: tenantProfile?.guarantor_student_proof_url,
        guarantor_student_proof_size: metadata.guarantor_student_proof?.size,
        guarantor_student_proof_uploaded_at: metadata.guarantor_student_proof?.lastModified,
        guarantor_other_income_proof: tenantProfile?.guarantor_other_income_proof_original_name,
        guarantor_other_income_proof_url: tenantProfile?.guarantor_other_income_proof_url,
        guarantor_other_income_proof_size: metadata.guarantor_other_income_proof?.size,
        guarantor_other_income_proof_uploaded_at: metadata.guarantor_other_income_proof?.lastModified,
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
            case 'identity':
                // Step 1: Identity & Legal Eligibility
                return (
                    <IdentityStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        onFieldBlur={handleFieldBlur}
                        existingDocuments={existingDocuments}
                        propertyCountry={property.country}
                    />
                );
            case 'household':
                // Step 2: Household Composition
                return (
                    <HouseholdStep
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
                        onFieldBlur={handleFieldBlur}
                        propertyCountry={property.country}
                    />
                );
            case 'financial':
                // Step 3: Financial Capability
                return (
                    <FinancialStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        clearTouchedFields={wizard.clearTouchedFields}
                        onFieldBlur={handleFieldBlur}
                        existingDocuments={existingDocuments}
                    />
                );
            case 'support':
                // Step 4: Financial Support (co-signers, guarantors, insurance)
                return (
                    <SupportStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        onFieldBlur={handleFieldBlur}
                        addCoSigner={wizard.addCoSigner}
                        removeCoSigner={wizard.removeCoSigner}
                        updateCoSigner={wizard.updateCoSigner}
                        addGuarantor={wizard.addGuarantor}
                        removeGuarantor={wizard.removeGuarantor}
                        updateGuarantor={wizard.updateGuarantor}
                        syncCoSignersFromOccupants={wizard.syncCoSignersFromOccupants}
                        propertyCountry={property.country}
                    />
                );
            case 'history':
                // Step 5: Credit & Rental History (per PLAN.md)
                return (
                    <HistoryStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        // Previous addresses
                        addPreviousAddress={wizard.addPreviousAddress}
                        removePreviousAddress={wizard.removePreviousAddress}
                        updatePreviousAddress={wizard.updatePreviousAddress}
                        // Landlord references
                        addLandlordReference={wizard.addLandlordReference}
                        removeLandlordReference={wizard.removeLandlordReference}
                        updateLandlordReference={wizard.updateLandlordReference}
                        // Other references
                        addOtherReference={wizard.addOtherReference}
                        removeOtherReference={wizard.removeOtherReference}
                        updateOtherReference={wizard.updateOtherReference}
                        // Legacy references (backwards compatibility)
                        addReference={wizard.addReference}
                        removeReference={wizard.removeReference}
                        updateReference={wizard.updateReference}
                        // Blur handlers
                        createIndexedBlurHandler={wizard.createIndexedBlurHandler}
                        onFieldBlur={handleFieldBlur}
                    />
                );
            case 'additional':
                // Step 6: Additional Information
                return (
                    <AdditionalStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                        onFieldBlur={handleFieldBlur}
                        propertyId={property.id}
                    />
                );
            case 'consent':
                // Step 7: Declarations & Consent (no autosave - data saved on submit only)
                return (
                    <ConsentStep
                        data={wizard.data}
                        errors={wizard.errors}
                        touchedFields={wizard.touchedFields}
                        updateField={wizard.updateField}
                        markFieldTouched={wizard.markFieldTouched}
                    />
                );
            case 'review':
                return <ReviewStep data={wizard.data} onEditStep={handleEditStep} />;
            default:
                return null;
        }
    };

    // Handle next step with validation feedback
    const handleNextStep = useCallback(async (): Promise<boolean> => {
        // Calculate the step that will be saved BEFORE calling goToNextStep
        // because state updates are batched and won't be available immediately
        const nextStepToSave = wizard.currentStepIndex + 2; // +1 for advancing, +1 for 1-indexed

        const success = await wizard.goToNextStep();
        if (!success) {
            wizard.markAllCurrentStepFieldsTouched();
        } else {
            // Save immediately after advancing to persist the step
            wizard.saveNow(nextStepToSave);
        }
        return success;
    }, [wizard]);

    return (
        <TenantLayout>
            <Head title={t('page.metaTitle', { property: property.title })} />
            {/* Title */}
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold">{t('page.title', { property: property.title })}</h1>
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

                {/* Property Summary Sidebar - Fixed width, sticky on desktop */}
                <div className="order-1 space-y-4 lg:sticky lg:top-[5.5rem] lg:order-2 lg:self-start">
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
