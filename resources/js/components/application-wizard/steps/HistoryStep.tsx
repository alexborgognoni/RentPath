import { SimpleSelect, type SelectOption } from '@/components/ui/simple-select';
import type {
    ApplicationWizardData,
    LandlordReferenceDetails,
    OtherReferenceDetails,
    PreviousAddressDetails,
    ReferenceDetails,
} from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Building2, ChevronDown, ChevronUp, CreditCard, Home, MapPin, Plus, Trash2, User } from 'lucide-react';
import { useMemo, useState } from 'react';

interface HistoryStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    // Previous addresses
    addPreviousAddress: () => void;
    removePreviousAddress: (index: number) => void;
    updatePreviousAddress: (index: number, field: keyof PreviousAddressDetails, value: string | boolean) => void;
    // Landlord references
    addLandlordReference: () => void;
    removeLandlordReference: (index: number) => void;
    updateLandlordReference: (index: number, field: keyof LandlordReferenceDetails, value: string | boolean) => void;
    // Other references
    addOtherReference: () => void;
    removeOtherReference: (index: number) => void;
    updateOtherReference: (index: number, field: keyof OtherReferenceDetails, value: string | boolean) => void;
    // Legacy references (for backwards compatibility)
    addReference: (type?: 'landlord' | 'personal' | 'professional') => void;
    removeReference: (index: number) => void;
    updateReference: (index: number, field: keyof ReferenceDetails, value: string) => void;
    onBlur: () => void;
}

export function HistoryStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    addPreviousAddress,
    removePreviousAddress,
    updatePreviousAddress,
    addLandlordReference,
    removeLandlordReference,
    updateLandlordReference,
    addOtherReference,
    removeOtherReference,
    updateOtherReference,
    onBlur: _onBlur,
}: HistoryStepProps) {
    void _onBlur; // Destructured for interface consistency but unused in this component
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.historyStep.${key}`);

    // Collapsible sections state
    const [expandedSections, setExpandedSections] = useState({
        creditCheck: true,
        currentAddress: false,
        previousAddresses: false,
        landlordReferences: false,
        otherReferences: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Living situation options
    const LIVING_SITUATIONS: SelectOption[] = useMemo(
        () => [
            { value: 'renting', label: t('livingSituations.renting') || 'Renting' },
            { value: 'owner', label: t('livingSituations.owner') || 'Owner' },
            { value: 'living_with_family', label: t('livingSituations.livingWithFamily') || 'Living with Family' },
            { value: 'student_housing', label: t('livingSituations.studentHousing') || 'Student Housing' },
            { value: 'employer_provided', label: t('livingSituations.employerProvided') || 'Employer Provided' },
            { value: 'other', label: t('livingSituations.other') || 'Other' },
        ],
        [translations],
    );

    // Reason for moving options
    const REASONS_FOR_MOVING: SelectOption[] = useMemo(
        () => [
            { value: 'relocation_work', label: t('reasonsForMoving.relocationWork') || 'Work Relocation' },
            { value: 'relocation_personal', label: t('reasonsForMoving.relocationPersonal') || 'Personal Relocation' },
            { value: 'upsizing', label: t('reasonsForMoving.upsizing') || 'Upsizing' },
            { value: 'downsizing', label: t('reasonsForMoving.downsizing') || 'Downsizing' },
            { value: 'end_of_lease', label: t('reasonsForMoving.endOfLease') || 'End of Lease' },
            { value: 'buying_property', label: t('reasonsForMoving.buyingProperty') || 'Buying Property' },
            { value: 'relationship_change', label: t('reasonsForMoving.relationshipChange') || 'Relationship Change' },
            { value: 'closer_to_family', label: t('reasonsForMoving.closerToFamily') || 'Closer to Family' },
            { value: 'better_location', label: t('reasonsForMoving.betterLocation') || 'Better Location' },
            { value: 'cost', label: t('reasonsForMoving.cost') || 'Cost Savings' },
            { value: 'first_time_renter', label: t('reasonsForMoving.firstTimeRenter') || 'First Time Renter' },
            { value: 'other', label: t('reasonsForMoving.other') || 'Other' },
        ],
        [translations],
    );

    // Credit check provider options
    const CREDIT_PROVIDERS: SelectOption[] = useMemo(
        () => [
            { value: 'no_preference', label: t('creditProviders.noPreference') || 'No Preference' },
            { value: 'experian', label: 'Experian' },
            { value: 'equifax', label: 'Equifax' },
            { value: 'transunion', label: 'TransUnion' },
            { value: 'illion_au', label: 'Illion (Australia)' },
        ],
        [translations],
    );

    // Other reference relationship options
    const REFERENCE_RELATIONSHIPS: SelectOption[] = useMemo(
        () => [
            { value: 'professional', label: t('referenceRelationships.professional') || 'Professional' },
            { value: 'personal', label: t('referenceRelationships.personal') || 'Personal' },
        ],
        [translations],
    );

    const showError = (field: string) => touchedFields[field] && errors[field];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold">{t('title') || 'Credit & Rental History'}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('description') || 'Authorize credit checks and provide your rental history'}</p>
            </div>

            {/* Section 1: Credit Check Authorization (REQUIRED) */}
            <div className="rounded-lg border border-border bg-card">
                <button type="button" onClick={() => toggleSection('creditCheck')} className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-primary" />
                        <div className="text-left">
                            <h3 className="font-semibold">{t('creditCheck.title') || 'Credit Check Authorization'}</h3>
                            <span className="text-xs text-destructive">{t('creditCheck.required') || 'Required'}</span>
                        </div>
                    </div>
                    {expandedSections.creditCheck ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.creditCheck && (
                    <div className="border-t border-border p-4">
                        <p className="mb-4 text-sm text-muted-foreground">
                            {t('creditCheck.description') ||
                                'You must authorize a credit check to proceed with your application. This is a standard requirement for all rental applications.'}
                        </p>

                        {/* Credit Check Consent */}
                        <div className="mb-4 rounded-lg border border-border bg-muted/30 p-4">
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.authorize_credit_check}
                                    onChange={(e) => updateField('authorize_credit_check', e.target.checked)}
                                    onBlur={() => markFieldTouched('authorize_credit_check')}
                                    className="mt-1 h-5 w-5 rounded border-border"
                                />
                                <div>
                                    <span className="font-medium">{t('creditCheck.consentLabel') || 'I authorize a credit check'}</span>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t('creditCheck.consentDescription') ||
                                            'I consent to a credit inquiry being conducted as part of my rental application.'}
                                    </p>
                                </div>
                            </label>
                            {showError('authorize_credit_check') && <p className="mt-2 text-xs text-destructive">{errors.authorize_credit_check}</p>}
                        </div>

                        {/* Provider Preference (Optional) */}
                        <div className="mb-4">
                            <label className="mb-1 block text-sm">
                                {t('creditCheck.providerLabel') || 'Credit Check Provider Preference'}{' '}
                                <span className="text-muted-foreground">({t('optional') || 'Optional'})</span>
                            </label>
                            <SimpleSelect
                                value={data.credit_check_provider_preference}
                                onChange={(value) =>
                                    updateField('credit_check_provider_preference', value as typeof data.credit_check_provider_preference)
                                }
                                options={CREDIT_PROVIDERS}
                                placeholder={t('creditCheck.providerPlaceholder') || 'Select provider...'}
                            />
                        </div>

                        {/* Background Check (Optional) */}
                        <div className="mb-4">
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.authorize_background_check}
                                    onChange={(e) => updateField('authorize_background_check', e.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-border"
                                />
                                <div>
                                    <span className="font-medium">
                                        {t('creditCheck.backgroundCheckLabel') || 'I also authorize a background check'}{' '}
                                        <span className="text-muted-foreground">({t('optional') || 'Optional'})</span>
                                    </span>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {t('creditCheck.backgroundCheckDescription') ||
                                            'Recommended for properties in the US. Includes criminal background and eviction history.'}
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* CCJ/Bankruptcies Disclosure */}
                        <div className="mb-4">
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.has_ccjs_or_bankruptcies}
                                    onChange={(e) => updateField('has_ccjs_or_bankruptcies', e.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-border"
                                />
                                <div>
                                    <span className="font-medium">
                                        {t('creditCheck.ccjLabel') || 'I have CCJs, defaults, or bankruptcies to disclose'}
                                    </span>
                                </div>
                            </label>
                            {data.has_ccjs_or_bankruptcies && (
                                <div className="mt-3 ml-8">
                                    <textarea
                                        value={data.ccj_bankruptcy_details}
                                        onChange={(e) => updateField('ccj_bankruptcy_details', e.target.value)}
                                        onBlur={() => markFieldTouched('ccj_bankruptcy_details')}
                                        placeholder={t('creditCheck.ccjPlaceholder') || 'Please provide details...'}
                                        className={`w-full rounded-lg border px-4 py-2 ${showError('ccj_bankruptcy_details') ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                        rows={3}
                                    />
                                    {showError('ccj_bankruptcy_details') && (
                                        <p className="mt-1 text-xs text-destructive">{errors.ccj_bankruptcy_details}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Eviction History */}
                        <div>
                            <label className="flex cursor-pointer items-start gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.has_eviction_history}
                                    onChange={(e) => updateField('has_eviction_history', e.target.checked)}
                                    className="mt-1 h-5 w-5 rounded border-border"
                                />
                                <div>
                                    <span className="font-medium">{t('creditCheck.evictionLabel') || 'I have prior evictions to disclose'}</span>
                                </div>
                            </label>
                            {data.has_eviction_history && (
                                <div className="mt-3 ml-8">
                                    <textarea
                                        value={data.eviction_details}
                                        onChange={(e) => updateField('eviction_details', e.target.value)}
                                        onBlur={() => markFieldTouched('eviction_details')}
                                        placeholder={t('creditCheck.evictionPlaceholder') || 'Please provide details...'}
                                        className={`w-full rounded-lg border px-4 py-2 ${showError('eviction_details') ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                        rows={3}
                                    />
                                    {showError('eviction_details') && <p className="mt-1 text-xs text-destructive">{errors.eviction_details}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Section 2: Current Address */}
            <div className="rounded-lg border border-border bg-card">
                <button type="button" onClick={() => toggleSection('currentAddress')} className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Home size={20} className="text-primary" />
                        <div className="text-left">
                            <h3 className="font-semibold">{t('currentAddress.title') || 'Current Address'}</h3>
                            <span className="text-xs text-muted-foreground">{t('currentAddress.subtitle') || 'Where you currently live'}</span>
                        </div>
                    </div>
                    {expandedSections.currentAddress ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.currentAddress && (
                    <div className="space-y-4 border-t border-border p-4">
                        {/* Living Situation */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                {t('currentAddress.livingSituation') || 'Current Living Situation'}
                            </label>
                            <SimpleSelect
                                value={data.current_living_situation}
                                onChange={(value) => updateField('current_living_situation', value as typeof data.current_living_situation)}
                                options={LIVING_SITUATIONS}
                                placeholder={t('currentAddress.livingSituationPlaceholder') || 'Select...'}
                            />
                        </div>

                        {/* Address Fields */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm">{t('fields.street') || 'Street Address'}</label>
                                <input
                                    type="text"
                                    value={data.current_address_street}
                                    onChange={(e) => updateField('current_address_street', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('fields.unit') || 'Unit/Apt'}</label>
                                <input
                                    type="text"
                                    value={data.current_address_unit}
                                    onChange={(e) => updateField('current_address_unit', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('fields.city') || 'City'}</label>
                                <input
                                    type="text"
                                    value={data.current_address_city}
                                    onChange={(e) => updateField('current_address_city', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('fields.postalCode') || 'Postal Code'}</label>
                                <input
                                    type="text"
                                    value={data.current_address_postal_code}
                                    onChange={(e) => updateField('current_address_postal_code', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('fields.moveInDate') || 'Move-in Date'}</label>
                                <input
                                    type="date"
                                    value={data.current_address_move_in_date}
                                    onChange={(e) => updateField('current_address_move_in_date', e.target.value)}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                />
                            </div>
                        </div>

                        {/* Landlord Details (if renting) */}
                        {data.current_living_situation === 'renting' && (
                            <div className="mt-4 border-t border-border pt-4">
                                <h4 className="mb-3 font-medium">{t('currentAddress.landlordDetails') || 'Current Landlord'}</h4>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm">{t('fields.monthlyRent') || 'Monthly Rent'}</label>
                                        <input
                                            type="number"
                                            value={data.current_monthly_rent}
                                            onChange={(e) => updateField('current_monthly_rent', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm">{t('fields.landlordName') || 'Landlord Name'}</label>
                                        <input
                                            type="text"
                                            value={data.current_landlord_name}
                                            onChange={(e) => updateField('current_landlord_name', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm">
                                            {t('fields.landlordContact') || 'Landlord Contact (email or phone)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={data.current_landlord_contact}
                                            onChange={(e) => updateField('current_landlord_contact', e.target.value)}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Reason for Moving */}
                        <div className="mt-4 border-t border-border pt-4">
                            <label className="mb-1 block text-sm font-medium">{t('currentAddress.reasonForMoving') || 'Reason for Moving'}</label>
                            <SimpleSelect
                                value={data.reason_for_moving}
                                onChange={(value) => updateField('reason_for_moving', value as typeof data.reason_for_moving)}
                                options={REASONS_FOR_MOVING}
                                placeholder={t('currentAddress.reasonPlaceholder') || 'Select reason...'}
                            />
                            {data.reason_for_moving === 'other' && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        value={data.reason_for_moving_other}
                                        onChange={(e) => updateField('reason_for_moving_other', e.target.value)}
                                        onBlur={() => markFieldTouched('reason_for_moving_other')}
                                        placeholder={t('currentAddress.reasonOtherPlaceholder') || 'Please specify...'}
                                        className={`w-full rounded-lg border px-4 py-2 ${showError('reason_for_moving_other') ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    />
                                    {showError('reason_for_moving_other') && (
                                        <p className="mt-1 text-xs text-destructive">{errors.reason_for_moving_other}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Section 3: Previous Addresses */}
            <div className="rounded-lg border border-border bg-card">
                <button type="button" onClick={() => toggleSection('previousAddresses')} className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <MapPin size={20} className="text-primary" />
                        <div className="text-left">
                            <h3 className="font-semibold">{t('previousAddresses.title') || 'Previous Addresses'}</h3>
                            <span className="text-xs text-muted-foreground">{t('previousAddresses.subtitle') || 'Last 3 years recommended'}</span>
                        </div>
                    </div>
                    {expandedSections.previousAddresses ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.previousAddresses && (
                    <div className="border-t border-border p-4">
                        {data.previous_addresses.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                                <p className="text-sm text-muted-foreground">{t('previousAddresses.empty') || 'No previous addresses added'}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.previous_addresses.map((addr, index) => (
                                    <div key={index} className="rounded-lg border border-border p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="font-medium">
                                                {t('previousAddresses.addressNumber') || 'Address'} #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removePreviousAddress(index)}
                                                className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div className="md:col-span-2">
                                                <label className="mb-1 block text-sm">{t('fields.street') || 'Street'}</label>
                                                <input
                                                    type="text"
                                                    value={addr.street}
                                                    onChange={(e) => updatePreviousAddress(index, 'street', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.city') || 'City'}</label>
                                                <input
                                                    type="text"
                                                    value={addr.city}
                                                    onChange={(e) => updatePreviousAddress(index, 'city', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.postalCode') || 'Postal Code'}</label>
                                                <input
                                                    type="text"
                                                    value={addr.postal_code}
                                                    onChange={(e) => updatePreviousAddress(index, 'postal_code', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.fromDate') || 'From'}</label>
                                                <input
                                                    type="date"
                                                    value={addr.from_date}
                                                    onChange={(e) => updatePreviousAddress(index, 'from_date', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.toDate') || 'To'}</label>
                                                <input
                                                    type="date"
                                                    value={addr.to_date}
                                                    onChange={(e) => updatePreviousAddress(index, 'to_date', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {data.previous_addresses.length < 5 && (
                            <button
                                type="button"
                                onClick={addPreviousAddress}
                                className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <Plus size={16} />
                                {t('previousAddresses.add') || 'Add Previous Address'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Section 4: Landlord References */}
            <div className="rounded-lg border border-border bg-card">
                <button type="button" onClick={() => toggleSection('landlordReferences')} className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <Building2 size={20} className="text-primary" />
                        <div className="text-left">
                            <h3 className="font-semibold">{t('landlordReferences.title') || 'Landlord References'}</h3>
                            <span className="text-xs text-muted-foreground">{t('landlordReferences.subtitle') || 'Recommended'}</span>
                        </div>
                    </div>
                    {expandedSections.landlordReferences ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.landlordReferences && (
                    <div className="border-t border-border p-4">
                        {data.landlord_references.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                                <p className="text-sm text-muted-foreground">{t('landlordReferences.empty') || 'No landlord references added'}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.landlord_references.map((ref, index) => (
                                    <div key={index} className="rounded-lg border border-border p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="font-medium">
                                                {t('landlordReferences.referenceNumber') || 'Reference'} #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeLandlordReference(index)}
                                                className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.name') || 'Name'}</label>
                                                <input
                                                    type="text"
                                                    value={ref.name}
                                                    onChange={(e) => updateLandlordReference(index, 'name', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.company') || 'Company'}</label>
                                                <input
                                                    type="text"
                                                    value={ref.company}
                                                    onChange={(e) => updateLandlordReference(index, 'company', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.email') || 'Email'}</label>
                                                <input
                                                    type="email"
                                                    value={ref.email}
                                                    onChange={(e) => updateLandlordReference(index, 'email', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.phone') || 'Phone'}</label>
                                                <input
                                                    type="tel"
                                                    value={ref.phone}
                                                    onChange={(e) => updateLandlordReference(index, 'phone', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="mb-1 block text-sm">{t('fields.propertyAddress') || 'Property Address'}</label>
                                                <input
                                                    type="text"
                                                    value={ref.property_address}
                                                    onChange={(e) => updateLandlordReference(index, 'property_address', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.tenancyStart') || 'Tenancy Start'}</label>
                                                <input
                                                    type="date"
                                                    value={ref.tenancy_start_date}
                                                    onChange={(e) => updateLandlordReference(index, 'tenancy_start_date', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.tenancyEnd') || 'Tenancy End'}</label>
                                                <input
                                                    type="date"
                                                    value={ref.tenancy_end_date}
                                                    onChange={(e) => updateLandlordReference(index, 'tenancy_end_date', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex cursor-pointer items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={ref.consent_to_contact}
                                                        onChange={(e) => updateLandlordReference(index, 'consent_to_contact', e.target.checked)}
                                                        className="h-4 w-4 rounded border-border"
                                                    />
                                                    <span className="text-sm">
                                                        {t('fields.consentToContact') || 'I consent to this reference being contacted'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {data.landlord_references.length < 3 && (
                            <button
                                type="button"
                                onClick={addLandlordReference}
                                className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <Plus size={16} />
                                {t('landlordReferences.add') || 'Add Landlord Reference'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Section 5: Other References */}
            <div className="rounded-lg border border-border bg-card">
                <button type="button" onClick={() => toggleSection('otherReferences')} className="flex w-full items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <User size={20} className="text-primary" />
                        <div className="text-left">
                            <h3 className="font-semibold">{t('otherReferences.title') || 'Other References'}</h3>
                            <span className="text-xs text-muted-foreground">{t('otherReferences.subtitle') || 'Optional'}</span>
                        </div>
                    </div>
                    {expandedSections.otherReferences ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.otherReferences && (
                    <div className="border-t border-border p-4">
                        {data.other_references.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                                <p className="text-sm text-muted-foreground">{t('otherReferences.empty') || 'No other references added'}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.other_references.map((ref, index) => (
                                    <div key={index} className="rounded-lg border border-border p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="font-medium">
                                                {t('otherReferences.referenceNumber') || 'Reference'} #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeOtherReference(index)}
                                                className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.name') || 'Name'}</label>
                                                <input
                                                    type="text"
                                                    value={ref.name}
                                                    onChange={(e) => updateOtherReference(index, 'name', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.relationship') || 'Relationship'}</label>
                                                <SimpleSelect
                                                    value={ref.relationship}
                                                    onChange={(value) =>
                                                        updateOtherReference(index, 'relationship', value as 'professional' | 'personal' | '')
                                                    }
                                                    options={REFERENCE_RELATIONSHIPS}
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.email') || 'Email'}</label>
                                                <input
                                                    type="email"
                                                    value={ref.email}
                                                    onChange={(e) => updateOtherReference(index, 'email', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.phone') || 'Phone'}</label>
                                                <input
                                                    type="tel"
                                                    value={ref.phone}
                                                    onChange={(e) => updateOtherReference(index, 'phone', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm">{t('fields.yearsKnown') || 'Years Known'}</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={ref.years_known}
                                                    onChange={(e) => updateOtherReference(index, 'years_known', e.target.value)}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex cursor-pointer items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={ref.consent_to_contact}
                                                        onChange={(e) => updateOtherReference(index, 'consent_to_contact', e.target.checked)}
                                                        className="h-4 w-4 rounded border-border"
                                                    />
                                                    <span className="text-sm">
                                                        {t('fields.consentToContact') || 'I consent to this reference being contacted'}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {data.other_references.length < 2 && (
                            <button
                                type="button"
                                onClick={addOtherReference}
                                className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                            >
                                <Plus size={16} />
                                {t('otherReferences.add') || 'Add Reference'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
