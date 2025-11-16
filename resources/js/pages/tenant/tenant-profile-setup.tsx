import { BaseLayout } from '@/layouts/base-layout';
import { type SharedData, type TenantProfile, type User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TenantProfileSetupProps extends SharedData {
    user: User;
    tenantProfile?: TenantProfile;
    isEditing?: boolean;
    rejectionReason?: string;
    rejectedFields?: string[];
}

export default function TenantProfileSetup() {
    const { user, tenantProfile, isEditing = false, rejectionReason, rejectedFields = [] } = usePage<TenantProfileSetupProps>().props;
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors, progress } = useForm({
        // Personal
        date_of_birth: tenantProfile?.date_of_birth || '',
        nationality: tenantProfile?.nationality || '',
        phone_country_code: tenantProfile?.phone_country_code || '+1',
        phone_number: tenantProfile?.phone_number || '',

        // Address
        current_house_number: tenantProfile?.current_house_number || '',
        current_street_name: tenantProfile?.current_street_name || '',
        current_city: tenantProfile?.current_city || '',
        current_postal_code: tenantProfile?.current_postal_code || '',
        current_country: tenantProfile?.current_country || '',

        // Employment
        employment_status: tenantProfile?.employment_status || 'employed',
        employer_name: tenantProfile?.employer_name || '',
        job_title: tenantProfile?.job_title || '',
        employment_start_date: tenantProfile?.employment_start_date || '',
        employment_type: tenantProfile?.employment_type || 'full_time',
        monthly_income: tenantProfile?.monthly_income || '',
        income_currency: tenantProfile?.income_currency || 'eur',
        employer_contact_name: tenantProfile?.employer_contact_name || '',
        employer_contact_phone: tenantProfile?.employer_contact_phone || '',
        employer_contact_email: tenantProfile?.employer_contact_email || '',

        // Student
        university_name: tenantProfile?.university_name || '',
        program_of_study: tenantProfile?.program_of_study || '',
        expected_graduation_date: tenantProfile?.expected_graduation_date || '',
        student_income_source: tenantProfile?.student_income_source || '',

        // Guarantor
        has_guarantor: tenantProfile?.has_guarantor || false,
        guarantor_name: tenantProfile?.guarantor_name || '',
        guarantor_relationship: tenantProfile?.guarantor_relationship || '',
        guarantor_phone: tenantProfile?.guarantor_phone || '',
        guarantor_email: tenantProfile?.guarantor_email || '',
        guarantor_address: tenantProfile?.guarantor_address || '',
        guarantor_employer: tenantProfile?.guarantor_employer || '',
        guarantor_monthly_income: tenantProfile?.guarantor_monthly_income || '',

        // Documents
        profile_picture: null as File | null,
        id_document: null as File | null,
        employment_contract: null as File | null,
        payslip_1: null as File | null,
        payslip_2: null as File | null,
        payslip_3: null as File | null,
        student_proof: null as File | null,
        guarantor_id: null as File | null,
        guarantor_proof_income: null as File | null,

        // Preferences
        emergency_contact_name: tenantProfile?.emergency_contact_name || '',
        emergency_contact_phone: tenantProfile?.emergency_contact_phone || '',
        emergency_contact_relationship: tenantProfile?.emergency_contact_relationship || '',
        preferred_move_in_date: tenantProfile?.preferred_move_in_date || '',
        occupants_count: tenantProfile?.occupants_count || 1,
        has_pets: tenantProfile?.has_pets || false,
        pets_description: tenantProfile?.pets_description || '',
        is_smoker: tenantProfile?.is_smoker || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = isEditing ? '/profile/tenant/edit' : '/profile/tenant/setup';
        post(url);
    };

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

    const isEmployed = data.employment_status === 'employed' || data.employment_status === 'self_employed';
    const isStudent = data.employment_status === 'student';

    return (
        <BaseLayout>
            <Head title={isEditing ? 'Edit Tenant Profile' : 'Create Tenant Profile'} />

            <div className="mx-auto max-w-4xl px-4 py-8">
                <h1 className="mb-2 text-3xl font-bold">{isEditing ? 'Edit Your Profile' : 'Create Your Tenant Profile'}</h1>
                <p className="mb-8 text-muted-foreground">Complete your profile to start applying for properties</p>

                {rejectionReason && (
                    <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                        <p className="font-semibold text-red-600 dark:text-red-400">Profile Rejected</p>
                        <p className="text-sm text-red-600 dark:text-red-400">{rejectionReason}</p>
                    </div>
                )}

                {/* Step Indicator */}
                <div className="mb-8 flex items-center justify-center gap-4">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    currentStep === step
                                        ? 'bg-primary text-white'
                                        : currentStep > step
                                          ? 'bg-green-500 text-white'
                                          : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                {step}
                            </div>
                            {step < 3 && <div className="h-1 w-12 bg-gray-200"></div>}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Personal Information</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Date of Birth *</label>
                                    <input
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        required
                                    />
                                    {errors.date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_of_birth}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Nationality (ISO Code) *</label>
                                    <input
                                        type="text"
                                        value={data.nationality}
                                        onChange={(e) => setData('nationality', e.target.value.toUpperCase())}
                                        maxLength={2}
                                        placeholder="US, GB, DE..."
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        required
                                    />
                                    {errors.nationality && <p className="mt-1 text-sm text-red-500">{errors.nationality}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Phone Country Code *</label>
                                    <input
                                        type="text"
                                        value={data.phone_country_code}
                                        onChange={(e) => setData('phone_country_code', e.target.value)}
                                        placeholder="+1"
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        required
                                    />
                                    {errors.phone_number && <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>}
                                </div>
                            </div>

                            <div className="border-t border-border pt-6">
                                <h3 className="mb-4 font-semibold">Current Address</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">House Number *</label>
                                        <input
                                            type="text"
                                            value={data.current_house_number}
                                            onChange={(e) => setData('current_house_number', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Street Name *</label>
                                        <input
                                            type="text"
                                            value={data.current_street_name}
                                            onChange={(e) => setData('current_street_name', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">City *</label>
                                        <input
                                            type="text"
                                            value={data.current_city}
                                            onChange={(e) => setData('current_city', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Postal Code *</label>
                                        <input
                                            type="text"
                                            value={data.current_postal_code}
                                            onChange={(e) => setData('current_postal_code', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Country (ISO Code) *</label>
                                        <input
                                            type="text"
                                            value={data.current_country}
                                            onChange={(e) => setData('current_country', e.target.value.toUpperCase())}
                                            maxLength={2}
                                            placeholder="US"
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Employment & Income */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Employment & Income</h2>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Employment Status *</label>
                                <select
                                    value={data.employment_status}
                                    onChange={(e) => setData('employment_status', e.target.value as any)}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                    required
                                >
                                    <option value="employed">Employed</option>
                                    <option value="self_employed">Self-Employed</option>
                                    <option value="student">Student</option>
                                    <option value="unemployed">Unemployed</option>
                                    <option value="retired">Retired</option>
                                </select>
                            </div>

                            {isEmployed && (
                                <div className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Employer Name *</label>
                                            <input
                                                type="text"
                                                value={data.employer_name}
                                                onChange={(e) => setData('employer_name', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Job Title *</label>
                                            <input
                                                type="text"
                                                value={data.job_title}
                                                onChange={(e) => setData('job_title', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Employment Start Date *</label>
                                            <input
                                                type="date"
                                                value={data.employment_start_date}
                                                onChange={(e) => setData('employment_start_date', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Employment Type *</label>
                                            <select
                                                value={data.employment_type}
                                                onChange={(e) => setData('employment_type', e.target.value as any)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required
                                            >
                                                <option value="full_time">Full Time</option>
                                                <option value="part_time">Part Time</option>
                                                <option value="contract">Contract</option>
                                                <option value="temporary">Temporary</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Monthly Income *</label>
                                            <input
                                                type="number"
                                                value={data.monthly_income}
                                                onChange={(e) => setData('monthly_income', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Currency *</label>
                                            <select
                                                value={data.income_currency}
                                                onChange={(e) => setData('income_currency', e.target.value as any)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required
                                            >
                                                <option value="eur">EUR</option>
                                                <option value="usd">USD</option>
                                                <option value="gbp">GBP</option>
                                                <option value="chf">CHF</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="border-t border-border pt-4">
                                        <h3 className="mb-4 font-semibold">Employer Contact (Optional)</h3>
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Contact Name</label>
                                                <input
                                                    type="text"
                                                    value={data.employer_contact_name}
                                                    onChange={(e) => setData('employer_contact_name', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Contact Phone</label>
                                                <input
                                                    type="tel"
                                                    value={data.employer_contact_phone}
                                                    onChange={(e) => setData('employer_contact_phone', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Contact Email</label>
                                                <input
                                                    type="email"
                                                    value={data.employer_contact_email}
                                                    onChange={(e) => setData('employer_contact_email', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isStudent && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">University Name *</label>
                                        <input
                                            type="text"
                                            value={data.university_name}
                                            onChange={(e) => setData('university_name', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Program of Study *</label>
                                        <input
                                            type="text"
                                            value={data.program_of_study}
                                            onChange={(e) => setData('program_of_study', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Expected Graduation *</label>
                                        <input
                                            type="date"
                                            value={data.expected_graduation_date}
                                            onChange={(e) => setData('expected_graduation_date', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Income Source *</label>
                                        <input
                                            type="text"
                                            value={data.student_income_source}
                                            onChange={(e) => setData('student_income_source', e.target.value)}
                                            placeholder="Parents, Scholarship..."
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Monthly Income *</label>
                                        <input
                                            type="number"
                                            value={data.monthly_income}
                                            onChange={(e) => setData('monthly_income', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Currency *</label>
                                        <select
                                            value={data.income_currency}
                                            onChange={(e) => setData('income_currency', e.target.value as any)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            required
                                        >
                                            <option value="eur">EUR</option>
                                            <option value="usd">USD</option>
                                            <option value="gbp">GBP</option>
                                            <option value="chf">CHF</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-border pt-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={data.has_guarantor}
                                        onChange={(e) => setData('has_guarantor', e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <label className="text-sm font-medium">I have a guarantor</label>
                                </div>

                                {data.has_guarantor && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Guarantor Name *</label>
                                            <input
                                                type="text"
                                                value={data.guarantor_name}
                                                onChange={(e) => setData('guarantor_name', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required={data.has_guarantor}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Relationship *</label>
                                            <input
                                                type="text"
                                                value={data.guarantor_relationship}
                                                onChange={(e) => setData('guarantor_relationship', e.target.value)}
                                                placeholder="Parent, Sibling..."
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required={data.has_guarantor}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Guarantor Phone *</label>
                                            <input
                                                type="tel"
                                                value={data.guarantor_phone}
                                                onChange={(e) => setData('guarantor_phone', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required={data.has_guarantor}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Guarantor Email *</label>
                                            <input
                                                type="email"
                                                value={data.guarantor_email}
                                                onChange={(e) => setData('guarantor_email', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required={data.has_guarantor}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="mb-2 block text-sm font-medium">Guarantor Address *</label>
                                            <input
                                                type="text"
                                                value={data.guarantor_address}
                                                onChange={(e) => setData('guarantor_address', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required={data.has_guarantor}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Guarantor Employer *</label>
                                            <input
                                                type="text"
                                                value={data.guarantor_employer}
                                                onChange={(e) => setData('guarantor_employer', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required={data.has_guarantor}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Guarantor Monthly Income *</label>
                                            <input
                                                type="number"
                                                value={data.guarantor_monthly_income}
                                                onChange={(e) => setData('guarantor_monthly_income', e.target.value)}
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                required={data.has_guarantor}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Documents */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold">Required Documents</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">ID Document * (PDF, JPG, PNG - Max 20MB)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => setData('id_document', e.target.files?.[0] || null)}
                                        className="w-full"
                                        required={!isEditing}
                                    />
                                    {errors.id_document && <p className="mt-1 text-sm text-red-500">{errors.id_document}</p>}
                                </div>

                                {isEmployed && (
                                    <>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Employment Contract *</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setData('employment_contract', e.target.files?.[0] || null)}
                                                className="w-full"
                                                required={!isEditing}
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Payslip 1 (Most Recent) *</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setData('payslip_1', e.target.files?.[0] || null)}
                                                className="w-full"
                                                required={!isEditing}
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Payslip 2 *</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setData('payslip_2', e.target.files?.[0] || null)}
                                                className="w-full"
                                                required={!isEditing}
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Payslip 3 *</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setData('payslip_3', e.target.files?.[0] || null)}
                                                className="w-full"
                                                required={!isEditing}
                                            />
                                        </div>
                                    </>
                                )}

                                {isStudent && (
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Student Proof (Enrollment Letter) *</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => setData('student_proof', e.target.files?.[0] || null)}
                                            className="w-full"
                                            required={!isEditing}
                                        />
                                    </div>
                                )}

                                {data.has_guarantor && (
                                    <>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Guarantor ID *</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setData('guarantor_id', e.target.files?.[0] || null)}
                                                className="w-full"
                                                required={!isEditing && data.has_guarantor}
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Guarantor Proof of Income *</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => setData('guarantor_proof_income', e.target.files?.[0] || null)}
                                                className="w-full"
                                                required={!isEditing && data.has_guarantor}
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Profile Picture (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('profile_picture', e.target.files?.[0] || null)}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {progress && (
                                <div className="mt-4">
                                    <div className="h-2 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-2 rounded-full bg-primary transition-all"
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">Uploading... {progress.percentage}%</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between border-t border-border pt-6">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-muted disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <div className="text-sm text-muted-foreground">Step {currentStep} of 3</div>

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
                            >
                                Next
                                <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                            >
                                {processing ? 'Submitting...' : isEditing ? 'Update Profile' : 'Submit Profile'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </BaseLayout>
    );
}
