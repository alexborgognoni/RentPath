import type { Property, PropertyFormData } from '@/types/dashboard';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Bold,
    Calendar,
    Camera,
    FileText,
    HousePlus,
    Italic,
    Link,
    List,
    ListOrdered,
    Upload,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PropertyFormProps {
    onClose: () => void;
    onSuccess?: (property: Property) => void;
}

interface FormData {
    title: string;
    house_number: string;
    street_name: string;
    street_line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    description: string;
    image_url: string;
    image_path: string;
    type: Property['type'];
    bedrooms: number;
    bathrooms: number;
    parking_spots: number;
    size: number;
    size_unit: Property['size_unit'];
    available_date: string;
    rent_amount: number | '';
    rent_currency: Property['rent_currency'];
    is_active: boolean;
}

const initialFormData: FormData = {
    title: '',
    house_number: '',
    street_name: '',
    street_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'CH',
    description: '',
    image_url: '',
    image_path: '',
    type: 'apartment',
    bedrooms: 0,
    bathrooms: 0,
    parking_spots: 0,
    size: 50,
    size_unit: 'square_meters',
    available_date: '',
    rent_amount: '',
    rent_currency: 'eur',
    is_active: true,
};

const propertyTypeOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'studio', label: 'Studio' },
    { value: 'loft', label: 'Loft' },
    { value: 'room', label: 'Room' },
    { value: 'office', label: 'Office' },
    { value: 'garage', label: 'Garage' },
    { value: 'storage', label: 'Storage' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'retail', label: 'Retail' },
    { value: 'commercial', label: 'Commercial' },
];

const currencyOptions = [
    { value: 'eur', label: 'Euro (€)', symbol: '€' },
    { value: 'usd', label: 'US Dollar ($)', symbol: '$' },
    { value: 'gbp', label: 'British Pound (£)', symbol: '£' },
    { value: 'chf', label: 'Swiss Franc (CHF)', symbol: 'CHF' },
];

const sizeUnitOptions = [
    { value: 'square_meters', label: 'Square Meters (m²)', symbol: 'm²' },
    { value: 'square_feet', label: 'Square Feet (ft²)', symbol: 'ft²' },
];

export function PropertyForm({ onClose, onSuccess }: PropertyFormProps) {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [hasChanges, setHasChanges] = useState(false);
    const [showDiscardDialog, setShowDiscardDialog] = useState(false);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    // Check for changes whenever formData changes
    useEffect(() => {
        const isChanged = Object.keys(formData).some((key) => {
            const currentValue = formData[key as keyof FormData];
            const initialValue = initialFormData[key as keyof FormData];
            return currentValue !== initialValue;
        }) || selectedImage !== null;
        setHasChanges(isChanged);
    }, [formData, selectedImage]);

    // Add escape key listener and disable body scroll
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };

        // Disable body scrolling
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEscape);
        
        return () => {
            // Re-enable body scrolling
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [hasChanges]);

    const handleCancel = () => {
        if (hasChanges) {
            setShowDiscardDialog(true);
        } else {
            onClose();
        }
    };

    const handleConfirmDiscard = () => {
        setShowDiscardDialog(false);
        onClose();
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Property title is required';
        }

        if (!formData.house_number.trim()) {
            newErrors.house_number = 'House number is required';
        }
        if (!formData.street_name.trim()) {
            newErrors.street_name = 'Street name is required';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!formData.postal_code.trim()) {
            newErrors.postal_code = 'Postal code is required';
        }
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        if (!formData.rent_amount || formData.rent_amount <= 0) {
            newErrors.rent_amount = 'Rent amount must be greater than 0';
        }

        if (formData.bedrooms < 0) {
            newErrors.bedrooms = 'Bedrooms cannot be negative';
        }

        if (formData.bathrooms < 0) {
            newErrors.bathrooms = 'Bathrooms cannot be negative';
        }

        if (formData.parking_spots < 0) {
            newErrors.parking_spots = 'Parking spots cannot be negative';
        }

        if (!formData.size || formData.size <= 0) {
            newErrors.size = 'Size is required and must be greater than 0';
        }

        if (formData.image_url && !isValidUrl(formData.image_url)) {
            newErrors.image_url = 'Please enter a valid image URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Upload image if selected
            let imagePath = formData.image_path;
            if (selectedImage) {
                try {
                    imagePath = await handleImageUpload();
                } catch (error) {
                    setImageError('Failed to upload image. Please try again.');
                    setIsSubmitting(false);
                    return;
                }
            }

            const submitData: PropertyFormData = {
                title: formData.title,
                house_number: formData.house_number,
                street_name: formData.street_name,
                street_line2: formData.street_line2 || undefined,
                city: formData.city,
                state: formData.state || undefined,
                postal_code: formData.postal_code,
                country: formData.country,
                description: formData.description,
                image_url: formData.image_url,
                image_path: imagePath || undefined,
                type: formData.type,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                parking_spots: formData.parking_spots,
                size: Number(formData.size),
                size_unit: formData.size_unit,
                available_date: formData.available_date || undefined,
                rent_amount: Number(formData.rent_amount),
                rent_currency: formData.rent_currency,
                is_active: formData.is_active,
            };

            router.post('/properties', submitData, {
                onSuccess: (page) => {
                    onClose();
                    // Refresh the page to show the new property
                    window.location.reload();
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            console.error('Error creating property:', error);
            setIsSubmitting(false);
        }
    };

    // Rich text formatting functions
    const applyFormatting = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        const editor = document.getElementById('description-editor') as HTMLDivElement;
        if (editor) {
            setFormData({ ...formData, description: editor.innerHTML });
        }
    };

    const insertLink = () => {
        const url = prompt('Enter the URL:');
        if (url) {
            applyFormatting('createLink', url);
            // Apply primary color to the new link
            setTimeout(() => {
                const editor = document.getElementById('description-editor') as HTMLDivElement;
                const links = editor.querySelectorAll('a');
                links.forEach(link => {
                    if (!link.classList.contains('text-primary')) {
                        link.classList.add('text-primary', 'hover:underline');
                    }
                });
                setFormData({ ...formData, description: editor.innerHTML });
            }, 100);
        }
    };

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        const content = e.currentTarget.innerHTML;
        setFormData({ ...formData, description: content });
    };

    const getCurrencySymbol = () => {
        return currencyOptions.find(c => c.value === formData.rent_currency)?.symbol || '€';
    };

    const getSizeUnitSymbol = () => {
        return sizeUnitOptions.find(u => u.value === formData.size_unit)?.symbol || 'm²';
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (limit to 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxSize) {
                setImageError('Image size too large. Please choose an image smaller than 10MB.');
                e.target.value = ''; // Clear the input
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                setImageError('Please select a valid image file.');
                e.target.value = '';
                return;
            }

            setSelectedImage(file);
            setImageError(null);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async (): Promise<string | null> => {
        if (!selectedImage) return null;

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await fetch('/api/images/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Upload failed:', response.status, errorText);
                throw new Error(`Upload failed with status ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.image_path) {
                return data.image_path;
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            throw error;
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setImageError(null);
        // Clear the file input
        const fileInput = document.getElementById('property-image') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
                {/* Header */}
                <div className="border-b border-border bg-card/95 p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center text-xl font-bold text-foreground">
                            <HousePlus className="mr-3 text-primary" size={24} />
                            Add New Property
                        </h2>
                        <button
                            onClick={handleCancel}
                            className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Property Image Upload */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Property Image
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    id="property-image"
                                />
                                {imagePreview ? (
                                    <div className="relative w-full h-64 rounded-xl overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="Property preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="p-2 rounded-full bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer"
                                            >
                                                <X size={16} />
                                            </button>
                                            <label
                                                htmlFor="property-image"
                                                className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
                                            >
                                                <Camera size={16} />
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="property-image"
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-all"
                                    >
                                        <div className="text-center">
                                            <Upload
                                                size={32}
                                                className="text-muted-foreground mx-auto mb-2"
                                            />
                                            <p className="text-foreground font-medium mb-1">
                                                Upload property image
                                            </p>
                                            <p className="text-muted-foreground text-sm">
                                                Click or drag an image here
                                            </p>
                                        </div>
                                    </label>
                                )}
                            </div>
                            {imageError && (
                                <p className="mt-1 text-sm text-destructive">{imageError}</p>
                            )}
                        </div>

                        {/* Property Title */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Property Title <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                placeholder="Enter property title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-destructive">{errors.title}</p>
                            )}
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-foreground">Address <span className="text-destructive">*</span></h3>
                            
                            {/* Street Address Row */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                        House Number <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.house_number}
                                        onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="123"
                                    />
                                    {errors.house_number && (
                                        <p className="mt-1 text-xs text-destructive">{errors.house_number}</p>
                                    )}
                                </div>
                                
                                <div className="sm:col-span-3">
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                        Street Name <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.street_name}
                                        onChange={(e) => setFormData({ ...formData, street_name: e.target.value })}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Main Street"
                                    />
                                    {errors.street_name && (
                                        <p className="mt-1 text-xs text-destructive">{errors.street_name}</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Optional Address Line 2 */}
                            <div>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                    Address Line 2 <span className="text-muted-foreground">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.street_line2}
                                    onChange={(e) => setFormData({ ...formData, street_line2: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Apartment, suite, unit, etc."
                                />
                            </div>
                            
                            {/* City, State, Postal Code Row */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                        City <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Zurich"
                                    />
                                    {errors.city && (
                                        <p className="mt-1 text-xs text-destructive">{errors.city}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                        State/Region <span className="text-muted-foreground">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="Canton"
                                    />
                                </div>
                                
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                        Postal Code <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.postal_code}
                                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="8001"
                                    />
                                    {errors.postal_code && (
                                        <p className="mt-1 text-xs text-destructive">{errors.postal_code}</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Country */}
                            <div className="sm:w-1/3">
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                    Country <span className="text-destructive">*</span>
                                </label>
                                <select
                                    required
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="CH">Switzerland</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                    <option value="AT">Austria</option>
                                    <option value="IT">Italy</option>
                                    <option value="US">United States</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="NL">Netherlands</option>
                                    <option value="BE">Belgium</option>
                                    <option value="ES">Spain</option>
                                </select>
                                {errors.country && (
                                    <p className="mt-1 text-xs text-destructive">{errors.country}</p>
                                )}
                            </div>
                        </div>

                        {/* Description with WYSIWYG Editor */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Description
                            </label>

                            {/* Formatting Toolbar */}
                            <div className="mb-2 flex items-center space-x-1 rounded-lg border border-border bg-background/50 p-1">
                                <button
                                    type="button"
                                    onClick={() => applyFormatting('bold')}
                                    className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Bold"
                                >
                                    <Bold size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyFormatting('italic')}
                                    className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Italic"
                                >
                                    <Italic size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyFormatting('insertUnorderedList')}
                                    className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Bullet List"
                                >
                                    <List size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyFormatting('insertOrderedList')}
                                    className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Numbered List"
                                >
                                    <ListOrdered size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={insertLink}
                                    className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    title="Insert Link"
                                >
                                    <Link size={16} />
                                </button>
                            </div>

                            {/* WYSIWYG Editor */}
                            <div
                                id="description-editor"
                                contentEditable
                                onInput={handleContentChange}
                                className="min-h-[168px] w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 [&_a]:text-primary [&_a]:hover:underline"
                                style={{ 
                                    overflowWrap: 'break-word',
                                    wordWrap: 'break-word'
                                }}
                                suppressContentEditableWarning={true}
                                dangerouslySetInnerHTML={{
                                    __html: formData.description || '<p class="text-muted-foreground">Describe your property...</p>'
                                }}
                            />
                        </div>

                        {/* Property Type */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Property Type <span className="text-destructive">*</span>
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as Property['type'] })}
                                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {propertyTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Property Details Grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Bedrooms <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={formData.bedrooms}
                                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                {errors.bedrooms && (
                                    <p className="mt-1 text-sm text-destructive">{errors.bedrooms}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Bathrooms <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    max="10"
                                    value={formData.bathrooms}
                                    onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || 0 })}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                {errors.bathrooms && (
                                    <p className="mt-1 text-sm text-destructive">{errors.bathrooms}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                    Parking Spots
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={formData.parking_spots}
                                    onChange={(e) => setFormData({ ...formData, parking_spots: parseInt(e.target.value) || 0 })}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                                {errors.parking_spots && (
                                    <p className="mt-1 text-sm text-destructive">{errors.parking_spots}</p>
                                )}
                            </div>
                        </div>

                        {/* Size with Unit */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Size <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="10000"
                                    step="0.01"
                                    value={formData.size}
                                    onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) || 0 })}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-28 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter size"
                                />
                                <div className="absolute right-1 top-1">
                                    <select
                                        value={formData.size_unit}
                                        onChange={(e) => setFormData({ ...formData, size_unit: e.target.value as Property['size_unit'] })}
                                        className="h-10 rounded-md border-0 bg-transparent pl-2 pr-1 text-sm text-foreground focus:outline-none focus:ring-0"
                                    >
                                        {sizeUnitOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.symbol}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {errors.size && (
                                <p className="mt-1 text-sm text-destructive">{errors.size}</p>
                            )}
                        </div>

                        {/* Monthly Rent */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Monthly Rent <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.rent_amount}
                                    onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-20 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="0.00"
                                />
                                <div className="absolute right-1 top-1">
                                    <select
                                        value={formData.rent_currency}
                                        onChange={(e) => setFormData({ ...formData, rent_currency: e.target.value as Property['rent_currency'] })}
                                        className="h-10 rounded-md border-0 bg-transparent pl-2 pr-1 text-sm text-foreground focus:outline-none focus:ring-0"
                                    >
                                        {currencyOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.symbol}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {errors.rent_amount && (
                                <p className="mt-1 text-sm text-destructive">{errors.rent_amount}</p>
                            )}
                        </div>

                        {/* Available Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Available Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.available_date}
                                    onChange={(e) => setFormData({ ...formData, available_date: e.target.value })}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="flex-1 cursor-pointer rounded-xl border border-border bg-background py-3 font-medium text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 cursor-pointer rounded-xl bg-gradient-to-r from-primary to-secondary py-3 font-medium text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Discard Changes Dialog */}
            {showDiscardDialog && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
                    >
                        <div className="text-center">
                            <h3 className="mb-2 text-lg font-medium text-foreground">
                                Discard Changes?
                            </h3>
                            <p className="mb-6 text-sm text-muted-foreground">
                                You have unsaved changes. Are you sure you want to discard them?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDiscardDialog(false)}
                                    className="flex-1 rounded-lg border border-border bg-background py-3 font-medium text-foreground transition-all hover:bg-muted"
                                >
                                    Keep Editing
                                </button>
                                <button
                                    onClick={handleConfirmDiscard}
                                    className="flex-1 rounded-lg bg-destructive py-3 font-medium text-white transition-all hover:bg-destructive/90"
                                >
                                    Discard
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
