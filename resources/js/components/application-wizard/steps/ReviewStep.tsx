import { getCurrencySymbol } from '@/components/ui/currency-select';
import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Briefcase, CheckCircle2, FileText, GraduationCap, Home, MapPin, PawPrint, Phone, User, Users } from 'lucide-react';

interface ReviewStepProps {
    data: ApplicationWizardData;
    onEditStep: (step: string) => void;
}

export function ReviewStep({ data, onEditStep }: ReviewStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.reviewStep.${key}`);
    const tCountry = (code: string) => translate(translations, `wizard.locationStep.countries.${code}`);
    const formatDate = (dateStr: string) => {
        if (!dateStr) return t('notProvided');
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: string | number, currency: string) => {
        if (!amount) return t('notProvided');
        const symbol = getCurrencySymbol(currency);
        return `${symbol}${Number(amount).toLocaleString()}`;
    };

    const formatMonths = (months: number | string) => {
        const count = Number(months);
        const parts = t('months').split('|');
        return count === 1 ? parts[0].replace(':count', '1') : (parts[1] || parts[0]).replace(':count', String(count));
    };

    const formatGuarantorAddress = () => {
        const parts = [
            data.profile_guarantor_house_number,
            data.profile_guarantor_street_name,
            data.profile_guarantor_address_line_2,
            data.profile_guarantor_city,
            data.profile_guarantor_state_province,
            data.profile_guarantor_postal_code,
            data.profile_guarantor_country ? tCountry(data.profile_guarantor_country) : null,
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : undefined;
    };

    const isEmployed = data.profile_employment_status === 'employed' || data.profile_employment_status === 'self_employed';
    const isStudent = data.profile_employment_status === 'student';

    const Section = ({ title, icon: Icon, step, children }: { title: string; icon: React.ElementType; step: string; children: React.ReactNode }) => (
        <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{title}</h3>
                </div>
                <button type="button" onClick={() => onEditStep(step)} className="text-sm text-primary hover:underline">
                    {t('edit')}
                </button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );

    const Field = ({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) => (
        <div className={className}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value || t('notProvided')}</dd>
        </div>
    );

    const DocumentBadge = ({ name, exists }: { name: string; exists: boolean }) => (
        <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${exists ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-muted text-muted-foreground'}`}
        >
            {exists ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            {name}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
            </div>

            {/* Personal Information */}
            <Section title={t('sections.personal')} icon={User} step="personal">
                <dl className="grid gap-4 md:grid-cols-3">
                    <Field label={t('labels.dateOfBirth')} value={formatDate(data.profile_date_of_birth)} />
                    <Field label={t('labels.nationality')} value={data.profile_nationality} />
                    <Field
                        label={t('labels.phone')}
                        value={data.profile_phone_number ? `${data.profile_phone_country_code} ${data.profile_phone_number}` : undefined}
                    />
                </dl>
                <div className="mt-4 border-t border-border pt-4">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {t('labels.currentAddress')}
                    </h4>
                    <p className="font-medium">
                        {data.profile_current_house_number} {data.profile_current_street_name}
                        {data.profile_current_address_line_2 && (
                            <>
                                <br />
                                {data.profile_current_address_line_2}
                            </>
                        )}
                        <br />
                        {data.profile_current_city}
                        {data.profile_current_state_province && `, ${data.profile_current_state_province}`} {data.profile_current_postal_code}
                        <br />
                        {tCountry(data.profile_current_country) || data.profile_current_country}
                    </p>
                </div>
            </Section>

            {/* Employment & Income */}
            <Section title={t('sections.employment')} icon={isStudent ? GraduationCap : Briefcase} step="employment">
                <dl className="grid gap-4 md:grid-cols-3">
                    <Field
                        label={t('labels.employmentStatus')}
                        value={
                            data.profile_employment_status
                                ? data.profile_employment_status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                                : undefined
                        }
                    />

                    {isEmployed && (
                        <>
                            <Field label={t('labels.employer')} value={data.profile_employer_name} />
                            <Field label={t('labels.jobTitle')} value={data.profile_job_title} />
                            <Field
                                label={t('labels.monthlyIncome')}
                                value={formatCurrency(data.profile_monthly_income, data.profile_income_currency)}
                            />
                            <Field
                                label={t('labels.employmentType')}
                                value={
                                    data.profile_employment_type
                                        ? data.profile_employment_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                                        : undefined
                                }
                            />
                            <Field label={t('labels.startDate')} value={formatDate(data.profile_employment_start_date)} />
                        </>
                    )}

                    {isStudent && (
                        <>
                            <Field label={t('labels.university')} value={data.profile_university_name} />
                            <Field label={t('labels.program')} value={data.profile_program_of_study} />
                            <Field label={t('labels.expectedGraduation')} value={formatDate(data.profile_expected_graduation_date)} />
                            <Field label={t('labels.incomeSource')} value={data.profile_student_income_source} />
                            {data.profile_monthly_income && (
                                <Field
                                    label={t('labels.monthlyIncome')}
                                    value={formatCurrency(data.profile_monthly_income, data.profile_income_currency)}
                                />
                            )}
                        </>
                    )}
                </dl>

                {/* Documents */}
                <div className="mt-4 border-t border-border pt-4">
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('labels.documents')}</h4>
                    <div className="flex flex-wrap gap-2">
                        <DocumentBadge name={t('documentBadges.idFront')} exists={!!data.profile_id_document_front} />
                        <DocumentBadge name={t('documentBadges.idBack')} exists={!!data.profile_id_document_back} />
                        {isEmployed && (
                            <>
                                <DocumentBadge name={t('documentBadges.employmentContract')} exists={!!data.profile_employment_contract} />
                                <DocumentBadge name={t('documentBadges.payslip1')} exists={!!data.profile_payslip_1} />
                                <DocumentBadge name={t('documentBadges.payslip2')} exists={!!data.profile_payslip_2} />
                                <DocumentBadge name={t('documentBadges.payslip3')} exists={!!data.profile_payslip_3} />
                            </>
                        )}
                        {isStudent && <DocumentBadge name={t('documentBadges.studentProof')} exists={!!data.profile_student_proof} />}
                    </div>
                </div>

                {/* Guarantor */}
                {data.profile_has_guarantor && (
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('labels.guarantor')}</h4>
                        <dl className="grid gap-4 md:grid-cols-2">
                            <Field
                                label={t('labels.name')}
                                value={
                                    data.profile_guarantor_first_name || data.profile_guarantor_last_name
                                        ? `${data.profile_guarantor_first_name} ${data.profile_guarantor_last_name}`.trim()
                                        : undefined
                                }
                            />
                            <Field
                                label={t('labels.relationship')}
                                value={
                                    data.profile_guarantor_relationship === 'Other' && data.profile_guarantor_relationship_other
                                        ? `${data.profile_guarantor_relationship} (${data.profile_guarantor_relationship_other})`
                                        : data.profile_guarantor_relationship
                                }
                            />
                            <Field
                                label={t('labels.phone')}
                                value={
                                    data.profile_guarantor_phone_number
                                        ? `${data.profile_guarantor_phone_country_code} ${data.profile_guarantor_phone_number}`
                                        : undefined
                                }
                            />
                            <Field label={t('labels.email')} value={data.profile_guarantor_email} />
                            <Field label={t('labels.address')} value={formatGuarantorAddress()} className="md:col-span-2" />
                            <Field label={t('labels.employmentStatus')} value={data.profile_guarantor_employment_status} />
                            {(data.profile_guarantor_employment_status === 'employed' ||
                                data.profile_guarantor_employment_status === 'self_employed') && (
                                <>
                                    <Field label={t('labels.employer')} value={data.profile_guarantor_employer_name} />
                                    <Field label={t('labels.jobTitle')} value={data.profile_guarantor_job_title} />
                                </>
                            )}
                            {data.profile_guarantor_employment_status === 'student' && (
                                <>
                                    <Field label={t('labels.university')} value={data.profile_guarantor_university_name} />
                                    <Field label={t('labels.program')} value={data.profile_guarantor_program_of_study} />
                                </>
                            )}
                            <Field
                                label={t('labels.monthlyIncome')}
                                value={formatCurrency(
                                    data.profile_guarantor_monthly_income,
                                    data.profile_guarantor_income_currency || data.profile_income_currency,
                                )}
                            />
                        </dl>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <DocumentBadge name={t('documentBadges.guarantorIdFront')} exists={!!data.profile_guarantor_id_front} />
                            <DocumentBadge name={t('documentBadges.guarantorIdBack')} exists={!!data.profile_guarantor_id_back} />
                            {(data.profile_guarantor_employment_status === 'employed' ||
                                data.profile_guarantor_employment_status === 'self_employed') && (
                                <>
                                    <DocumentBadge
                                        name={t('documentBadges.guarantorEmploymentContract')}
                                        exists={!!data.profile_guarantor_employment_contract}
                                    />
                                    <DocumentBadge name={t('documentBadges.guarantorPayslip1')} exists={!!data.profile_guarantor_payslip_1} />
                                    <DocumentBadge name={t('documentBadges.guarantorPayslip2')} exists={!!data.profile_guarantor_payslip_2} />
                                    <DocumentBadge name={t('documentBadges.guarantorPayslip3')} exists={!!data.profile_guarantor_payslip_3} />
                                </>
                            )}
                            {data.profile_guarantor_employment_status === 'student' && (
                                <DocumentBadge name={t('documentBadges.guarantorStudentProof')} exists={!!data.profile_guarantor_student_proof} />
                            )}
                            {(data.profile_guarantor_employment_status === 'unemployed' ||
                                data.profile_guarantor_employment_status === 'retired') && (
                                <DocumentBadge name={t('documentBadges.guarantorIncomeProof')} exists={!!data.profile_guarantor_other_income_proof} />
                            )}
                        </div>
                    </div>
                )}
            </Section>

            {/* Application Details */}
            <Section title={t('sections.details')} icon={Home} step="details">
                <dl className="grid gap-4 md:grid-cols-3">
                    <Field label={t('labels.moveInDate')} value={formatDate(data.desired_move_in_date)} />
                    <Field label={t('labels.leaseDuration')} value={formatMonths(data.lease_duration_months)} />
                    <Field label={t('labels.additionalOccupants')} value={data.additional_occupants || 0} />
                    <Field label={t('labels.pets')} value={data.has_pets ? 'Yes' : 'No'} />
                </dl>

                {data.message_to_landlord && (
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">{t('labels.messageToLandlord')}</h4>
                        <p className="text-sm whitespace-pre-wrap">{data.message_to_landlord}</p>
                    </div>
                )}

                {data.occupants_details.length > 0 && (
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Users className="h-3 w-3" /> {t('labels.additionalOccupants')}
                        </h4>
                        <div className="space-y-2">
                            {data.occupants_details.map((occupant, index) => (
                                <div key={index} className="flex items-center gap-4 text-sm">
                                    <span className="font-medium">{occupant.name}</span>
                                    <span className="text-muted-foreground">{t('labels.age').replace(':age', String(occupant.age))}</span>
                                    <span className="text-muted-foreground">
                                        {occupant.relationship === 'Other' ? occupant.relationship_other : occupant.relationship}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.has_pets && data.pets_details.length > 0 && (
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <PawPrint className="h-3 w-3" /> {t('labels.pets')}
                        </h4>
                        <div className="space-y-2">
                            {data.pets_details.map((pet, index) => (
                                <div key={index} className="flex items-center gap-4 text-sm">
                                    <span className="font-medium">{pet.type === 'Other' ? pet.type_other : pet.type}</span>
                                    {pet.breed && <span className="text-muted-foreground">{pet.breed}</span>}
                                    {pet.age && <span className="text-muted-foreground">{t('labels.age').replace(':age', String(pet.age))}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Section>

            {/* References */}
            <Section title={t('sections.references')} icon={Phone} step="references">
                {data.references.filter((r) => r.type === 'landlord').length > 0 ? (
                    <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">{t('labels.previousLandlord')}</h4>
                        <div className="space-y-3">
                            {data.references
                                .filter((r) => r.type === 'landlord')
                                .map((ref, index) => (
                                    <div key={index} className="rounded-lg bg-muted/50 p-3">
                                        <dl className="grid gap-2 md:grid-cols-3">
                                            <Field label={t('labels.name')} value={ref.name} />
                                            <Field label={t('labels.phone')} value={ref.phone} />
                                            <Field label={t('labels.email')} value={ref.email} />
                                            <Field
                                                label={t('labels.relationship')}
                                                value={ref.relationship === 'Other' ? ref.relationship_other : ref.relationship}
                                            />
                                            <Field label={t('labels.yearsKnown')} value={ref.years_known ? `${ref.years_known} years` : undefined} />
                                        </dl>
                                    </div>
                                ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">{t('noPreviousLandlord')}</p>
                )}

                {data.references.filter((r) => r.type === 'professional').length > 0 && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('labels.professionalReferences')}</h4>
                        <div className="space-y-3">
                            {data.references
                                .filter((r) => r.type === 'professional')
                                .map((ref, index) => (
                                    <div key={index} className="rounded-lg bg-muted/50 p-3">
                                        <dl className="grid gap-2 md:grid-cols-3">
                                            <Field label={t('labels.name')} value={ref.name} />
                                            <Field label={t('labels.phone')} value={ref.phone} />
                                            <Field label={t('labels.email')} value={ref.email} />
                                            <Field
                                                label={t('labels.relationship')}
                                                value={ref.relationship === 'Other' ? ref.relationship_other : ref.relationship}
                                            />
                                            <Field label={t('labels.yearsKnown')} value={ref.years_known ? `${ref.years_known} years` : undefined} />
                                        </dl>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {data.references.filter((r) => r.type === 'personal').length > 0 && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">{t('labels.personalReferences')}</h4>
                        <div className="space-y-3">
                            {data.references
                                .filter((r) => r.type === 'personal')
                                .map((ref, index) => (
                                    <div key={index} className="rounded-lg bg-muted/50 p-3">
                                        <dl className="grid gap-2 md:grid-cols-3">
                                            <Field label={t('labels.name')} value={ref.name} />
                                            <Field label={t('labels.phone')} value={ref.phone} />
                                            <Field label={t('labels.email')} value={ref.email} />
                                            <Field
                                                label={t('labels.relationship')}
                                                value={ref.relationship === 'Other' ? ref.relationship_other : ref.relationship}
                                            />
                                            <Field label={t('labels.yearsKnown')} value={ref.years_known ? `${ref.years_known} years` : undefined} />
                                        </dl>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {data.references.length === 0 && <p className="text-sm text-muted-foreground">{t('noReferences')}</p>}
            </Section>

            {/* Emergency Contact */}
            <Section title={t('sections.emergency')} icon={Phone} step="emergency">
                {data.emergency_contact_name ? (
                    <dl className="grid gap-4 md:grid-cols-3">
                        <Field label={t('labels.name')} value={data.emergency_contact_name} />
                        <Field label={t('labels.phone')} value={data.emergency_contact_phone} />
                        <Field label={t('labels.relationship')} value={data.emergency_contact_relationship} />
                    </dl>
                ) : (
                    <p className="text-sm text-muted-foreground">{t('noEmergencyContact')}</p>
                )}
            </Section>

            {/* Confirmation */}
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-semibold">{t('confirmation.title')}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{t('confirmation.description')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
