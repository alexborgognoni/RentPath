import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BaseLayout } from '@/layouts/base-layout';
import { type SharedData } from '@/types';
import type { PropertyManager, User } from '@/types/dashboard';
import { translate as t } from '@/utils/translate-utils';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Building, ChevronDown, Info, Trash2, Upload, User as UserIcon, X } from 'lucide-react';
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

    // Set default phone country based on user location or ensure form data is properly initialized
    useEffect(() => {
        if (!propertyManager?.phone_country_code) {
            // Only set geolocation for new profiles
            fetch('https://ipapi.co/json/')
                .then((response) => response.json())
                .then((data) => {
                    const countryCodeMap: { [key: string]: string } = {
                        US: '+1',
                        CA: '+1',
                        GB: '+44',
                        DE: '+49',
                        FR: '+33',
                        IT: '+39',
                        ES: '+34',
                        AU: '+61',
                        JP: '+81',
                        KR: '+82',
                        CN: '+86',
                        IN: '+91',
                        BR: '+55',
                        MX: '+52',
                        AR: '+54',
                        RU: '+7',
                        ZA: '+27',
                        EG: '+20',
                        NG: '+234',
                        KE: '+254',
                        NL: '+31',
                        BE: '+32',
                        CH: '+41',
                        AT: '+43',
                        SE: '+46',
                        NO: '+47',
                        DK: '+45',
                        FI: '+358',
                    };
                    const countryCode = data.country_code;
                    const phonePrefix = countryCodeMap[countryCode] || '+1';
                    setData('phone_prefix', phonePrefix);
                })
                .catch(() => {
                    // Keep default +1 if geolocation fails
                });
        } else {
            // For editing, make sure form data reflects existing values
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
        const formData: Record<string, unknown> = {
            type: submittedType,
            phone_country_code: data.phone_prefix || '+1',
            phone_number: data.phone_number || '',
            remove_profile_picture: data.profile_picture === 'removed',
        };

        // Add professional fields if professional type
        if (submittedType === 'professional') {
            formData.company_name = data.company_name || '';
            formData.company_website = data.company_website || '';
            formData.license_number = data.license_number || '';
        }

        // Add files if they exist
        if (data.profile_picture && data.profile_picture !== 'removed' && data.profile_picture instanceof File) {
            formData.profile_picture = data.profile_picture;
        }
        if (data.id_document && data.id_document !== 'removed' && data.id_document instanceof File) {
            formData.id_document = data.id_document;
        }
        if (data.license_document && data.license_document !== 'removed' && data.license_document instanceof File) {
            formData.license_document = data.license_document;
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
        const endpoint = isEditing ? '/edit-profile' : '/profile/setup';

        router.post(endpoint, formData, {
            forceFormData: true,
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
            <Head title={isEditing ? t(translations.profile, 'setup.edit_title') : t(translations.profile, 'setup.title')} />
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
                                {isEditing ? t(translations.profile, 'setup.edit_title') : t(translations.profile, 'setup.title')}
                            </h1>
                            <p className="text-muted-foreground">
                                {isEditing ? t(translations.profile, 'setup.edit_description') : t(translations.profile, 'setup.description')}
                            </p>
                            {!isEditing && (
                                <p className="mt-2 text-sm text-muted-foreground">{t(translations.profile, 'setup.verification_notice')}</p>
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
                                    {t(translations.profile, 'setup.click_upload_text')}
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
                                        {t(translations.profile, 'setup.first_name')}
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
                                        {t(translations.profile, 'setup.last_name')}
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
                                    {t(translations.profile, 'setup.profile_type')}
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
                                            <p className="font-medium text-foreground">{t(translations.profile, 'setup.individual')}</p>
                                            <p className="text-xs text-muted-foreground">{t(translations.profile, 'setup.individual_desc')}</p>
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
                                            <p className="font-medium text-foreground">{t(translations.profile, 'setup.professional')}</p>
                                            <p className="text-xs text-muted-foreground">{t(translations.profile, 'setup.professional_desc')}</p>
                                        </div>
                                    </button>
                                </div>
                                {errors.type && <p className="mt-1 text-sm text-destructive">{errors.type}</p>}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-foreground">
                                    {t(translations.profile, 'setup.phone_number')} <span className="text-destructive">*</span>
                                </label>
                                <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-3">
                                    <div className="relative">
                                        <select
                                            value={data.phone_prefix}
                                            onChange={(e) => setData('phone_prefix', e.target.value)}
                                            className={`w-full cursor-pointer appearance-none overflow-hidden rounded-md border py-2 pr-10 pl-3 text-ellipsis whitespace-nowrap shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none ${getFieldClassName('phone_number')} [&>option]:cursor-pointer`}
                                        >
                                            <option value="+93">Afghanistan +93</option>
                                            <option value="+355">Albania +355</option>
                                            <option value="+213">Algeria +213</option>
                                            <option value="+1-684">American Samoa +1-684</option>
                                            <option value="+376">Andorra +376</option>
                                            <option value="+244">Angola +244</option>
                                            <option value="+1-264">Anguilla +1-264</option>
                                            <option value="+672">Antarctica +672</option>
                                            <option value="+1-268">Antigua and Barbuda +1-268</option>
                                            <option value="+54">Argentina +54</option>
                                            <option value="+374">Armenia +374</option>
                                            <option value="+297">Aruba +297</option>
                                            <option value="+61">Australia +61</option>
                                            <option value="+43">Austria +43</option>
                                            <option value="+994">Azerbaijan +994</option>
                                            <option value="+1-242">Bahamas +1-242</option>
                                            <option value="+973">Bahrain +973</option>
                                            <option value="+880">Bangladesh +880</option>
                                            <option value="+1-246">Barbados +1-246</option>
                                            <option value="+375">Belarus +375</option>
                                            <option value="+32">Belgium +32</option>
                                            <option value="+501">Belize +501</option>
                                            <option value="+229">Benin +229</option>
                                            <option value="+1-441">Bermuda +1-441</option>
                                            <option value="+975">Bhutan +975</option>
                                            <option value="+591">Bolivia +591</option>
                                            <option value="+387">Bosnia and Herzegovina +387</option>
                                            <option value="+267">Botswana +267</option>
                                            <option value="+55">Brazil +55</option>
                                            <option value="+246">British Indian Ocean Territory +246</option>
                                            <option value="+1-284">British Virgin Islands +1-284</option>
                                            <option value="+673">Brunei +673</option>
                                            <option value="+359">Bulgaria +359</option>
                                            <option value="+226">Burkina Faso +226</option>
                                            <option value="+257">Burundi +257</option>
                                            <option value="+855">Cambodia +855</option>
                                            <option value="+237">Cameroon +237</option>
                                            <option value="+1">Canada +1</option>
                                            <option value="+238">Cape Verde +238</option>
                                            <option value="+1-345">Cayman Islands +1-345</option>
                                            <option value="+236">Central African Republic +236</option>
                                            <option value="+235">Chad +235</option>
                                            <option value="+56">Chile +56</option>
                                            <option value="+86">China +86</option>
                                            <option value="+61">Christmas Island +61</option>
                                            <option value="+61">Cocos Islands +61</option>
                                            <option value="+57">Colombia +57</option>
                                            <option value="+269">Comoros +269</option>
                                            <option value="+682">Cook Islands +682</option>
                                            <option value="+506">Costa Rica +506</option>
                                            <option value="+385">Croatia +385</option>
                                            <option value="+53">Cuba +53</option>
                                            <option value="+599">Curacao +599</option>
                                            <option value="+357">Cyprus +357</option>
                                            <option value="+420">Czech Republic +420</option>
                                            <option value="+243">Democratic Republic of the Congo +243</option>
                                            <option value="+45">Denmark +45</option>
                                            <option value="+253">Djibouti +253</option>
                                            <option value="+1-767">Dominica +1-767</option>
                                            <option value="+1-809">Dominican Republic +1-809</option>
                                            <option value="+670">East Timor +670</option>
                                            <option value="+593">Ecuador +593</option>
                                            <option value="+20">Egypt +20</option>
                                            <option value="+503">El Salvador +503</option>
                                            <option value="+240">Equatorial Guinea +240</option>
                                            <option value="+291">Eritrea +291</option>
                                            <option value="+372">Estonia +372</option>
                                            <option value="+268">Eswatini +268</option>
                                            <option value="+251">Ethiopia +251</option>
                                            <option value="+500">Falkland Islands +500</option>
                                            <option value="+298">Faroe Islands +298</option>
                                            <option value="+679">Fiji +679</option>
                                            <option value="+358">Finland +358</option>
                                            <option value="+33">France +33</option>
                                            <option value="+594">French Guiana +594</option>
                                            <option value="+689">French Polynesia +689</option>
                                            <option value="+241">Gabon +241</option>
                                            <option value="+220">Gambia +220</option>
                                            <option value="+995">Georgia +995</option>
                                            <option value="+49">Germany +49</option>
                                            <option value="+233">Ghana +233</option>
                                            <option value="+350">Gibraltar +350</option>
                                            <option value="+30">Greece +30</option>
                                            <option value="+299">Greenland +299</option>
                                            <option value="+1-473">Grenada +1-473</option>
                                            <option value="+590">Guadeloupe +590</option>
                                            <option value="+1-671">Guam +1-671</option>
                                            <option value="+502">Guatemala +502</option>
                                            <option value="+44-1481">Guernsey +44-1481</option>
                                            <option value="+224">Guinea +224</option>
                                            <option value="+245">Guinea-Bissau +245</option>
                                            <option value="+592">Guyana +592</option>
                                            <option value="+509">Haiti +509</option>
                                            <option value="+504">Honduras +504</option>
                                            <option value="+852">Hong Kong +852</option>
                                            <option value="+36">Hungary +36</option>
                                            <option value="+354">Iceland +354</option>
                                            <option value="+91">India +91</option>
                                            <option value="+62">Indonesia +62</option>
                                            <option value="+98">Iran +98</option>
                                            <option value="+964">Iraq +964</option>
                                            <option value="+353">Ireland +353</option>
                                            <option value="+44-1624">Isle of Man +44-1624</option>
                                            <option value="+972">Israel +972</option>
                                            <option value="+39">Italy +39</option>
                                            <option value="+225">Ivory Coast +225</option>
                                            <option value="+1-876">Jamaica +1-876</option>
                                            <option value="+81">Japan +81</option>
                                            <option value="+44-1534">Jersey +44-1534</option>
                                            <option value="+962">Jordan +962</option>
                                            <option value="+7">Kazakhstan +7</option>
                                            <option value="+254">Kenya +254</option>
                                            <option value="+686">Kiribati +686</option>
                                            <option value="+383">Kosovo +383</option>
                                            <option value="+965">Kuwait +965</option>
                                            <option value="+996">Kyrgyzstan +996</option>
                                            <option value="+856">Laos +856</option>
                                            <option value="+371">Latvia +371</option>
                                            <option value="+961">Lebanon +961</option>
                                            <option value="+266">Lesotho +266</option>
                                            <option value="+231">Liberia +231</option>
                                            <option value="+218">Libya +218</option>
                                            <option value="+423">Liechtenstein +423</option>
                                            <option value="+370">Lithuania +370</option>
                                            <option value="+352">Luxembourg +352</option>
                                            <option value="+853">Macau +853</option>
                                            <option value="+389">North Macedonia +389</option>
                                            <option value="+261">Madagascar +261</option>
                                            <option value="+265">Malawi +265</option>
                                            <option value="+60">Malaysia +60</option>
                                            <option value="+960">Maldives +960</option>
                                            <option value="+223">Mali +223</option>
                                            <option value="+356">Malta +356</option>
                                            <option value="+692">Marshall Islands +692</option>
                                            <option value="+596">Martinique +596</option>
                                            <option value="+222">Mauritania +222</option>
                                            <option value="+230">Mauritius +230</option>
                                            <option value="+262">Mayotte +262</option>
                                            <option value="+52">Mexico +52</option>
                                            <option value="+691">Micronesia +691</option>
                                            <option value="+373">Moldova +373</option>
                                            <option value="+377">Monaco +377</option>
                                            <option value="+976">Mongolia +976</option>
                                            <option value="+382">Montenegro +382</option>
                                            <option value="+1-664">Montserrat +1-664</option>
                                            <option value="+212">Morocco +212</option>
                                            <option value="+258">Mozambique +258</option>
                                            <option value="+95">Myanmar +95</option>
                                            <option value="+264">Namibia +264</option>
                                            <option value="+674">Nauru +674</option>
                                            <option value="+977">Nepal +977</option>
                                            <option value="+31">Netherlands +31</option>
                                            <option value="+687">New Caledonia +687</option>
                                            <option value="+64">New Zealand +64</option>
                                            <option value="+505">Nicaragua +505</option>
                                            <option value="+227">Niger +227</option>
                                            <option value="+234">Nigeria +234</option>
                                            <option value="+683">Niue +683</option>
                                            <option value="+672">Norfolk Island +672</option>
                                            <option value="+850">North Korea +850</option>
                                            <option value="+1-670">Northern Mariana Islands +1-670</option>
                                            <option value="+47">Norway +47</option>
                                            <option value="+968">Oman +968</option>
                                            <option value="+92">Pakistan +92</option>
                                            <option value="+680">Palau +680</option>
                                            <option value="+970">Palestine +970</option>
                                            <option value="+507">Panama +507</option>
                                            <option value="+675">Papua New Guinea +675</option>
                                            <option value="+595">Paraguay +595</option>
                                            <option value="+51">Peru +51</option>
                                            <option value="+63">Philippines +63</option>
                                            <option value="+64">Pitcairn +64</option>
                                            <option value="+48">Poland +48</option>
                                            <option value="+351">Portugal +351</option>
                                            <option value="+1-787">Puerto Rico +1-787</option>
                                            <option value="+974">Qatar +974</option>
                                            <option value="+242">Republic of the Congo +242</option>
                                            <option value="+262">Reunion +262</option>
                                            <option value="+40">Romania +40</option>
                                            <option value="+7">Russia +7</option>
                                            <option value="+250">Rwanda +250</option>
                                            <option value="+590">Saint Barthelemy +590</option>
                                            <option value="+290">Saint Helena +290</option>
                                            <option value="+1-869">Saint Kitts and Nevis +1-869</option>
                                            <option value="+1-758">Saint Lucia +1-758</option>
                                            <option value="+590">Saint Martin +590</option>
                                            <option value="+508">Saint Pierre and Miquelon +508</option>
                                            <option value="+1-784">Saint Vincent and the Grenadines +1-784</option>
                                            <option value="+685">Samoa +685</option>
                                            <option value="+378">San Marino +378</option>
                                            <option value="+239">Sao Tome and Principe +239</option>
                                            <option value="+966">Saudi Arabia +966</option>
                                            <option value="+221">Senegal +221</option>
                                            <option value="+381">Serbia +381</option>
                                            <option value="+248">Seychelles +248</option>
                                            <option value="+232">Sierra Leone +232</option>
                                            <option value="+65">Singapore +65</option>
                                            <option value="+1-721">Sint Maarten +1-721</option>
                                            <option value="+421">Slovakia +421</option>
                                            <option value="+386">Slovenia +386</option>
                                            <option value="+677">Solomon Islands +677</option>
                                            <option value="+252">Somalia +252</option>
                                            <option value="+27">South Africa +27</option>
                                            <option value="+500">South Georgia and the South Sandwich Islands +500</option>
                                            <option value="+82">South Korea +82</option>
                                            <option value="+211">South Sudan +211</option>
                                            <option value="+34">Spain +34</option>
                                            <option value="+94">Sri Lanka +94</option>
                                            <option value="+249">Sudan +249</option>
                                            <option value="+597">Suriname +597</option>
                                            <option value="+47">Svalbard and Jan Mayen +47</option>
                                            <option value="+46">Sweden +46</option>
                                            <option value="+41">Switzerland +41</option>
                                            <option value="+963">Syria +963</option>
                                            <option value="+886">Taiwan +886</option>
                                            <option value="+992">Tajikistan +992</option>
                                            <option value="+255">Tanzania +255</option>
                                            <option value="+66">Thailand +66</option>
                                            <option value="+228">Togo +228</option>
                                            <option value="+690">Tokelau +690</option>
                                            <option value="+676">Tonga +676</option>
                                            <option value="+1-868">Trinidad and Tobago +1-868</option>
                                            <option value="+216">Tunisia +216</option>
                                            <option value="+90">Turkey +90</option>
                                            <option value="+993">Turkmenistan +993</option>
                                            <option value="+1-649">Turks and Caicos Islands +1-649</option>
                                            <option value="+688">Tuvalu +688</option>
                                            <option value="+1-340">U.S. Virgin Islands +1-340</option>
                                            <option value="+256">Uganda +256</option>
                                            <option value="+380">Ukraine +380</option>
                                            <option value="+971">United Arab Emirates +971</option>
                                            <option value="+44">United Kingdom +44</option>
                                            <option value="+1">United States +1</option>
                                            <option value="+598">Uruguay +598</option>
                                            <option value="+998">Uzbekistan +998</option>
                                            <option value="+678">Vanuatu +678</option>
                                            <option value="+379">Vatican +379</option>
                                            <option value="+58">Venezuela +58</option>
                                            <option value="+84">Vietnam +84</option>
                                            <option value="+681">Wallis and Futuna +681</option>
                                            <option value="+212">Western Sahara +212</option>
                                            <option value="+967">Yemen +967</option>
                                            <option value="+260">Zambia +260</option>
                                            <option value="+263">Zimbabwe +263</option>
                                        </select>
                                        <div className="pointer-events-none absolute top-2 right-0 bottom-0 flex items-center pr-2">
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        value={data.phone_number}
                                        onChange={(e) => {
                                            setData('phone_number', e.target.value.replace(/[^0-9]/g, ''));
                                            clearFieldError('phone_number');
                                        }}
                                        className={`flex-1 ${getFieldClassName('phone_number')}`}
                                        placeholder="123456789"
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
                                            {t(translations.profile, 'setup.company_name')} <span className="text-destructive">*</span>
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
                                            {t(translations.profile, 'setup.company_website')}
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
                                                {t(translations.profile, 'setup.license_number')} <span className="text-destructive">*</span>
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
                                                    <p className="leading-relaxed">{t(translations.profile, 'setup.license_number_tooltip')}</p>
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
                                            {t(translations.profile, 'setup.id_document')} <span className="text-destructive">*</span>
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
                                                                ? t(translations.profile, 'setup.replace_file')
                                                                : t(translations.profile, 'setup.upload_file')}
                                                        </span>
                                                    </label>
                                                    <p className="pl-1">{t(translations.profile, 'setup.drag_drop')}</p>
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
                                                <p className="text-xs text-muted-foreground">{t(translations.profile, 'setup.file_requirements')}</p>
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
                                                                        window.open('/property-manager/document/id_document', '_blank');
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
                                            {t(translations.profile, 'setup.license_document')} <span className="text-destructive">*</span>
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
                                                                ? t(translations.profile, 'setup.replace_file')
                                                                : t(translations.profile, 'setup.upload_file')}
                                                        </span>
                                                    </label>
                                                    <p className="pl-1">{t(translations.profile, 'setup.drag_drop')}</p>
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
                                                <p className="text-xs text-muted-foreground">{t(translations.profile, 'setup.file_requirements')}</p>
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
                                                                        window.open('/property-manager/document/license_document', '_blank');
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
                                            ? t(translations.profile, 'setup.updating')
                                            : t(translations.profile, 'setup.submitting')
                                        : isEditing
                                          ? t(translations.profile, 'setup.update_profile')
                                          : t(translations.profile, 'setup.submit_profile')}
                                </button>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="w-full cursor-pointer rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground shadow-lg transition-all hover:bg-muted"
                                    >
                                        {t(translations.profile, 'common.cancel')}
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
                                        {t(translations.profile, 'setup.uploading')} {progress.percentage}%
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
