import { BaseLayout } from '@/layouts/base-layout';
import { type SharedData, type TenantProfile } from '@/types';
import type { Property } from '@/types/dashboard';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MapPin, Plus, Trash2, Upload } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ApplicationCreateProps extends SharedData {
    property: Property;
    tenantProfile: TenantProfile;
    draftApplication?: Application | null;
    token?: string | null;
}

interface Application {
    current_step: number;
    desired_move_in_date: string;
    lease_duration_months: number;
    message_to_landlord: string;
    additional_occupants: number;
    occupants_details: Array<{ name: string; age: string; relationship: string; relationship_other: string }>;
    has_pets: boolean;
    pets_details: Array<{ type: string; type_other: string; breed: string; age: string; weight: string }>;
    previous_landlord_name: string;
    previous_landlord_phone: string;
    previous_landlord_email: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relationship: string;
    references: Array<{ name: string; phone: string; email: string; relationship: string; relationship_other: string; years_known: string }>;
}

// Common relationship and pet type options
const OCCUPANT_RELATIONSHIPS = ['Spouse', 'Partner', 'Child', 'Parent', 'Sibling', 'Roommate', 'Other'];
const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Guinea Pig', 'Reptile', 'Other'];
const REFERENCE_RELATIONSHIPS = ['Employer', 'Colleague', 'Professor', 'Teacher', 'Friend', 'Neighbor', 'Other'];

export default function ApplicationCreate() {
    const { property, tenantProfile, draftApplication, token } = usePage<ApplicationCreateProps>().props;
    const [viewingStep, setViewingStep] = useState(draftApplication?.current_step || 1);
    const [maxStepReached, setMaxStepReached] = useState(draftApplication?.current_step || 1);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [pendingSave, setPendingSave] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { data, setData, post, processing, errors, progress } = useForm({
        desired_move_in_date: draftApplication?.desired_move_in_date
            ? new Date(draftApplication.desired_move_in_date).toISOString().split('T')[0]
            : '',
        lease_duration_months: draftApplication?.lease_duration_months || 12,
        message_to_landlord: draftApplication?.message_to_landlord || '',

        // Occupants
        additional_occupants: draftApplication?.additional_occupants || 0,
        occupants_details:
            draftApplication?.occupants_details || ([] as Array<{ name: string; age: string; relationship: string; relationship_other: string }>),

        // Pets
        has_pets: draftApplication?.has_pets || false,
        pets_details:
            draftApplication?.pets_details || ([] as Array<{ type: string; type_other: string; breed: string; age: string; weight: string }>),

        // Previous landlord (now optional)
        previous_landlord_name: draftApplication?.previous_landlord_name || '',
        previous_landlord_phone: draftApplication?.previous_landlord_phone || '',
        previous_landlord_email: draftApplication?.previous_landlord_email || '',

        // Emergency contact
        emergency_contact_name: draftApplication?.emergency_contact_name || tenantProfile.emergency_contact_name || '',
        emergency_contact_phone: draftApplication?.emergency_contact_phone || tenantProfile.emergency_contact_phone || '',
        emergency_contact_relationship: draftApplication?.emergency_contact_relationship || tenantProfile.emergency_contact_relationship || '',

        // References
        references:
            draftApplication?.references ||
            ([] as Array<{ name: string; phone: string; email: string; relationship: string; relationship_other: string; years_known: string }>),

        // Optional documents
        application_id_document: null as File | null,
        application_proof_of_income: null as File | null,
        application_reference_letter: null as File | null,
        additional_documents: [] as File[],

        // Token
        invited_via_token: token || '',
    });

    // Save draft on blur (no validation, just save)
    const saveOnBlur = useCallback(() => {
        // Debounce slightly to avoid multiple rapid saves
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(() => {
            setPendingSave(true);
            router.post(
                `/properties/${property.id}/apply/draft${token ? `?token=${token}` : ''}`,
                { ...data, current_step: maxStepReached },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['draftApplication'],
                    onSuccess: (page: { props: { draftApplication?: Application } }) => {
                        const updatedDraft = page.props.draftApplication;
                        if (updatedDraft && updatedDraft.current_step !== undefined) {
                            // Backend may have reduced current_step due to validation
                            const actualMaxStep = updatedDraft.current_step;
                            if (actualMaxStep < maxStepReached) {
                                // Validation failed - update maxStepReached
                                setMaxStepReached(actualMaxStep);
                            }
                        }
                        setPendingSave(false);
                    },
                    onError: () => setPendingSave(false),
                },
            );
        }, 300); // Small debounce to batch rapid blurs
    }, [data, maxStepReached, property.id, token]);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    // Save draft unconditionally (no validation on frontend, but backend validates)
    const saveDraft = (newMaxStep?: number) => {
        return new Promise<number>((resolve, reject) => {
            router.post(
                `/properties/${property.id}/apply/draft${token ? `?token=${token}` : ''}`,
                { ...data, current_step: newMaxStep ?? maxStepReached },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['draftApplication'], // Reload only the draft application data
                    onSuccess: (page: { props: { draftApplication?: Application } }) => {
                        // Backend validated and updated current_step
                        const updatedDraft = page.props.draftApplication;
                        if (updatedDraft && updatedDraft.current_step !== undefined) {
                            const actualMaxStep = updatedDraft.current_step;
                            setMaxStepReached(actualMaxStep);
                            resolve(actualMaxStep);
                        } else {
                            resolve(newMaxStep ?? maxStepReached);
                        }
                    },
                    onError: () => {
                        reject();
                    },
                },
            );
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate ALL steps before final submission
        const allErrors: { [key: string]: string } = {};

        // Temporarily validate each step
        for (let step = 1; step <= 4; step++) {
            const stepErrors = getStepErrors(step);
            Object.assign(allErrors, stepErrors);
        }

        if (Object.keys(allErrors).length > 0) {
            setValidationErrors(allErrors);
            // Find first step with errors and navigate to it
            for (let step = 1; step <= 4; step++) {
                const stepErrors = getStepErrors(step);
                if (Object.keys(stepErrors).length > 0) {
                    setViewingStep(step);
                    markAllStepFieldsAsTouched(step);
                    break;
                }
            }
            return;
        }

        // All valid, submit
        post(`/properties/${property.id}/apply${token ? `?token=${token}` : ''}`);
    };

    // Mark field as touched and validate it (save happens on blur)
    const handleFieldChange = (fieldName: string, value: unknown) => {
        setData(fieldName as keyof typeof data, value as never);
        setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
        validateField(fieldName, value);

        // Immediately check with updated value (don't wait for state)
        // This provides instant feedback before the useEffect runs
        checkAndUpdateMaxStepReachedWithValue(fieldName, value);
    };

    // Handle field blur - save draft
    const handleFieldBlur = () => {
        saveOnBlur();
    };

    // Validate a single field in real-time
    const validateField = (fieldName: string, value: unknown) => {
        const errors: { [key: string]: string } = {};

        if (fieldName === 'desired_move_in_date') {
            if (!value) {
                errors.desired_move_in_date = 'Move-in date is required';
            } else if (typeof value === 'string') {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate <= today) {
                    errors.desired_move_in_date = 'Move-in date must be in the future';
                }
            }
        }

        if (fieldName === 'lease_duration_months') {
            const numValue = typeof value === 'number' ? value : typeof value === 'string' ? parseInt(value) : 0;
            if (!value || numValue < 1) {
                errors.lease_duration_months = 'Lease duration must be at least 1 month';
            } else if (numValue > 60) {
                errors.lease_duration_months = 'Lease duration cannot exceed 60 months';
            }
        }

        // Occupant field validation
        if (fieldName.startsWith('occupant_') && fieldName.includes('_name')) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[fieldName] = 'Name is required';
            }
        }

        if (fieldName.startsWith('occupant_') && fieldName.includes('_age')) {
            if (!value || (typeof value === 'number' && (value < 0 || value > 120))) {
                errors[fieldName] = 'Valid age is required';
            }
        }

        if (fieldName.startsWith('occupant_') && fieldName.includes('_relationship')) {
            if (!value) {
                errors[fieldName] = 'Relationship is required';
            }
        }

        if (fieldName.startsWith('occupant_') && fieldName.includes('_relationship_other')) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[fieldName] = 'Please specify the relationship';
            }
        }

        // Pet field validation
        if (fieldName.startsWith('pet_') && fieldName.includes('_type')) {
            if (!value) {
                errors[fieldName] = 'Pet type is required';
            }
        }

        if (fieldName.startsWith('pet_') && fieldName.includes('_type_other')) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[fieldName] = 'Please specify the pet type';
            }
        }

        // Reference field validation
        if (fieldName.startsWith('ref_') && fieldName.includes('_name')) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[fieldName] = 'Name is required';
            }
        }

        if (fieldName.startsWith('ref_') && fieldName.includes('_phone')) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[fieldName] = 'Phone is required';
            }
        }

        if (fieldName.startsWith('ref_') && fieldName.includes('_email')) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[fieldName] = 'Email is required';
            } else if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors[fieldName] = 'Valid email is required';
            }
        }

        if (fieldName.startsWith('ref_') && fieldName.includes('_relationship')) {
            if (!value) {
                errors[fieldName] = 'Relationship is required';
            }
        }

        if (fieldName.startsWith('ref_') && fieldName.includes('_relationship_other')) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[fieldName] = 'Please specify the relationship';
            }
        }

        if (fieldName.startsWith('ref_') && fieldName.includes('_years_known')) {
            if (!value || (typeof value === 'number' && (value < 0 || value > 100))) {
                errors[fieldName] = 'Years known is required';
            }
        }

        // Update validation errors for this field
        setValidationErrors((prev) => {
            const updated = { ...prev };
            if (errors[fieldName]) {
                updated[fieldName] = errors[fieldName];
            } else {
                delete updated[fieldName];
            }
            return updated;
        });
    };

    // Check current step validity and update UI maxStepReached accordingly
    const checkAndUpdateMaxStepReached = useCallback(() => {
        // Calculate the highest valid step based on current data
        let calculatedMaxStep = 0;

        for (let step = 1; step <= 4; step++) {
            const stepErrors = getStepErrors(step);
            if (Object.keys(stepErrors).length === 0) {
                calculatedMaxStep = step;
            } else {
                break; // Stop at first invalid step
            }
        }

        // If current calculated max is less than UI maxStepReached, reduce it
        // But don't increase it (that only happens on successful save)
        if (calculatedMaxStep < maxStepReached) {
            setMaxStepReached(calculatedMaxStep);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, maxStepReached]);

    // Automatically check validation whenever data changes
    // This ensures progress bar is always accurate regardless of how data was changed
    useEffect(() => {
        checkAndUpdateMaxStepReached();
    }, [checkAndUpdateMaxStepReached]);

    // Check with a specific field override (for immediate validation during typing)
    const checkAndUpdateMaxStepReachedWithValue = (fieldName: string, value: unknown) => {
        // Create temporary data with the new value
        const tempData = { ...data, [fieldName]: value };

        // Calculate the highest valid step with the temporary data
        let calculatedMaxStep = 0;

        for (let step = 1; step <= 4; step++) {
            const stepErrors = getStepErrorsWithData(step, tempData);
            if (Object.keys(stepErrors).length === 0) {
                calculatedMaxStep = step;
            } else {
                break; // Stop at first invalid step
            }
        }

        // If current calculated max is less than UI maxStepReached, reduce it
        // But don't increase it (that only happens on successful save)
        if (calculatedMaxStep < maxStepReached) {
            setMaxStepReached(calculatedMaxStep);
        }
    };

    // Validate current step before advancing (sets state and returns boolean)
    const validateCurrentStep = (): boolean => {
        const errors = getCurrentStepErrors();
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = async () => {
        // Force blur on active element to trigger save
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // Wait for any pending save to complete
        if (pendingSave) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        const nextStepNumber = Math.min(viewingStep + 1, 4);
        const newMaxStep = Math.max(maxStepReached, nextStepNumber);

        // ALWAYS save first (unconditional)
        try {
            await saveDraft(newMaxStep);

            // THEN validate if this was a forward progression
            if (nextStepNumber > maxStepReached) {
                if (!validateCurrentStep()) {
                    // Validation failed - show errors but data is saved
                    markAllCurrentStepFieldsAsTouched();
                    return;
                }
            }

            // Navigation allowed
            setViewingStep(nextStepNumber);
            setMaxStepReached(newMaxStep);
            setValidationErrors({});
        } catch (error) {
            console.error('Failed to save draft:', error);
        }
    };

    const prevStep = async () => {
        // Force blur on active element to trigger save
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // Wait for any pending save to complete
        if (pendingSave) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // ALWAYS save when navigating backwards (no validation)
        try {
            await saveDraft();
            setViewingStep((prev) => Math.max(prev - 1, 1));
            setValidationErrors({});
        } catch (error) {
            console.error('Failed to save draft:', error);
        }
    };

    const goToStep = async (step: number) => {
        // Can navigate to any step up to maxStepReached
        if (step === viewingStep) return;

        if (step <= maxStepReached) {
            // Force blur on active element to trigger save
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }

            // Wait for any pending save to complete
            if (pendingSave) {
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            const newMaxStep = Math.max(maxStepReached, viewingStep);

            // ALWAYS save first (unconditional)
            try {
                const actualMaxStep = await saveDraft(newMaxStep);

                // Check if backend reduced maxStepReached due to validation failure
                if (step > actualMaxStep) {
                    // Backend validation failed - cannot navigate to requested step
                    // Show errors for current viewing step
                    if (!validateCurrentStep()) {
                        markAllCurrentStepFieldsAsTouched();
                    }
                    return;
                }

                // Navigation allowed
                setViewingStep(step);
                setValidationErrors({});
            } catch (error) {
                console.error('Failed to save draft:', error);
            }
        }
    };

    // Mark all fields in a specific step as touched to show validation errors
    const markAllStepFieldsAsTouched = (step: number) => {
        const newTouched: { [key: string]: boolean } = { ...touchedFields };

        if (step === 1) {
            newTouched.desired_move_in_date = true;
            newTouched.lease_duration_months = true;

            // Mark all occupant fields as touched
            data.occupants_details.forEach((_, index) => {
                newTouched[`occupant_${index}_name`] = true;
                newTouched[`occupant_${index}_age`] = true;
                newTouched[`occupant_${index}_relationship`] = true;
                if (data.occupants_details[index].relationship === 'Other') {
                    newTouched[`occupant_${index}_relationship_other`] = true;
                }
            });

            // Mark all pet fields as touched if has_pets
            if (data.has_pets) {
                data.pets_details.forEach((_, index) => {
                    newTouched[`pet_${index}_type`] = true;
                    if (data.pets_details[index].type === 'Other') {
                        newTouched[`pet_${index}_type_other`] = true;
                    }
                });
            }
        }

        if (step === 2) {
            // Mark all reference fields as touched
            data.references.forEach((_, index) => {
                newTouched[`ref_${index}_name`] = true;
                newTouched[`ref_${index}_phone`] = true;
                newTouched[`ref_${index}_email`] = true;
                newTouched[`ref_${index}_relationship`] = true;
                newTouched[`ref_${index}_years_known`] = true;
                if (data.references[index].relationship === 'Other') {
                    newTouched[`ref_${index}_relationship_other`] = true;
                }
            });
        }

        setTouchedFields(newTouched);
    };

    // Mark all fields in current step as touched
    const markAllCurrentStepFieldsAsTouched = () => {
        markAllStepFieldsAsTouched(viewingStep);
    };

    // Validate a specific step and return errors (does NOT set state)
    const getStepErrors = (step: number): { [key: string]: string } => {
        return getStepErrorsWithData(step, data);
    };

    // Validate a specific step with custom data and return errors (does NOT set state)
    const getStepErrorsWithData = (step: number, formData: typeof data): { [key: string]: string } => {
        const errors: { [key: string]: string } = {};

        if (step === 1) {
            // Validate main fields
            if (!formData.desired_move_in_date) {
                errors.desired_move_in_date = 'Move-in date is required';
            } else {
                const selectedDate = new Date(formData.desired_move_in_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate <= today) {
                    errors.desired_move_in_date = 'Move-in date must be in the future';
                }
            }

            if (!formData.lease_duration_months || formData.lease_duration_months < 1) {
                errors.lease_duration_months = 'Lease duration must be at least 1 month';
            } else if (formData.lease_duration_months > 60) {
                errors.lease_duration_months = 'Lease duration cannot exceed 60 months';
            }

            // Validate occupants
            formData.occupants_details.forEach((occupant, index) => {
                if (!occupant.name || occupant.name.trim() === '') {
                    errors[`occupant_${index}_name`] = 'Name is required';
                }
                const age = typeof occupant.age === 'string' ? parseInt(occupant.age) : occupant.age;
                if (!occupant.age || age < 0 || age > 120) {
                    errors[`occupant_${index}_age`] = 'Valid age is required';
                }
                if (!occupant.relationship) {
                    errors[`occupant_${index}_relationship`] = 'Relationship is required';
                }
                if (occupant.relationship === 'Other' && (!occupant.relationship_other || occupant.relationship_other.trim() === '')) {
                    errors[`occupant_${index}_relationship_other`] = 'Please specify the relationship';
                }
            });

            // Validate pets if has_pets is checked
            if (formData.has_pets) {
                if (formData.pets_details.length === 0) {
                    errors.pets_details = 'At least one pet is required';
                }
                formData.pets_details.forEach((pet, index) => {
                    if (!pet.type) {
                        errors[`pet_${index}_type`] = 'Pet type is required';
                    }
                    if (pet.type === 'Other' && (!pet.type_other || pet.type_other.trim() === '')) {
                        errors[`pet_${index}_type_other`] = 'Please specify the pet type';
                    }
                });
            }
        }

        if (step === 2) {
            // Validate references - each reference must be complete if started
            formData.references.forEach((ref, index) => {
                const hasAnyData = ref.name || ref.phone || ref.email || ref.relationship || ref.years_known;
                if (hasAnyData) {
                    if (!ref.name || ref.name.trim() === '') {
                        errors[`ref_${index}_name`] = 'Name is required';
                    }
                    if (!ref.phone || ref.phone.trim() === '') {
                        errors[`ref_${index}_phone`] = 'Phone is required';
                    }
                    if (!ref.email || ref.email.trim() === '') {
                        errors[`ref_${index}_email`] = 'Email is required';
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref.email)) {
                        errors[`ref_${index}_email`] = 'Valid email is required';
                    }
                    if (!ref.relationship) {
                        errors[`ref_${index}_relationship`] = 'Relationship is required';
                    }
                    if (ref.relationship === 'Other' && (!ref.relationship_other || ref.relationship_other.trim() === '')) {
                        errors[`ref_${index}_relationship_other`] = 'Please specify the relationship';
                    }
                    const yearsKnown = typeof ref.years_known === 'string' ? parseInt(ref.years_known) : ref.years_known;
                    if (!ref.years_known || yearsKnown < 0 || yearsKnown > 100) {
                        errors[`ref_${index}_years_known`] = 'Years known is required';
                    }
                }
            });
        }

        // Steps 3 and 4 are always valid (all optional)
        return errors;
    };

    // Validate current step and return errors (convenience wrapper)
    const getCurrentStepErrors = (): { [key: string]: string } => {
        return getStepErrors(viewingStep);
    };

    // Check if current step is valid (convenience wrapper)
    const isCurrentStepValid = (): boolean => {
        const errors = getCurrentStepErrors();
        return Object.keys(errors).length === 0;
    };

    // Validate pre-filled fields on mount (from draft)
    useEffect(() => {
        if (draftApplication) {
            // Validate all pre-filled fields in current step
            const newTouched: { [key: string]: boolean } = {};

            // Step 1 pre-filled fields
            if (data.desired_move_in_date) {
                newTouched.desired_move_in_date = true;
                validateField('desired_move_in_date', data.desired_move_in_date);
            }
            if (data.lease_duration_months) {
                newTouched.lease_duration_months = true;
                validateField('lease_duration_months', data.lease_duration_months);
            }

            // Pre-filled occupants
            data.occupants_details.forEach((occupant, index) => {
                if (occupant.name) {
                    newTouched[`occupant_${index}_name`] = true;
                    validateField(`occupant_${index}_name`, occupant.name);
                }
                if (occupant.age) {
                    newTouched[`occupant_${index}_age`] = true;
                    validateField(`occupant_${index}_age`, occupant.age);
                }
                if (occupant.relationship) {
                    newTouched[`occupant_${index}_relationship`] = true;
                    validateField(`occupant_${index}_relationship`, occupant.relationship);
                }
                if (occupant.relationship === 'Other' && occupant.relationship_other) {
                    newTouched[`occupant_${index}_relationship_other`] = true;
                    validateField(`occupant_${index}_relationship_other`, occupant.relationship_other);
                }
            });

            // Pre-filled pets
            if (data.has_pets) {
                data.pets_details.forEach((pet, index) => {
                    if (pet.type) {
                        newTouched[`pet_${index}_type`] = true;
                        validateField(`pet_${index}_type`, pet.type);
                    }
                    if (pet.type === 'Other' && pet.type_other) {
                        newTouched[`pet_${index}_type_other`] = true;
                        validateField(`pet_${index}_type_other`, pet.type_other);
                    }
                });
            }

            // Pre-filled references
            data.references.forEach((ref, index) => {
                if (ref.name) {
                    newTouched[`ref_${index}_name`] = true;
                    validateField(`ref_${index}_name`, ref.name);
                }
                if (ref.phone) {
                    newTouched[`ref_${index}_phone`] = true;
                    validateField(`ref_${index}_phone`, ref.phone);
                }
                if (ref.email) {
                    newTouched[`ref_${index}_email`] = true;
                    validateField(`ref_${index}_email`, ref.email);
                }
                if (ref.relationship) {
                    newTouched[`ref_${index}_relationship`] = true;
                    validateField(`ref_${index}_relationship`, ref.relationship);
                }
                if (ref.relationship === 'Other' && ref.relationship_other) {
                    newTouched[`ref_${index}_relationship_other`] = true;
                    validateField(`ref_${index}_relationship_other`, ref.relationship_other);
                }
                if (ref.years_known) {
                    newTouched[`ref_${index}_years_known`] = true;
                    validateField(`ref_${index}_years_known`, ref.years_known);
                }
            });

            setTouchedFields(newTouched);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run on mount

    // Enforce mandatory first pet when "I have pets" is checked
    useEffect(() => {
        if (data.has_pets && data.pets_details.length === 0) {
            setData('pets_details', [{ type: '', type_other: '', breed: '', age: '', weight: '' }]);
        } else if (!data.has_pets && data.pets_details.length > 0) {
            setData('pets_details', []);
        }
        // No need to call checkAndUpdateMaxStepReached - the data useEffect will handle it
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.has_pets]);

    // Helper functions for array fields
    const addOccupant = () => {
        const updated = [...data.occupants_details, { name: '', age: '', relationship: '', relationship_other: '' }];
        setData('occupants_details', updated);
        setData('additional_occupants', updated.length);
    };

    const removeOccupant = (index: number) => {
        const updated = data.occupants_details.filter((_, i) => i !== index);
        setData('occupants_details', updated);
        setData('additional_occupants', updated.length);
    };

    const updateOccupant = (index: number, field: string, value: string) => {
        const updated = [...data.occupants_details];
        updated[index] = { ...updated[index], [field]: value };
        setData('occupants_details', updated);

        // Mark as touched and validate
        const fieldKey = `occupant_${index}_${field}`;
        setTouchedFields((prev) => ({ ...prev, [fieldKey]: true }));
        validateField(fieldKey, value);
    };

    const addPet = () => {
        setData('pets_details', [...data.pets_details, { type: '', type_other: '', breed: '', age: '', weight: '' }]);
    };

    const removePet = (index: number) => {
        // Prevent removing the first pet if has_pets is checked
        if (data.has_pets && data.pets_details.length === 1) {
            return;
        }
        setData(
            'pets_details',
            data.pets_details.filter((_, i) => i !== index),
        );
    };

    const updatePet = (index: number, field: string, value: string) => {
        const updated = [...data.pets_details];
        updated[index] = { ...updated[index], [field]: value };
        setData('pets_details', updated);

        // Mark as touched and validate
        const fieldKey = `pet_${index}_${field}`;
        setTouchedFields((prev) => ({ ...prev, [fieldKey]: true }));
        validateField(fieldKey, value);
    };

    const addReference = () => {
        setData('references', [...data.references, { name: '', phone: '', email: '', relationship: '', relationship_other: '', years_known: '' }]);
    };

    const removeReference = (index: number) => {
        setData(
            'references',
            data.references.filter((_, i) => i !== index),
        );
    };

    const updateReference = (index: number, field: string, value: string) => {
        const updated = [...data.references];
        updated[index] = { ...updated[index], [field]: value };
        setData('references', updated);

        // Mark as touched and validate
        const fieldKey = `ref_${index}_${field}`;
        setTouchedFields((prev) => ({ ...prev, [fieldKey]: true }));
        validateField(fieldKey, value);
    };

    return (
        <BaseLayout>
            <Head title={`Apply for ${property.title}`} />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Title and Progress Bar - Centered above cards */}
                <div className="mb-8 text-center">
                    <h1 className="mb-6 text-3xl font-bold">Application for {property.title}</h1>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3, 4].map((step) => {
                            const isCurrent = viewingStep === step;
                            const isCompleted = step < maxStepReached; // Steps before maxStepReached are completed
                            const isInProgress = step === maxStepReached && step !== viewingStep; // Current max step but not viewing
                            const isClickable = step <= maxStepReached && step !== viewingStep; // Can click any step up to max reached, except current

                            return (
                                <div key={step} className="relative flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => goToStep(step)}
                                        disabled={!isClickable}
                                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full font-semibold ring-2 transition-colors ${
                                            isCurrent
                                                ? 'bg-primary text-white ring-primary'
                                                : isCompleted
                                                  ? 'bg-primary/10 text-primary ring-primary hover:bg-primary hover:text-white'
                                                  : isInProgress
                                                    ? 'bg-background text-primary ring-primary hover:bg-primary hover:text-white'
                                                    : 'bg-gray-100 text-gray-400 ring-gray-200 dark:bg-gray-800 dark:text-gray-600 dark:ring-gray-700'
                                        } ${isClickable ? 'cursor-pointer' : ''} ${!isClickable && !isCurrent ? 'cursor-not-allowed' : ''}`}
                                    >
                                        {step}
                                    </button>
                                    {step < 4 && (
                                        <div
                                            className={`h-1 w-12 rounded-full ${step < maxStepReached ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-800'}`}
                                        ></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Two-column layout with fixed widths */}
                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[800px_350px]">
                    {/* Main Form Content - Fixed width */}
                    <div className="order-2 lg:order-1">
                        <div className="rounded-lg border border-border bg-card">
                            <form onSubmit={handleSubmit} className="space-y-6 p-6">
                                {/* Step 1: Application Details */}
                                {viewingStep === 1 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold">Application Details</h2>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Desired Move-In Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.desired_move_in_date}
                                                    onChange={(e) => handleFieldChange('desired_move_in_date', e.target.value)}
                                                    onBlur={handleFieldBlur}
                                                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                                                    className={`w-full rounded-lg border px-4 py-2 ${touchedFields.desired_move_in_date && validationErrors.desired_move_in_date ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                    required
                                                />
                                                {touchedFields.desired_move_in_date && validationErrors.desired_move_in_date && (
                                                    <p className="mt-1 text-sm text-destructive">{validationErrors.desired_move_in_date}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">
                                                    Desired Lease Duration (months) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={data.lease_duration_months}
                                                    onChange={(e) => handleFieldChange('lease_duration_months', parseInt(e.target.value) || 0)}
                                                    onBlur={handleFieldBlur}
                                                    min={1}
                                                    max={60}
                                                    className={`w-full rounded-lg border px-4 py-2 ${touchedFields.lease_duration_months && validationErrors.lease_duration_months ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                    required
                                                />
                                                {touchedFields.lease_duration_months && validationErrors.lease_duration_months && (
                                                    <p className="mt-1 text-sm text-destructive">{validationErrors.lease_duration_months}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Message to Landlord (Optional)</label>
                                            <textarea
                                                value={data.message_to_landlord}
                                                onChange={(e) => setData('message_to_landlord', e.target.value)}
                                                onBlur={handleFieldBlur}
                                                rows={4}
                                                maxLength={2000}
                                                placeholder="Introduce yourself and explain why you're interested in this property..."
                                                className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">{data.message_to_landlord.length}/2000 characters</p>
                                        </div>

                                        <div className="border-t border-border pt-6">
                                            <h3 className="mb-4 font-semibold">Occupants</h3>
                                            <p className="mb-4 text-sm text-muted-foreground">
                                                You (the applicant) are automatically included. Add any additional occupants below.
                                            </p>

                                            {data.occupants_details.map((occupant, index) => (
                                                <div key={index} className="mb-4 rounded-lg border border-border p-4">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <h4 className="font-medium">Occupant {index + 1}</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOccupant(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="grid gap-4 md:grid-cols-3">
                                                        <div>
                                                            <label className="mb-1 block text-sm">
                                                                Name <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={occupant.name}
                                                                onChange={(e) => updateOccupant(index, 'name', e.target.value)}
                                                                onBlur={handleFieldBlur}
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`occupant_${index}_name`] && validationErrors[`occupant_${index}_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            />
                                                            {touchedFields[`occupant_${index}_name`] &&
                                                                validationErrors[`occupant_${index}_name`] && (
                                                                    <p className="mt-1 text-xs text-destructive">
                                                                        {validationErrors[`occupant_${index}_name`]}
                                                                    </p>
                                                                )}
                                                        </div>
                                                        <div>
                                                            <label className="mb-1 block text-sm">
                                                                Age <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={occupant.age}
                                                                onChange={(e) => updateOccupant(index, 'age', e.target.value)}
                                                                onBlur={handleFieldBlur}
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`occupant_${index}_age`] && validationErrors[`occupant_${index}_age`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            />
                                                            {touchedFields[`occupant_${index}_age`] && validationErrors[`occupant_${index}_age`] && (
                                                                <p className="mt-1 text-xs text-destructive">
                                                                    {validationErrors[`occupant_${index}_age`]}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="mb-1 block text-sm">
                                                                Relationship <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                value={occupant.relationship}
                                                                onChange={(e) => updateOccupant(index, 'relationship', e.target.value)}
                                                                onFocus={() =>
                                                                    setTouchedFields((prev) => ({
                                                                        ...prev,
                                                                        [`occupant_${index}_relationship`]: true,
                                                                    }))
                                                                }
                                                                onBlur={handleFieldBlur}
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`occupant_${index}_relationship`] && validationErrors[`occupant_${index}_relationship`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            >
                                                                {!touchedFields[`occupant_${index}_relationship`] && (
                                                                    <option value="">Select...</option>
                                                                )}
                                                                {OCCUPANT_RELATIONSHIPS.map((rel) => (
                                                                    <option key={rel} value={rel}>
                                                                        {rel}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {touchedFields[`occupant_${index}_relationship`] &&
                                                                validationErrors[`occupant_${index}_relationship`] && (
                                                                    <p className="mt-1 text-xs text-destructive">
                                                                        {validationErrors[`occupant_${index}_relationship`]}
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </div>
                                                    {occupant.relationship === 'Other' && (
                                                        <div className="mt-3">
                                                            <label className="mb-1 block text-sm">
                                                                Please specify relationship <span className="text-red-500">*</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={occupant.relationship_other}
                                                                onChange={(e) => updateOccupant(index, 'relationship_other', e.target.value)}
                                                                onBlur={handleFieldBlur}
                                                                placeholder="Enter relationship..."
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`occupant_${index}_relationship_other`] && validationErrors[`occupant_${index}_relationship_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            />
                                                            {touchedFields[`occupant_${index}_relationship_other`] &&
                                                                validationErrors[`occupant_${index}_relationship_other`] && (
                                                                    <p className="mt-1 text-xs text-destructive">
                                                                        {validationErrors[`occupant_${index}_relationship_other`]}
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={addOccupant}
                                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                                            >
                                                <Plus size={16} />
                                                Add Occupant
                                            </button>
                                        </div>

                                        <div className="border-t border-border pt-6">
                                            <div className="mb-4 flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.has_pets}
                                                    onChange={(e) => setData('has_pets', e.target.checked)}
                                                    className="h-4 w-4"
                                                />
                                                <label className="text-sm font-medium">I have pets</label>
                                            </div>

                                            {data.has_pets && (
                                                <div className="space-y-4">
                                                    {data.pets_details.map((pet, index) => (
                                                        <div key={index} className="rounded-lg border border-border p-4">
                                                            <div className="mb-2 flex items-center justify-between">
                                                                <h4 className="font-medium">Pet {index + 1}</h4>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removePet(index)}
                                                                    className={`text-red-500 hover:text-red-700 ${data.has_pets && data.pets_details.length === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                                                                    disabled={data.has_pets && data.pets_details.length === 1}
                                                                    title={
                                                                        data.has_pets && data.pets_details.length === 1
                                                                            ? 'At least one pet is required'
                                                                            : ''
                                                                    }
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="grid gap-4 md:grid-cols-4">
                                                                <div>
                                                                    <label className="mb-1 block text-sm">
                                                                        Type <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <select
                                                                        value={pet.type}
                                                                        onChange={(e) => updatePet(index, 'type', e.target.value)}
                                                                        onFocus={() =>
                                                                            setTouchedFields((prev) => ({ ...prev, [`pet_${index}_type`]: true }))
                                                                        }
                                                                        onBlur={handleFieldBlur}
                                                                        className={`w-full rounded border px-3 py-1.5 ${touchedFields[`pet_${index}_type`] && validationErrors[`pet_${index}_type`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                        required={data.has_pets}
                                                                    >
                                                                        {!touchedFields[`pet_${index}_type`] && <option value="">Select...</option>}
                                                                        {PET_TYPES.map((type) => (
                                                                            <option key={type} value={type}>
                                                                                {type}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    {touchedFields[`pet_${index}_type`] && validationErrors[`pet_${index}_type`] && (
                                                                        <p className="mt-1 text-xs text-destructive">
                                                                            {validationErrors[`pet_${index}_type`]}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <label className="mb-1 block text-sm">Breed</label>
                                                                    <input
                                                                        type="text"
                                                                        value={pet.breed}
                                                                        onChange={(e) => updatePet(index, 'breed', e.target.value)}
                                                                        onBlur={handleFieldBlur}
                                                                        className="w-full rounded border border-border bg-background px-3 py-1.5"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="mb-1 block text-sm">Age</label>
                                                                    <input
                                                                        type="number"
                                                                        value={pet.age}
                                                                        onChange={(e) => updatePet(index, 'age', e.target.value)}
                                                                        onBlur={handleFieldBlur}
                                                                        className="w-full rounded border border-border bg-background px-3 py-1.5"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="mb-1 block text-sm">Weight (kg)</label>
                                                                    <input
                                                                        type="number"
                                                                        value={pet.weight}
                                                                        onChange={(e) => updatePet(index, 'weight', e.target.value)}
                                                                        onBlur={handleFieldBlur}
                                                                        className="w-full rounded border border-border bg-background px-3 py-1.5"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {pet.type === 'Other' && (
                                                                <div className="mt-3">
                                                                    <label className="mb-1 block text-sm">
                                                                        Please specify pet type <span className="text-red-500">*</span>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={pet.type_other}
                                                                        onChange={(e) => updatePet(index, 'type_other', e.target.value)}
                                                                        onBlur={handleFieldBlur}
                                                                        placeholder="Enter pet type..."
                                                                        className={`w-full rounded border px-3 py-1.5 ${touchedFields[`pet_${index}_type_other`] && validationErrors[`pet_${index}_type_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                        required
                                                                    />
                                                                    {touchedFields[`pet_${index}_type_other`] &&
                                                                        validationErrors[`pet_${index}_type_other`] && (
                                                                            <p className="mt-1 text-xs text-destructive">
                                                                                {validationErrors[`pet_${index}_type_other`]}
                                                                            </p>
                                                                        )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={addPet}
                                                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                                                    >
                                                        <Plus size={16} />
                                                        Add Pet
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Previous Landlord & References */}
                                {viewingStep === 2 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold">References</h2>

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
                                                        onChange={(e) => setData('previous_landlord_name', e.target.value)}
                                                        onBlur={handleFieldBlur}
                                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                    />
                                                    {errors.previous_landlord_name && (
                                                        <p className="mt-1 text-sm text-destructive">{errors.previous_landlord_name}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">Phone</label>
                                                    <input
                                                        type="tel"
                                                        value={data.previous_landlord_phone}
                                                        onChange={(e) => setData('previous_landlord_phone', e.target.value)}
                                                        onBlur={handleFieldBlur}
                                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="mb-2 block text-sm font-medium">Email</label>
                                                    <input
                                                        type="email"
                                                        value={data.previous_landlord_email}
                                                        onChange={(e) => setData('previous_landlord_email', e.target.value)}
                                                        onBlur={handleFieldBlur}
                                                        className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-border pt-6">
                                            <h3 className="mb-4 font-semibold">Personal References (Optional)</h3>
                                            <p className="mb-4 text-sm text-muted-foreground">
                                                Add references from employers, colleagues, or other professional contacts.
                                            </p>

                                            {data.references.map((ref, index) => (
                                                <div key={index} className="mb-4 rounded-lg border border-border p-4">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <h4 className="font-medium">Reference {index + 1}</h4>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeReference(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
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
                                                                onBlur={handleFieldBlur}
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_name`] && validationErrors[`ref_${index}_name`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            />
                                                            {touchedFields[`ref_${index}_name`] && validationErrors[`ref_${index}_name`] && (
                                                                <p className="mt-1 text-xs text-destructive">
                                                                    {validationErrors[`ref_${index}_name`]}
                                                                </p>
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
                                                                onBlur={handleFieldBlur}
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_phone`] && validationErrors[`ref_${index}_phone`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            />
                                                            {touchedFields[`ref_${index}_phone`] && validationErrors[`ref_${index}_phone`] && (
                                                                <p className="mt-1 text-xs text-destructive">
                                                                    {validationErrors[`ref_${index}_phone`]}
                                                                </p>
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
                                                                onBlur={handleFieldBlur}
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_email`] && validationErrors[`ref_${index}_email`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            />
                                                            {touchedFields[`ref_${index}_email`] && validationErrors[`ref_${index}_email`] && (
                                                                <p className="mt-1 text-xs text-destructive">
                                                                    {validationErrors[`ref_${index}_email`]}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="mb-1 block text-sm">
                                                                Relationship <span className="text-red-500">*</span>
                                                            </label>
                                                            <select
                                                                value={ref.relationship}
                                                                onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                                                                onFocus={() =>
                                                                    setTouchedFields((prev) => ({ ...prev, [`ref_${index}_relationship`]: true }))
                                                                }
                                                                onBlur={handleFieldBlur}
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_relationship`] && validationErrors[`ref_${index}_relationship`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            >
                                                                {!touchedFields[`ref_${index}_relationship`] && <option value="">Select...</option>}
                                                                {REFERENCE_RELATIONSHIPS.map((rel) => (
                                                                    <option key={rel} value={rel}>
                                                                        {rel}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {touchedFields[`ref_${index}_relationship`] &&
                                                                validationErrors[`ref_${index}_relationship`] && (
                                                                    <p className="mt-1 text-xs text-destructive">
                                                                        {validationErrors[`ref_${index}_relationship`]}
                                                                    </p>
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
                                                                onBlur={handleFieldBlur}
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_years_known`] && validationErrors[`ref_${index}_years_known`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            />
                                                            {touchedFields[`ref_${index}_years_known`] &&
                                                                validationErrors[`ref_${index}_years_known`] && (
                                                                    <p className="mt-1 text-xs text-destructive">
                                                                        {validationErrors[`ref_${index}_years_known`]}
                                                                    </p>
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
                                                                onBlur={handleFieldBlur}
                                                                placeholder="Enter relationship..."
                                                                className={`w-full rounded border px-3 py-1.5 ${touchedFields[`ref_${index}_relationship_other`] && validationErrors[`ref_${index}_relationship_other`] ? 'border-destructive bg-destructive/5' : 'border-border bg-background'}`}
                                                                required
                                                            />
                                                            {touchedFields[`ref_${index}_relationship_other`] &&
                                                                validationErrors[`ref_${index}_relationship_other`] && (
                                                                    <p className="mt-1 text-xs text-destructive">
                                                                        {validationErrors[`ref_${index}_relationship_other`]}
                                                                    </p>
                                                                )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={addReference}
                                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                                            >
                                                <Plus size={16} />
                                                Add Reference
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Emergency Contact */}
                                {viewingStep === 3 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold">Emergency Contact</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {tenantProfile.emergency_contact_name
                                                ? 'You can use your profile emergency contact or provide a different one for this application.'
                                                : 'Provide an emergency contact for this application.'}
                                        </p>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Name</label>
                                                <input
                                                    type="text"
                                                    value={data.emergency_contact_name}
                                                    onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={data.emergency_contact_phone}
                                                    onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Relationship</label>
                                                <input
                                                    type="text"
                                                    value={data.emergency_contact_relationship}
                                                    onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                                                    onBlur={handleFieldBlur}
                                                    placeholder="Parent, Sibling..."
                                                    className="w-full rounded-lg border border-border bg-background px-4 py-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4: Additional Documents */}
                                {viewingStep === 4 && (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold">Additional Documents (Optional)</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Your tenant profile already includes your ID and income verification. You can optionally upload newer
                                            documents here.
                                        </p>

                                        <div className="space-y-6">
                                            {/* ID Document Upload */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Updated ID Document (Optional)</label>
                                                <div className="mt-2 flex justify-center rounded-md border border-dashed border-border px-6 pt-5 pb-6">
                                                    <div className="w-full space-y-1 text-center">
                                                        <label htmlFor="application_id_document" className="cursor-pointer">
                                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                        </label>
                                                        <div className="flex justify-center text-sm text-muted-foreground">
                                                            <label
                                                                htmlFor="application_id_document"
                                                                className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                                                            >
                                                                <span>{data.application_id_document ? 'Replace file' : 'Upload a file'}</span>
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <input
                                                            id="application_id_document"
                                                            name="application_id_document"
                                                            type="file"
                                                            accept=".pdf,.png,.jpg,.jpeg"
                                                            className="sr-only"
                                                            onChange={(e) => setData('application_id_document', e.target.files?.[0] || null)}
                                                        />
                                                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 20MB</p>
                                                        {data.application_id_document && (
                                                            <div className="mt-3 w-full overflow-hidden px-4">
                                                                <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background px-3 py-2 shadow-sm">
                                                                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                                                                        {data.application_id_document.name}
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setData('application_id_document', null)}
                                                                        className="flex-shrink-0 cursor-pointer text-destructive hover:text-destructive/80"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Proof of Income Upload */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Updated Proof of Income (Optional)</label>
                                                <div className="mt-2 flex justify-center rounded-md border border-dashed border-border px-6 pt-5 pb-6">
                                                    <div className="w-full space-y-1 text-center">
                                                        <label htmlFor="application_proof_of_income" className="cursor-pointer">
                                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                        </label>
                                                        <div className="flex justify-center text-sm text-muted-foreground">
                                                            <label
                                                                htmlFor="application_proof_of_income"
                                                                className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                                                            >
                                                                <span>{data.application_proof_of_income ? 'Replace file' : 'Upload a file'}</span>
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <input
                                                            id="application_proof_of_income"
                                                            name="application_proof_of_income"
                                                            type="file"
                                                            accept=".pdf,.png,.jpg,.jpeg"
                                                            className="sr-only"
                                                            onChange={(e) => setData('application_proof_of_income', e.target.files?.[0] || null)}
                                                        />
                                                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 20MB</p>
                                                        {data.application_proof_of_income && (
                                                            <div className="mt-3 w-full overflow-hidden px-4">
                                                                <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background px-3 py-2 shadow-sm">
                                                                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                                                                        {data.application_proof_of_income.name}
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setData('application_proof_of_income', null)}
                                                                        className="flex-shrink-0 cursor-pointer text-destructive hover:text-destructive/80"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reference Letter Upload */}
                                            <div>
                                                <label className="mb-2 block text-sm font-medium">Reference Letter (Optional)</label>
                                                <div className="mt-2 flex justify-center rounded-md border border-dashed border-border px-6 pt-5 pb-6">
                                                    <div className="w-full space-y-1 text-center">
                                                        <label htmlFor="application_reference_letter" className="cursor-pointer">
                                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                                        </label>
                                                        <div className="flex justify-center text-sm text-muted-foreground">
                                                            <label
                                                                htmlFor="application_reference_letter"
                                                                className="cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"
                                                            >
                                                                <span>{data.application_reference_letter ? 'Replace file' : 'Upload a file'}</span>
                                                            </label>
                                                            <p className="pl-1">or drag and drop</p>
                                                        </div>
                                                        <input
                                                            id="application_reference_letter"
                                                            name="application_reference_letter"
                                                            type="file"
                                                            accept=".pdf,.png,.jpg,.jpeg"
                                                            className="sr-only"
                                                            onChange={(e) => setData('application_reference_letter', e.target.files?.[0] || null)}
                                                        />
                                                        <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 20MB</p>
                                                        {data.application_reference_letter && (
                                                            <div className="mt-3 w-full overflow-hidden px-4">
                                                                <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-md border border-border bg-background px-3 py-2 shadow-sm">
                                                                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-primary">
                                                                        {data.application_reference_letter.name}
                                                                    </p>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setData('application_reference_letter', null)}
                                                                        className="flex-shrink-0 cursor-pointer text-destructive hover:text-destructive/80"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {progress && (
                                            <div className="mt-4">
                                                <div className="h-2 w-full rounded-full bg-gray-200">
                                                    <div
                                                        className="h-2 rounded-full bg-primary transition-all"
                                                        style={{ width: `${progress.percentage}%` }}
                                                    ></div>
                                                </div>
                                                <p className="mt-1 text-sm text-muted-foreground">Uploading... {progress.percentage}%</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between border-t border-border pt-6">
                                    {viewingStep > 1 ? (
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-muted"
                                        >
                                            <ChevronLeft size={16} />
                                            Previous
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    <div className="text-sm text-muted-foreground">Step {viewingStep} of 4</div>

                                    {viewingStep < 4 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!isCurrentStepValid()}
                                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Next
                                            <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {processing ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Property Summary Sidebar - Fixed width */}
                    <div className="order-1 lg:order-2">
                        <div className="sticky top-8 rounded-lg border border-border bg-card">
                            {property.main_image_url && (
                                <div className="overflow-hidden rounded-t-lg">
                                    <img src={property.main_image_url} alt={property.title} className="h-56 w-full object-cover" />
                                </div>
                            )}

                            <div className="space-y-3 p-6">
                                <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                    <div>
                                        <p>
                                            {property.house_number} {property.street_name}
                                        </p>
                                        <p>
                                            {property.city}, {property.postal_code}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-3">
                                    <div className="mb-2 flex items-baseline justify-between">
                                        <span className="text-sm text-muted-foreground">Monthly Rent</span>
                                        <span className="text-xl font-bold text-primary">{property.formatted_rent}</span>
                                    </div>

                                    {property.utilities_included !== null && (
                                        <p className="text-xs text-muted-foreground">
                                            {property.utilities_included ? 'Utilities included' : 'Utilities not included'}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-sm">
                                    {property.bedrooms !== null && property.bedrooms !== undefined && (
                                        <div>
                                            <p className="text-muted-foreground">Bedrooms</p>
                                            <p className="font-medium">{property.bedrooms}</p>
                                        </div>
                                    )}
                                    {property.bathrooms !== null && property.bathrooms !== undefined && (
                                        <div>
                                            <p className="text-muted-foreground">Bathrooms</p>
                                            <p className="font-medium">{property.bathrooms}</p>
                                        </div>
                                    )}
                                    {property.size !== null && property.size !== undefined && (
                                        <div>
                                            <p className="text-muted-foreground">Size</p>
                                            <p className="font-medium">{property.size} m²</p>
                                        </div>
                                    )}
                                    {property.available_from && (
                                        <div>
                                            <p className="text-muted-foreground">Available</p>
                                            <p className="font-medium">
                                                {new Date(property.available_from).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {(property.pets_allowed || property.smoking_allowed) && (
                                    <div className="border-t border-border pt-3 text-sm">
                                        <p className="mb-1 font-medium">Allowed</p>
                                        <div className="space-y-1">
                                            {property.pets_allowed && <p className="text-green-600 dark:text-green-400">✓ Pets allowed</p>}
                                            {property.smoking_allowed && <p className="text-green-600 dark:text-green-400">✓ Smoking allowed</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
}
