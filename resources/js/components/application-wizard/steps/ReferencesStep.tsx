import { SimpleSelect, type SelectOption } from '@/components/ui/simple-select';
import type { ApplicationWizardData, ReferenceDetails } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Briefcase, Building2, Plus, Trash2, User } from 'lucide-react';
import { useMemo } from 'react';

interface ReferencesStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    addReference: (type?: 'landlord' | 'personal' | 'professional') => void;
    removeReference: (index: number) => void;
    updateReference: (index: number, field: keyof ReferenceDetails, value: string) => void;
    onBlur: () => void;
}

const REFERENCE_TYPE_ICONS = {
    landlord: Building2,
    personal: User,
    professional: Briefcase,
} as const;

export function ReferencesStep({ data, errors, touchedFields, addReference, removeReference, updateReference, onBlur }: ReferencesStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.referencesStep.${key}`);

    const LANDLORD_RELATIONSHIPS = useMemo(
        () => [
            { value: 'Previous Landlord', label: t('landlord.relationships.previous_landlord') },
            { value: 'Property Manager', label: t('landlord.relationships.property_manager') },
            { value: 'Other', label: t('landlord.relationships.other') },
        ],
        [translations],
    );

    const PERSONAL_RELATIONSHIPS = useMemo(
        () => [
            { value: 'Friend', label: t('personal.relationships.friend') },
            { value: 'Neighbor', label: t('personal.relationships.neighbor') },
            { value: 'Family Friend', label: t('personal.relationships.family_friend') },
            { value: 'Other', label: t('personal.relationships.other') },
        ],
        [translations],
    );

    const PROFESSIONAL_RELATIONSHIPS = useMemo(
        () => [
            { value: 'Employer', label: t('professional.relationships.employer') },
            { value: 'Manager', label: t('professional.relationships.manager') },
            { value: 'Colleague', label: t('professional.relationships.colleague') },
            { value: 'Professor', label: t('professional.relationships.professor') },
            { value: 'Teacher', label: t('professional.relationships.teacher') },
            { value: 'Mentor', label: t('professional.relationships.mentor') },
            { value: 'Other', label: t('professional.relationships.other') },
        ],
        [translations],
    );

    const REFERENCE_RELATIONSHIPS: Record<string, SelectOption[]> = {
        landlord: LANDLORD_RELATIONSHIPS,
        personal: PERSONAL_RELATIONSHIPS,
        professional: PROFESSIONAL_RELATIONSHIPS,
    };

    // Group references by type
    const landlordRefs = data.references.filter((ref) => ref.type === 'landlord');
    const personalRefs = data.references.filter((ref) => ref.type === 'personal');
    const professionalRefs = data.references.filter((ref) => ref.type === 'professional');

    const getTypeLabel = (type: string) => {
        if (type === 'landlord') return t('landlord.title');
        if (type === 'personal') return t('other.title');
        if (type === 'professional') return t('other.title');
        return type;
    };

    const getTypeIcon = (type: string) => {
        return REFERENCE_TYPE_ICONS[type as keyof typeof REFERENCE_TYPE_ICONS] || User;
    };

    const getRelationshipOptions = (type: string) => {
        return REFERENCE_RELATIONSHIPS[type as keyof typeof REFERENCE_RELATIONSHIPS] || REFERENCE_RELATIONSHIPS.personal;
    };

    const renderReferenceCard = (ref: ReferenceDetails, index: number, actualIndex: number) => {
        const TypeIcon = getTypeIcon(ref.type);
        const relationshipOptions = getRelationshipOptions(ref.type);

        return (
            <div key={actualIndex} className="rounded-lg border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TypeIcon size={18} className="text-muted-foreground" />
                        <span className="font-medium">{getTypeLabel(ref.type)}</span>
                        {index > 0 && <span className="text-sm text-muted-foreground">#{index + 1}</span>}
                    </div>
                    <button
                        type="button"
                        onClick={() => removeReference(actualIndex)}
                        className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remove reference"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm">{t('fields.name')}</label>
                        <input
                            type="text"
                            value={ref.name}
                            onChange={(e) => updateReference(actualIndex, 'name', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_name`] && errors[`ref_${actualIndex}_name`])}
                            className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`ref_${actualIndex}_name`] && errors[`ref_${actualIndex}_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        />
                        {touchedFields[`ref_${actualIndex}_name`] && errors[`ref_${actualIndex}_name`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_name`]}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">{t('fields.relationship')}</label>
                        <SimpleSelect
                            value={ref.relationship}
                            onChange={(value) => updateReference(actualIndex, 'relationship', value)}
                            options={relationshipOptions}
                            placeholder="Select..."
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_relationship`] && errors[`ref_${actualIndex}_relationship`])}
                        />
                        {touchedFields[`ref_${actualIndex}_relationship`] && errors[`ref_${actualIndex}_relationship`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_relationship`]}</p>
                        )}
                    </div>

                    {ref.relationship === 'Other' && (
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm">{t('fields.specify')}</label>
                            <input
                                type="text"
                                value={ref.relationship_other}
                                onChange={(e) => updateReference(actualIndex, 'relationship_other', e.target.value)}
                                onBlur={onBlur}
                                placeholder={t('placeholder')}
                                aria-invalid={
                                    !!(touchedFields[`ref_${actualIndex}_relationship_other`] && errors[`ref_${actualIndex}_relationship_other`])
                                }
                                className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`ref_${actualIndex}_relationship_other`] && errors[`ref_${actualIndex}_relationship_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                            />
                            {touchedFields[`ref_${actualIndex}_relationship_other`] && errors[`ref_${actualIndex}_relationship_other`] && (
                                <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_relationship_other`]}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm">{t('fields.phone')}</label>
                        <input
                            type="tel"
                            value={ref.phone}
                            onChange={(e) => updateReference(actualIndex, 'phone', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_phone`] && errors[`ref_${actualIndex}_phone`])}
                            className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`ref_${actualIndex}_phone`] && errors[`ref_${actualIndex}_phone`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        />
                        {touchedFields[`ref_${actualIndex}_phone`] && errors[`ref_${actualIndex}_phone`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_phone`]}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">{t('fields.email')}</label>
                        <input
                            type="email"
                            value={ref.email}
                            onChange={(e) => updateReference(actualIndex, 'email', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_email`] && errors[`ref_${actualIndex}_email`])}
                            className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`ref_${actualIndex}_email`] && errors[`ref_${actualIndex}_email`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        />
                        {touchedFields[`ref_${actualIndex}_email`] && errors[`ref_${actualIndex}_email`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_email`]}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm">{t('fields.yearsKnown')}</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={ref.years_known}
                            onChange={(e) => updateReference(actualIndex, 'years_known', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_years_known`] && errors[`ref_${actualIndex}_years_known`])}
                            className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`ref_${actualIndex}_years_known`] && errors[`ref_${actualIndex}_years_known`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        />
                        {touchedFields[`ref_${actualIndex}_years_known`] && errors[`ref_${actualIndex}_years_known`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_years_known`]}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Get actual indices for each reference
    const getActualIndex = (ref: ReferenceDetails) => data.references.indexOf(ref);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('title')}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
            </div>

            {/* Landlord References Section */}
            <div>
                <div className="mb-3 flex items-center gap-2">
                    <Building2 size={20} className="text-primary" />
                    <h3 className="font-semibold">{t('landlord.title')}</h3>
                    <span className="text-sm text-muted-foreground">({t('landlord.recommended')})</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{t('landlord.description')}</p>

                <div className="space-y-3">
                    {landlordRefs.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                            <p className="text-sm text-muted-foreground">{t('landlord.empty')}</p>
                        </div>
                    ) : (
                        landlordRefs.map((ref, index) => renderReferenceCard(ref, index, getActualIndex(ref)))
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => addReference('landlord')}
                    className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                >
                    <Plus size={16} />
                    {t('landlord.add')}
                </button>
            </div>

            {/* Personal & Professional References Section */}
            <div className="border-t border-border pt-6">
                <div className="mb-3 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    <h3 className="font-semibold">{t('other.title')}</h3>
                    <span className="text-sm text-muted-foreground">({t('other.optional')})</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{t('other.description')}</p>

                <div className="space-y-3">
                    {personalRefs.length === 0 && professionalRefs.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                            <p className="text-sm text-muted-foreground">{t('other.empty')}</p>
                        </div>
                    ) : (
                        <>
                            {professionalRefs.map((ref, index) => renderReferenceCard(ref, index, getActualIndex(ref)))}
                            {personalRefs.map((ref, index) => renderReferenceCard(ref, index, getActualIndex(ref)))}
                        </>
                    )}
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => addReference('professional')}
                        className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                    >
                        <Plus size={16} />
                        <Briefcase size={14} />
                        {t('other.addProfessional')}
                    </button>
                    <button
                        type="button"
                        onClick={() => addReference('personal')}
                        className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                    >
                        <Plus size={16} />
                        <User size={14} />
                        {t('other.addPersonal')}
                    </button>
                </div>
            </div>

            {/* Summary */}
            {data.references.length > 0 && (
                <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                        <strong>{data.references.length}</strong>{' '}
                        {data.references.length === 1
                            ? t('summary').replace(':count', '1').split('|')[0]
                            : t('summary').replace(':count', data.references.length.toString()).split('|')[1] ||
                              t('summary').replace(':count', data.references.length.toString())}
                        {landlordRefs.length > 0 && (
                            <span>
                                {' '}
                                {t('summaryDetail')
                                    .replace(':landlord', landlordRefs.length.toString())
                                    .replace(':other', (professionalRefs.length + personalRefs.length).toString())}
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
