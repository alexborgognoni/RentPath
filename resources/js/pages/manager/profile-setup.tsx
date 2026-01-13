import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PhoneInput } from '@/components/ui/phone-input';
import { useGeoLocation } from '@/hooks/use-geo-location';
import { BaseLayout } from '@/layouts/base-layout';
import { type SharedData } from '@/types';
import type { PropertyManager, User } from '@/types/dashboard';
import { getCountryByIso2 } from '@/utils/country-data';
import { route } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Building, Info, Trash2, Upload, User as UserIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProfileSetupProps {
    user: User;
    propertyManager?: PropertyManager;
    isEditing?: boolean;
    rejectionReason?: string;
    rejectedFields?: string[];
}

export default function ProfileSetup({ user, propertyManager, isEditing = false, rejectionReason, rejectedFields = [] }: ProfileSetupProps) {
    const { translations } = usePage<SharedData>().props;
    const { countryCode: detectedCountry } = useGeoLocation();
    const [selectedType, setSelectedType] = useState<'individual' | 'professional'>(propertyManager?.type || 'individual');
    const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>({});
    const [showLicenseTooltip, setShowLicenseTooltip] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);

    // Track original values for change detection
    const originalValues = {
        type: propertyManager?.type || 'individual',
        company_name: propertyManager?.company_name || '',
        company_website: propertyManager?.company_website || '',
        license_number: propertyManager?.license_number || '',
        phone_prefix: propertyManager?.phone_country_code || '+1',
        phone_number: propertyManager?.phone_number || '',
    };

    const { data, setData, processing, errors, progress } = useForm({
        type: propertyManager?.type || 'individual',
        company_name: propertyManager?.company_name || '',
        company_website: propertyManager?.company_website || '',
        license_number: propertyManager?.license_number || '',
        phone_prefix: propertyManager?.phone_country_code || '+1',
        phone_number: propertyManager?.phone_number || '',
        profile_picture: null as File | null | 'removed',
        id_document: null as File | null | 'removed',
        license_document: null as File | null | 'removed',
    });

    // Close tooltip on scroll (mobile)
    useEffect(() => {
        const handleScroll = () => {
            if (showLicenseTooltip) {
                setShowLicenseTooltip(false);
            }
        };

        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [showLicenseTooltip]);

    // Set default phone country based on IP detection
    useEffect(() => {
        if (!propertyManager?.phone_country_code && detectedCountry) {
            const country = getCountryByIso2(detectedCountry);
            if (country) {
                setData('phone_prefix', `+${country.dialCode}`);
            }
        }
    }, [detectedCountry, propertyManager?.phone_country_code, setData]);

    // For editing, make sure form data reflects existing values
    useEffect(() => {
        if (isEditing && propertyManager) {
            setData({
                type: propertyManager.type || 'individual',
                company_name: propertyManager.company_name || '',
                company_website: propertyManager.company_website || '',
                license_number: propertyManager.license_number || '',
                phone_prefix: propertyManager.phone_country_code || '+1',
                phone_number: propertyManager.phone_number || '',
                profile_picture: null,
                id_document: null,
                license_document: null,
            });
            setSelectedType(propertyManager.type || 'individual');
        }
    }, [isEditing, propertyManager, setData]);

    // Check if form has been modified
    const hasFormChanged = () => {
        if (!isEditing) return true; // For new profiles, always allow submission

        return (
            data.type !== originalValues.type ||
            data.company_name !== originalValues.company_name ||
            data.company_website !== originalValues.company_website ||
            data.license_number !== originalValues.license_number ||
            data.phone_prefix !== originalValues.phone_prefix ||
            data.phone_number !== originalValues.phone_number ||
            data.profile_picture !== null ||
            data.id_document !== null ||
            data.license_document !== null
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (processing) {
            return;
        }

        // Determine the actual type being submitted
        const submittedType = data.type || selectedType;

        // Prepare form data
        const formData = new FormData();
        formData.append('type', submittedType);
        formData.append('phone_country_code', data.phone_prefix || '+1');
        formData.append('phone_number', data.phone_number || '');
        formData.append('remove_profile_picture', data.profile_picture === 'removed' ? '1' : '0');

        // Add professional fields if professional type
        if (submittedType === 'professional') {
            formData.append('company_name', data.company_name || '');
            formData.append('company_website', data.company_website || '');
            formData.append('license_number', data.license_number || '');
        }

        // Add files if they exist
        if (data.profile_picture && data.profile_picture !== 'removed' && data.profile_picture instanceof File) {
            formData.append('profile_picture', data.profile_picture);
        }
        if (data.id_document && data.id_document !== 'removed' && data.id_document instanceof File) {
            formData.append('id_document', data.id_document);
        }
        if (data.license_document && data.license_document !== 'removed' && data.license_document instanceof File) {
            formData.append('license_document', data.license_document);
        }

        // Client-side validation
        const newClientErrors: { [key: string]: string } = {};

        if (!data.phone_number || data.phone_number.trim() === '') {
            newClientErrors.phone_number = 'Please enter your phone number.';
        }

        // Individual-specific validation
        if (submittedType === 'individual') {
            // ID document required if no existing one
            if ((!data.id_document || data.id_document === 'removed') && !propertyManager?.id_document_path) {
                newClientErrors.id_document = 'Please upload your ID document.';
            }
        }

        // Professional-specific validation
        if (submittedType === 'professional') {
            if (!data.company_name || data.company_name.trim() === '') {
                newClientErrors.company_name = 'Company name is required for professional accounts.';
            }
            // Validate company website if provided
            if (data.company_website && data.company_website.trim() !== '') {
                const websiteError = validateWebsite(data.company_website);
                if (websiteError) {
                    newClientErrors.company_website = websiteError;
                }
            }
            if (!data.license_number || data.license_number.trim() === '') {
                newClientErrors.license_number = 'License number is required for professional accounts.';
            }
            // License document required if no existing one
            if ((!data.license_document || data.license_document === 'removed') && !propertyManager?.license_document_path) {
                newClientErrors.license_document = 'Please upload your license document.';
            }
        }

        setClientErrors(newClientErrors);

        if (Object.keys(newClientErrors).length > 0) {
            return;
        }

        // Clear previous errors
        setGeneralError(null);

        // Submit form
        const endpoint = isEditing ? route('property-manager.update') : route('property-manager.store');

        router.post(endpoint, formData, {
            onError: (errors) => {
                console.error('Submission errors:', errors);
                // Get all error messages
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    setGeneralError(errorMessages.join(' '));
                } else {
                    setGeneralError('An unexpected error occurred. Please try again.');
                }
                // Scroll to top to show the error banner
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            onSuccess: () => {
                setGeneralError(null);
            },
        });
    };

    const handleTypeChange = (type: 'individual' | 'professional') => {
        setSelectedType(type);
        setData('type', type);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent, fieldName: 'id_document' | 'license_document') => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const file = files[0];
            const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                setClientErrors((prev) => ({
                    ...prev,
                    [fieldName]: `${fieldName === 'id_document' ? 'ID' : 'License'} document must be in PDF, JPEG, PNG, or JPG format.`,
                }));
                return;
            }
            if (file.size > 20 * 1024 * 1024) {
                setClientErrors((prev) => ({
                    ...prev,
                    [fieldName]: `${fieldName === 'id_document' ? 'ID' : 'License'} document must be smaller than 20MB.`,
                }));
                return;
            }
            setData(fieldName, file);
            clearFieldError(fieldName);
        }
    };

    const clearFieldError = (fieldName: string) => {
        if (clientErrors[fieldName]) {
            setClientErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const validateWebsite = (website: string): string | null => {
        if (!website || website.trim() === '') {
            return null; // Empty is valid (optional field)
        }

        let domain = website.trim();

        // Remove protocol if present
        domain = domain.replace(/^https?:\/\//i, '');

        // Remove www. if present
        domain = domain.replace(/^www\./i, '');

        // Validate domain format
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        if (!domainRegex.test(domain)) {
            return 'Please enter a valid domain (e.g., example.com).';
        }

        return null;
    };

    const isFieldRejected = (fieldName: string) => {
        return rejectedFields.includes(fieldName);
    };

    const getFieldClassName = (fieldName: string) => {
        const baseClass = 'mt-2 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20';
        const formErrors = errors as Record<string, string>;
        if (isFieldRejected(fieldName) || clientErrors[fieldName] || formErrors[fieldName]) {
            return baseClass + ' border-destructive bg-destructive/5 focus:border-destructive';
        }
        return baseClass + ' border-border bg-background focus:border-primary';
    };

    return (
        <BaseLayout>
            <Head title={isEditing ? t(translations.manager.profile, 'setup.editTitle') : t(translations.manager.profile, 'setup.title')} />
            <div className="flex-1 overflow-y-auto py-12">
                <div className="mx-auto max-w-2xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="xs:rounded-2xl xs:border xs:border-border xs:bg-card xs:p-8 xs:shadow-lg"
                    >
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-3xl font-bold text-foreground">
                                {isEditing ? t(translations.manager.profile, 'setup.editTitle') : t(translations.manager.profile, 'setup.title')}
                            </h1>
                            <p className="text-muted-foreground">
                                {isEditing
                                    ? t(translations.manager.profile, 'setup.editDescription')
                                    : t(translations.manager.profile, 'setup.description')}
                            </p>
                            {!isEditing && (
                                <p className="mt-2 text-sm text-muted-foreground">{t(translations.manager.profile, 'setup.verificationNotice')}</p>
                            )}

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
                                            className="absolute top-2 right-2 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Close</span>
                                        </button>
                                    </Alert>
                                </motion.div>
                            )}

                            {/* Profile Picture Upload */}
                            <div className="mt-8">
                                <div className="relative mx-auto h-32 w-32">
                                    <label
                                        htmlFor="profile_picture"
                                        className={`relative block h-32 w-32 cursor-pointer overflow-hidden rounded-full border-4 ${isFieldRejected('profile_picture') ? 'border-destructive' : 'border-primary'} bg-muted`}
                                    >
                                        {(data.profile_picture && data.profile_picture !== 'removed') ||
                                        (propertyManager?.profile_picture_path && data.profile_picture !== 'removed') ? (
                                            <img
                                                src={
                                                    data.profile_picture && data.profile_picture instanceof File
                                                        ? URL.createObjectURL(data.profile_picture)
                                                        : propertyManager?.profile_picture_url
                                                }
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                                <UserIcon className="h-12 w-12 text-primary" />
                                            </div>
                                        )}
                                        <input
                                            id="profile_picture"
                                            name="profile_picture"
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp"
                                            className="sr-only"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                                                    if (!validTypes.includes(file.type)) {
                                                        setClientErrors((prev) => ({
                                                            ...prev,
                                                            profile_picture: 'Profile picture must be in JPEG, PNG, or WEBP format.',
                                                        }));
                                                        setData('profile_picture', null);
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                    if (file.size > 5 * 1024 * 1024) {
                                                        setClientErrors((prev) => ({
                                                            ...prev,
                                                            profile_picture: 'Profile picture must be smaller than 5MB.',
                                                        }));
                                                        setData('profile_picture', null);
                                                        e.target.value = '';
                                                        return;
                                                    }
                                                }
                                                setData('profile_picture', file || null);
                                                clearFieldError('profile_picture');
                                            }}
                                            key={data.profile_picture ? 'with-file' : 'without-file'}
                                        />
                                    </label>
                                    <label
                                        htmlFor="profile_picture"
                                        className="absolute right-0 bottom-0 cursor-pointer rounded-full bg-primary p-2 shadow-lg transition-colors hover:bg-primary/90"
                                    >
                                        <Upload className="h-4 w-4 text-white" />
                                    </label>
                                    {((data.profile_picture && data.profile_picture !== 'removed') ||
                                        (propertyManager?.profile_picture_path && data.profile_picture !== 'removed')) && (
                                        <button
                                            type="button"
                                            onClick={() => setData('profile_picture', 'removed')}
                                            className="absolute bottom-0 left-0 cursor-pointer rounded-full bg-destructive p-2 shadow-lg transition-colors hover:bg-destructive/90"
                                        >
                                            <Trash2 className="h-4 w-4 text-white" />
                                        </button>
                                    )}
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {t(translations.manager.profile, 'setup.clickUploadText')}
                                    {isFieldRejected('profile_picture') && <span className="text-destructive"> *</span>}
                                </p>
                                {errors.profile_picture && <p className="mt-1 text-sm text-destructive">{errors.profile_picture}</p>}
                            </div>
                        </div>

                        {rejectionReason && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-6 rounded-lg border-l-4 border-destructive bg-destructive/10 p-4"
                            >
                                <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-foreground">Profile Update Required</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">{rejectionReason}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-foreground">
                                        {t(translations.manager.profile, 'setup.firstName')}
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        value={user.first_name}
                                        disabled
                                        className="mt-2 block w-full cursor-not-allowed rounded-md border border-border bg-muted px-3 py-2 text-muted-foreground"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-foreground">
                                        {t(translations.manager.profile, 'setup.lastName')}
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        value={user.last_name}
                                        disabled
                                        className="mt-2 block w-full cursor-not-allowed rounded-md border border-border bg-muted px-3 py-2 text-muted-foreground"
                                    />
                                </div>
                            </div>
                            {/* Profile Type Selection */}
                            <div>
                                <label className="mb-3 block text-sm font-medium text-foreground">
                                    {t(translations.manager.profile, 'setup.profileType')}
                                </label>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('individual')}
                                        className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${
                                            selectedType === 'individual'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border bg-background hover:bg-muted/50'
                                        }`}
                                    >
                                        <UserIcon className="h-6 w-6 text-primary" />
                                        <div className="ml-3 text-left">
                                            <p className="font-medium text-foreground">{t(translations.manager.profile, 'setup.individual')}</p>
                                            <p className="text-xs text-muted-foreground">{t(translations.manager.profile, 'setup.individualDesc')}</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('professional')}
                                        className={`flex cursor-pointer items-center rounded-lg border-2 p-4 transition-all ${
                                            selectedType === 'professional'
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border bg-background hover:bg-muted/50'
                                        }`}
                                    >
                                        <Building className="h-6 w-6 text-primary" />
                                        <div className="ml-3 text-left">
                                            <p className="font-medium text-foreground">{t(translations.manager.profile, 'setup.professional')}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {t(translations.manager.profile, 'setup.professionalDesc')}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                                {errors.type && <p className="mt-1 text-sm text-destructive">{errors.type}</p>}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-foreground">
                                    {t(translations.manager.profile, 'setup.phoneNumber')} <span className="text-destructive">*</span>
                                </label>
                                <div className="mt-2">
                                    <PhoneInput
                                        value={data.phone_number}
                                        countryCode={data.phone_prefix}
                                        onChange={(phoneNumber, countryCode) => {
                                            setData('phone_number', phoneNumber);
                                            setData('phone_prefix', countryCode);
                                            clearFieldError('phone_number');
                                        }}
                                        defaultCountry={detectedCountry}
                                        aria-invalid={!!(clientErrors.phone_number || errors.phone_number)}
                                        error={clientErrors.phone_number || errors.phone_number}
                                        placeholder="612345678"
                                    />
                                </div>
                                {(clientErrors.phone_number || errors.phone_number) && (
                                    <p className="mt-1 text-sm text-destructive">{clientErrors.phone_number || errors.phone_number}</p>
                                )}
                            </div>

                            {/* Professional Fields */}
                            {selectedType === 'professional' && (
                                <>
                                    <div>
                                        <label htmlFor="company_name" className="block text-sm font-medium text-foreground">
                                            {t(translations.manager.profile, 'setup.companyName')} <span className="text-destructive">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="company_name"
                                            value={data.company_name}
                                            onChange={(e) => {
                                                setData('company_name', e.target.value);
                                                clearFieldError('company_name');
                                            }}
                                            className={getFieldClassName('company_name')}
                                        />
                                        {(clientErrors.company_name || errors.company_name) && (
                                            <p className="mt-1 text-sm text-destructive">{clientErrors.company_name || errors.company_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="company_website" className="block text-sm font-medium text-foreground">
                                            {t(translations.manager.profile, 'setup.companyWebsite')}
                                        </label>
                                        <input
                                            type="text"
                                            id="company_website"
                                            value={data.company_website}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setData('company_website', value);

                                                // Real-time validation
                                                const error = validateWebsite(value);
                                                if (error) {
                                                    setClientErrors((prev) => ({ ...prev, company_website: error }));
                                                } else {
                                                    clearFieldError('company_website');
                                                }
                                            }}
                                            className={getFieldClassName('company_website')}
                                            placeholder="example.com"
                                        />
                                        {(clientErrors.company_website || errors.company_website) && (
                                            <p className="mt-1 text-sm text-destructive">{clientErrors.company_website || errors.company_website}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="license_number" className="flex items-center gap-2 text-sm font-medium text-foreground">
                                            <span>
                                                {t(translations.manager.profile, 'setup.licenseNumber')} <span className="text-destructive">*</span>
                                            </span>
                                            <div className="group relative inline-block">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowLicenseTooltip(!showLicenseTooltip)}
                                                    onMouseEnter={() => setShowLicenseTooltip(true)}
                                                    onMouseLeave={() => setShowLicenseTooltip(false)}
                                                    className="cursor-pointer"
                                                >
                                                    <Info className="h-4 w-4 text-primary" />
                                                </button>
                                                <div
                                                    className={`absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg transition-opacity duration-200 ${showLicenseTooltip ? 'visible opacity-100' : 'invisible opacity-0'}`}
                                                >
                                                    <p className="leading-relaxed">{t(translations.manager.profile, 'setup.licenseNumberTooltip')}</p>
                                                    <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-t-4 border-r-4 border-l-4 border-t-border border-r-transparent border-l-transparent"></div>
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            id="license_number"
                                            value={data.license_number}
                                            onChange={(e) => {
                                                setData('license_number', e.target.value);
                                                clearFieldError('license_number');
                                            }}
                                            className={getFieldClassName('license_number')}
                                        />
                                        {(clientErrors.license_number || errors.license_number) && (
                                            <p className="mt-1 text-sm text-destructive">{clientErrors.license_number || errors.license_number}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Document Uploads */}
                            <div className="space-y-4">
                                {selectedType === 'individual' && (
                                    <div>
                                        <label htmlFor="id_document" className="block text-sm font-medium text-foreground">
                                            {t(translations.manager.profile, 'setup.idDocument')} <span className="text-destructive">*</span>
                                        </label>
                                        <div
                                            className={`mt-2 flex justify-center rounded-md border border-dashed px-6 pt-5 pb-6 ${isFieldRejected('id_document') || clientErrors.id_document || errors.id_document ? 'border-destructive bg-destructive/5' : 'border-border'}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 'id_document')}
                                        >
                                            <div className="w-full space-y-1 text-center">
                                                <label htmlFor="id_document" className="cursor-pointer">
                                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                </label>
                                                <div className="flex justify-center text-sm text-muted-foreground">
                                                    <label
                                                        htmlFor="id_document"
                                                        className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                                                    >
                                                        <span>
                                                            {(data.id_document && data.id_document !== 'removed') ||
                                                            (propertyManager?.id_document_path && data.id_document !== 'removed')
                                                                ? t(translations.manager.profile, 'setup.replaceFile')
                                                                : t(translations.manager.profile, 'setup.uploadFile')}
                                                        </span>
                                                    </label>
                                                    <p className="pl-1">{t(translations.manager.profile, 'setup.dragDrop')}</p>
                                                </div>
                                                <input
                                                    id="id_document"
                                                    name="id_document"
                                                    type="file"
                                                    accept=".pdf,.png,.jpg,.jpeg"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
                                                            if (!validTypes.includes(file.type)) {
                                                                setClientErrors((prev) => ({
                                                                    ...prev,
                                                                    id_document: 'ID document must be in PDF, JPEG, PNG, or JPG format.',
                                                                }));
                                                                setData('id_document', null);
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            if (file.size > 20 * 1024 * 1024) {
                                                                setClientErrors((prev) => ({
                                                                    ...prev,
                                                                    id_document: 'ID document must be smaller than 20MB.',
                                                                }));
                                                                setData('id_document', null);
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                        }
                                                        setData('id_document', file || null);
                                                        clearFieldError('id_document');
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    {t(translations.manager.profile, 'setup.fileRequirements')}
                                                </p>
                                                {((data.id_document && data.id_document !== 'removed') ||
                                                    (propertyManager?.id_document_path && data.id_document !== 'removed')) && (
                                                    <div className="mt-3 w-full overflow-hidden px-4">
                                                        <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background px-3 py-2 shadow-sm">
                                                            <p
                                                                className="min-w-0 flex-1 cursor-pointer truncate overflow-hidden text-sm font-medium text-primary hover:text-primary/80"
                                                                onClick={() => {
                                                                    if (data.id_document && data.id_document instanceof File) {
                                                                        window.open(URL.createObjectURL(data.id_document), '_blank');
                                                                    } else if (propertyManager?.id_document_path) {
                                                                        window.open(
                                                                            route('property-manager.document', { type: 'id_document' }),
                                                                            '_blank',
                                                                        );
                                                                    }
                                                                }}
                                                                title={
                                                                    data.id_document instanceof File
                                                                        ? data.id_document?.name
                                                                        : propertyManager?.id_document_original_name || 'ID Document'
                                                                }
                                                            >
                                                                {data.id_document instanceof File
                                                                    ? data.id_document?.name
                                                                    : propertyManager?.id_document_original_name || 'ID Document'}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('id_document', 'removed')}
                                                                className="flex-shrink-0 cursor-pointer text-destructive hover:text-destructive/80"
                                                                title="Remove file"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {(clientErrors.id_document || errors.id_document) && (
                                            <p className="mt-1 text-sm text-destructive">{clientErrors.id_document || errors.id_document}</p>
                                        )}
                                    </div>
                                )}

                                {selectedType === 'professional' && (
                                    <div>
                                        <label htmlFor="license_document" className="block text-sm font-medium text-foreground">
                                            {t(translations.manager.profile, 'setup.licenseDocument')} <span className="text-destructive">*</span>
                                        </label>
                                        <div
                                            className={`mt-2 flex justify-center rounded-md border border-dashed px-6 pt-5 pb-6 ${isFieldRejected('license_document') || clientErrors.license_document || errors.license_document ? 'border-destructive bg-destructive/5' : 'border-border'}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, 'license_document')}
                                        >
                                            <div className="w-full space-y-1 text-center">
                                                <label htmlFor="license_document" className="cursor-pointer">
                                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                </label>
                                                <div className="flex justify-center text-sm text-muted-foreground">
                                                    <label
                                                        htmlFor="license_document"
                                                        className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                                                    >
                                                        <span>
                                                            {(data.license_document && data.license_document !== 'removed') ||
                                                            (propertyManager?.license_document_path && data.license_document !== 'removed')
                                                                ? t(translations.manager.profile, 'setup.replaceFile')
                                                                : t(translations.manager.profile, 'setup.uploadFile')}
                                                        </span>
                                                    </label>
                                                    <p className="pl-1">{t(translations.manager.profile, 'setup.dragDrop')}</p>
                                                </div>
                                                <input
                                                    id="license_document"
                                                    name="license_document"
                                                    type="file"
                                                    accept=".pdf,.png,.jpg,.jpeg"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
                                                            if (!validTypes.includes(file.type)) {
                                                                setClientErrors((prev) => ({
                                                                    ...prev,
                                                                    license_document: 'License document must be in PDF, JPEG, PNG, or JPG format.',
                                                                }));
                                                                setData('license_document', null);
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                            if (file.size > 20 * 1024 * 1024) {
                                                                setClientErrors((prev) => ({
                                                                    ...prev,
                                                                    license_document: 'License document must be smaller than 20MB.',
                                                                }));
                                                                setData('license_document', null);
                                                                e.target.value = '';
                                                                return;
                                                            }
                                                        }
                                                        setData('license_document', file || null);
                                                        clearFieldError('license_document');
                                                    }}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    {t(translations.manager.profile, 'setup.fileRequirements')}
                                                </p>
                                                {((data.license_document && data.license_document !== 'removed') ||
                                                    (propertyManager?.license_document_path && data.license_document !== 'removed')) && (
                                                    <div className="mt-3 w-full overflow-hidden px-4">
                                                        <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background px-3 py-2 shadow-sm">
                                                            <p
                                                                className="min-w-0 flex-1 cursor-pointer truncate overflow-hidden text-sm font-medium text-primary hover:text-primary/80"
                                                                onClick={() => {
                                                                    if (data.license_document && data.license_document instanceof File) {
                                                                        window.open(URL.createObjectURL(data.license_document), '_blank');
                                                                    } else if (propertyManager?.license_document_path) {
                                                                        window.open(
                                                                            route('property-manager.document', { type: 'license_document' }),
                                                                            '_blank',
                                                                        );
                                                                    }
                                                                }}
                                                                title={
                                                                    data.license_document instanceof File
                                                                        ? data.license_document?.name
                                                                        : propertyManager?.license_document_original_name || 'License Document'
                                                                }
                                                            >
                                                                {data.license_document instanceof File
                                                                    ? data.license_document?.name
                                                                    : propertyManager?.license_document_original_name || 'License Document'}
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => setData('license_document', 'removed')}
                                                                className="flex-shrink-0 cursor-pointer text-destructive hover:text-destructive/80"
                                                                title="Remove file"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {(clientErrors.license_document || errors.license_document) && (
                                            <p className="mt-1 text-sm text-destructive">
                                                {clientErrors.license_document || errors.license_document}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={processing || (isEditing && !hasFormChanged())}
                                    className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? isEditing
                                            ? t(translations.manager.profile, 'setup.updating')
                                            : t(translations.manager.profile, 'setup.submitting')
                                        : isEditing
                                          ? t(translations.manager.profile, 'setup.updateProfile')
                                          : t(translations.manager.profile, 'setup.submitProfile')}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="w-full cursor-pointer rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground shadow-lg transition-all hover:bg-muted"
                                    >
                                        {t(translations.manager.profile, 'common.cancel')}
                                    </button>
                                )}
                            </div>

                            {/* Progress Bar */}
                            {progress && (
                                <div className="mt-4">
                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t(translations.manager.profile, 'setup.uploading')} {progress.percentage}%
                                    </p>
                                </div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </BaseLayout>
    );
}
