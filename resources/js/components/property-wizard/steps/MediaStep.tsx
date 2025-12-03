import { StepContainer } from '@/components/property-wizard/components/StepContainer';
import type { PropertyWizardData } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { PROPERTY_CONSTRAINTS } from '@/lib/validation/property-validation';
import { motion, Reorder } from 'framer-motion';
import { Camera, GripVertical, ImagePlus, Star, Trash2, Upload } from 'lucide-react';
import { useCallback } from 'react';

interface MediaStepProps {
    data: PropertyWizardData;
    updateData: <K extends keyof PropertyWizardData>(key: K, value: PropertyWizardData[K]) => void;
    updateMultipleFields: (updates: Partial<PropertyWizardData>) => void;
    errors: Partial<Record<keyof PropertyWizardData, string>>;
    onBlur?: (field: keyof PropertyWizardData, value: unknown) => void;
}

export function MediaStep({ data, updateData, updateMultipleFields, errors, onBlur }: MediaStepProps) {
    const handleBlur = (field: keyof PropertyWizardData) => {
        if (onBlur) {
            onBlur(field, data[field]);
        }
    };

    const handleImageSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            if (files.length === 0) return;

            const newImages = [...data.images];
            const newPreviews = [...data.imagePreviews];

            files.forEach((file) => {
                if (!file.type.startsWith('image/')) return;
                if (file.size > PROPERTY_CONSTRAINTS.images.maxSizeBytes) return;

                newImages.push(file);

                const reader = new FileReader();
                reader.onload = (event) => {
                    newPreviews.push(event.target?.result as string);
                    updateMultipleFields({
                        images: [...newImages],
                        imagePreviews: [...newPreviews],
                    });
                };
                reader.readAsDataURL(file);
            });

            // Reset input
            e.target.value = '';
        },
        [data.images, data.imagePreviews, updateMultipleFields],
    );

    const handleRemoveImage = useCallback(
        (index: number) => {
            const newImages = data.images.filter((_, i) => i !== index);
            const newPreviews = data.imagePreviews.filter((_, i) => i !== index);

            let newMainIndex = data.mainImageIndex;
            if (index === data.mainImageIndex) {
                newMainIndex = 0;
            } else if (index < data.mainImageIndex) {
                newMainIndex = data.mainImageIndex - 1;
            }

            updateMultipleFields({
                images: newImages,
                imagePreviews: newPreviews,
                mainImageIndex: Math.min(newMainIndex, Math.max(0, newImages.length - 1)),
            });
        },
        [data.images, data.imagePreviews, data.mainImageIndex, updateMultipleFields],
    );

    const handleSetMainImage = useCallback(
        (index: number) => {
            updateData('mainImageIndex', index);
        },
        [updateData],
    );

    const handleReorder = useCallback(
        (newOrder: string[]) => {
            // Find the new positions based on preview URLs
            const newImages: File[] = [];
            const newPreviews: string[] = [];
            let newMainIndex = 0;

            newOrder.forEach((preview, newIndex) => {
                const oldIndex = data.imagePreviews.indexOf(preview);
                if (oldIndex !== -1) {
                    newImages.push(data.images[oldIndex]);
                    newPreviews.push(preview);
                    if (oldIndex === data.mainImageIndex) {
                        newMainIndex = newIndex;
                    }
                }
            });

            updateMultipleFields({
                images: newImages,
                imagePreviews: newPreviews,
                mainImageIndex: newMainIndex,
            });
        },
        [data.images, data.imagePreviews, data.mainImageIndex, updateMultipleFields],
    );

    const inputClassName = (hasError: boolean) =>
        cn(
            'w-full rounded-xl border-2 bg-background px-4 py-3 text-foreground shadow-sm transition-all',
            'placeholder:text-muted-foreground/60',
            'focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none',
            hasError ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary/30',
        );

    return (
        <StepContainer title="Make it shine" description="Great photos and a compelling title attract more applicants">
            <div className="mx-auto max-w-3xl">
                {/* Title Input - Hero style */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <label htmlFor="title" className="mb-2 block text-center text-sm font-medium text-foreground">
                        Property Title <span className="text-destructive">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={data.title}
                        onChange={(e) => updateData('title', e.target.value)}
                        onBlur={() => handleBlur('title')}
                        className={cn(inputClassName(!!errors.title), 'text-center text-lg font-medium')}
                        placeholder="e.g., Sunny 2BR Apartment with Balcony in City Center"
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
                        Description <span className="text-xs text-muted-foreground">(optional but recommended)</span>
                    </label>
                    <textarea
                        id="description"
                        value={data.description || ''}
                        onChange={(e) => updateData('description', e.target.value)}
                        onBlur={() => handleBlur('description')}
                        rows={4}
                        className={cn(inputClassName(!!errors.description), 'resize-none')}
                        placeholder="Describe what makes your property special. Mention nearby amenities, transport links, and anything else tenants should know..."
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
                        Property Photos
                    </h3>

                    <input
                        type="file"
                        accept={PROPERTY_CONSTRAINTS.images.allowedTypes.join(',')}
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        id="property-images"
                    />

                    {data.imagePreviews.length > 0 ? (
                        <div className="space-y-4">
                            {/* Draggable image grid */}
                            <Reorder.Group
                                axis="x"
                                values={data.imagePreviews}
                                onReorder={handleReorder}
                                className="grid grid-cols-2 gap-4 md:grid-cols-3"
                            >
                                {data.imagePreviews.map((preview, index) => (
                                    <Reorder.Item
                                        key={preview}
                                        value={preview}
                                        className="group relative aspect-[4/3] cursor-grab overflow-hidden rounded-xl active:cursor-grabbing"
                                    >
                                        <img src={preview} alt={`Property image ${index + 1}`} className="h-full w-full object-cover" />

                                        {/* Overlay controls */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                                        {/* Drag handle */}
                                        <div className="absolute top-2 left-2 rounded-lg bg-black/50 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                            <GripVertical className="h-4 w-4" />
                                        </div>

                                        {/* Main badge */}
                                        {data.mainImageIndex === index && (
                                            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                                                <Star className="h-3 w-3 fill-current" />
                                                Main
                                            </div>
                                        )}

                                        {/* Action buttons */}
                                        <div className="absolute right-2 bottom-2 left-2 flex justify-between opacity-0 transition-opacity group-hover:opacity-100">
                                            {data.mainImageIndex !== index && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetMainImage(index)}
                                                    className="flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-white"
                                                >
                                                    <Star className="h-3 w-3" />
                                                    Set as main
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="ml-auto rounded-lg bg-destructive p-2 text-white transition-colors hover:bg-destructive/90"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </Reorder.Item>
                                ))}

                                {/* Add more button */}
                                {data.imagePreviews.length < PROPERTY_CONSTRAINTS.images.maxCount && (
                                    <label
                                        htmlFor="property-images"
                                        className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 transition-all hover:border-primary/50 hover:bg-muted/50"
                                    >
                                        <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">Add more</span>
                                    </label>
                                )}
                            </Reorder.Group>

                            <p className="text-center text-xs text-muted-foreground">
                                Drag to reorder. The first image will be your main photo. ({data.imagePreviews.length}/
                                {PROPERTY_CONSTRAINTS.images.maxCount})
                            </p>
                        </div>
                    ) : (
                        <label
                            htmlFor="property-images"
                            className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 transition-all hover:border-primary/50 hover:bg-muted/50"
                        >
                            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="mb-1 font-medium text-foreground">Upload property photos</p>
                            <p className="text-sm text-muted-foreground">Click or drag images here</p>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Max {PROPERTY_CONSTRAINTS.images.maxSizeBytes / (1024 * 1024)}MB per image • JPG, PNG, WebP
                            </p>
                        </label>
                    )}
                </motion.div>
            </div>
        </StepContainer>
    );
}
