import { AppLayout } from '@/layouts/app-layout';
import type { Property, PropertyFormData } from '@/types/dashboard';
import { type SharedData } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Building, Home, Upload, X, Camera, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PropertyCreateProps {
    property?: Property;
    isEditing?: boolean;
}

export default function PropertyCreate({ property, isEditing = false }: PropertyCreateProps) {
    const { translations } = usePage<SharedData>().props;
    const [clientErrors, setClientErrors] = useState<{[key: string]: string}>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState<number>(0);
    const [subtypeOptions, setSubtypeOptions] = useState<{value: string; label: string}[]>([]);

    const { data, setData, post, put, processing, errors, progress } = useForm<PropertyFormData>({
        // Basic info
        title: property?.title || '',
        description: property?.description || '',

        // Address
        house_number: property?.house_number || '',
        street_name: property?.street_name || '',
        street_line2: property?.street_line2 || '',
        city: property?.city || '',
        state: property?.state || '',
        postal_code: property?.postal_code || '',
        country: property?.country || 'CH',

        // Type
        type: property?.type || 'apartment',
        subtype: property?.subtype || 'studio',

        // Specifications
        bedrooms: property?.bedrooms || 0,
        bathrooms: property?.bathrooms || 0,
        parking_spots_interior: property?.parking_spots_interior || 0,
        parking_spots_exterior: property?.parking_spots_exterior || 0,
        size: property?.size || undefined,
        balcony_size: property?.balcony_size || undefined,
        land_size: property?.land_size || undefined,
        floor_level: property?.floor_level || undefined,
        has_elevator: property?.has_elevator || false,
        year_built: property?.year_built || undefined,

        // Energy/Building
        energy_class: property?.energy_class || undefined,
        thermal_insulation_class: property?.thermal_insulation_class || undefined,
        heating_type: property?.heating_type || undefined,

        // Kitchen
        kitchen_equipped: property?.kitchen_equipped || false,
        kitchen_separated: property?.kitchen_separated || false,

        // Amenities
        has_cellar: property?.has_cellar || false,
        has_laundry: property?.has_laundry || false,
        has_fireplace: property?.has_fireplace || false,
        has_air_conditioning: property?.has_air_conditioning || false,
        has_garden: property?.has_garden || false,
        has_rooftop: property?.has_rooftop || false,
        extras: property?.extras || undefined,

        // Rental
        rent_amount: property?.rent_amount || 0,
        rent_currency: property?.rent_currency || 'eur',
        available_date: property?.available_date || undefined,

        // Images
        images: undefined,
        main_image_index: 0,
    });

    // Property type and subtype options
    const propertyTypeOptions = [
        { value: 'apartment', label: 'Apartment' },
        { value: 'house', label: 'House' },
        { value: 'room', label: 'Room' },
        { value: 'commercial', label: 'Commercial' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'parking', label: 'Parking' },
    ];

    const propertySubtypes: {[key: string]: {value: string; label: string}[]} = {
        apartment: [
            { value: 'studio', label: 'Studio' },
            { value: 'loft', label: 'Loft' },
            { value: 'duplex', label: 'Duplex' },
            { value: 'triplex', label: 'Triplex' },
            { value: 'penthouse', label: 'Penthouse' },
            { value: 'serviced', label: 'Serviced' },
        ],
        house: [
            { value: 'detached', label: 'Detached' },
            { value: 'semi-detached', label: 'Semi-detached' },
            { value: 'villa', label: 'Villa' },
            { value: 'bungalow', label: 'Bungalow' },
        ],
        room: [
            { value: 'private_room', label: 'Private Room' },
            { value: 'student_room', label: 'Student Room' },
            { value: 'co-living', label: 'Co-living' },
        ],
        commercial: [
            { value: 'office', label: 'Office' },
            { value: 'retail', label: 'Retail' },
        ],
        industrial: [
            { value: 'warehouse', label: 'Warehouse' },
            { value: 'factory', label: 'Factory' },
        ],
        parking: [
            { value: 'garage', label: 'Garage' },
            { value: 'indoor_spot', label: 'Indoor Spot' },
            { value: 'outdoor_spot', label: 'Outdoor Spot' },
        ],
    };

    const currencyOptions = [
        { value: 'eur', label: 'Euro (€)', symbol: '€' },
        { value: 'usd', label: 'US Dollar ($)', symbol: '$' },
        { value: 'gbp', label: 'British Pound (£)', symbol: '£' },
        { value: 'chf', label: 'Swiss Franc (CHF)', symbol: 'CHF' },
    ];

    const energyClassOptions = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const heatingTypeOptions = [
        { value: 'gas', label: 'Gas' },
        { value: 'electric', label: 'Electric' },
        { value: 'district', label: 'District Heating' },
        { value: 'wood', label: 'Wood' },
        { value: 'heat_pump', label: 'Heat Pump' },
        { value: 'other', label: 'Other' },
    ];

    // Update subtypes when type changes
    useEffect(() => {
        const options = propertySubtypes[data.type] || [];
        setSubtypeOptions(options);
        if (options.length > 0 && !options.find(o => o.value === data.subtype)) {
            setData('subtype', options[0].value as any);
        }
    }, [data.type]);

    const clearFieldError = (fieldName: string) => {
        if (clientErrors[fieldName]) {
            setClientErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newImages = [...selectedImages];
        const newPreviews = [...imagePreviews];

        files.forEach(file => {
            // Check file type
            if (!file.type.startsWith('image/')) {
                setGeneralError('Please select only image files.');
                return;
            }

            // Check file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setGeneralError('Each image must be smaller than 10MB.');
                return;
            }

            newImages.push(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target?.result as string);
                setImagePreviews([...newPreviews]);
            };
            reader.readAsDataURL(file);
        });

        setSelectedImages(newImages);
        setData('images', newImages);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        setData('images', newImages);

        // Adjust main image index if needed
        if (mainImageIndex >= newImages.length) {
            setMainImageIndex(Math.max(0, newImages.length - 1));
            setData('main_image_index', Math.max(0, newImages.length - 1));
        }
    };

    const handleSetMainImage = (index: number) => {
        setMainImageIndex(index);
        setData('main_image_index', index);
    };

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        // Required fields
        if (!data.title?.trim()) {
            newErrors.title = 'Property title is required';
        }
        if (!data.house_number?.trim()) {
            newErrors.house_number = 'House number is required';
        }
        if (!data.street_name?.trim()) {
            newErrors.street_name = 'Street name is required';
        }
        if (!data.city?.trim()) {
            newErrors.city = 'City is required';
        }
        if (!data.postal_code?.trim()) {
            newErrors.postal_code = 'Postal code is required';
        }
        if (!data.country?.trim()) {
            newErrors.country = 'Country is required';
        }
        if (!data.type) {
            newErrors.type = 'Property type is required';
        }
        if (!data.subtype) {
            newErrors.subtype = 'Property subtype is required';
        }
        if (!data.rent_amount || data.rent_amount <= 0) {
            newErrors.rent_amount = 'Rent amount must be greater than 0';
        }

        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setGeneralError(null);

        const formData = new FormData();

        // Add all form fields
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof PropertyFormData];
            if (value !== undefined && value !== null && key !== 'images') {
                if (typeof value === 'boolean') {
                    formData.append(key, value ? '1' : '0');
                } else if (typeof value === 'object' && !Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        // Add images
        selectedImages.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });
        formData.append('main_image_index', String(mainImageIndex));

        const endpoint = isEditing ? `/properties/${property?.id}` : '/properties';
        const method = isEditing ? 'put' : 'post';

        router[method](endpoint, formData as any, {
            forceFormData: true,
            onError: (errors) => {
                console.error('Submission errors:', errors);
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    setGeneralError(errorMessages.join(' '));
                } else {
                    setGeneralError('An unexpected error occurred. Please try again.');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onSuccess: () => {
                setGeneralError(null);
            },
        });
    };

    const getFieldClassName = (fieldName: string) => {
        const baseClass = 'w-full rounded-lg border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20';
        if (clientErrors[fieldName] || errors[fieldName]) {
            return baseClass + ' border-destructive bg-destructive/5 focus:border-destructive';
        }
        return baseClass + ' border-border bg-background focus:border-primary';
    };

    return (
        <AppLayout>
            <Head title={isEditing ? 'Edit Property' : 'Add New Property'} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 mb-6 sm:rounded-2xl sm:border sm:border-border sm:bg-card sm:p-8 sm:shadow-lg"
            >
                        <div className="mb-8">
                            <h1 className="mb-2 text-3xl font-bold text-foreground flex items-center gap-3">
                                <Home className="text-primary" size={32} />
                                {isEditing ? 'Edit Property' : 'Add New Property'}
                            </h1>
                            <p className="text-muted-foreground">
                                {isEditing
                                    ? 'Update your property details below'
                                    : 'Fill in the details to list your property'}
                            </p>

                            {/* Error Banner */}
                            {generalError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-6"
                                >
                                    <Alert variant="destructive" className="relative">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{generalError}</AlertDescription>
                                        <button
                                            onClick={() => setGeneralError(null)}
                                            className="absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </Alert>
                                </motion.div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                            {/* Images Section */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    Property Images
                                </h2>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Upload Images
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        id="property-images"
                                    />

                                    {imagePreviews.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Property image ${index + 1}`}
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                    <div className="absolute top-2 right-2 flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="p-2 rounded-full bg-destructive text-white hover:bg-destructive/90 transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    {mainImageIndex === index && (
                                                        <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-medium">
                                                            Main
                                                        </div>
                                                    )}
                                                    {mainImageIndex !== index && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetMainImage(index)}
                                                            className="absolute bottom-2 left-2 right-2 bg-background/90 text-foreground px-3 py-1.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                        >
                                                            Set as Main
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <label
                                                htmlFor="property-images"
                                                className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                                            >
                                                <Camera size={32} className="text-muted-foreground mb-2" />
                                                <span className="text-sm text-muted-foreground">Add More</span>
                                            </label>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="property-images"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-all"
                                        >
                                            <Upload size={48} className="text-muted-foreground mb-4" />
                                            <p className="text-foreground font-medium mb-1">Upload property images</p>
                                            <p className="text-muted-foreground text-sm">Click or drag images here</p>
                                            <p className="text-muted-foreground text-xs mt-2">Max 10MB per image</p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    Basic Information
                                </h2>

                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                                        Property Title <span className="text-destructive">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => {
                                            setData('title', e.target.value);
                                            clearFieldError('title');
                                        }}
                                        className={getFieldClassName('title')}
                                        placeholder="e.g., Modern 2BR Apartment in City Center"
                                    />
                                    {(clientErrors.title || errors.title) && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {clientErrors.title || errors.title}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => {
                                            setData('description', e.target.value);
                                            clearFieldError('description');
                                        }}
                                        rows={6}
                                        className={getFieldClassName('description')}
                                        placeholder="Describe your property..."
                                    />
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    Property Type
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
                                            Type <span className="text-destructive">*</span>
                                        </label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => {
                                                setData('type', e.target.value as any);
                                                clearFieldError('type');
                                            }}
                                            className={getFieldClassName('type')}
                                        >
                                            {propertyTypeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {(clientErrors.type || errors.type) && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {clientErrors.type || errors.type}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="subtype" className="block text-sm font-medium text-foreground mb-2">
                                            Subtype <span className="text-destructive">*</span>
                                        </label>
                                        <select
                                            id="subtype"
                                            value={data.subtype}
                                            onChange={(e) => {
                                                setData('subtype', e.target.value as any);
                                                clearFieldError('subtype');
                                            }}
                                            className={getFieldClassName('subtype')}
                                        >
                                            {subtypeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {(clientErrors.subtype || errors.subtype) && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {clientErrors.subtype || errors.subtype}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    Address
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-1">
                                        <label htmlFor="house_number" className="block text-sm font-medium text-foreground mb-2">
                                            Number <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="house_number"
                                            value={data.house_number}
                                            onChange={(e) => {
                                                setData('house_number', e.target.value);
                                                clearFieldError('house_number');
                                            }}
                                            className={getFieldClassName('house_number')}
                                            placeholder="123"
                                        />
                                        {(clientErrors.house_number || errors.house_number) && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {clientErrors.house_number || errors.house_number}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-3">
                                        <label htmlFor="street_name" className="block text-sm font-medium text-foreground mb-2">
                                            Street Name <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="street_name"
                                            value={data.street_name}
                                            onChange={(e) => {
                                                setData('street_name', e.target.value);
                                                clearFieldError('street_name');
                                            }}
                                            className={getFieldClassName('street_name')}
                                            placeholder="Main Street"
                                        />
                                        {(clientErrors.street_name || errors.street_name) && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {clientErrors.street_name || errors.street_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="street_line2" className="block text-sm font-medium text-foreground mb-2">
                                        Address Line 2 <span className="text-muted-foreground text-xs">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="street_line2"
                                        value={data.street_line2}
                                        onChange={(e) => setData('street_line2', e.target.value)}
                                        className={getFieldClassName('street_line2')}
                                        placeholder="Apartment, suite, unit, etc."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
                                            City <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => {
                                                setData('city', e.target.value);
                                                clearFieldError('city');
                                            }}
                                            className={getFieldClassName('city')}
                                            placeholder="Zurich"
                                        />
                                        {(clientErrors.city || errors.city) && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {clientErrors.city || errors.city}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-foreground mb-2">
                                            State/Region <span className="text-muted-foreground text-xs">(Optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            className={getFieldClassName('state')}
                                            placeholder="Canton"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="postal_code" className="block text-sm font-medium text-foreground mb-2">
                                            Postal Code <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="postal_code"
                                            value={data.postal_code}
                                            onChange={(e) => {
                                                setData('postal_code', e.target.value);
                                                clearFieldError('postal_code');
                                            }}
                                            className={getFieldClassName('postal_code')}
                                            placeholder="8001"
                                        />
                                        {(clientErrors.postal_code || errors.postal_code) && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {clientErrors.postal_code || errors.postal_code}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="md:w-1/3">
                                    <label htmlFor="country" className="block text-sm font-medium text-foreground mb-2">
                                        Country <span className="text-destructive">*</span>
                                    </label>
                                    <select
                                        id="country"
                                        value={data.country}
                                        onChange={(e) => {
                                            setData('country', e.target.value);
                                            clearFieldError('country');
                                        }}
                                        className={getFieldClassName('country')}
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
                                    {(clientErrors.country || errors.country) && (
                                        <p className="mt-1 text-sm text-destructive">
                                            {clientErrors.country || errors.country}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Property Specifications */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    Specifications
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label htmlFor="bedrooms" className="block text-sm font-medium text-foreground mb-2">
                                            Bedrooms
                                        </label>
                                        <input
                                            type="number"
                                            id="bedrooms"
                                            min="0"
                                            value={data.bedrooms}
                                            onChange={(e) => setData('bedrooms', parseInt(e.target.value) || 0)}
                                            className={getFieldClassName('bedrooms')}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="bathrooms" className="block text-sm font-medium text-foreground mb-2">
                                            Bathrooms
                                        </label>
                                        <input
                                            type="number"
                                            id="bathrooms"
                                            min="0"
                                            step="0.5"
                                            value={data.bathrooms}
                                            onChange={(e) => setData('bathrooms', parseFloat(e.target.value) || 0)}
                                            className={getFieldClassName('bathrooms')}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="parking_spots_interior" className="block text-sm font-medium text-foreground mb-2">
                                            Indoor Parking
                                        </label>
                                        <input
                                            type="number"
                                            id="parking_spots_interior"
                                            min="0"
                                            value={data.parking_spots_interior}
                                            onChange={(e) => setData('parking_spots_interior', parseInt(e.target.value) || 0)}
                                            className={getFieldClassName('parking_spots_interior')}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="parking_spots_exterior" className="block text-sm font-medium text-foreground mb-2">
                                            Outdoor Parking
                                        </label>
                                        <input
                                            type="number"
                                            id="parking_spots_exterior"
                                            min="0"
                                            value={data.parking_spots_exterior}
                                            onChange={(e) => setData('parking_spots_exterior', parseInt(e.target.value) || 0)}
                                            className={getFieldClassName('parking_spots_exterior')}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="size" className="block text-sm font-medium text-foreground mb-2">
                                            Size (m²)
                                        </label>
                                        <input
                                            type="number"
                                            id="size"
                                            min="0"
                                            step="0.01"
                                            value={data.size || ''}
                                            onChange={(e) => setData('size', parseFloat(e.target.value) || undefined)}
                                            className={getFieldClassName('size')}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="balcony_size" className="block text-sm font-medium text-foreground mb-2">
                                            Balcony Size (m²)
                                        </label>
                                        <input
                                            type="number"
                                            id="balcony_size"
                                            min="0"
                                            step="0.01"
                                            value={data.balcony_size || ''}
                                            onChange={(e) => setData('balcony_size', parseFloat(e.target.value) || undefined)}
                                            className={getFieldClassName('balcony_size')}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="land_size" className="block text-sm font-medium text-foreground mb-2">
                                            Land Size (m²) <span className="text-muted-foreground text-xs">(For houses)</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="land_size"
                                            min="0"
                                            step="0.01"
                                            value={data.land_size || ''}
                                            onChange={(e) => setData('land_size', parseFloat(e.target.value) || undefined)}
                                            className={getFieldClassName('land_size')}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="floor_level" className="block text-sm font-medium text-foreground mb-2">
                                            Floor Level
                                        </label>
                                        <input
                                            type="number"
                                            id="floor_level"
                                            value={data.floor_level || ''}
                                            onChange={(e) => setData('floor_level', parseInt(e.target.value) || undefined)}
                                            className={getFieldClassName('floor_level')}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="year_built" className="block text-sm font-medium text-foreground mb-2">
                                            Year Built
                                        </label>
                                        <input
                                            type="number"
                                            id="year_built"
                                            min="1800"
                                            max={new Date().getFullYear()}
                                            value={data.year_built || ''}
                                            onChange={(e) => setData('year_built', parseInt(e.target.value) || undefined)}
                                            className={getFieldClassName('year_built')}
                                            placeholder="2020"
                                        />
                                    </div>

                                    <div className="flex items-center pt-8">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.has_elevator}
                                                onChange={(e) => setData('has_elevator', e.target.checked)}
                                                className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                            />
                                            <span className="text-sm font-medium text-foreground">Has Elevator</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Energy & Building */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    Energy & Building
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="energy_class" className="block text-sm font-medium text-foreground mb-2">
                                            Energy Class
                                        </label>
                                        <select
                                            id="energy_class"
                                            value={data.energy_class || ''}
                                            onChange={(e) => setData('energy_class', e.target.value as any || undefined)}
                                            className={getFieldClassName('energy_class')}
                                        >
                                            <option value="">Not specified</option>
                                            {energyClassOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="thermal_insulation_class" className="block text-sm font-medium text-foreground mb-2">
                                            Thermal Insulation
                                        </label>
                                        <select
                                            id="thermal_insulation_class"
                                            value={data.thermal_insulation_class || ''}
                                            onChange={(e) => setData('thermal_insulation_class', e.target.value as any || undefined)}
                                            className={getFieldClassName('thermal_insulation_class')}
                                        >
                                            <option value="">Not specified</option>
                                            {energyClassOptions.filter(o => o !== 'A+').map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="heating_type" className="block text-sm font-medium text-foreground mb-2">
                                            Heating Type
                                        </label>
                                        <select
                                            id="heating_type"
                                            value={data.heating_type || ''}
                                            onChange={(e) => setData('heating_type', e.target.value as any || undefined)}
                                            className={getFieldClassName('heating_type')}
                                        >
                                            <option value="">Not specified</option>
                                            {heatingTypeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Kitchen & Amenities */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    Kitchen & Amenities
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.kitchen_equipped}
                                            onChange={(e) => setData('kitchen_equipped', e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-foreground">Kitchen Equipped</span>
                                    </label>

                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.kitchen_separated}
                                            onChange={(e) => setData('kitchen_separated', e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-foreground">Separate Kitchen</span>
                                    </label>

                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.has_cellar}
                                            onChange={(e) => setData('has_cellar', e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-foreground">Cellar</span>
                                    </label>

                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.has_laundry}
                                            onChange={(e) => setData('has_laundry', e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-foreground">Laundry</span>
                                    </label>

                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.has_fireplace}
                                            onChange={(e) => setData('has_fireplace', e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-foreground">Fireplace</span>
                                    </label>

                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.has_air_conditioning}
                                            onChange={(e) => setData('has_air_conditioning', e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-foreground">Air Conditioning</span>
                                    </label>

                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.has_garden}
                                            onChange={(e) => setData('has_garden', e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-foreground">Garden</span>
                                    </label>

                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.has_rooftop}
                                            onChange={(e) => setData('has_rooftop', e.target.checked)}
                                            className="mr-2 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-foreground">Rooftop Access</span>
                                    </label>
                                </div>
                            </div>

                            {/* Rental Information */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                                    Rental Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="rent_amount" className="block text-sm font-medium text-foreground mb-2">
                                            Monthly Rent <span className="text-destructive">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                id="rent_amount"
                                                min="0"
                                                step="0.01"
                                                value={data.rent_amount}
                                                onChange={(e) => {
                                                    setData('rent_amount', parseFloat(e.target.value) || 0);
                                                    clearFieldError('rent_amount');
                                                }}
                                                className={getFieldClassName('rent_amount') + ' pr-20'}
                                                placeholder="0.00"
                                            />
                                            <div className="absolute right-1 top-1">
                                                <select
                                                    value={data.rent_currency}
                                                    onChange={(e) => setData('rent_currency', e.target.value as any)}
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
                                        {(clientErrors.rent_amount || errors.rent_amount) && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {clientErrors.rent_amount || errors.rent_amount}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="available_date" className="block text-sm font-medium text-foreground mb-2">
                                            Available From
                                        </label>
                                        <input
                                            type="date"
                                            id="available_date"
                                            value={data.available_date || ''}
                                            onChange={(e) => setData('available_date', e.target.value || undefined)}
                                            className={getFieldClassName('available_date')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => router.visit('/dashboard')}
                                    className="flex-1 rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground shadow-lg transition-all hover:bg-muted cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {processing ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Property' : 'Create Property')}
                                </button>
                            </div>

                            {/* Progress Bar */}
                            {progress && (
                                <div className="mt-4">
                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">Uploading {progress.percentage}%</p>
                                </div>
                            )}
                        </form>
            </motion.div>
        </AppLayout>
    );
}
