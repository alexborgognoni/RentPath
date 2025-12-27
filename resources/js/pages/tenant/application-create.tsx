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
import { Head, usePage } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import { useCallback } from 'react';

interface ApplicationCreateProps extends SharedData {
    property: Property;
    tenantProfile: TenantProfile;
    draftApplication?: DraftApplication | null;
    token?: string | null;
}

export default function ApplicationCreate() {
    const { property, tenantProfile, draftApplication, token } = usePage<ApplicationCreateProps>().props;

    const wizard = useApplicationWizard({
        propertyId: property.id,
        tenantProfile,
        draftApplication,
        token,
    });

    // Handle blur to trigger autosave
    const handleBlur = useCallback(() => {
        wizard.saveNow();
    }, [wizard]);

    // Existing document file names for display
    const existingDocuments = {
        id_document: tenantProfile?.id_document_original_name,
        employment_contract: tenantProfile?.employment_contract_original_name,
        payslip_1: tenantProfile?.payslip_1_original_name,
        payslip_2: tenantProfile?.payslip_2_original_name,
        payslip_3: tenantProfile?.payslip_3_original_name,
        student_proof: tenantProfile?.student_proof_original_name,
        guarantor_id: tenantProfile?.guarantor_id_original_name,
        guarantor_proof_income: tenantProfile?.guarantor_proof_income_original_name,
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
                        updateField={wizard.updateField}
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
            <Head title={`Apply for ${property.title}`} />
            {/* Title */}
            <div className="mb-6 text-center">
                <h1 className="mb-2 text-3xl font-bold">Application for {property.title}</h1>
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
                            submitLabel="Submit Application"
                            submittingLabel="Submitting..."
                        />
                    </div>
                </div>

                {/* Property Summary Sidebar - Fixed width */}
                <div className="order-1 lg:order-2">
                    <div className="sticky top-8 rounded-lg border border-border bg-card">
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
                                <div className="mb-2 flex items-baseline justify-between">
                                    <span className="text-sm text-muted-foreground">Monthly Rent</span>
                                    <span className="text-xl font-bold text-primary">{property.formatted_rent}</span>
                                </div>

                                {property.utilities_included !== null && (
                                    <p className="text-xs text-muted-foreground">
                                        {property.utilities_included ? 'Utilities included' : 'Utilities not included'}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-sm">
                                {property.bedrooms !== null && property.bedrooms !== undefined && (
                                    <div>
                                        <p className="text-muted-foreground">Bedrooms</p>
                                        <p className="font-medium">{property.bedrooms}</p>
                                    </div>
                                )}
                                {property.bathrooms !== null && property.bathrooms !== undefined && (
                                    <div>
                                        <p className="text-muted-foreground">Bathrooms</p>
                                        <p className="font-medium">{property.bathrooms}</p>
                                    </div>
                                )}
                                {property.size !== null && property.size !== undefined && (
                                    <div>
                                        <p className="text-muted-foreground">Size</p>
                                        <p className="font-medium">{property.size} m²</p>
                                    </div>
                                )}
                                {property.available_from && (
                                    <div>
                                        <p className="text-muted-foreground">Available</p>
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
                                    <p className="mb-1 font-medium">Allowed</p>
                                    <div className="space-y-1">
                                        {property.pets_allowed && <p className="text-green-600 dark:text-green-400">Pets allowed</p>}
                                        {property.smoking_allowed && <p className="text-green-600 dark:text-green-400">Smoking allowed</p>}
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
