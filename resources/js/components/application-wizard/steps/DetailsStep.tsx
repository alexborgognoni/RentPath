import { DatePicker } from '@/components/ui/date-picker';
import { SimpleSelect } from '@/components/ui/simple-select';
import { WeightUnitSelect } from '@/components/ui/weight-unit-select';
import type { ApplicationWizardData, OccupantDetails, PetDetails } from '@/hooks/useApplicationWizard';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface DetailsStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    addOccupant: () => void;
    removeOccupant: (index: number) => void;
    updateOccupant: (index: number, field: keyof OccupantDetails, value: string) => void;
    addPet: () => void;
    removePet: (index: number) => void;
    updatePet: (index: number, field: keyof PetDetails, value: string) => void;
    onBlur: () => void;
}

export function DetailsStep({
    data,
    errors,
    touchedFields,
    updateField,
    markFieldTouched,
    addOccupant,
    removeOccupant,
    updateOccupant,
    addPet,
    removePet,
    updatePet,
    onBlur,
}: DetailsStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.detailsStep.${key}`);

    const OCCUPANT_RELATIONSHIPS = useMemo(
        () => [
            { value: 'Spouse', label: t('occupants.relationships.spouse') },
            { value: 'Partner', label: t('occupants.relationships.partner') },
            { value: 'Child', label: t('occupants.relationships.child') },
            { value: 'Parent', label: t('occupants.relationships.parent') },
            { value: 'Sibling', label: t('occupants.relationships.sibling') },
            { value: 'Roommate', label: t('occupants.relationships.roommate') },
            { value: 'Other', label: t('occupants.relationships.other') },
        ],
        [translations],
    );

    const PET_TYPES = useMemo(
        () => [
            { value: 'Dog', label: t('pets.types.dog') },
            { value: 'Cat', label: t('pets.types.cat') },
            { value: 'Bird', label: t('pets.types.bird') },
            { value: 'Fish', label: t('pets.types.fish') },
            { value: 'Rabbit', label: t('pets.types.rabbit') },
            { value: 'Hamster', label: t('pets.types.hamster') },
            { value: 'Guinea Pig', label: t('pets.types.guinea_pig') },
            { value: 'Reptile', label: t('pets.types.reptile') },
            { value: 'Other', label: t('pets.types.other') },
        ],
        [translations],
    );

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('title')}</h2>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.moveInDate')}</label>
                    <DatePicker
                        value={data.desired_move_in_date}
                        onChange={(value) => handleFieldChange('desired_move_in_date', value)}
                        onBlur={onBlur}
                        min={new Date(Date.now() + 86400000)}
                        aria-invalid={!!(touchedFields.desired_move_in_date && errors.desired_move_in_date)}
                    />
                    {touchedFields.desired_move_in_date && errors.desired_move_in_date && (
                        <p className="mt-1 text-sm text-destructive">{errors.desired_move_in_date}</p>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">{t('fields.leaseDuration')}</label>
                    <input
                        type="number"
                        value={data.lease_duration_months}
                        onChange={(e) => handleFieldChange('lease_duration_months', parseInt(e.target.value) || 0)}
                        onBlur={onBlur}
                        min={1}
                        max={60}
                        aria-invalid={!!(touchedFields.lease_duration_months && errors.lease_duration_months)}
                        className={`w-full rounded-lg border px-4 py-2 ${touchedFields.lease_duration_months && errors.lease_duration_months ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                        required
                    />
                    {touchedFields.lease_duration_months && errors.lease_duration_months && (
                        <p className="mt-1 text-sm text-destructive">{errors.lease_duration_months}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">
                    {t('fields.messageToLandlord')} <span className="text-muted-foreground">({t('optional')})</span>
                </label>
                <textarea
                    value={data.message_to_landlord}
                    onChange={(e) => updateField('message_to_landlord', e.target.value)}
                    onBlur={onBlur}
                    rows={4}
                    maxLength={2000}
                    placeholder={t('placeholders.message')}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    {t('characters').replace(':count', data.message_to_landlord.length.toString()).replace(':max', '2000')}
                </p>
            </div>

            {/* Occupants Section */}
            <div className="border-t border-border pt-6">
                <h3 className="mb-4 font-semibold">{t('occupants.title')}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{t('occupants.description')}</p>

                {data.occupants_details.map((occupant, index) => (
                    <div key={index} className="mb-4 rounded-lg border border-border p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-medium">{t('occupants.occupant').replace(':index', (index + 1).toString())}</h4>
                            <button type="button" onClick={() => removeOccupant(index)} className="cursor-pointer text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm">{t('occupants.name')}</label>
                                <input
                                    type="text"
                                    value={occupant.name}
                                    onChange={(e) => updateOccupant(index, 'name', e.target.value)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`occupant_${index}_name`] && errors[`occupant_${index}_name`])}
                                    className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`occupant_${index}_name`] && errors[`occupant_${index}_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`occupant_${index}_name`] && errors[`occupant_${index}_name`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`occupant_${index}_name`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('occupants.age')}</label>
                                <input
                                    type="number"
                                    value={occupant.age}
                                    onChange={(e) => updateOccupant(index, 'age', e.target.value)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`occupant_${index}_age`] && errors[`occupant_${index}_age`])}
                                    className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`occupant_${index}_age`] && errors[`occupant_${index}_age`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`occupant_${index}_age`] && errors[`occupant_${index}_age`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`occupant_${index}_age`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('occupants.relationship')}</label>
                                <SimpleSelect
                                    value={occupant.relationship}
                                    onChange={(value) => updateOccupant(index, 'relationship', value)}
                                    options={OCCUPANT_RELATIONSHIPS}
                                    placeholder="Select..."
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`occupant_${index}_relationship`] && errors[`occupant_${index}_relationship`])}
                                />
                                {touchedFields[`occupant_${index}_relationship`] && errors[`occupant_${index}_relationship`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`occupant_${index}_relationship`]}</p>
                                )}
                            </div>
                        </div>
                        {occupant.relationship === 'Other' && (
                            <div className="mt-3">
                                <label className="mb-1 block text-sm">{t('occupants.specifyRelationship')}</label>
                                <input
                                    type="text"
                                    value={occupant.relationship_other}
                                    onChange={(e) => updateOccupant(index, 'relationship_other', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('occupants.placeholder')}
                                    aria-invalid={
                                        !!(touchedFields[`occupant_${index}_relationship_other`] && errors[`occupant_${index}_relationship_other`])
                                    }
                                    className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`occupant_${index}_relationship_other`] && errors[`occupant_${index}_relationship_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`occupant_${index}_relationship_other`] && errors[`occupant_${index}_relationship_other`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`occupant_${index}_relationship_other`]}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addOccupant} className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline">
                    <Plus size={16} />
                    {t('occupants.addOccupant')}
                </button>
            </div>

            {/* Pets Section */}
            <div className="border-t border-border pt-6">
                <div className="mb-4 flex items-center gap-2">
                    <input type="checkbox" checked={data.has_pets} onChange={(e) => updateField('has_pets', e.target.checked)} className="h-4 w-4" />
                    <label className="text-sm font-medium">{t('pets.hasPets')}</label>
                </div>

                {data.has_pets && (
                    <div className="space-y-4">
                        {errors.pets_details && <p className="text-sm text-destructive">{errors.pets_details}</p>}

                        {data.pets_details.map((pet, index) => (
                            <div key={index} className="rounded-lg border border-border p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="font-medium">{t('pets.pet').replace(':index', (index + 1).toString())}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removePet(index)}
                                        className={`text-red-500 hover:text-red-700 ${data.has_pets && data.pets_details.length === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={data.has_pets && data.pets_details.length === 1}
                                        title={data.has_pets && data.pets_details.length === 1 ? t('pets.atLeastOneRequired') : ''}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="grid gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="mb-1 block text-sm">{t('pets.type')}</label>
                                        <SimpleSelect
                                            value={pet.type}
                                            onChange={(value) => updatePet(index, 'type', value)}
                                            options={PET_TYPES}
                                            placeholder="Select..."
                                            onBlur={onBlur}
                                            aria-invalid={!!(touchedFields[`pet_${index}_type`] && errors[`pet_${index}_type`])}
                                        />
                                        {touchedFields[`pet_${index}_type`] && errors[`pet_${index}_type`] && (
                                            <p className="mt-1 text-xs text-destructive">{errors[`pet_${index}_type`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm">
                                            {t('pets.breed')} <span className="text-muted-foreground">({t('optional')})</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={pet.breed}
                                            onChange={(e) => updatePet(index, 'breed', e.target.value)}
                                            onBlur={onBlur}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm">
                                            {t('pets.age')} <span className="text-muted-foreground">({t('optional')})</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={pet.age}
                                            onChange={(e) => updatePet(index, 'age', e.target.value)}
                                            onBlur={onBlur}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm">
                                            {t('pets.weight')} <span className="text-muted-foreground">({t('optional')})</span>
                                        </label>
                                        <div className="flex">
                                            <WeightUnitSelect
                                                value={pet.weight_unit || 'kg'}
                                                onChange={(value) => updatePet(index, 'weight_unit', value)}
                                                compact
                                            />
                                            <input
                                                type="number"
                                                value={pet.weight}
                                                onChange={(e) => updatePet(index, 'weight', e.target.value)}
                                                onBlur={onBlur}
                                                className="w-full rounded-l-none rounded-r-lg border border-border bg-background px-4 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {pet.type === 'Other' && (
                                    <div className="mt-3">
                                        <label className="mb-1 block text-sm">{t('pets.specifyType')}</label>
                                        <input
                                            type="text"
                                            value={pet.type_other}
                                            onChange={(e) => updatePet(index, 'type_other', e.target.value)}
                                            onBlur={onBlur}
                                            placeholder={t('pets.placeholder')}
                                            aria-invalid={!!(touchedFields[`pet_${index}_type_other`] && errors[`pet_${index}_type_other`])}
                                            className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`pet_${index}_type_other`] && errors[`pet_${index}_type_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                            required
                                        />
                                        {touchedFields[`pet_${index}_type_other`] && errors[`pet_${index}_type_other`] && (
                                            <p className="mt-1 text-xs text-destructive">{errors[`pet_${index}_type_other`]}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addPet}
                            className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Plus size={16} />
                            {t('pets.addPet')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
