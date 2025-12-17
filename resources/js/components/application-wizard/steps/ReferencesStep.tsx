import type { ApplicationWizardData, ReferenceDetails } from '@/hooks/useApplicationWizard';
import { Plus, Trash2 } from 'lucide-react';

const REFERENCE_RELATIONSHIPS = ['Employer', 'Colleague', 'Professor', 'Teacher', 'Friend', 'Neighbor', 'Other'];

interface ReferencesStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    addReference: () => void;
    removeReference: (index: number) => void;
    updateReference: (index: number, field: keyof ReferenceDetails, value: string) => void;
    onBlur: () => void;
}

export function ReferencesStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    addReference,
    removeReference,
    updateReference,
    onBlur,
}: ReferencesStepProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">References</h2>

            {/* Previous Landlord Section */}
            <div>
                <h3 className="mb-4 font-semibold">Previous Landlord (Optional)</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                    If this is your first rental or you're currently living with family, you can skip this section.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={data.previous_landlord_name}
                            onChange={(e) => updateField('previous_landlord_name', e.target.value)}
                            onBlur={onBlur}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Phone</label>
                        <input
                            type="tel"
                            value={data.previous_landlord_phone}
                            onChange={(e) => updateField('previous_landlord_phone', e.target.value)}
                            onBlur={onBlur}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={data.previous_landlord_email}
                            onChange={(e) => updateField('previous_landlord_email', e.target.value)}
                            onBlur={onBlur}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                        />
                    </div>
                </div>
            </div>

            {/* Personal References Section */}
            <div className="border-t border-border pt-6">
                <h3 className="mb-4 font-semibold">Personal References (Optional)</h3>
                <p className="mb-4 text-sm text-muted-foreground">Add references from employers, colleagues, or other professional contacts.</p>

                {data.references.map((ref, index) => (
                    <div key={index} className="mb-4 rounded-lg border border-border p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-medium">Reference {index + 1}</h4>
                            <button type="button" onClick={() => removeReference(index)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={ref.name}
                                    onChange={(e) => updateReference(index, 'name', e.target.value)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`ref_${index}_name`] && errors[`ref_${index}_name`])}
                                    className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_name`] && errors[`ref_${index}_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`ref_${index}_name`] && errors[`ref_${index}_name`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`ref_${index}_name`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={ref.phone}
                                    onChange={(e) => updateReference(index, 'phone', e.target.value)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`ref_${index}_phone`] && errors[`ref_${index}_phone`])}
                                    className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_phone`] && errors[`ref_${index}_phone`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`ref_${index}_phone`] && errors[`ref_${index}_phone`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`ref_${index}_phone`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={ref.email}
                                    onChange={(e) => updateReference(index, 'email', e.target.value)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`ref_${index}_email`] && errors[`ref_${index}_email`])}
                                    className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_email`] && errors[`ref_${index}_email`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`ref_${index}_email`] && errors[`ref_${index}_email`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`ref_${index}_email`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Relationship <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={ref.relationship}
                                    onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                                    onFocus={() => markFieldTouched(`ref_${index}_relationship`)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`ref_${index}_relationship`] && errors[`ref_${index}_relationship`])}
                                    className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_relationship`] && errors[`ref_${index}_relationship`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                >
                                    {!touchedFields[`ref_${index}_relationship`] && <option value="">Select...</option>}
                                    {REFERENCE_RELATIONSHIPS.map((rel) => (
                                        <option key={rel} value={rel}>
                                            {rel}
                                        </option>
                                    ))}
                                </select>
                                {touchedFields[`ref_${index}_relationship`] && errors[`ref_${index}_relationship`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`ref_${index}_relationship`]}</p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm">
                                    Years Known <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={ref.years_known}
                                    onChange={(e) => updateReference(index, 'years_known', e.target.value)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`ref_${index}_years_known`] && errors[`ref_${index}_years_known`])}
                                    className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_years_known`] && errors[`ref_${index}_years_known`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`ref_${index}_years_known`] && errors[`ref_${index}_years_known`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`ref_${index}_years_known`]}</p>
                                )}
                            </div>
                        </div>
                        {ref.relationship === 'Other' && (
                            <div className="mt-3">
                                <label className="mb-1 block text-sm">
                                    Please specify relationship <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={ref.relationship_other}
                                    onChange={(e) => updateReference(index, 'relationship_other', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder="Enter relationship..."
                                    aria-invalid={!!(touchedFields[`ref_${index}_relationship_other`] && errors[`ref_${index}_relationship_other`])}
                                    className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_relationship_other`] && errors[`ref_${index}_relationship_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`ref_${index}_relationship_other`] && errors[`ref_${index}_relationship_other`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`ref_${index}_relationship_other`]}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addReference} className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Plus size={16} />
                    Add Reference
                </button>
            </div>
        </div>
    );
}
