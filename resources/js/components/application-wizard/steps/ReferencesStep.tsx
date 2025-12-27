import type { ApplicationWizardData, ReferenceDetails } from '@/hooks/useApplicationWizard';
import { Briefcase, Building2, Plus, Trash2, User } from 'lucide-react';

const REFERENCE_TYPES = [
    { value: 'landlord', label: 'Previous Landlord', icon: Building2, description: 'A landlord from a previous rental' },
    { value: 'personal', label: 'Personal Reference', icon: User, description: 'A friend, neighbor, or family acquaintance' },
    { value: 'professional', label: 'Professional Reference', icon: Briefcase, description: 'An employer, colleague, or professor' },
] as const;

const REFERENCE_RELATIONSHIPS = {
    landlord: ['Previous Landlord', 'Property Manager', 'Other'],
    personal: ['Friend', 'Neighbor', 'Family Friend', 'Other'],
    professional: ['Employer', 'Manager', 'Colleague', 'Professor', 'Teacher', 'Mentor', 'Other'],
};

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

export function ReferencesStep({ data, errors, touchedFields, addReference, removeReference, updateReference, onBlur }: ReferencesStepProps) {
    // Group references by type
    const landlordRefs = data.references.filter((ref) => ref.type === 'landlord');
    const personalRefs = data.references.filter((ref) => ref.type === 'personal');
    const professionalRefs = data.references.filter((ref) => ref.type === 'professional');

    const getTypeLabel = (type: string) => {
        return REFERENCE_TYPES.find((t) => t.value === type)?.label || type;
    };

    const getTypeIcon = (type: string) => {
        const refType = REFERENCE_TYPES.find((t) => t.value === type);
        if (!refType) return User;
        return refType.icon;
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
                        <label className="mb-1 block text-sm">
                            Name <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="text"
                            value={ref.name}
                            onChange={(e) => updateReference(actualIndex, 'name', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_name`] && errors[`ref_${actualIndex}_name`])}
                            className={`w-full rounded border px-3 py-2 ${touchedFields[`ref_${actualIndex}_name`] && errors[`ref_${actualIndex}_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        />
                        {touchedFields[`ref_${actualIndex}_name`] && errors[`ref_${actualIndex}_name`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_name`]}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Relationship <span className="text-destructive">*</span>
                        </label>
                        <select
                            value={ref.relationship}
                            onChange={(e) => updateReference(actualIndex, 'relationship', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_relationship`] && errors[`ref_${actualIndex}_relationship`])}
                            className={`w-full rounded border px-3 py-2 ${touchedFields[`ref_${actualIndex}_relationship`] && errors[`ref_${actualIndex}_relationship`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        >
                            <option value="">Select...</option>
                            {relationshipOptions.map((rel) => (
                                <option key={rel} value={rel}>
                                    {rel}
                                </option>
                            ))}
                        </select>
                        {touchedFields[`ref_${actualIndex}_relationship`] && errors[`ref_${actualIndex}_relationship`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_relationship`]}</p>
                        )}
                    </div>

                    {ref.relationship === 'Other' && (
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm">
                                Please specify <span className="text-destructive">*</span>
                            </label>
                            <input
                                type="text"
                                value={ref.relationship_other}
                                onChange={(e) => updateReference(actualIndex, 'relationship_other', e.target.value)}
                                onBlur={onBlur}
                                placeholder="Enter relationship..."
                                aria-invalid={
                                    !!(touchedFields[`ref_${actualIndex}_relationship_other`] && errors[`ref_${actualIndex}_relationship_other`])
                                }
                                className={`w-full rounded border px-3 py-2 ${touchedFields[`ref_${actualIndex}_relationship_other`] && errors[`ref_${actualIndex}_relationship_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                            />
                            {touchedFields[`ref_${actualIndex}_relationship_other`] && errors[`ref_${actualIndex}_relationship_other`] && (
                                <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_relationship_other`]}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="mb-1 block text-sm">
                            Phone <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="tel"
                            value={ref.phone}
                            onChange={(e) => updateReference(actualIndex, 'phone', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_phone`] && errors[`ref_${actualIndex}_phone`])}
                            className={`w-full rounded border px-3 py-2 ${touchedFields[`ref_${actualIndex}_phone`] && errors[`ref_${actualIndex}_phone`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        />
                        {touchedFields[`ref_${actualIndex}_phone`] && errors[`ref_${actualIndex}_phone`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_phone`]}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">
                            Email <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="email"
                            value={ref.email}
                            onChange={(e) => updateReference(actualIndex, 'email', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_email`] && errors[`ref_${actualIndex}_email`])}
                            className={`w-full rounded border px-3 py-2 ${touchedFields[`ref_${actualIndex}_email`] && errors[`ref_${actualIndex}_email`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        />
                        {touchedFields[`ref_${actualIndex}_email`] && errors[`ref_${actualIndex}_email`] && (
                            <p className="mt-1 text-xs text-destructive">{errors[`ref_${actualIndex}_email`]}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-1 block text-sm">
                            Years Known <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={ref.years_known}
                            onChange={(e) => updateReference(actualIndex, 'years_known', e.target.value)}
                            onBlur={onBlur}
                            aria-invalid={!!(touchedFields[`ref_${actualIndex}_years_known`] && errors[`ref_${actualIndex}_years_known`])}
                            className={`w-full rounded border px-3 py-2 ${touchedFields[`ref_${actualIndex}_years_known`] && errors[`ref_${actualIndex}_years_known`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
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
                <h2 className="text-xl font-bold">References</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Add references to strengthen your application. Landlord references are especially valuable.
                </p>
            </div>

            {/* Landlord References Section */}
            <div>
                <div className="mb-3 flex items-center gap-2">
                    <Building2 size={20} className="text-primary" />
                    <h3 className="font-semibold">Landlord References</h3>
                    <span className="text-sm text-muted-foreground">(Recommended)</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">A reference from a previous landlord helps verify your rental history.</p>

                <div className="space-y-3">
                    {landlordRefs.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                            <p className="text-sm text-muted-foreground">No landlord references added yet.</p>
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
                    Add Landlord Reference
                </button>
            </div>

            {/* Personal & Professional References Section */}
            <div className="border-t border-border pt-6">
                <div className="mb-3 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    <h3 className="font-semibold">Other References</h3>
                    <span className="text-sm text-muted-foreground">(Optional)</span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                    Add personal or professional references who can vouch for your character and reliability.
                </p>

                <div className="space-y-3">
                    {personalRefs.length === 0 && professionalRefs.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
                            <p className="text-sm text-muted-foreground">No other references added yet.</p>
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
                        Add Professional Reference
                    </button>
                    <button
                        type="button"
                        onClick={() => addReference('personal')}
                        className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                    >
                        <Plus size={16} />
                        <User size={14} />
                        Add Personal Reference
                    </button>
                </div>
            </div>

            {/* Summary */}
            {data.references.length > 0 && (
                <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm text-muted-foreground">
                        <strong>{data.references.length}</strong> reference{data.references.length !== 1 ? 's' : ''} added
                        {landlordRefs.length > 0 && (
                            <span>
                                {' '}
                                ({landlordRefs.length} landlord, {professionalRefs.length + personalRefs.length} other)
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
