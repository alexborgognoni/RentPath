import { DatePicker } from '@/components/ui/date-picker';
import { OptionalBadge } from '@/components/ui/optional-badge';
import { SimpleSelect } from '@/components/ui/simple-select';
import type { ApplicationWizardData, CoSignerDetails, GuarantorDetails } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Info, Link2, Plus, Shield, Trash2, UserPlus, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { FinancialInfoSection } from '../shared';

interface SupportStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    onBlur: () => void;
    addCoSigner: () => void;
    removeCoSigner: (index: number) => void;
    updateCoSigner: (index: number, field: keyof CoSignerDetails, value: string) => void;
    addGuarantor: () => void;
    removeGuarantor: (index: number) => void;
    updateGuarantor: (index: number, field: keyof GuarantorDetails, value: string) => void;
    syncCoSignersFromOccupants: () => void;
}

export function SupportStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    onBlur,
    addCoSigner,
    removeCoSigner,
    updateCoSigner,
    addGuarantor,
    removeGuarantor,
    updateGuarantor,
    syncCoSignersFromOccupants,
}: SupportStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.supportStep.${key}`);

    // Sync co-signers from occupants on mount
    useEffect(() => {
        syncCoSignersFromOccupants();
    }, [syncCoSignersFromOccupants]);

    const RELATIONSHIP_OPTIONS = useMemo(
        () => [
            { value: 'spouse', label: t('relationships.spouse') },
            { value: 'partner', label: t('relationships.partner') },
            { value: 'parent', label: t('relationships.parent') },
            { value: 'sibling', label: t('relationships.sibling') },
            { value: 'child', label: t('relationships.child') },
            { value: 'friend', label: t('relationships.friend') },
            { value: 'employer', label: t('relationships.employer') },
            { value: 'other', label: t('relationships.other') },
        ],
        [translations],
    );

    const INSURANCE_OPTIONS = useMemo(
        () => [
            { value: 'no', label: t('insurance.options.no') },
            { value: 'yes', label: t('insurance.options.yes') },
            { value: 'already_have', label: t('insurance.options.alreadyHave') },
        ],
        [translations],
    );

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    // Count auto-generated vs manual co-signers
    const autoCoSignersCount = data.co_signers.filter((cs) => cs.from_occupant_index !== null).length;
    const manualCoSignersCount = data.co_signers.filter((cs) => cs.from_occupant_index === null).length;

    // Create handlers for each co-signer's FinancialInfoSection
    const createCoSignerHandlers = useCallback(
        (index: number) => ({
            getValue: (field: string) => {
                const coSigner = data.co_signers[index];
                return String(coSigner?.[field as keyof CoSignerDetails] ?? '');
            },
            setValue: (field: string, value: string) => {
                updateCoSigner(index, field as keyof CoSignerDetails, value);
            },
            getError: (field: string) => {
                return errors[`co_signers.${index}.${field}`];
            },
            isTouched: (field: string) => {
                return !!touchedFields[`cosigner_${index}_${field}`];
            },
        }),
        [data.co_signers, updateCoSigner, errors, touchedFields],
    );

    // Create handlers for each guarantor's FinancialInfoSection
    const createGuarantorHandlers = useCallback(
        (index: number) => ({
            getValue: (field: string) => {
                const guarantor = data.guarantors[index];
                return String(guarantor?.[field as keyof GuarantorDetails] ?? '');
            },
            setValue: (field: string, value: string) => {
                updateGuarantor(index, field as keyof GuarantorDetails, value);
            },
            getError: (field: string) => {
                return errors[`guarantors.${index}.${field}`];
            },
            isTouched: (field: string) => {
                return !!touchedFields[`guarantor_${index}_${field}`];
            },
        }),
        [data.guarantors, updateGuarantor, errors, touchedFields],
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('title')}</h2>
            <p className="text-muted-foreground">{t('description')}</p>

            {/* Info Card */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex gap-3">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div className="space-y-2 text-sm">
                        <p>{t('info.purpose')}</p>
                        <p className="text-muted-foreground">{t('info.optional')}</p>
                    </div>
                </div>
            </div>

            {/* Co-signers Section */}
            <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t('coSigners.title')}</h3>
                    {autoCoSignersCount > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            {autoCoSignersCount} {t('coSigners.fromHousehold')}
                        </span>
                    )}
                    {manualCoSignersCount > 0 && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {manualCoSignersCount} {t('coSigners.additional')}
                        </span>
                    )}
                    {data.co_signers.length === 0 && <OptionalBadge />}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{t('coSigners.description')}</p>

                {data.co_signers.map((coSigner, index) => {
                    const isFromOccupant = coSigner.from_occupant_index !== null;
                    const handlers = createCoSignerHandlers(index);

                    return (
                        <div key={index} className="mb-4 rounded-lg border border-border bg-background p-4">
                            {/* Header */}
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium">
                                        {coSigner.first_name && coSigner.last_name
                                            ? `${coSigner.first_name} ${coSigner.last_name}`
                                            : t('coSigners.coSigner').replace(':index', (index + 1).toString())}
                                    </h4>
                                    {isFromOccupant && (
                                        <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                            <Link2 className="h-3 w-3" />
                                            {t('coSigners.leaseSignerBadge')}
                                        </span>
                                    )}
                                </div>
                                {!isFromOccupant && (
                                    <button
                                        type="button"
                                        onClick={() => removeCoSigner(index)}
                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                        title={t('coSigners.remove')}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Identity Fields */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.firstName')}</label>
                                    <input
                                        type="text"
                                        value={coSigner.first_name}
                                        onChange={(e) => updateCoSigner(index, 'first_name', e.target.value)}
                                        onBlur={onBlur}
                                        disabled={isFromOccupant}
                                        className={`w-full rounded-lg border border-border px-4 py-2 ${isFromOccupant ? 'bg-muted' : 'bg-background'}`}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.lastName')}</label>
                                    <input
                                        type="text"
                                        value={coSigner.last_name}
                                        onChange={(e) => updateCoSigner(index, 'last_name', e.target.value)}
                                        onBlur={onBlur}
                                        disabled={isFromOccupant}
                                        className={`w-full rounded-lg border border-border px-4 py-2 ${isFromOccupant ? 'bg-muted' : 'bg-background'}`}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.email')}</label>
                                    <input
                                        type="email"
                                        value={coSigner.email}
                                        onChange={(e) => updateCoSigner(index, 'email', e.target.value)}
                                        onBlur={onBlur}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.phone')}</label>
                                    <input
                                        type="tel"
                                        value={coSigner.phone_number}
                                        onChange={(e) => updateCoSigner(index, 'phone_number', e.target.value)}
                                        onBlur={onBlur}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.dateOfBirth')}</label>
                                    <DatePicker
                                        value={coSigner.date_of_birth}
                                        onChange={(value) => updateCoSigner(index, 'date_of_birth', value || '')}
                                        onBlur={onBlur}
                                        max={new Date()}
                                        disabled={isFromOccupant}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.relationship')}</label>
                                    <SimpleSelect
                                        value={coSigner.relationship}
                                        onChange={(value) => updateCoSigner(index, 'relationship', value)}
                                        options={RELATIONSHIP_OPTIONS}
                                        placeholder={t('placeholders.selectRelationship')}
                                        onBlur={onBlur}
                                        disabled={isFromOccupant}
                                    />
                                </div>
                                {coSigner.relationship === 'other' && !isFromOccupant && (
                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm">{t('fields.relationshipOther')}</label>
                                        <input
                                            type="text"
                                            value={coSigner.relationship_other}
                                            onChange={(e) => updateCoSigner(index, 'relationship_other', e.target.value)}
                                            onBlur={onBlur}
                                            placeholder={t('placeholders.specifyRelationship')}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Financial Information Section */}
                            <div className="mt-4 border-t border-border pt-4">
                                <h5 className="mb-3 text-sm font-medium">{t('coSigners.financialInfo')}</h5>
                                <FinancialInfoSection
                                    entityType="co_signer"
                                    translations={translations}
                                    fieldPrefix=""
                                    getValue={handlers.getValue}
                                    setValue={handlers.setValue}
                                    getError={handlers.getError}
                                    isTouched={handlers.isTouched}
                                    onBlur={onBlur}
                                />
                            </div>
                        </div>
                    );
                })}

                <button type="button" onClick={addCoSigner} className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline">
                    <Plus size={16} />
                    {t('coSigners.addCoSigner')}
                </button>
            </div>

            {/* Guarantors Section */}
            <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">{t('guarantors.title')}</h3>
                    <OptionalBadge />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{t('guarantors.description')}</p>

                {data.guarantors.map((guarantor, index) => {
                    const handlers = createGuarantorHandlers(index);

                    return (
                        <div key={index} className="mb-4 rounded-lg border border-border bg-background p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="font-medium">
                                    {guarantor.first_name && guarantor.last_name
                                        ? `${guarantor.first_name} ${guarantor.last_name}`
                                        : t('guarantors.guarantor').replace(':index', (index + 1).toString())}
                                </h4>
                                <button
                                    type="button"
                                    onClick={() => removeGuarantor(index)}
                                    className="cursor-pointer text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Identity Fields */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.firstName')}</label>
                                    <input
                                        type="text"
                                        value={guarantor.first_name}
                                        onChange={(e) => updateGuarantor(index, 'first_name', e.target.value)}
                                        onBlur={onBlur}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.lastName')}</label>
                                    <input
                                        type="text"
                                        value={guarantor.last_name}
                                        onChange={(e) => updateGuarantor(index, 'last_name', e.target.value)}
                                        onBlur={onBlur}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.email')}</label>
                                    <input
                                        type="email"
                                        value={guarantor.email}
                                        onChange={(e) => updateGuarantor(index, 'email', e.target.value)}
                                        onBlur={onBlur}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.phone')}</label>
                                    <input
                                        type="tel"
                                        value={guarantor.phone_number}
                                        onChange={(e) => updateGuarantor(index, 'phone_number', e.target.value)}
                                        onBlur={onBlur}
                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">{t('fields.relationship')}</label>
                                    <SimpleSelect
                                        value={guarantor.relationship}
                                        onChange={(value) => updateGuarantor(index, 'relationship', value)}
                                        options={RELATIONSHIP_OPTIONS}
                                        placeholder={t('placeholders.selectRelationship')}
                                        onBlur={onBlur}
                                    />
                                </div>
                                {guarantor.relationship === 'other' && (
                                    <div>
                                        <label className="mb-1 block text-sm">{t('fields.relationshipOther')}</label>
                                        <input
                                            type="text"
                                            value={guarantor.relationship_other}
                                            onChange={(e) => updateGuarantor(index, 'relationship_other', e.target.value)}
                                            onBlur={onBlur}
                                            placeholder={t('placeholders.specifyRelationship')}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Address Section */}
                            <div className="mt-4 border-t border-border pt-4">
                                <h5 className="mb-3 text-sm font-medium">{t('guarantors.address')}</h5>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm">{t('fields.streetAddress')}</label>
                                        <input
                                            type="text"
                                            value={guarantor.street_address}
                                            onChange={(e) => updateGuarantor(index, 'street_address', e.target.value)}
                                            onBlur={onBlur}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm">{t('fields.city')}</label>
                                        <input
                                            type="text"
                                            value={guarantor.city}
                                            onChange={(e) => updateGuarantor(index, 'city', e.target.value)}
                                            onBlur={onBlur}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm">{t('fields.postalCode')}</label>
                                        <input
                                            type="text"
                                            value={guarantor.postal_code}
                                            onChange={(e) => updateGuarantor(index, 'postal_code', e.target.value)}
                                            onBlur={onBlur}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Financial Information Section */}
                            <div className="mt-4 border-t border-border pt-4">
                                <h5 className="mb-3 text-sm font-medium">{t('guarantors.employment')}</h5>
                                <FinancialInfoSection
                                    entityType="guarantor"
                                    translations={translations}
                                    fieldPrefix=""
                                    getValue={handlers.getValue}
                                    setValue={handlers.setValue}
                                    getError={handlers.getError}
                                    isTouched={handlers.isTouched}
                                    onBlur={onBlur}
                                />
                            </div>
                        </div>
                    );
                })}

                <button type="button" onClick={addGuarantor} className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline">
                    <Plus size={16} />
                    {t('guarantors.addGuarantor')}
                </button>
            </div>

            {/* Rent Insurance Section */}
            <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">{t('insurance.title')}</h3>
                    <OptionalBadge />
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{t('insurance.description')}</p>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">{t('insurance.interestedLabel')}</label>
                        <SimpleSelect
                            value={data.interested_in_rent_insurance}
                            onChange={(value) => handleFieldChange('interested_in_rent_insurance', value as 'yes' | 'no' | 'already_have' | '')}
                            onBlur={onBlur}
                            options={INSURANCE_OPTIONS}
                            placeholder={t('insurance.selectPlaceholder')}
                        />
                        {touchedFields.interested_in_rent_insurance && errors.interested_in_rent_insurance && (
                            <p className="mt-1 text-sm text-destructive">{errors.interested_in_rent_insurance}</p>
                        )}
                    </div>

                    {data.interested_in_rent_insurance === 'already_have' && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('insurance.providerLabel')}</label>
                                <input
                                    type="text"
                                    value={data.existing_insurance_provider}
                                    onChange={(e) => handleFieldChange('existing_insurance_provider', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('insurance.providerPlaceholder')}
                                    className={`w-full rounded-lg border px-4 py-2 ${
                                        touchedFields.existing_insurance_provider && errors.existing_insurance_provider
                                            ? 'border-destructive bg-destructive/5'
                                            : 'border-border bg-background'
                                    }`}
                                />
                                {touchedFields.existing_insurance_provider && errors.existing_insurance_provider && (
                                    <p className="mt-1 text-sm text-destructive">{errors.existing_insurance_provider}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {t('insurance.policyNumberLabel')} <span className="text-muted-foreground">({t('optional')})</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.existing_insurance_policy_number}
                                    onChange={(e) => handleFieldChange('existing_insurance_policy_number', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('insurance.policyNumberPlaceholder')}
                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
