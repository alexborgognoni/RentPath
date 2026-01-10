import { ManagerLayout } from '@/layouts/manager-layout';
import { type SharedData } from '@/types';
import type { PropertyManagerFormData, User } from '@/types/dashboard';
import { route } from '@/utils/route';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Building2, Camera, FileText, Globe, Phone, Trash2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface SetupPropertyManagerPageProps {
    user: User;
}

export default function SetupPropertyManagerPage({ user }: SetupPropertyManagerPageProps) {
    const { translations } = usePage<SharedData>().props;
    const [formData, setFormData] = useState<PropertyManagerFormData & { profile_picture_preview?: string }>({
        type: 'individual',
        company_name: '',
        company_website: '',
        license_number: '',
        phone_number: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const newErrors: Record<string, string> = {};
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        }
        if (formData.type === 'professional' && !formData.company_name?.trim()) {
            newErrors.company_name = 'Company name is required for professional accounts';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        const submitFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (value instanceof File) {
                    submitFormData.append(key, value);
                } else {
                    submitFormData.append(key, value.toString());
                }
            }
        });

        router.post(route('property-manager.store'), submitFormData, {
            onError: (errors) => {
                setErrors(errors);
                setIsSubmitting(false);
            },
            onSuccess: () => setIsSubmitting(false),
        });
    };

    const handleFileChange = (field: 'profile_picture' | 'id_document' | 'license_document') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (field === 'profile_picture') {
                const preview = URL.createObjectURL(file);
                setFormData({ ...formData, profile_picture: file, profile_picture_preview: preview });
            } else {
                setFormData({ ...formData, [field]: file });
            }
        }
    };

    const removeProfilePicture = () => {
        setFormData({ ...formData, profile_picture: undefined, profile_picture_preview: '' });
    };

    return (
        <ManagerLayout>
            <Head title="Setup Property Manager Profile" />
            <div className="min-h-screen bg-background">
                <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
                        {/* Header */}
                        <div className="text-center">
                            <h1 className="mb-2 text-3xl font-bold text-foreground">Setup Your Property Manager Profile</h1>
                            <p className="mx-auto max-w-2xl text-muted-foreground">
                                Welcome, {user.full_name}! Complete your property manager profile to start managing your properties effectively.
                            </p>
                        </div>
                        {/* Form */}
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Profile Picture */}
                                <div className="text-center">
                                    <label className="mb-2 block text-sm font-medium text-foreground">Profile Picture</label>

                                    <div className="relative mx-auto flex flex-col items-center">
                                        <div className="relative h-24 w-24">
                                            {/* Avatar container */}
                                            <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-full border-2 border-primary bg-muted">
                                                {formData.profile_picture_preview ? (
                                                    <img
                                                        src={formData.profile_picture_preview}
                                                        alt="Profile Preview"
                                                        className="h-full w-full object-cover transition-all duration-200 group-hover:brightness-75"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center transition-all duration-200 group-hover:brightness-75">
                                                        <UserIcon className="h-10 w-10 text-muted-foreground" />
                                                    </div>
                                                )}

                                                {/* Camera icon on hover */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    <Camera className="h-6 w-6 text-white" />
                                                </div>

                                                {/* Hidden file input */}
                                                <input
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/jpg"
                                                    onChange={handleFileChange('profile_picture')}
                                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                />
                                            </div>
                                        </div>

                                        {/* File name + trash button */}
                                        {formData.profile_picture && (
                                            <div className="mt-2 flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                                                <span className="max-w-[120px] truncate">{formData.profile_picture.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={removeProfilePicture}
                                                    className="flex items-center rounded bg-destructive/80 px-2 py-1 text-white shadow hover:bg-destructive"
                                                >
                                                    <Trash2 className="mr-1 h-4 w-4" /> Remove
                                                </button>
                                            </div>
                                        )}

                                        {!formData.profile_picture && (
                                            <p className="mt-2 text-xs text-muted-foreground">Max size: 2MB. Formats: JPG, PNG</p>
                                        )}
                                    </div>
                                </div>
                                {/* Account Type */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-foreground">
                                        Account Type <span className="text-destructive">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <label
                                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${formData.type === 'individual' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value="individual"
                                                checked={formData.type === 'individual'}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'individual' | 'professional' })}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center space-x-3">
                                                <UserIcon className="h-5 w-5 text-primary" />
                                                <div>
                                                    <div className="font-medium text-foreground">Individual</div>
                                                    <div className="text-sm text-muted-foreground">Private landlord</div>
                                                </div>
                                            </div>
                                        </label>

                                        <label
                                            className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${formData.type === 'professional' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value="professional"
                                                checked={formData.type === 'professional'}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'individual' | 'professional' })}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center space-x-3">
                                                <Building2 className="h-5 w-5 text-primary" />
                                                <div>
                                                    <div className="font-medium text-foreground">Professional</div>
                                                    <div className="text-sm text-muted-foreground">Agency or company</div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    {errors.type && <p className="mt-1 text-sm text-destructive">{errors.type}</p>}
                                </div>
                                {/* Phone Number */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        Phone Number <span className="text-destructive">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone_number}
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            className="w-full rounded-lg border border-border bg-background py-3 pr-4 pl-10 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                            placeholder="+41 XX XXX XX XX"
                                        />
                                    </div>
                                    {errors.phone_number && <p className="mt-1 text-sm text-destructive">{errors.phone_number}</p>}
                                </div>
                                {/* Professional Fields */}
                                {formData.type === 'professional' && (
                                    <div className="space-y-6 rounded-xl border border-border bg-muted/30 p-4">
                                        {' '}
                                        <h3 className="font-medium text-foreground">Professional Information</h3> {/* Company Name */}{' '}
                                        <div>
                                            {' '}
                                            <label className="mb-2 block text-sm font-medium text-foreground">
                                                {' '}
                                                Company Name <span className="text-destructive">*</span>{' '}
                                            </label>{' '}
                                            <input
                                                type="text"
                                                required={formData.type === 'professional'}
                                                value={formData.company_name}
                                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                placeholder="Your Company Name"
                                            />{' '}
                                            {errors.company_name && <p className="mt-1 text-sm text-destructive">{errors.company_name}</p>}{' '}
                                        </div>{' '}
                                        {/* Company Website */}{' '}
                                        <div>
                                            {' '}
                                            <label className="mb-2 block text-sm font-medium text-foreground"> Company Website </label>{' '}
                                            <div className="relative">
                                                {' '}
                                                <Globe className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />{' '}
                                                <input
                                                    type="url"
                                                    value={formData.company_website}
                                                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                                                    className="w-full rounded-lg border border-border bg-background py-3 pr-4 pl-10 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    placeholder="https://yourcompany.com"
                                                />{' '}
                                            </div>{' '}
                                            {errors.company_website && <p className="mt-1 text-sm text-destructive">{errors.company_website}</p>}{' '}
                                        </div>{' '}
                                        {/* License Number */}{' '}
                                        <div>
                                            {' '}
                                            <label className="mb-2 block text-sm font-medium text-foreground"> License Number </label>{' '}
                                            <div className="relative">
                                                {' '}
                                                <FileText className="absolute top-3 left-3 h-5 w-5 text-muted-foreground" />{' '}
                                                <input
                                                    type="text"
                                                    value={formData.license_number}
                                                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                                                    className="w-full rounded-lg border border-border bg-background py-3 pr-4 pl-10 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    placeholder="Real estate license number"
                                                />{' '}
                                            </div>{' '}
                                            {errors.license_number && <p className="mt-1 text-sm text-destructive">{errors.license_number}</p>}{' '}
                                        </div>{' '}
                                    </div>
                                )}
                                {/* File Uploads */}{' '}
                                <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
                                    {' '}
                                    <h3 className="font-medium text-foreground">Documents (Optional)</h3> {/* ID Document */}{' '}
                                    <div>
                                        {' '}
                                        <label className="mb-2 block text-sm font-medium text-foreground">ID Document</label>{' '}
                                        <input
                                            type="file"
                                            accept=".pdf,image/jpeg,image/png,image/jpg"
                                            onChange={handleFileChange('id_document')}
                                            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/90"
                                        />{' '}
                                        <p className="mt-1 text-xs text-muted-foreground">Max size: 20MB. Formats: PDF, JPG, PNG</p>{' '}
                                    </div>{' '}
                                    {/* License Document */}{' '}
                                    {formData.type === 'professional' && (
                                        <div>
                                            {' '}
                                            <label className="mb-2 block text-sm font-medium text-foreground">License Document</label>{' '}
                                            <input
                                                type="file"
                                                accept=".pdf,image/jpeg,image/png,image/jpg"
                                                onChange={handleFileChange('license_document')}
                                                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary/90"
                                            />{' '}
                                            <p className="mt-1 text-xs text-muted-foreground">Max size: 20MB. Formats: PDF, JPG, PNG</p>{' '}
                                        </div>
                                    )}{' '}
                                </div>{' '}
                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4 pt-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                                                Setting up...
                                            </>
                                        ) : (
                                            'Complete Setup'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ManagerLayout>
    );
}
