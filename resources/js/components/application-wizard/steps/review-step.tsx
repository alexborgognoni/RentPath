import type { UploadedFile } from '@/components/ui/file-upload';
import type { ApplicationWizardData } from '@/hooks/use-application-wizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    CreditCard,
    FileText,
    GraduationCap,
    Home,
    MapPin,
    PawPrint,
    Phone,
    Shield,
    Upload,
    User,
    UserPlus,
    Users,
} from 'lucide-react';

interface ReviewStepProps {
    data: ApplicationWizardData;
    onEditStep: (step: string) => void;
}

export function ReviewStep({ data, onEditStep }: ReviewStepProps) {
    const { translations, auth } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.reviewStep.${key}`);

    // Translation helpers for other steps
    const tHistory = (key: string) => translate(translations, `wizard.application.historyStep.${key}`);
    const tFinancial = (key: string) => translate(translations, `wizard.application.financialStep.${key}`);
    const tHousehold = (key: string) => translate(translations, `wizard.application.householdStep.${key}`);

    // Get country name from translation, fallback to code if not found
    const getCountryName = (code: string) => {
        if (!code) return undefined;
        const key = `wizard.locationStep.countries.${code}`;
        const translated = translate(translations, key);
        // If translate returns the key, use the code instead
        return translated === key ? code : translated;
    };

    // Format enum values: replace all underscores with spaces and title case
    const formatEnum = (value: string | undefined) => {
        if (!value) return undefined;
        return value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    };

    // Living situation translation lookup
    const getLivingSituation = (value: string | undefined) => {
        if (!value) return undefined;
        const keyMap: Record<string, string> = {
            renting: 'renting',
            owner: 'owner',
            living_with_family: 'livingWithFamily',
            student_housing: 'studentHousing',
            employer_provided: 'employerProvided',
            other: 'other',
        };
        const key = keyMap[value];
        if (key) {
            const translated = tHistory(`livingSituations.${key}`);
            if (!translated.includes('livingSituations')) return translated;
        }
        return formatEnum(value);
    };

    // Reason for moving translation lookup
    const getReasonForMoving = (value: string | undefined) => {
        if (!value) return undefined;
        const keyMap: Record<string, string> = {
            relocation_work: 'relocationWork',
            relocation_personal: 'relocationPersonal',
            upsizing: 'upsizing',
            downsizing: 'downsizing',
            end_of_lease: 'endOfLease',
            buying_property: 'buyingProperty',
            relationship_change: 'relationshipChange',
            closer_to_family: 'closerToFamily',
            better_location: 'betterLocation',
            cost: 'cost',
            first_time_renter: 'firstTimeRenter',
            other: 'other',
        };
        const key = keyMap[value];
        if (key) {
            const translated = tHistory(`reasonsForMoving.${key}`);
            if (!translated.includes('reasonsForMoving')) return translated;
        }
        return formatEnum(value);
    };

    // Employment status translation lookup
    const getEmploymentStatus = (value: string | undefined) => {
        if (!value) return undefined;
        const keyMap: Record<string, string> = {
            employed: 'employed',
            self_employed: 'selfEmployed',
            student: 'student',
            retired: 'retired',
            unemployed: 'unemployed',
            other: 'other',
        };
        const key = keyMap[value];
        if (key) {
            const translated = tFinancial(`employmentStatus.options.${key}`);
            if (!translated.includes('employmentStatus')) return translated;
        }
        return formatEnum(value);
    };

    // Relationship translation lookup
    const getRelationship = (value: string | undefined) => {
        if (!value) return undefined;
        const keyMap: Record<string, string> = {
            spouse: 'spouse',
            partner: 'partner',
            parent: 'parent',
            child: 'child',
            sibling: 'sibling',
            friend: 'friend',
            relative: 'relative',
            colleague: 'colleague',
            professional: 'professional',
            personal: 'personal',
            other: 'other',
        };
        const key = keyMap[value];
        if (key) {
            const translated = tHousehold(`relationships.${key}`);
            if (!translated.includes('relationships')) return translated;
        }
        return formatEnum(value);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return t('notProvided') || 'Not provided';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatMonths = (months: number | string) => {
        const count = Number(months);
        const template = t('months') || ':count month|:count months';
        const parts = template.split('|');
        return count === 1 ? parts[0].replace(':count', '1') : (parts[1] || parts[0]).replace(':count', String(count));
    };

    const formatAddress = (prefix: string) => {
        const streetName = data[`${prefix}_street_name` as keyof ApplicationWizardData] as string;
        const houseNumber = data[`${prefix}_house_number` as keyof ApplicationWizardData] as string;
        const addressLine2 = data[`${prefix}_address_line_2` as keyof ApplicationWizardData] as string;
        const city = data[`${prefix}_city` as keyof ApplicationWizardData] as string;
        const stateProvince = data[`${prefix}_state_province` as keyof ApplicationWizardData] as string;
        const postalCode = data[`${prefix}_postal_code` as keyof ApplicationWizardData] as string;
        const country = data[`${prefix}_country` as keyof ApplicationWizardData] as string;

        const parts = [houseNumber, streetName, addressLine2, city, stateProvince, postalCode, getCountryName(country)].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : undefined;
    };

    const isEmployed = data.profile_employment_status === 'employed' || data.profile_employment_status === 'self_employed';
    const isStudent = data.profile_employment_status === 'student';

    // Section component for consistent styling
    const Section = ({ title, icon: Icon, step, children }: { title: string; icon: React.ElementType; step: string; children: React.ReactNode }) => (
        <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{title}</h3>
                </div>
                <button type="button" onClick={() => onEditStep(step)} className="cursor-pointer text-sm text-primary hover:underline">
                    {t('edit') || 'Edit'}
                </button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );

    // Field component for consistent styling
    const Field = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
        <div className={className}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value || t('notProvided') || 'Not provided'}</dd>
        </div>
    );

    // Document badge component
    const DocumentBadge = ({ name, exists }: { name: string; exists: boolean }) => (
        <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${exists ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
        >
            <FileText className="h-4 w-4" />
            {name}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('title') || 'Review Your Application'}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('description') || 'Please review all information before submitting. Click "Edit" to make changes.'}
                </p>
            </div>

            {/* ===== Identity Step ===== */}
            <Section title={t('sections.identity') || 'Identity & Legal Eligibility'} icon={User} step="identity">
                {/* Personal Details */}
                <div className="mb-4">
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('subsections.personalDetails') || 'Personal Details'}</h4>
                    <dl className="grid gap-4 md:grid-cols-3">
                        <Field label={t('labels.name') || 'Name'} value={`${auth.user.first_name} ${auth.user.last_name}`} />
                        <Field label={t('labels.email') || 'Email'} value={auth.user.email} />
                        <Field label={t('labels.dateOfBirth') || 'Date of Birth'} value={formatDate(data.profile_date_of_birth)} />
                        <Field label={t('labels.nationality') || 'Nationality'} value={getCountryName(data.profile_nationality)} />
                        <Field
                            label={t('labels.phone') || 'Phone'}
                            value={data.profile_phone_number ? `${data.profile_phone_country_code} ${data.profile_phone_number}` : undefined}
                        />
                    </dl>
                </div>

                {/* ID Document */}
                <div className="border-t border-border pt-4">
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('subsections.idDocument') || 'ID Document'}</h4>
                    <dl className="grid gap-4 md:grid-cols-3">
                        <Field label={t('labels.documentType') || 'Document Type'} value={formatEnum(data.profile_id_document_type)} />
                        <Field label={t('labels.documentNumber') || 'Document Number'} value={data.profile_id_number} />
                        <Field label={t('labels.issuingCountry') || 'Issuing Country'} value={getCountryName(data.profile_id_issuing_country)} />
                        <Field label={t('labels.expiryDate') || 'Expiry Date'} value={formatDate(data.profile_id_expiry_date)} />
                    </dl>
                </div>

                {/* Immigration Status */}
                {data.profile_immigration_status && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
                            {t('subsections.immigrationStatus') || 'Immigration Status'}
                        </h4>
                        <dl className="grid gap-4 md:grid-cols-3">
                            <Field
                                label={t('labels.status') || 'Status'}
                                value={
                                    data.profile_immigration_status === 'other'
                                        ? data.profile_immigration_status_other
                                        : formatEnum(data.profile_immigration_status)
                                }
                            />
                            {data.profile_visa_type && (
                                <Field
                                    label={t('labels.visaType') || 'Visa/Permit Type'}
                                    value={data.profile_visa_type === 'other' ? data.profile_visa_type_other : formatEnum(data.profile_visa_type)}
                                />
                            )}
                            {data.profile_visa_expiry_date && (
                                <Field label={t('labels.visaExpiry') || 'Visa Expiry'} value={formatDate(data.profile_visa_expiry_date)} />
                            )}
                        </dl>
                    </div>
                )}

                {/* Right to Rent */}
                {data.profile_right_to_rent_share_code && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('subsections.rightToRent') || 'Right to Rent'}</h4>
                        <dl className="grid gap-4 md:grid-cols-2">
                            <Field label={t('labels.shareCode') || 'Share Code'} value={data.profile_right_to_rent_share_code} />
                        </dl>
                    </div>
                )}
            </Section>

            {/* ===== Household Step ===== */}
            <Section title={t('sections.household') || 'Household Composition'} icon={Home} step="household">
                {/* Rental Intent */}
                <div className="mb-4">
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('subsections.rentalIntent') || 'Rental Intent'}</h4>
                    <dl className="grid gap-4 md:grid-cols-3">
                        <Field label={t('labels.moveInDate') || 'Desired Move-In Date'} value={formatDate(data.desired_move_in_date)} />
                        <Field label={t('labels.leaseDuration') || 'Lease Duration'} value={formatMonths(data.lease_duration_months)} />
                        {(data.is_flexible_on_move_in || data.is_flexible_on_duration) && (
                            <Field
                                label={t('labels.flexibility') || 'Flexibility'}
                                value={[
                                    data.is_flexible_on_move_in ? t('labels.flexibleMoveIn') || 'Flexible on move-in' : null,
                                    data.is_flexible_on_duration ? t('labels.flexibleDuration') || 'Flexible on duration' : null,
                                ]
                                    .filter(Boolean)
                                    .join(', ')}
                            />
                        )}
                    </dl>
                    {data.message_to_landlord && (
                        <div className="mt-4">
                            <dt className="text-sm text-muted-foreground">{t('labels.messageToLandlord') || 'Message to Landlord'}</dt>
                            <dd className="mt-1 text-sm whitespace-pre-wrap">{data.message_to_landlord}</dd>
                        </div>
                    )}
                </div>

                {/* Occupants */}
                {data.occupants_details.length > 0 && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Users className="h-3 w-3" /> {t('subsections.occupants') || 'Additional Occupants'}{' '}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.occupants_details.length}</span>
                        </h4>
                        <div className="space-y-2">
                            {data.occupants_details.map((occupant, index) => {
                                const age = occupant.date_of_birth
                                    ? Math.floor((Date.now() - new Date(occupant.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                                    : null;
                                return (
                                    <div key={index} className="flex items-center gap-4 text-sm">
                                        <span className="font-medium">
                                            {occupant.first_name} {occupant.last_name}
                                        </span>
                                        {age !== null && (
                                            <span className="text-muted-foreground">
                                                {(t('labels.age') || 'Age: :age').replace(':age', String(age))}
                                            </span>
                                        )}
                                        <span className="text-muted-foreground">
                                            {occupant.relationship === 'other' ? occupant.relationship_other : getRelationship(occupant.relationship)}
                                        </span>
                                        {occupant.will_sign_lease && (
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                                {t('labels.leaseSigner') || 'Lease Signer'}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Pets */}
                {data.pets_details.length > 0 && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <PawPrint className="h-3 w-3" /> {t('subsections.pets') || 'Pets'}{' '}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.pets_details.length}</span>
                        </h4>
                        <div className="space-y-2">
                            {data.pets_details.map((pet, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-4 text-sm">
                                    <span className="font-medium">{pet.type === 'other' ? pet.type_other : formatEnum(pet.type)}</span>
                                    {pet.breed && <span className="text-muted-foreground">{pet.breed}</span>}
                                    {pet.name && <span className="text-muted-foreground">"{pet.name}"</span>}
                                    {pet.age && (
                                        <span className="text-muted-foreground">
                                            {pet.age} {t('labels.yearsOld') || 'years old'}
                                        </span>
                                    )}
                                    {pet.size && <span className="text-muted-foreground">{formatEnum(pet.size)}</span>}
                                    {pet.is_registered_assistance_animal && (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                            {t('labels.assistanceAnimal') || 'Assistance Animal'}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Emergency Contact */}
                {(data.emergency_contact_first_name || data.emergency_contact_last_name) && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Phone className="h-3 w-3" /> {t('subsections.emergencyContact') || 'Emergency Contact'}
                        </h4>
                        <dl className="grid gap-4 md:grid-cols-2">
                            <Field
                                label={t('labels.name') || 'Name'}
                                value={`${data.emergency_contact_first_name} ${data.emergency_contact_last_name}`.trim()}
                            />
                            <Field
                                label={t('labels.relationship') || 'Relationship'}
                                value={
                                    data.emergency_contact_relationship === 'other'
                                        ? data.emergency_contact_relationship_other
                                        : getRelationship(data.emergency_contact_relationship)
                                }
                            />
                            <Field
                                label={t('labels.phone') || 'Phone'}
                                value={
                                    data.emergency_contact_phone_number
                                        ? `${data.emergency_contact_phone_country_code} ${data.emergency_contact_phone_number}`
                                        : undefined
                                }
                            />
                            {data.emergency_contact_email && <Field label={t('labels.email') || 'Email'} value={data.emergency_contact_email} />}
                        </dl>
                    </div>
                )}
            </Section>

            {/* ===== Financial Step ===== */}
            <Section title={t('sections.financial') || 'Financial Capability'} icon={isStudent ? GraduationCap : Briefcase} step="financial">
                <dl className="grid gap-4 md:grid-cols-3">
                    <Field label={t('labels.employmentStatus') || 'Employment Status'} value={getEmploymentStatus(data.profile_employment_status)} />

                    {isEmployed && (
                        <>
                            <Field label={t('labels.employer') || 'Employer'} value={data.profile_employer_name} />
                            <Field label={t('labels.jobTitle') || 'Job Title'} value={data.profile_job_title} />
                            <Field label={t('labels.employmentType') || 'Employment Type'} value={formatEnum(data.profile_employment_type)} />
                            <Field label={t('labels.startDate') || 'Start Date'} value={formatDate(data.profile_employment_start_date)} />
                            <Field
                                label={t('labels.monthlyIncome') || 'Monthly Income'}
                                value={
                                    data.profile_monthly_income
                                        ? `${data.profile_income_currency} ${Number(data.profile_monthly_income).toLocaleString()}`
                                        : undefined
                                }
                            />
                        </>
                    )}

                    {isStudent && (
                        <>
                            <Field label={t('labels.university') || 'University'} value={data.profile_university_name} />
                            <Field label={t('labels.program') || 'Program'} value={data.profile_program_of_study} />
                            <Field
                                label={t('labels.expectedGraduation') || 'Expected Graduation'}
                                value={formatDate(data.profile_expected_graduation_date)}
                            />
                            {data.profile_monthly_income && (
                                <Field
                                    label={t('labels.monthlyIncome') || 'Monthly Income'}
                                    value={`${data.profile_income_currency} ${Number(data.profile_monthly_income).toLocaleString()}`}
                                />
                            )}
                        </>
                    )}
                </dl>
            </Section>

            {/* ===== Support Step ===== */}
            <Section title={t('sections.support') || 'Financial Support'} icon={Shield} step="support">
                {/* Co-Signers */}
                {data.co_signers.length > 0 && (
                    <div className="mb-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Users className="h-3 w-3" /> {t('subsections.coSigners') || 'Co-Signers'}{' '}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.co_signers.length}</span>
                        </h4>
                        <div className="space-y-2">
                            {data.co_signers.map((cs, index) => (
                                <div key={index} className="flex items-center gap-4 text-sm">
                                    <span className="font-medium">
                                        {cs.first_name} {cs.last_name}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {cs.relationship === 'other' ? cs.relationship_other : getRelationship(cs.relationship)}
                                    </span>
                                    {cs.from_occupant_index !== null && (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                            {t('labels.fromHousehold') || 'From Household'}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Guarantors */}
                {data.guarantors.length > 0 && (
                    <div className={data.co_signers.length > 0 ? 'border-t border-border pt-4' : ''}>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <UserPlus className="h-3 w-3" /> {t('subsections.guarantors') || 'Guarantors'}{' '}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.guarantors.length}</span>
                        </h4>
                        <div className="space-y-2">
                            {data.guarantors.map((g, index) => (
                                <div key={index} className="flex items-center gap-4 text-sm">
                                    <span className="font-medium">
                                        {g.first_name} {g.last_name}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {g.relationship === 'other' ? g.relationship_other : getRelationship(g.relationship)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Insurance */}
                {data.interested_in_rent_insurance && (
                    <div className={data.co_signers.length > 0 || data.guarantors.length > 0 ? 'border-t border-border pt-4' : ''}>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Shield className="h-3 w-3" /> {t('subsections.insurance') || 'Rent Insurance'}
                        </h4>
                        <dl className="grid gap-4 md:grid-cols-2">
                            <Field
                                label={t('labels.insuranceInterest') || 'Interest'}
                                value={
                                    data.interested_in_rent_insurance === 'yes'
                                        ? t('labels.insuranceYes') || 'Interested'
                                        : data.interested_in_rent_insurance === 'already_have'
                                          ? t('labels.insuranceAlreadyHave') || 'Already Have'
                                          : t('labels.insuranceNo') || 'Not Interested'
                                }
                            />
                            {data.existing_insurance_provider && (
                                <Field label={t('labels.insuranceProvider') || 'Provider'} value={data.existing_insurance_provider} />
                            )}
                            {data.existing_insurance_policy_number && (
                                <Field label={t('labels.policyNumber') || 'Policy Number'} value={data.existing_insurance_policy_number} />
                            )}
                        </dl>
                    </div>
                )}

                {data.co_signers.length === 0 && data.guarantors.length === 0 && !data.interested_in_rent_insurance && (
                    <p className="text-sm text-muted-foreground">{t('noSupport') || 'No financial support added'}</p>
                )}
            </Section>

            {/* ===== History Step ===== */}
            <Section title={t('sections.history') || 'Credit & Rental History'} icon={CreditCard} step="history">
                {/* Credit Check */}
                <div className="mb-4">
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('subsections.creditCheck') || 'Credit Check'}</h4>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <Field
                            label={t('labels.creditCheckAuthorized') || 'Credit Check'}
                            value={
                                data.authorize_credit_check ? t('labels.authorized') || 'Authorized' : t('labels.notAuthorized') || 'Not Authorized'
                            }
                        />
                        {data.authorize_background_check && (
                            <Field label={t('labels.backgroundCheck') || 'Background Check'} value={t('labels.authorized') || 'Authorized'} />
                        )}
                        {data.credit_check_provider_preference && data.credit_check_provider_preference !== 'no_preference' && (
                            <Field
                                label={t('labels.creditProvider') || 'Preferred Provider'}
                                value={formatEnum(data.credit_check_provider_preference)}
                            />
                        )}
                    </dl>

                    {/* Disclosures */}
                    {(data.has_ccjs_or_bankruptcies || data.has_eviction_history) && (
                        <div className="mt-4 space-y-3">
                            {data.has_ccjs_or_bankruptcies && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                        {t('labels.hasCcjsBankruptcies') || 'Has CCJs/Bankruptcies'}
                                    </p>
                                    {data.ccj_bankruptcy_details && (
                                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{data.ccj_bankruptcy_details}</p>
                                    )}
                                </div>
                            )}
                            {data.has_eviction_history && (
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                        {t('labels.hasEvictionHistory') || 'Has Eviction History'}
                                    </p>
                                    {data.eviction_details && (
                                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{data.eviction_details}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Current Address */}
                <div className="border-t border-border pt-4">
                    <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Home className="h-3 w-3" /> {t('subsections.currentAddress') || 'Current Address'}
                    </h4>
                    <dl className="grid gap-4 md:grid-cols-2">
                        <Field label={t('labels.livingSituation') || 'Living Situation'} value={getLivingSituation(data.current_living_situation)} />
                        <Field label={t('labels.address') || 'Address'} value={formatAddress('current_address')} />
                        <Field label={t('labels.currentMoveInDate') || 'Living Since'} value={formatDate(data.current_address_move_in_date)} />
                        {data.current_monthly_rent && (
                            <Field
                                label={t('labels.monthlyRent') || 'Monthly Rent'}
                                value={`${data.current_rent_currency || 'EUR'} ${Number(data.current_monthly_rent).toLocaleString()}`}
                            />
                        )}
                        {data.current_landlord_name && (
                            <Field label={t('labels.currentLandlord') || 'Current Landlord'} value={data.current_landlord_name} />
                        )}
                        {data.current_landlord_contact && (
                            <Field label={t('labels.landlordContact') || 'Landlord Contact'} value={data.current_landlord_contact} />
                        )}
                        <Field
                            label={t('labels.reasonForMoving') || 'Reason for Moving'}
                            value={data.reason_for_moving === 'other' ? data.reason_for_moving_other : getReasonForMoving(data.reason_for_moving)}
                        />
                    </dl>
                </div>

                {/* Previous Addresses */}
                {data.previous_addresses.length > 0 && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {t('subsections.previousAddresses') || 'Previous Addresses'}{' '}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.previous_addresses.length}</span>
                        </h4>
                        <div className="space-y-2">
                            {data.previous_addresses.map((addr, index) => (
                                <div key={index} className="text-sm">
                                    <span className="font-medium">
                                        {addr.house_number} {addr.street_name}, {addr.city}
                                    </span>
                                    {addr.from_date && addr.to_date && (
                                        <span className="text-muted-foreground">
                                            {' '}
                                            ({formatDate(addr.from_date)} - {formatDate(addr.to_date)})
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Landlord References */}
                {data.landlord_references.length > 0 && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Building2 className="h-3 w-3" /> {t('subsections.landlordReferences') || 'Landlord References'}{' '}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.landlord_references.length}</span>
                        </h4>
                        <div className="space-y-3">
                            {data.landlord_references.map((ref, index) => (
                                <div key={index} className="rounded-lg border border-border p-3">
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <span className="font-medium">{ref.name}</span>
                                        {ref.company && <span className="text-muted-foreground">{ref.company}</span>}
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        {ref.email && <span>{ref.email}</span>}
                                        {ref.phone && <span>{ref.phone}</span>}
                                        {ref.property_address && <span>{ref.property_address}</span>}
                                        {(ref.tenancy_start_date || ref.tenancy_end_date) && (
                                            <span>
                                                {ref.tenancy_start_date && formatDate(ref.tenancy_start_date)}
                                                {ref.tenancy_start_date && ref.tenancy_end_date && ' - '}
                                                {ref.tenancy_end_date && formatDate(ref.tenancy_end_date)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other References */}
                {data.other_references.length > 0 && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <User className="h-3 w-3" /> {t('subsections.otherReferences') || 'Other References'}{' '}
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.other_references.length}</span>
                        </h4>
                        <div className="space-y-3">
                            {data.other_references.map((ref, index) => (
                                <div key={index} className="rounded-lg border border-border p-3">
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <span className="font-medium">{ref.name}</span>
                                        <span className="text-muted-foreground">{formatEnum(ref.relationship)}</span>
                                        {ref.years_known && (
                                            <span className="text-muted-foreground">
                                                {(t('labels.yearsKnown') || ':years years').replace(':years', String(ref.years_known))}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        {ref.email && <span>{ref.email}</span>}
                                        {ref.phone && <span>{ref.phone}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Section>

            {/* ===== Additional Step ===== */}
            {((data.additional_documents && (data.additional_documents as UploadedFile[]).length > 0) || data.additional_information) && (
                <Section title={t('sections.additional') || 'Additional Information'} icon={Upload} step="additional">
                    {/* Additional Documents */}
                    {data.additional_documents && (data.additional_documents as UploadedFile[]).length > 0 && (
                        <div className="mb-4">
                            <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('subsections.documents') || 'Supporting Documents'}</h4>
                            <div className="flex flex-wrap gap-2">
                                {(data.additional_documents as UploadedFile[]).map((doc, index) => (
                                    <DocumentBadge key={index} name={doc.originalName || `Document ${index + 1}`} exists={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Notes */}
                    {data.additional_information && (
                        <div
                            className={
                                data.additional_documents && (data.additional_documents as UploadedFile[]).length > 0
                                    ? 'border-t border-border pt-4'
                                    : ''
                            }
                        >
                            <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('subsections.notes') || 'Additional Notes'}</h4>
                            <p className="text-sm whitespace-pre-wrap">{data.additional_information}</p>
                        </div>
                    )}
                </Section>
            )}
        </div>
    );
}
