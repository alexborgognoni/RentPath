import type { ApplicationWizardData } from '@/hooks/useApplicationWizard';
import { Briefcase, CheckCircle2, FileText, GraduationCap, Home, MapPin, PawPrint, Phone, User, Users } from 'lucide-react';

const CURRENCY_SYMBOLS: Record<string, string> = {
    eur: '€',
    usd: '$',
    gbp: '£',
    chf: 'CHF',
};

const COUNTRY_NAMES: Record<string, string> = {
    AT: 'Austria',
    BE: 'Belgium',
    CH: 'Switzerland',
    DE: 'Germany',
    ES: 'Spain',
    FR: 'France',
    GB: 'United Kingdom',
    IE: 'Ireland',
    IT: 'Italy',
    LU: 'Luxembourg',
    NL: 'Netherlands',
    PT: 'Portugal',
    US: 'United States',
};

interface ReviewStepProps {
    data: ApplicationWizardData;
    onEditStep: (step: string) => void;
}

export function ReviewStep({ data, onEditStep }: ReviewStepProps) {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Not provided';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: string | number, currency: string) => {
        if (!amount) return 'Not provided';
        const symbol = CURRENCY_SYMBOLS[currency] || '€';
        return `${symbol}${Number(amount).toLocaleString()}`;
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
                    Edit
                </button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );

    const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value || 'Not provided'}</dd>
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
                <h2 className="text-xl font-bold">Review Your Application</h2>
                <p className="mt-1 text-sm text-muted-foreground">Please review all information before submitting. Click "Edit" to make changes.</p>
            </div>

            {/* Personal Information */}
            <Section title="Personal Information" icon={User} step="personal">
                <dl className="grid gap-4 md:grid-cols-3">
                    <Field label="Date of Birth" value={formatDate(data.profile_date_of_birth)} />
                    <Field label="Nationality" value={data.profile_nationality} />
                    <Field
                        label="Phone"
                        value={data.profile_phone_number ? `${data.profile_phone_country_code} ${data.profile_phone_number}` : undefined}
                    />
                </dl>
                <div className="mt-4 border-t border-border pt-4">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <MapPin className="h-3 w-3" /> Current Address
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
                        {COUNTRY_NAMES[data.profile_current_country] || data.profile_current_country}
                    </p>
                </div>
            </Section>

            {/* Employment & Income */}
            <Section title="Employment & Income" icon={isStudent ? GraduationCap : Briefcase} step="employment">
                <dl className="grid gap-4 md:grid-cols-3">
                    <Field
                        label="Employment Status"
                        value={
                            data.profile_employment_status
                                ? data.profile_employment_status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                                : undefined
                        }
                    />

                    {isEmployed && (
                        <>
                            <Field label="Employer" value={data.profile_employer_name} />
                            <Field label="Job Title" value={data.profile_job_title} />
                            <Field label="Monthly Income" value={formatCurrency(data.profile_monthly_income, data.profile_income_currency)} />
                            <Field
                                label="Employment Type"
                                value={
                                    data.profile_employment_type
                                        ? data.profile_employment_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                                        : undefined
                                }
                            />
                            <Field label="Start Date" value={formatDate(data.profile_employment_start_date)} />
                        </>
                    )}

                    {isStudent && (
                        <>
                            <Field label="University" value={data.profile_university_name} />
                            <Field label="Program" value={data.profile_program_of_study} />
                            <Field label="Expected Graduation" value={formatDate(data.profile_expected_graduation_date)} />
                            <Field label="Income Source" value={data.profile_student_income_source} />
                            {data.profile_monthly_income && (
                                <Field label="Monthly Income" value={formatCurrency(data.profile_monthly_income, data.profile_income_currency)} />
                            )}
                        </>
                    )}
                </dl>

                {/* Documents */}
                <div className="mt-4 border-t border-border pt-4">
                    <h4 className="mb-3 text-sm font-medium text-muted-foreground">Documents</h4>
                    <div className="flex flex-wrap gap-2">
                        <DocumentBadge name="ID Document" exists={!!data.profile_id_document} />
                        {isEmployed && (
                            <>
                                <DocumentBadge name="Employment Contract" exists={!!data.profile_employment_contract} />
                                <DocumentBadge name="Payslip 1" exists={!!data.profile_payslip_1} />
                                <DocumentBadge name="Payslip 2" exists={!!data.profile_payslip_2} />
                                <DocumentBadge name="Payslip 3" exists={!!data.profile_payslip_3} />
                            </>
                        )}
                        {isStudent && <DocumentBadge name="Student Proof" exists={!!data.profile_student_proof} />}
                    </div>
                </div>

                {/* Guarantor */}
                {data.profile_has_guarantor && (
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">Guarantor</h4>
                        <dl className="grid gap-4 md:grid-cols-3">
                            <Field label="Name" value={data.profile_guarantor_name} />
                            <Field label="Relationship" value={data.profile_guarantor_relationship} />
                            <Field
                                label="Monthly Income"
                                value={formatCurrency(data.profile_guarantor_monthly_income, data.profile_income_currency)}
                            />
                        </dl>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <DocumentBadge name="Guarantor ID" exists={!!data.profile_guarantor_id} />
                            <DocumentBadge name="Guarantor Income Proof" exists={!!data.profile_guarantor_proof_income} />
                        </div>
                    </div>
                )}
            </Section>

            {/* Application Details */}
            <Section title="Application Details" icon={Home} step="details">
                <dl className="grid gap-4 md:grid-cols-3">
                    <Field label="Desired Move-In Date" value={formatDate(data.desired_move_in_date)} />
                    <Field label="Lease Duration" value={`${data.lease_duration_months} months`} />
                    <Field label="Additional Occupants" value={data.additional_occupants || 0} />
                    <Field label="Pets" value={data.has_pets ? 'Yes' : 'No'} />
                </dl>

                {data.message_to_landlord && (
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Message to Landlord</h4>
                        <p className="text-sm whitespace-pre-wrap">{data.message_to_landlord}</p>
                    </div>
                )}

                {data.occupants_details.length > 0 && (
                    <div className="mt-4 border-t border-border pt-4">
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Users className="h-3 w-3" /> Additional Occupants
                        </h4>
                        <div className="space-y-2">
                            {data.occupants_details.map((occupant, index) => (
                                <div key={index} className="flex items-center gap-4 text-sm">
                                    <span className="font-medium">{occupant.name}</span>
                                    <span className="text-muted-foreground">Age: {occupant.age}</span>
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
                            <PawPrint className="h-3 w-3" /> Pets
                        </h4>
                        <div className="space-y-2">
                            {data.pets_details.map((pet, index) => (
                                <div key={index} className="flex items-center gap-4 text-sm">
                                    <span className="font-medium">{pet.type === 'Other' ? pet.type_other : pet.type}</span>
                                    {pet.breed && <span className="text-muted-foreground">{pet.breed}</span>}
                                    {pet.age && <span className="text-muted-foreground">Age: {pet.age}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Section>

            {/* References */}
            <Section title="References" icon={Phone} step="references">
                {data.previous_landlord_name || data.previous_landlord_phone || data.previous_landlord_email ? (
                    <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">Previous Landlord</h4>
                        <dl className="grid gap-4 md:grid-cols-3">
                            <Field label="Name" value={data.previous_landlord_name} />
                            <Field label="Phone" value={data.previous_landlord_phone} />
                            <Field label="Email" value={data.previous_landlord_email} />
                        </dl>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No previous landlord provided</p>
                )}

                {data.references.length > 0 && (
                    <div className="border-t border-border pt-4">
                        <h4 className="mb-3 text-sm font-medium text-muted-foreground">Personal References</h4>
                        <div className="space-y-3">
                            {data.references.map((ref, index) => (
                                <div key={index} className="rounded-lg bg-muted/50 p-3">
                                    <dl className="grid gap-2 md:grid-cols-3">
                                        <Field label="Name" value={ref.name} />
                                        <Field label="Phone" value={ref.phone} />
                                        <Field label="Email" value={ref.email} />
                                        <Field
                                            label="Relationship"
                                            value={ref.relationship === 'Other' ? ref.relationship_other : ref.relationship}
                                        />
                                        <Field label="Years Known" value={ref.years_known ? `${ref.years_known} years` : undefined} />
                                    </dl>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!data.previous_landlord_name && data.references.length === 0 && (
                    <p className="text-sm text-muted-foreground">No references provided</p>
                )}
            </Section>

            {/* Emergency Contact */}
            <Section title="Emergency Contact" icon={Phone} step="emergency">
                {data.emergency_contact_name ? (
                    <dl className="grid gap-4 md:grid-cols-3">
                        <Field label="Name" value={data.emergency_contact_name} />
                        <Field label="Phone" value={data.emergency_contact_phone} />
                        <Field label="Relationship" value={data.emergency_contact_relationship} />
                    </dl>
                ) : (
                    <p className="text-sm text-muted-foreground">No emergency contact provided</p>
                )}
            </Section>

            {/* Confirmation */}
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-semibold">Ready to Submit</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            By submitting this application, you confirm that all information provided is accurate and complete. Your profile data will
                            be saved for future applications.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
