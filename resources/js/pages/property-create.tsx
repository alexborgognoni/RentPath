import { WizardNavigation } from '@/components/property-wizard/components/WizardNavigation';
import { WizardProgress } from '@/components/property-wizard/components/WizardProgress';
import { AmenitiesStep } from '@/components/property-wizard/steps/AmenitiesStep';
import { EnergyStep } from '@/components/property-wizard/steps/EnergyStep';
import { LocationStep } from '@/components/property-wizard/steps/LocationStep';
import { MediaStep } from '@/components/property-wizard/steps/MediaStep';
import { PricingStep } from '@/components/property-wizard/steps/PricingStep';
import { PropertyTypeStep } from '@/components/property-wizard/steps/PropertyTypeStep';
import { ReviewStep } from '@/components/property-wizard/steps/ReviewStep';
import { SpecificationsStep } from '@/components/property-wizard/steps/SpecificationsStep';
import { SaveStatus } from '@/components/ui/save-status';
import { usePropertyWizard, WIZARD_STEPS } from '@/hooks/usePropertyWizard';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { BreadcrumbItem } from '@/types';
import type { Property } from '@/types/dashboard';
import { route } from '@/utils/route';
import { Head, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useCallback } from 'react';

interface PropertyCreateWizardProps {
    property?: Property;
    isEditing?: boolean;
    isDraft?: boolean;
}

export default function PropertyCreateWizard({ property, isEditing = false, isDraft = false }: PropertyCreateWizardProps) {
    const wizard = usePropertyWizard({
        property,
        isDraft,
        onDraftCreated: (propertyId) => {
            // Update URL to include draft ID without full navigation
            window.history.replaceState({}, '', `${window.location.pathname}?draft=${propertyId}`);
        },
    });

    const breadcrumbs: BreadcrumbItem[] = isEditing
        ? [
              { title: 'Properties', href: route('manager.properties.index') },
              { title: property?.title || 'Property', href: route('properties.show', { property: property?.id }) },
              { title: 'Edit' },
          ]
        : [{ title: 'Properties', href: route('manager.properties.index') }, { title: 'Add Property' }];

    const handleSubmit = useCallback(() => {
        if (!wizard.validateForPublish()) {
            return;
        }

        wizard.setIsSubmitting(true);

        const formData = new FormData();

        // Add all form fields
        const { data } = wizard;
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof typeof data];
            if (value !== undefined && value !== null && key !== 'images' && key !== 'imagePreviews' && key !== 'existingImages') {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else if (typeof value === 'object' && !Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (!Array.isArray(value)) {
                    formData.append(key, String(value));
                }
            }
        });

        // Add images
        data.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
        formData.append('main_image_index', String(data.mainImageIndex));

        // Use the appropriate endpoint based on whether this is a draft or an existing property
        if (wizard.propertyId && !isEditing) {
            // Publishing a draft
            router.post(`/properties/${wizard.propertyId}/publish`, formData, {
                forceFormData: true,
                onError: (errors) => {
                    console.error('Submission errors:', errors);
                    wizard.setIsSubmitting(false);
                    const wizardErrors: Partial<Record<keyof typeof data, string>> = {};
                    Object.entries(errors).forEach(([key, message]) => {
                        wizardErrors[key as keyof typeof data] = message as string;
                    });
                    wizard.setErrors(wizardErrors);
                },
                onSuccess: () => {
                    wizard.setIsSubmitting(false);
                },
            });
        } else if (isEditing && property?.id) {
            // Updating existing property
            router.put(`/properties/${property.id}`, formData, {
                forceFormData: true,
                onError: (errors) => {
                    console.error('Submission errors:', errors);
                    wizard.setIsSubmitting(false);
                    const wizardErrors: Partial<Record<keyof typeof data, string>> = {};
                    Object.entries(errors).forEach(([key, message]) => {
                        wizardErrors[key as keyof typeof data] = message as string;
                    });
                    wizard.setErrors(wizardErrors);
                },
                onSuccess: () => {
                    wizard.setIsSubmitting(false);
                },
            });
        } else {
            // Fallback: create new property (shouldn't happen with autosave flow)
            router.post('/properties', formData, {
                forceFormData: true,
                onError: (errors) => {
                    console.error('Submission errors:', errors);
                    wizard.setIsSubmitting(false);
                    const wizardErrors: Partial<Record<keyof typeof data, string>> = {};
                    Object.entries(errors).forEach(([key, message]) => {
                        wizardErrors[key as keyof typeof data] = message as string;
                    });
                    wizard.setErrors(wizardErrors);
                },
                onSuccess: () => {
                    wizard.setIsSubmitting(false);
                },
            });
        }
    }, [wizard, isEditing, property?.id]);

    const renderCurrentStep = () => {
        const stepProps = {
            data: wizard.data,
            updateData: wizard.updateData,
            updateMultipleFields: wizard.updateMultipleFields,
            errors: wizard.errors,
            onBlur: wizard.validateFieldOnBlur,
        };

        switch (wizard.currentStep) {
            case 'property-type':
                return <PropertyTypeStep {...stepProps} />;
            case 'location':
                return <LocationStep {...stepProps} />;
            case 'specifications':
                return <SpecificationsStep {...stepProps} />;
            case 'amenities':
                return <AmenitiesStep {...stepProps} />;
            case 'energy':
                return <EnergyStep {...stepProps} />;
            case 'pricing':
                return <PricingStep {...stepProps} />;
            case 'media':
                return <MediaStep {...stepProps} />;
            case 'review':
                return <ReviewStep {...stepProps} onEditStep={wizard.goToStep} />;
            default:
                return null;
        }
    };

    const currentStepConfig = WIZARD_STEPS.find((s) => s.id === wizard.currentStep);

    return (
        <ManagerLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Property' : 'Add New Property'} />

            <div className="flex min-h-[calc(100vh-8rem)] flex-col">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Home className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit Property' : 'Add New Property'}</h1>
                                <p className="text-sm text-muted-foreground">{currentStepConfig?.description}</p>
                            </div>
                        </div>

                        {/* Save status indicator */}
                        <SaveStatus status={wizard.autosaveStatus} lastSavedAt={wizard.lastSavedAt} />
                    </div>

                    {/* Progress indicator */}
                    <WizardProgress
                        steps={WIZARD_STEPS}
                        currentStep={wizard.currentStep}
                        currentStepIndex={wizard.currentStepIndex}
                        maxStepReached={wizard.maxStepReached}
                        onStepClick={wizard.goToStep}
                        canGoToStep={wizard.canGoToStep}
                    />
                </motion.div>

                {/* Main content area */}
                <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card shadow-sm">
                    {/* Step content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div key={wizard.currentStep}>{renderCurrentStep()}</motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation footer */}
                    <WizardNavigation
                        onBack={wizard.goToPreviousStep}
                        onNext={wizard.goToNextStep}
                        onSubmit={handleSubmit}
                        onSkip={currentStepConfig?.optional ? wizard.goToNextStep : undefined}
                        isFirstStep={wizard.isFirstStep}
                        isLastStep={wizard.isLastStep}
                        isSubmitting={wizard.isSubmitting}
                        showSkip={currentStepConfig?.optional}
                        nextLabel={wizard.isLastStep ? 'Publish Listing' : undefined}
                    />
                </div>
            </div>
        </ManagerLayout>
    );
}
