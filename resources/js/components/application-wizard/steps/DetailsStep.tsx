import { DatePicker } from '@/components/ui/date-picker';
import { FileUpload } from '@/components/ui/file-upload';
import { OptionalBadge } from '@/components/ui/optional-badge';
import { PhoneInput } from '@/components/ui/phone-input';
import { SimpleSelect } from '@/components/ui/simple-select';
import type { ApplicationWizardData, OccupantDetails, PetDetails } from '@/hooks/useApplicationWizard';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import type { SharedData } from '@/types';
import { getCountryByIso2 } from '@/utils/country-data';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { AlertCircle, Calendar, ChevronDown, ChevronUp, PawPrint, Phone, Plus, Trash2, Users } from 'lucide-react';
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

    // Collapsible sections state (card-based layout)
    // Only the first section is expanded by default
    const [expandedSections, setExpandedSections] = useState({
        rentalIntent: true,
        occupants: false,
        pets: false,
        emergencyContact: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    // Effect to expand sections with errors
    useEffect(() => {
        const rentalIntentFields = ['desired_move_in_date', 'lease_duration_months', 'message_to_landlord'];
        const occupantFields = data.occupants_details.flatMap((_, i) => [
            `occupant_${i}_first_name`,
            `occupant_${i}_last_name`,
            `occupant_${i}_date_of_birth`,
            `occupant_${i}_relationship`,
            `occupant_${i}_relationship_other`,
        ]);
        const petFields = ['pets_details', ...data.pets_details.flatMap((_, i) => [`pet_${i}_type`, `pet_${i}_type_other`])];
        const emergencyContactFields = [
            'emergency_contact_name',
            'emergency_contact_relationship',
            'emergency_contact_phone_number',
            'emergency_contact_email',
        ];

        const hasRentalIntentError = rentalIntentFields.some((f) => touchedFields[f] && errors[f]);
        const hasOccupantsError = occupantFields.some((f) => touchedFields[f] && errors[f]);
        const hasPetsError = petFields.some((f) => touchedFields[f] && errors[f]);
        const hasEmergencyContactError = emergencyContactFields.some((f) => touchedFields[f] && errors[f]);

        // Expand sections with errors
        if (hasRentalIntentError || hasOccupantsError || hasPetsError || hasEmergencyContactError) {
            setExpandedSections((prev) => ({
                ...prev,
                rentalIntent: prev.rentalIntent || hasRentalIntentError,
                occupants: prev.occupants || hasOccupantsError,
                pets: prev.pets || hasPetsError,
                emergencyContact: prev.emergencyContact || hasEmergencyContactError,
            }));
        }
    }, [errors, touchedFields, data.occupants_details, data.pets_details]);

    // Show emergency contact section suggestion for US/AU properties
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

    const getFieldClass = (field: string) => {
        const hasError = touchedFields[field] && errors[field];
        return `w-full rounded-lg border px-4 py-2 ${hasError ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold">{t('title') || 'Household Composition'}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t('description') || 'Tell us about who will live in the property and your rental intent.'}
                </p>
            </div>

            {/* Section 1: Rental Intent */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('rentalIntent')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-primary" />
                        <h3 className="font-semibold">{t('sections.rentalIntent') || 'Rental Intent'}</h3>
                    </div>
                    {expandedSections.rentalIntent ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.rentalIntent && (
                    <div className="space-y-4 border-t border-border p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('fields.moveInDate') || 'Desired Move-In Date'}</label>
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
                                    {t('fields.leaseDuration') || 'Desired Lease Duration (months)'}
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

                        {/* Message to Landlord */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('fields.messageToLandlord') || 'Message to Landlord'}
                                <OptionalBadge />
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
                    </div>
                )}
            </div>

            {/* Section 2: Occupants */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('occupants')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <Users size={20} className="text-primary" />
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{t('occupants.title') || 'Occupants'}</h3>
                            {data.occupants_details.length > 0 && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.occupants_details.length}</span>
                            )}
                        </div>
                    </div>
                    {expandedSections.occupants ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.occupants && (
                    <div className="space-y-4 border-t border-border p-4">
                        <p className="text-sm text-muted-foreground">
                            {t('occupants.description') || 'You (the applicant) are automatically included. Add any additional occupants below.'}
                        </p>

                        {data.occupants_details.map((occupant, index) => (
                            <div key={index} className="rounded-lg border border-border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h4 className="font-medium">
                                        {(t('occupants.occupant') || 'Occupant :index').replace(':index', (index + 1).toString())}
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => removeOccupant(index)}
                                        className="cursor-pointer text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Row 1: First Name, Last Name */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm">{t('occupants.firstName') || 'First Name'}</label>
                                        <input
                                            type="text"
                                            value={occupant.first_name}
                                            onChange={(e) => updateOccupant(index, 'first_name', e.target.value)}
                                            onBlur={onBlur}
                                            aria-invalid={!!(touchedFields[`occupant_${index}_first_name`] && errors[`occupant_${index}_first_name`])}
                                            className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`occupant_${index}_first_name`] && errors[`occupant_${index}_first_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                        />
                                        {touchedFields[`occupant_${index}_first_name`] && errors[`occupant_${index}_first_name`] && (
                                            <p className="mt-1 text-sm text-destructive">{errors[`occupant_${index}_first_name`]}</p>
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
                                        />
                                        {touchedFields[`occupant_${index}_last_name`] && errors[`occupant_${index}_last_name`] && (
                                            <p className="mt-1 text-sm text-destructive">{errors[`occupant_${index}_last_name`]}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Date of Birth, Relationship */}
                                <div className="mt-3 grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm">{t('occupants.dateOfBirth') || 'Date of Birth'}</label>
                                        <DatePicker
                                            value={occupant.date_of_birth}
                                            onChange={(value) => updateOccupant(index, 'date_of_birth', value || '')}
                                            onBlur={onBlur}
                                            max={new Date()}
                                            aria-invalid={
                                                !!(touchedFields[`occupant_${index}_date_of_birth`] && errors[`occupant_${index}_date_of_birth`])
                                            }
                                        />
                                        {touchedFields[`occupant_${index}_date_of_birth`] && errors[`occupant_${index}_date_of_birth`] && (
                                            <p className="mt-1 text-sm text-destructive">{errors[`occupant_${index}_date_of_birth`]}</p>
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
                                            aria-invalid={
                                                !!(touchedFields[`occupant_${index}_relationship`] && errors[`occupant_${index}_relationship`])
                                            }
                                        />
                                        {touchedFields[`occupant_${index}_relationship`] && errors[`occupant_${index}_relationship`] && (
                                            <p className="mt-1 text-sm text-destructive">{errors[`occupant_${index}_relationship`]}</p>
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
                                                !!(
                                                    touchedFields[`occupant_${index}_relationship_other`] &&
                                                    errors[`occupant_${index}_relationship_other`]
                                                )
                                            }
                                            className={`w-full rounded-lg border px-4 py-2 ${touchedFields[`occupant_${index}_relationship_other`] && errors[`occupant_${index}_relationship_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                        />
                                        {touchedFields[`occupant_${index}_relationship_other`] && errors[`occupant_${index}_relationship_other`] && (
                                            <p className="mt-1 text-sm text-destructive">{errors[`occupant_${index}_relationship_other`]}</p>
                                        )}
                                    </div>
                                )}

                                {/* Lease signing and dependent flags */}
                                <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4">
                                    <label className="flex cursor-pointer items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={occupant.will_sign_lease}
                                            onChange={(e) => updateOccupant(index, 'will_sign_lease', e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        <span className="text-sm">{t('occupants.willSignLease') || 'Will sign the lease'}</span>
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

                                {occupant.will_sign_lease && (
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

                        <button
                            type="button"
                            onClick={addOccupant}
                            className="flex cursor-pointer items-center gap-2 text-sm text-primary hover:underline"
                        >
                            <Plus size={16} />
                            {t('occupants.addOccupant') || 'Add Occupant'}
                        </button>
                    </div>
                )}
            </div>

            {/* Section 3: Pets */}
            <div className="rounded-lg border border-border bg-card">
                <button type="button" onClick={() => toggleSection('pets')} className="flex w-full cursor-pointer items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <PawPrint size={20} className="text-primary" />
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{t('pets.title') || 'Pets'}</h3>
                            {data.pets_details.length > 0 && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{data.pets_details.length}</span>
                            )}
                        </div>
                    </div>
                    {expandedSections.pets ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {expandedSections.pets && (
                    <div className="space-y-4 border-t border-border p-4">
                        <p className="text-sm text-muted-foreground">
                            {t('pets.description') || 'Add any pets that will live in the property. If you have no pets, leave this section empty.'}
                        </p>

                        {errors.pets_details && <p className="text-sm text-destructive">{errors.pets_details}</p>}

                        {data.pets_details.map((pet, index) => (
                            <div key={index} className="rounded-lg border border-border p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h4 className="font-medium">{(t('pets.pet') || 'Pet :index').replace(':index', (index + 1).toString())}</h4>
                                    <button type="button" onClick={() => removePet(index)} className="cursor-pointer text-red-500 hover:text-red-700">
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
                                            <p className="mt-1 text-sm text-destructive">{errors[`pet_${index}_type`]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-1 flex items-center gap-2 text-sm">
                                            {t('pets.breed') || 'Breed'}
                                            <OptionalBadge />
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
                                        <label className="mb-1 flex items-center gap-2 text-sm">
                                            {t('pets.name') || 'Name'}
                                            <OptionalBadge />
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

                                {/* Row 2: Age, Size */}
                                <div className="mt-3 grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 flex items-center gap-2 text-sm">
                                            {t('pets.age') || 'Age'}
                                            <OptionalBadge />
                                        </label>
                                        <input
                                            type="text"
                                            value={pet.age}
                                            onChange={(e) => updatePet(index, 'age', e.target.value)}
                                            onBlur={onBlur}
                                            placeholder={t('pets.agePlaceholder') || 'e.g. 2 years'}
                                            className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 flex items-center gap-2 text-sm">
                                            {t('pets.size') || 'Size'}
                                            <OptionalBadge />
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
                                        />
                                        {touchedFields[`pet_${index}_type_other`] && errors[`pet_${index}_type_other`] && (
                                            <p className="mt-1 text-sm text-destructive">{errors[`pet_${index}_type_other`]}</p>
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

            {/* Section 4: Emergency Contact */}
            <div className="rounded-lg border border-border bg-card">
                <button
                    type="button"
                    onClick={() => toggleSection('emergencyContact')}
                    className="flex w-full cursor-pointer items-center justify-between p-4"
                >
                    <div className="flex items-center gap-3">
                        <Phone size={20} className="text-primary" />
                        <h3 className="font-semibold">{t('emergencyContact.title') || 'Emergency Contact'}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <OptionalBadge />
                        {expandedSections.emergencyContact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </button>

                {expandedSections.emergencyContact && (
                    <div className="space-y-4 border-t border-border p-4">
                        {suggestEmergencyContact && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    <AlertCircle className="mr-1 inline h-4 w-4" />
                                    {t('emergencyContact.descriptionSuggested') || 'Recommended for this property location.'}
                                </p>
                            </div>
                        )}

                        {/* Row 1: First Name, Last Name */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('emergencyContact.fields.firstName') || 'First Name'}</label>
                                <input
                                    type="text"
                                    value={data.emergency_contact_first_name}
                                    onChange={(e) => handleFieldChange('emergency_contact_first_name', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('emergencyContact.placeholders.firstName') || 'First name'}
                                    aria-invalid={!!(touchedFields.emergency_contact_first_name && errors.emergency_contact_first_name)}
                                    className={getFieldClass('emergency_contact_first_name')}
                                />
                                {touchedFields.emergency_contact_first_name && errors.emergency_contact_first_name && (
                                    <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_first_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">{t('emergencyContact.fields.lastName') || 'Last Name'}</label>
                                <input
                                    type="text"
                                    value={data.emergency_contact_last_name}
                                    onChange={(e) => handleFieldChange('emergency_contact_last_name', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('emergencyContact.placeholders.lastName') || 'Last name'}
                                    aria-invalid={!!(touchedFields.emergency_contact_last_name && errors.emergency_contact_last_name)}
                                    className={getFieldClass('emergency_contact_last_name')}
                                />
                                {touchedFields.emergency_contact_last_name && errors.emergency_contact_last_name && (
                                    <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_last_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 2: Relationship, Phone */}
                        <div className="grid gap-4 md:grid-cols-2">
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
                        </div>

                        {/* Specify relationship if "Other" is selected */}
                        {data.emergency_contact_relationship === 'other' && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    {t('emergencyContact.fields.specifyRelationship') || 'Please Specify Relationship'}
                                </label>
                                <input
                                    type="text"
                                    value={data.emergency_contact_relationship_other}
                                    onChange={(e) => handleFieldChange('emergency_contact_relationship_other', e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={t('emergencyContact.placeholders.specifyRelationship') || 'e.g. Cousin, Colleague'}
                                    aria-invalid={
                                        !!(touchedFields.emergency_contact_relationship_other && errors.emergency_contact_relationship_other)
                                    }
                                    className={getFieldClass('emergency_contact_relationship_other')}
                                />
                                {touchedFields.emergency_contact_relationship_other && errors.emergency_contact_relationship_other && (
                                    <p className="mt-1 text-sm text-destructive">{errors.emergency_contact_relationship_other}</p>
                                )}
                            </div>
                        )}

                        {/* Row 3: Email */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                                {t('emergencyContact.fields.email') || 'Email Address'}
                                <OptionalBadge />
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
                )}
            </div>
        </div>
    );
}
