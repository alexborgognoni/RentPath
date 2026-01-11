import { EditModeNavigation } from '@/components/property-wizard/components/edit-mode-navigation';
import { AmenitiesStep } from '@/components/property-wizard/steps/amenities-step';
import { EnergyStep } from '@/components/property-wizard/steps/energy-step';
import { LocationStep } from '@/components/property-wizard/steps/location-step';
import { MediaStep } from '@/components/property-wizard/steps/media-step';
import { PricingStep } from '@/components/property-wizard/steps/pricing-step';
import { PropertyTypeStep } from '@/components/property-wizard/steps/property-type-step';
import { ReviewStep } from '@/components/property-wizard/steps/review-step';
import { SpecificationsStep } from '@/components/property-wizard/steps/specifications-step';
import { Button } from '@/components/ui/button';
import { usePropertyWizard, WIZARD_STEPS, type WizardStep } from '@/hooks/use-property-wizard';
import { ManagerLayout } from '@/layouts/manager-layout';
import type { BreadcrumbItem } from '@/types';
import type { Property } from '@/types/dashboard';
import { route } from '@/utils/route';
import { Head, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Home, Save } from 'lucide-react';
import { useCallback, useState } from 'react';

interface PropertyEditProps {
    property: Property;
}

export default function PropertyEdit({ property }: PropertyEditProps) {
    const [editingSection, setEditingSection] = useState<WizardStep | null>(null);

    const wizard = usePropertyWizard({
        property,
        isEditMode: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Properties', href: route('manager.properties.index') },
        { title: property.title || 'Property', href: route('properties.show', { property: property.id }) },
        { title: 'Edit' },
    ];

    const handleEditSection = (step: WizardStep) => {
        wizard.setErrors({}); // Clear any previous errors
        setEditingSection(step);
    };

    const handleDoneEditing = async () => {
        if (editingSection && (await wizard.validateSpecificStep(editingSection))) {
            setEditingSection(null);
        }
    };

    const handleCancel = () => {
        if (editingSection) {
            // If editing a section, just go back to review
            wizard.setErrors({});
            setEditingSection(null);
        } else {
            // If on review, go back to property page
            router.visit(route('properties.show', { property: property.id }));
        }
    };

    const handleSave = useCallback(() => {
        if (!wizard.validateForPublish()) {
            // Find the first section with errors and navigate to it
            const errorFields = Object.keys(wizard.errors);
            if (errorFields.length > 0) {
                // Map error fields to their step
                const fieldToStep: Record<string, WizardStep> = {
                    type: 'property-type',
                    subtype: 'property-type',
                    house_number: 'location',
                    street_name: 'location',
                    city: 'location',
                    postal_code: 'location',
                    country: 'location',
                    bedrooms: 'specifications',
                    bathrooms: 'specifications',
                    size: 'specifications',
                    rent_amount: 'pricing',
                    title: 'media',
                    images: 'media',
                };
                const firstErrorField = errorFields[0];
                const targetStep = fieldToStep[firstErrorField];
                if (targetStep) {
                    setEditingSection(targetStep);
                }
            }
            return;
        }

        wizard.setIsSubmitting(true);

        const formData = new FormData();

        // Add all form fields (excluding image-related fields which are handled separately)
        const { data } = wizard;
        const imageFields = ['images', 'mainImageId', 'mainImageIndex', 'deletedImageIds'];
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof typeof data];
            if (!imageFields.includes(key)) {
                if (value === undefined || value === null) {
                    // Skip null/undefined values
                } else if (typeof value === 'boolean') {
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

        // 2. Deleted image IDs
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

        // Add method spoofing for PUT request (required for FormData)
        formData.append('_method', 'PUT');

        // Submit update using POST with _method spoofing (FormData doesn't work well with PUT)
        router.post(`/properties/${property.id}`, formData, {
            onError: (errors) => {
                console.error('Update errors:', errors);
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
    }, [wizard, property.id]);

    const renderStepComponent = (step: WizardStep) => {
        const stepProps = {
            data: wizard.data,
            updateData: wizard.updateData,
            updateMultipleFields: wizard.updateMultipleFields,
            errors: wizard.errors,
            onBlur: wizard.validateFieldOnBlur,
        };

        switch (step) {
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
            default:
                return null;
        }
    };

    const getStepTitle = (step: WizardStep): string => {
        return WIZARD_STEPS.find((s) => s.id === step)?.title || '';
    };

    const hasErrors = Object.keys(wizard.errors).length > 0;

    return (
        <ManagerLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${property.title || 'Property'}`} />

            <div className="flex min-h-[calc(100vh-8rem)] flex-col">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Home className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    {editingSection ? `Edit ${getStepTitle(editingSection)}` : 'Edit Property'}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    {editingSection ? 'Make your changes and click Done when finished' : 'Review and update your property listing'}
                                </p>
                            </div>
                        </div>

                        {/* No autosave in edit mode - changes saved explicitly */}
                    </div>
                </motion.div>

                {/* Main content area */}
                <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card shadow-sm">
                    {/* Content - min-h prevents collapse during transitions */}
                    <div className="min-h-[400px] flex-1 overflow-y-auto p-6 md:p-10">
                        <AnimatePresence mode="wait">
                            {editingSection ? (
                                <motion.div
                                    key={editingSection}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderStepComponent(editingSection)}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ReviewStep data={wizard.data} errors={wizard.errors} onEditStep={handleEditSection} isEditMode />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer navigation */}
                    {editingSection ? (
                        <EditModeNavigation
                            sectionTitle={getStepTitle(editingSection)}
                            onCancel={handleCancel}
                            onDone={handleDoneEditing}
                            hasErrors={hasErrors}
                        />
                    ) : (
                        <div className="flex items-center justify-between rounded-b-2xl border-t border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
                            <Button variant="outline" onClick={handleCancel} className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={wizard.isSubmitting} className="gap-2">
                                <Save className="h-4 w-4" />
                                {wizard.isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </ManagerLayout>
    );
}
