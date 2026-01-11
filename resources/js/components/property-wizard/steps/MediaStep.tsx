import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData, WizardImage } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { PROPERTY_CONSTRAINTS } from '@/lib/validation/property-validation';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion, Reorder } from 'framer-motion';
import { Camera, ImagePlus, Star, Trash2, Upload } from 'lucide-react';
import { useCallback } from 'react';

interface MediaStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    updateMultipleFields: (updates: Partial<PropertyWizardData>) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
    onBlur?: (field: keyof PropertyWizardData, value: unknown) => void;
}

export function MediaStep({ data, updateData, updateMultipleFields, errors, onBlur }: MediaStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string, params?: Record<string, string | number>) => translate(translations, key, params);

    const handleBlur = (field: keyof PropertyWizardData) => {
        if (onBlur) {
            onBlur(field, data[field]);
        }
    };

    // Check if an image is the main image
    const isMainImage = useCallback(
        (image: WizardImage, index: number): boolean => {
            if (image.id !== null && data.mainImageId !== null) {
                return image.id === data.mainImageId;
            }
            return index === data.mainImageIndex;
        },
        [data.mainImageId, data.mainImageIndex],
    );

    const handleImageSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;

            // Process files and add them one by one as they're read
            files.forEach((file) => {
                if (!file.type.startsWith('image/')) return;
                if (file.size > PROPERTY_CONSTRAINTS.images.maxSizeBytes) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const newImage: WizardImage = {
                        id: null,
                        file: file,
                        image_url: event.target?.result as string,
                    };

                    // Use functional update to handle async reads
                    updateMultipleFields({
                        images: [...data.images, newImage],
                        // If this is the first image, set it as main
                        ...(data.images.length === 0 ? { mainImageIndex: 0 } : {}),
                    });
                };
                reader.readAsDataURL(file);
            });

            // Reset input
            e.target.value = '';
        },
        [data.images, updateMultipleFields],
    );

    const handleRemoveImage = useCallback(
        (index: number) => {
            const imageToRemove = data.images[index];
            const newImages = data.images.filter((_, i) => i !== index);

            // Track deleted existing images (those with an ID)
            const newDeletedIds = [...data.deletedImageIds];
            if (imageToRemove.id !== null) {
                newDeletedIds.push(imageToRemove.id);
            }

            // Update main image tracking
            let newMainImageId = data.mainImageId;
            let newMainImageIndex = data.mainImageIndex;

            // If we're removing the main image, reset to first image
            if (isMainImage(imageToRemove, index)) {
                if (newImages.length > 0) {
                    newMainImageId = newImages[0].id;
                    newMainImageIndex = 0;
                } else {
                    newMainImageId = null;
                    newMainImageIndex = 0;
                }
            } else if (index < data.mainImageIndex) {
                // Adjust index if we removed an image before the main one
                newMainImageIndex = data.mainImageIndex - 1;
            }

            updateMultipleFields({
                images: newImages,
                deletedImageIds: newDeletedIds,
                mainImageId: newMainImageId,
                mainImageIndex: Math.max(0, Math.min(newMainImageIndex, newImages.length - 1)),
            });
        },
        [data.images, data.deletedImageIds, data.mainImageId, data.mainImageIndex, updateMultipleFields, isMainImage],
    );

    const handleSetMainImage = useCallback(
        (index: number) => {
            const image = data.images[index];
            updateMultipleFields({
                mainImageId: image.id,
                mainImageIndex: index,
            });
        },
        [data.images, updateMultipleFields],
    );

    const handleReorder = useCallback(
        (newOrder: WizardImage[]) => {
            // Find the new index of the main image
            const currentMainImage = data.images.find((img, idx) => isMainImage(img, idx));
            const newMainIndex = currentMainImage ? newOrder.indexOf(currentMainImage) : 0;

            updateMultipleFields({
                images: newOrder,
                mainImageIndex: newMainIndex >= 0 ? newMainIndex : 0,
            });
        },
        [data.images, updateMultipleFields, isMainImage],
    );

    const inputClassName = (hasError: boolean) =>
        cn(
            'w-full rounded-xl border-2 bg-background px-4 py-3 text-foreground shadow-sm transition-all',
            'placeholder:text-muted-foreground/60',
            'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
            hasError ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary/30',
        );

    return (
        <StepContainer title={t('wizard.mediaStep.title')} description={t('wizard.mediaStep.description')}>
            <div className="mx-auto max-w-3xl">
                {/* Title Input - Hero style */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <label htmlFor="title" className="mb-2 block text-center text-sm font-medium text-foreground">
                        {t('wizard.mediaStep.propertyTitle')} <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={data.title}
                        onChange={(e) => updateData('title', e.target.value)}
                        onBlur={() => handleBlur('title')}
                        className={cn(inputClassName(!!errors.title), 'text-center text-lg font-medium')}
                        placeholder={t('wizard.mediaStep.titlePlaceholder')}
                        maxLength={PROPERTY_CONSTRAINTS.title.maxLength}
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? 'title-error' : undefined}
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {errors.title && (
                                <span id="title-error" className="text-destructive">
                                    {errors.title}
                                </span>
                            )}
                        </span>
                        <span>
                            {data.title.length}/{PROPERTY_CONSTRAINTS.title.maxLength}
                        </span>
                    </div>
                </motion.div>

                {/* Description */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
                    <label htmlFor="description" className="mb-2 block text-center text-sm font-medium text-foreground">
                        {t('wizard.mediaStep.descriptionLabel')}{' '}
                        <span className="text-xs text-muted-foreground">({t('wizard.mediaStep.descriptionOptional')})</span>
                    </label>
                    <textarea
                        id="description"
                        value={data.description || ''}
                        onChange={(e) => updateData('description', e.target.value)}
                        onBlur={() => handleBlur('description')}
                        rows={4}
                        className={cn(inputClassName(!!errors.description), 'resize-none')}
                        placeholder={t('wizard.mediaStep.descriptionPlaceholder')}
                        maxLength={PROPERTY_CONSTRAINTS.description.maxLength}
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{errors.description && <span className="text-destructive">{errors.description}</span>}</span>
                        <span>
                            {(data.description || '').length}/{PROPERTY_CONSTRAINTS.description.maxLength.toLocaleString()}
                        </span>
                    </div>
                </motion.div>

                {/* Photo Upload */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-medium text-foreground">
                        <Camera className="h-5 w-5 text-primary" />
                        {t('wizard.mediaStep.propertyPhotos')}
                    </h3>

                    <input
                        type="file"
                        accept={PROPERTY_CONSTRAINTS.images.allowedTypes.join(',')}
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        id="property-images"
                    />

                    {data.images.length > 0 ? (
                        <div className="space-y-4">
                            {/* Draggable image grid */}
                            <Reorder.Group axis="x" values={data.images} onReorder={handleReorder} className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {data.images.map((image, index) => (
                                    <Reorder.Item
                                        key={image.id !== null ? `existing-${image.id}` : `new-${image.image_url}`}
                                        value={image}
                                        className="group relative aspect-[4/3] cursor-grab overflow-hidden rounded-xl active:cursor-grabbing"
                                    >
                                        <img src={image.image_url} alt={`Property image ${index + 1}`} className="h-full w-full object-cover" />

                                        {/* Overlay controls */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs font-medium text-white">
                                                {index + 1}
                                            </div>
                                            {isMainImage(image, index) && (
                                                <div className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    {t('wizard.mediaStep.main')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Delete button */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 cursor-pointer rounded-lg bg-destructive p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/90"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>

                                        {/* Set as main button */}
                                        {!isMainImage(image, index) && (
                                            <div className="absolute right-2 bottom-2 left-2 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetMainImage(index)}
                                                    className="flex cursor-pointer items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-white"
                                                >
                                                    <Star className="h-3 w-3" />
                                                    {t('wizard.mediaStep.setAsMain')}
                                                </button>
                                            </div>
                                        )}
                                    </Reorder.Item>
                                ))}

                                {/* Add more button */}
                                {data.images.length < PROPERTY_CONSTRAINTS.images.maxCount && (
                                    <label
                                        htmlFor="property-images"
                                        className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all hover:border-primary/50 hover:bg-muted/50"
                                    >
                                        <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">{t('wizard.mediaStep.addMore')}</span>
                                    </label>
                                )}
                            </Reorder.Group>

                            <p className="text-center text-xs text-muted-foreground">
                                {t('wizard.mediaStep.dragToReorder')} ({data.images.length}/{PROPERTY_CONSTRAINTS.images.maxCount})
                            </p>
                        </div>
                    ) : (
                        <label
                            htmlFor="property-images"
                            className={cn(
                                'flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/30 transition-all hover:border-primary/50 hover:bg-muted/50',
                                errors.images ? 'border-destructive bg-destructive/5' : 'border-border',
                            )}
                        >
                            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="mb-1 font-medium text-foreground">{t('wizard.mediaStep.uploadPhotos')}</p>
                            <p className="text-sm text-muted-foreground">{t('wizard.mediaStep.clickOrDrag')}</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {t('wizard.mediaStep.maxSize', { size: PROPERTY_CONSTRAINTS.images.maxSizeBytes / (1024 * 1024) })} •{' '}
                                {t('wizard.mediaStep.allowedFormats')}
                            </p>
                        </label>
                    )}
                    {errors.images && <p className="mt-3 text-center text-sm text-destructive">{errors.images}</p>}
                </motion.div>
            </div>
        </StepContainer>
    );
}
