import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { PhoneInput } from '@/components/ui/phone-input';
import { SimpleSelect } from '@/components/ui/simple-select';
import { WeightUnitSelect } from '@/components/ui/weight-unit-select';
import type { ApplicationWizardData, OccupantDetails, PetDetails } from '@/hooks/useApplicationWizard';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import type { SharedData } from '@/types';
import { getCountryByIso2 } from '@/utils/country-data';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { AlertCircle, ChevronDown, ChevronUp, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface DetailsStepProps {
    data: ApplicationWizardData;
    errors: Record<string, string>;
    touchedFields: Record<string, boolean>;
    updateField: <K extends keyof ApplicationWizardData>(key: K, value: ApplicationWizardData[K]) => void;
    markFieldTouched: (field: string) => void;
    addOccupant: () => void;
    removeOccupant: (index: number) => void;
    updateOccupant: (index: number, field: keyof OccupantDetails, value: string | boolean) => void;
    addPet: () => void;
    removePet: (index: number) => void;
    updatePet: (index: number, field: keyof PetDetails, value: string | boolean | File | null) => void;
    onBlur: () => void;
    propertyCountry?: string;
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
    propertyCountry,
}: DetailsStepProps) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, `wizard.application.detailsStep.${key}`);

    const { countryCode: detectedCountry } = useGeoLocation();
    const hasSetDefaults = useRef(false);

    // Collapsible sections state
    const [showEmergencyContact, setShowEmergencyContact] = useState(false);

    // Show emergency contact section for US/AU properties (suggested)
    const suggestEmergencyContact = propertyCountry === 'US' || propertyCountry === 'AU';

    // Set default phone country code for emergency contact
    useEffect(
        () => {
            if (detectedCountry && !hasSetDefaults.current) {
                hasSetDefaults.current = true;
                if (!data.emergency_contact_phone_country_code) {
                    const country = getCountryByIso2(detectedCountry);
                    if (country) {
                        updateField('emergency_contact_phone_country_code', `+${country.dialCode}`);
                    }
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [detectedCountry],
    );

    const OCCUPANT_RELATIONSHIPS = useMemo(
        () => [
            { value: 'spouse', label: t('occupants.relationships.spouse') || 'Spouse' },
            { value: 'partner', label: t('occupants.relationships.partner') || 'Partner' },
            { value: 'child', label: t('occupants.relationships.child') || 'Child' },
            { value: 'parent', label: t('occupants.relationships.parent') || 'Parent' },
            { value: 'sibling', label: t('occupants.relationships.sibling') || 'Sibling' },
            { value: 'roommate', label: t('occupants.relationships.roommate') || 'Roommate' },
            { value: 'dependent', label: t('occupants.relationships.dependent') || 'Dependent' },
            { value: 'other', label: t('occupants.relationships.other') || 'Other' },
        ],
        [translations],
    );

    const PET_TYPES = useMemo(
        () => [
            { value: 'dog', label: t('pets.types.dog') || 'Dog' },
            { value: 'cat', label: t('pets.types.cat') || 'Cat' },
            { value: 'bird', label: t('pets.types.bird') || 'Bird' },
            { value: 'fish', label: t('pets.types.fish') || 'Fish' },
            { value: 'rabbit', label: t('pets.types.rabbit') || 'Rabbit' },
            { value: 'hamster', label: t('pets.types.hamster') || 'Hamster' },
            { value: 'guinea_pig', label: t('pets.types.guinea_pig') || 'Guinea Pig' },
            { value: 'reptile', label: t('pets.types.reptile') || 'Reptile' },
            { value: 'other', label: t('pets.types.other') || 'Other' },
        ],
        [translations],
    );

    const PET_SIZES = useMemo(
        () => [
            { value: 'small', label: t('pets.sizes.small') || 'Small (< 10kg)' },
            { value: 'medium', label: t('pets.sizes.medium') || 'Medium (10-25kg)' },
            { value: 'large', label: t('pets.sizes.large') || 'Large (> 25kg)' },
        ],
        [translations],
    );

    const EMERGENCY_CONTACT_RELATIONSHIPS = useMemo(
        () => [
            { value: 'spouse', label: t('emergencyContact.relationships.spouse') || 'Spouse' },
            { value: 'partner', label: t('emergencyContact.relationships.partner') || 'Partner' },
            { value: 'parent', label: t('emergencyContact.relationships.parent') || 'Parent' },
            { value: 'sibling', label: t('emergencyContact.relationships.sibling') || 'Sibling' },
            { value: 'child', label: t('emergencyContact.relationships.child') || 'Child' },
            { value: 'friend', label: t('emergencyContact.relationships.friend') || 'Friend' },
            { value: 'other', label: t('emergencyContact.relationships.other') || 'Other' },
        ],
        [translations],
    );

    const handleFieldChange = (field: keyof ApplicationWizardData, value: unknown) => {
        updateField(field, value as ApplicationWizardData[typeof field]);
        markFieldTouched(field);
    };

    const handleEmergencyPhoneChange = (phoneNumber: string, countryCode: string) => {
        updateField('emergency_contact_phone_number', phoneNumber);
        updateField('emergency_contact_phone_country_code', countryCode);
        markFieldTouched('emergency_contact_phone_number');
    };

    // Helper to determine if occupant is 18+ (can sign lease)
    const isOccupantAdult = (dateOfBirth: string): boolean => {
        if (!dateOfBirth) return false;
        const dob = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    };

    const getFieldClass = (field: string) => {
        const hasError = touchedFields[field] && errors[field];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold">{t('title') || 'Household Composition'}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('description') || 'Tell us about who will live in the property and your rental intent.'}
                </p>
            </div>

            {/* Rental Intent Section */}
            <div className="rounded-lg border border-border p-4">
                <h3 className="mb-4 font-semibold">{t('sections.rentalIntent') || 'Rental Intent'}</h3>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('fields.moveInDate') || 'Desired Move-In Date'} <span className="text-destructive">*</span>
                        </label>
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
                        <label className="mt-2 flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_flexible_on_move_in}
                                onChange={(e) => handleFieldChange('is_flexible_on_move_in', e.target.checked)}
                                className="h-4 w-4"
                            />
                            <span className="text-sm text-muted-foreground">
                                {t('fields.flexibleOnMoveIn') || "I'm flexible on the move-in date"}
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            {t('fields.leaseDuration') || 'Desired Lease Duration (months)'} <span className="text-destructive">*</span>
                        </label>
                        <input
                            type="number"
                            value={data.lease_duration_months}
                            onChange={(e) => handleFieldChange('lease_duration_months', parseInt(e.target.value) || 0)}
                            onBlur={onBlur}
                            min={1}
                            max={60}
                            aria-invalid={!!(touchedFields.lease_duration_months && errors.lease_duration_months)}
                            className={getFieldClass('lease_duration_months')}
                            required
                        />
                        {touchedFields.lease_duration_months && errors.lease_duration_months && (
                            <p className="mt-1 text-sm text-destructive">{errors.lease_duration_months}</p>
                        )}
                        <label className="mt-2 flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_flexible_on_duration}
                                onChange={(e) => handleFieldChange('is_flexible_on_duration', e.target.checked)}
                                className="h-4 w-4"
                            />
                            <span className="text-sm text-muted-foreground">
                                {t('fields.flexibleOnDuration') || "I'm flexible on the lease duration"}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Message to Landlord */}
            <div>
                <label className="mb-2 block text-sm font-medium">
                    {t('fields.messageToLandlord') || 'Message to Landlord'} <span className="text-muted-foreground">({t('optional')})</span>
                </label>
                <textarea
                    value={data.message_to_landlord}
                    onChange={(e) => updateField('message_to_landlord', e.target.value)}
                    onBlur={onBlur}
                    rows={4}
                    maxLength={2000}
                    placeholder={t('placeholders.message') || "Introduce yourself and explain why you're interested in this property..."}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                    {(t('characters') || ':count/:max characters')
                        .replace(':count', data.message_to_landlord.length.toString())
                        .replace(':max', '2000')}
                </p>
            </div>

            {/* Occupants Section */}
            <div className="border-t border-border pt-6">
                <div className="mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">{t('occupants.title') || 'Occupants'}</h3>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                    {t('occupants.description') || 'You (the applicant) are automatically included. Add any additional occupants below.'}
                </p>

                {data.occupants_details.map((occupant, index) => (
                    <div key={index} className="mb-4 rounded-lg border border-border p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="font-medium">
                                {(t('occupants.occupant') || 'Occupant :index').replace(':index', (index + 1).toString())}
                            </h4>
                            <button type="button" onClick={() => removeOccupant(index)} className="cursor-pointer text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-sm">{t('occupants.firstName') || 'First Name'}</label>
                                <input
                                    type="text"
                                    value={occupant.first_name}
                                    onChange={(e) => updateOccupant(index, 'first_name', e.target.value)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`occupant_${index}_first_name`] && errors[`occupant_${index}_first_name`])}
                                    className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`occupant_${index}_first_name`] && errors[`occupant_${index}_first_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`occupant_${index}_first_name`] && errors[`occupant_${index}_first_name`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`occupant_${index}_first_name`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('occupants.lastName') || 'Last Name'}</label>
                                <input
                                    type="text"
                                    value={occupant.last_name}
                                    onChange={(e) => updateOccupant(index, 'last_name', e.target.value)}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields[`occupant_${index}_last_name`] && errors[`occupant_${index}_last_name`])}
                                    className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`occupant_${index}_last_name`] && errors[`occupant_${index}_last_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                    required
                                />
                                {touchedFields[`occupant_${index}_last_name`] && errors[`occupant_${index}_last_name`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`occupant_${index}_last_name`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('occupants.dateOfBirth') || 'Date of Birth'}</label>
                                <DatePicker
                                    value={occupant.date_of_birth}
                                    onChange={(value) => updateOccupant(index, 'date_of_birth', value || '')}
                                    onBlur={onBlur}
                                    max={new Date()}
                                    aria-invalid={!!(touchedFields[`occupant_${index}_date_of_birth`] && errors[`occupant_${index}_date_of_birth`])}
                                />
                                {touchedFields[`occupant_${index}_date_of_birth`] && errors[`occupant_${index}_date_of_birth`] && (
                                    <p className="mt-1 text-xs text-destructive">{errors[`occupant_${index}_date_of_birth`]}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">{t('occupants.relationship') || 'Relationship'}</label>
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

                        {occupant.relationship === 'other' && (
                            <div className="mt-3">
                                <label className="mb-1 block text-sm">{t('occupants.specifyRelationship') || 'Please specify'}</label>
                                <input
                                    type="text"
                                    value={occupant.relationship_other}
                                    onChange={(e) => updateOccupant(index, 'relationship_other', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('occupants.placeholder') || 'Enter relationship...'}
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

                        {/* Lease signing and dependent flags */}
                        <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
                            <label
                                className={`flex cursor-pointer items-center gap-2 ${!isOccupantAdult(occupant.date_of_birth) ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={occupant.will_sign_lease}
                                    onChange={(e) => updateOccupant(index, 'will_sign_lease', e.target.checked)}
                                    disabled={!isOccupantAdult(occupant.date_of_birth)}
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">{t('occupants.willSignLease') || 'Will sign the lease'}</span>
                                {!isOccupantAdult(occupant.date_of_birth) && (
                                    <span className="text-xs text-muted-foreground">({t('occupants.mustBe18') || 'Must be 18+'})</span>
                                )}
                            </label>

                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={occupant.is_dependent}
                                    onChange={(e) => updateOccupant(index, 'is_dependent', e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <span className="text-sm">{t('occupants.isDependent') || 'Is a dependent'}</span>
                            </label>
                        </div>

                        {occupant.will_sign_lease && isOccupantAdult(occupant.date_of_birth) && (
                            <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                                <p className="text-sm text-primary">
                                    <AlertCircle className="mr-1 inline h-4 w-4" />
                                    {t('occupants.coSignerNote') ||
                                        'This person will need to provide identity and financial information in the Risk Mitigation step.'}
                                </p>
                            </div>
                        )}
                    </div>
                ))}

                <button type="button" onClick={addOccupant} className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline">
                    <Plus size={16} />
                    {t('occupants.addOccupant') || 'Add Occupant'}
                </button>
            </div>

            {/* Pets Section */}
            <div className="border-t border-border pt-6">
                <div className="mb-4 flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={data.has_pets}
                        onChange={(e) => handleFieldChange('has_pets', e.target.checked)}
                        className="h-4 w-4"
                    />
                    <label className="text-sm font-medium">{t('pets.hasPets') || 'I have pets'}</label>
                </div>

                {data.has_pets && (
                    <div className="space-y-4">
                        {errors.pets_details && <p className="text-sm text-destructive">{errors.pets_details}</p>}

                        {data.pets_details.map((pet, index) => (
                            <div key={index} className="rounded-lg border border-border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h4 className="font-medium">{(t('pets.pet') || 'Pet :index').replace(':index', (index + 1).toString())}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removePet(index)}
                                        className={`text-red-500 hover:text-red-700 ${data.has_pets && data.pets_details.length === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                        disabled={data.has_pets && data.pets_details.length === 1}
                                        title={
                                            data.has_pets && data.pets_details.length === 1
                                                ? t('pets.atLeastOneRequired') || 'At least one pet required'
                                                : ''
                                        }
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Row 1: Type, Breed, Name */}
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm">{t('pets.type') || 'Type'}</label>
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
                                            {t('pets.breed') || 'Breed'}{' '}
                                            <span className="text-muted-foreground">({t('optional') || 'optional'})</span>
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
                                            {t('pets.name') || 'Name'} <span className="text-muted-foreground">({t('optional') || 'optional'})</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={pet.name}
                                            onChange={(e) => updatePet(index, 'name', e.target.value)}
                                            onBlur={onBlur}
                                            placeholder={t('pets.namePlaceholder') || "Pet's name"}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Age, Weight, Size */}
                                <div className="mt-3 grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm">
                                            {t('pets.age') || 'Age'} <span className="text-muted-foreground">({t('optional') || 'optional'})</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={pet.age}
                                            onChange={(e) => updatePet(index, 'age', e.target.value)}
                                            onBlur={onBlur}
                                            placeholder="e.g. 2 years"
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm">
                                            {t('pets.weight') || 'Weight'}{' '}
                                            <span className="text-muted-foreground">({t('optional') || 'optional'})</span>
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
                                    <div>
                                        <label className="mb-1 block text-sm">
                                            {t('pets.size') || 'Size'} <span className="text-muted-foreground">({t('optional') || 'optional'})</span>
                                        </label>
                                        <SimpleSelect
                                            value={pet.size}
                                            onChange={(value) => updatePet(index, 'size', value)}
                                            options={PET_SIZES}
                                            placeholder={t('pets.sizePlaceholder') || 'Select size...'}
                                            onBlur={onBlur}
                                        />
                                    </div>
                                </div>

                                {pet.type === 'other' && (
                                    <div className="mt-3">
                                        <label className="mb-1 block text-sm">{t('pets.specifyType') || 'Please specify'}</label>
                                        <input
                                            type="text"
                                            value={pet.type_other}
                                            onChange={(e) => updatePet(index, 'type_other', e.target.value)}
                                            onBlur={onBlur}
                                            placeholder={t('pets.placeholder') || 'Enter pet type...'}
                                            aria-invalid={!!(touchedFields[`pet_${index}_type_other`] && errors[`pet_${index}_type_other`])}
                                            className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`pet_${index}_type_other`] && errors[`pet_${index}_type_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                            required
                                        />
                                        {touchedFields[`pet_${index}_type_other`] && errors[`pet_${index}_type_other`] && (
                                            <p className="mt-1 text-xs text-destructive">{errors[`pet_${index}_type_other`]}</p>
                                        )}
                                    </div>
                                )}

                                {/* Assistance Animal Section */}
                                <div className="mt-4 border-t border-border pt-4">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={pet.is_registered_assistance_animal}
                                            onChange={(e) => updatePet(index, 'is_registered_assistance_animal', e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        <span className="text-sm">
                                            {t('pets.isAssistanceAnimal') || 'This is a registered assistance/service animal'}
                                        </span>
                                    </label>

                                    {pet.is_registered_assistance_animal && (
                                        <div className="mt-3">
                                            <FileUpload
                                                label={t('pets.assistanceDocumentation') || 'Assistance Animal Documentation'}
                                                documentType={`pet_${index}_assistance_documentation`}
                                                uploadUrl="/tenant-profile/document/upload"
                                                accept={{
                                                    'image/*': ['.png', '.jpg', '.jpeg'],
                                                    'application/pdf': ['.pdf'],
                                                }}
                                                maxSize={20 * 1024 * 1024}
                                                description={{
                                                    fileTypes: 'PDF, PNG, JPG',
                                                    maxFileSize: '20MB',
                                                }}
                                                onUploadSuccess={() => {
                                                    markFieldTouched(`pet_${index}_assistance_documentation`);
                                                }}
                                                error={
                                                    touchedFields[`pet_${index}_assistance_documentation`]
                                                        ? errors[`pet_${index}_assistance_documentation`]
                                                        : undefined
                                                }
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {t('pets.assistanceDocumentationHelp') ||
                                                    'Upload documentation from a licensed professional (e.g., letter from doctor, registration certificate)'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addPet}
                            className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Plus size={16} />
                            {t('pets.addPet') || 'Add Pet'}
                        </button>
                    </div>
                )}
            </div>

            {/* Emergency Contact Section (Collapsible) */}
            <div className="border-t border-border pt-6">
                <button
                    type="button"
                    onClick={() => setShowEmergencyContact(!showEmergencyContact)}
                    className="flex w-full cursor-pointer items-center justify-between text-left"
                >
                    <div className="flex items-center gap-2">
                        <AlertCircle className={`h-5 w-5 ${suggestEmergencyContact ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        <div>
                            <h3 className="font-semibold">{t('emergencyContact.title') || 'Emergency Contact'}</h3>
                            <p className="text-xs text-muted-foreground">
                                {suggestEmergencyContact
                                    ? t('emergencyContact.descriptionSuggested') || 'Recommended for this property'
                                    : t('emergencyContact.description') || 'Optional but helpful for landlords'}
                            </p>
                        </div>
                    </div>
                    {showEmergencyContact ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                </button>

                {showEmergencyContact && (
                    <div className="mt-4 space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('emergencyContact.fields.name') || 'Contact Name'}</label>
                                <input
                                    type="text"
                                    value={data.emergency_contact_name}
                                    onChange={(e) => handleFieldChange('emergency_contact_name', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('emergencyContact.placeholders.name') || 'Full name'}
                                    aria-invalid={!!(touchedFields.emergency_contact_name && errors.emergency_contact_name)}
                                    className={getFieldClass('emergency_contact_name')}
                                />
                                {touchedFields.emergency_contact_name && errors.emergency_contact_name && (
                                    <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {t('emergencyContact.fields.relationship') || 'Relationship'}
                                </label>
                                <SimpleSelect
                                    value={data.emergency_contact_relationship}
                                    onChange={(value) => handleFieldChange('emergency_contact_relationship', value)}
                                    options={EMERGENCY_CONTACT_RELATIONSHIPS}
                                    placeholder={t('emergencyContact.placeholders.relationship') || 'Select...'}
                                    onBlur={onBlur}
                                    aria-invalid={!!(touchedFields.emergency_contact_relationship && errors.emergency_contact_relationship)}
                                />
                                {touchedFields.emergency_contact_relationship && errors.emergency_contact_relationship && (
                                    <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_relationship}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('emergencyContact.fields.phone') || 'Phone Number'}</label>
                                <PhoneInput
                                    value={data.emergency_contact_phone_number}
                                    countryCode={data.emergency_contact_phone_country_code}
                                    onChange={handleEmergencyPhoneChange}
                                    onBlur={onBlur}
                                    placeholder={t('emergencyContact.placeholders.phone') || 'Phone number'}
                                    error={touchedFields.emergency_contact_phone_number ? errors.emergency_contact_phone_number : undefined}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {t('emergencyContact.fields.email') || 'Email Address'}{' '}
                                    <span className="text-muted-foreground">({t('optional') || 'optional'})</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.emergency_contact_email}
                                    onChange={(e) => handleFieldChange('emergency_contact_email', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('emergencyContact.placeholders.email') || 'email@example.com'}
                                    aria-invalid={!!(touchedFields.emergency_contact_email && errors.emergency_contact_email)}
                                    className={getFieldClass('emergency_contact_email')}
                                />
                                {touchedFields.emergency_contact_email && errors.emergency_contact_email && (
                                    <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_email}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
