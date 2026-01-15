import { AmenitiesStep } from '@/components/property-wizard/steps/amenities-step';
import { EnergyStep } from '@/components/property-wizard/steps/energy-step';
import { LocationStep } from '@/components/property-wizard/steps/location-step';
import { MediaStep } from '@/components/property-wizard/steps/media-step';
import { PricingStep } from '@/components/property-wizard/steps/pricing-step';
import { PropertyTypeStep } from '@/components/property-wizard/steps/property-type-step';
import { ReviewStep } from '@/components/property-wizard/steps/review-step';
import { SpecificationsStep } from '@/components/property-wizard/steps/specifications-step';
import { SaveStatus } from '@/components/ui/save-status';
import { WizardNavigation, WizardProgress } from '@/components/wizard';
import { usePropertyWizard, useWizardSteps } from '@/hooks/use-property-wizard';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import type { Property } from '@/types/dashboard';
import { route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useCallback } from 'react';

interface PropertyCreateWizardProps {
    property?: Property;
    isEditing?: boolean;
    isDraft?: boolean;
}

export default function PropertyCreateWizard({ property, isEditing = false, isDraft = false }: PropertyCreateWizardProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const WIZARD_STEPS = useWizardSteps();
    const wizard = usePropertyWizard({
        property,
        isDraft,
        onDraftCreated: (propertyId) => {
            // Update URL to include draft ID without full navigation
            window.history.replaceState({}, '', `${window.location.pathname}?draft=${propertyId}`);
        },
    });

    const breadcrumbs: BreadcrumbItem[] =
        isEditing && property
            ? [
                  { title: t('manager.properties.title'), href: route('manager.properties.index') },
                  { title: property.title || t('manager.properties.property'), href: route('properties.show', { property: property.id }) },
                  { title: t('wizard.property.reviewStep.edit') },
              ]
            : [{ title: t('manager.properties.title'), href: route('manager.properties.index') }, { title: t('wizard.property.page.addProperty') }];

    const handleSubmit = useCallback(async () => {
        const isValid = await wizard.validateForPublish();
        if (!isValid) {
            return;
        }

        wizard.setIsSubmitting(true);

        const formData = new FormData();

        // Add all form fields (excluding image-related fields which are handled separately)
        const { data } = wizard;
        const imageFields = ['images', 'mainImageId', 'mainImageIndex', 'deletedImageIds'];
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof typeof data];
            if (value !== undefined && value !== null && !imageFields.includes(key)) {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else if (typeof value === 'object' && !Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (!Array.isArray(value)) {
                    formData.append(key, String(value));
                }
            }
        });

        // Delta image handling
        // 1. New images (those without an ID)
        const newImages = data.images.filter((img) => img.id === null);
        newImages.forEach((img, i) => {
            if (img.file) {
                formData.append(`new_images[${i}]`, img.file);
            }
        });

        // 2. Deleted image IDs (if any)
        data.deletedImageIds.forEach((id, i) => {
            formData.append(`deleted_image_ids[${i}]`, String(id));
        });

        // 3. Image order (existing IDs or "new:index" for new images)
        data.images.forEach((img, i) => {
            const orderValue = img.id !== null ? String(img.id) : `new:${newImages.indexOf(img)}`;
            formData.append(`image_order[${i}]`, orderValue);
        });

        // 4. Main image
        if (data.mainImageId !== null) {
            formData.append('main_image_id', String(data.mainImageId));
        } else {
            formData.append('main_image_index', String(data.mainImageIndex));
        }

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
            <Head title={isEditing ? t('wizard.property.page.editProperty') : t('wizard.property.page.addProperty')} />

            <div className="flex min-h-[calc(100vh-8rem)] flex-col">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Home className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    {isEditing ? t('wizard.property.page.editProperty') : t('wizard.property.page.addProperty')}
                                </h1>
                                <p className="text-sm text-muted-foreground">{currentStepConfig?.description}</p>
                            </div>
                        </div>

                        {/* Save status indicator */}
                        <SaveStatus status={wizard.autosaveStatus} lastSavedAt={wizard.lastSavedAt} onSave={wizard.saveNow} />
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
                    {/* Step content - min-h prevents collapse during AnimatePresence transitions */}
                    <div className="min-h-96 flex-1 overflow-y-auto p-6 md:p-10">
                        <AnimatePresence mode="wait">
                            <motion.div key={wizard.currentStep}>{renderCurrentStep()}</motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation footer */}
                    <WizardNavigation
                        onBack={wizard.goToPreviousStep}
                        onNext={wizard.goToNextStep}
                        onSubmit={handleSubmit}
                        onSkip={
                            currentStepConfig?.optional
                                ? async () => {
                                      await wizard.goToNextStep();
                                  }
                                : undefined
                        }
                        isFirstStep={wizard.isFirstStep}
                        isLastStep={wizard.isLastStep}
                        isSubmitting={wizard.isSubmitting}
                        showSkip={currentStepConfig?.optional}
                        nextLabel={
                            wizard.isLastStep
                                ? isEditing
                                    ? t('wizard.property.page.updateListing')
                                    : t('wizard.property.page.publishListing')
                                : undefined
                        }
                        backLabel={t('wizard.common.nav.back')}
                        skipLabel={t('wizard.common.nav.skip')}
                        submitLabel={isEditing ? t('wizard.property.page.updateListing') : t('wizard.property.page.publishListing')}
                        submittingLabel={t('wizard.common.nav.submitting')}
                    />
                </div>
            </div>
        </ManagerLayout>
    );
}
