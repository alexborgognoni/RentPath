import { z } from 'zod';

// Step IDs
export type ApplicationStepId = 'details' | 'references' | 'emergency' | 'documents';

// ===== Error Messages =====
export const APPLICATION_MESSAGES = {
    desired_move_in_date: {
        required: 'Move-in date is required',
        future: 'Move-in date must be in the future',
    },
    lease_duration_months: {
        required: 'Lease duration is required',
        min: 'Lease duration must be at least 1 month',
        max: 'Lease duration cannot exceed 60 months',
    },
    message_to_landlord: {
        maxLength: 'Message cannot exceed 2000 characters',
    },
    occupant: {
        name: {
            required: 'Name is required',
        },
        age: {
            required: 'Age is required',
            invalid: 'Valid age is required (0-120)',
        },
        relationship: {
            required: 'Relationship is required',
        },
        relationship_other: {
            required: 'Please specify the relationship',
        },
    },
    pet: {
        type: {
            required: 'Pet type is required',
        },
        type_other: {
            required: 'Please specify the pet type',
        },
        required: 'At least one pet is required when "I have pets" is checked',
    },
    reference: {
        name: {
            required: 'Name is required',
        },
        phone: {
            required: 'Phone is required',
        },
        email: {
            required: 'Email is required',
            invalid: 'Valid email is required',
        },
        relationship: {
            required: 'Relationship is required',
        },
        relationship_other: {
            required: 'Please specify the relationship',
        },
        years_known: {
            required: 'Years known is required',
            invalid: 'Valid years known is required (0-100)',
        },
    },
};

// ===== Shared Sub-Schemas =====
const occupantSchema = z.object({
    name: z.string().min(1, APPLICATION_MESSAGES.occupant.name.required),
    age: z
        .string()
        .min(1, APPLICATION_MESSAGES.occupant.age.required)
        .refine(
            (val) => {
                const num = parseInt(val);
                return !isNaN(num) && num >= 0 && num <= 120;
            },
            { message: APPLICATION_MESSAGES.occupant.age.invalid },
        ),
    relationship: z.string().min(1, APPLICATION_MESSAGES.occupant.relationship.required),
    relationship_other: z.string(),
});

const occupantWithOtherSchema = occupantSchema.refine(
    (data) => {
        if (data.relationship === 'Other') {
            return data.relationship_other.trim().length > 0;
        }
        return true;
    },
    {
        message: APPLICATION_MESSAGES.occupant.relationship_other.required,
        path: ['relationship_other'],
    },
);

const petSchema = z.object({
    type: z.string().min(1, APPLICATION_MESSAGES.pet.type.required),
    type_other: z.string(),
    breed: z.string(),
    age: z.string(),
    weight: z.string(),
});

const petWithOtherSchema = petSchema.refine(
    (data) => {
        if (data.type === 'Other') {
            return data.type_other.trim().length > 0;
        }
        return true;
    },
    {
        message: APPLICATION_MESSAGES.pet.type_other.required,
        path: ['type_other'],
    },
);

const referenceSchema = z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string(),
    relationship: z.string(),
    relationship_other: z.string(),
    years_known: z.string(),
});

// ===== Step Schemas =====

// Step 1: Details (move-in, lease, occupants, pets)
export const detailsStepSchema = z
    .object({
        desired_move_in_date: z.string().min(1, APPLICATION_MESSAGES.desired_move_in_date.required),
        lease_duration_months: z
            .number()
            .min(1, APPLICATION_MESSAGES.lease_duration_months.min)
            .max(60, APPLICATION_MESSAGES.lease_duration_months.max),
        message_to_landlord: z.string().max(2000, APPLICATION_MESSAGES.message_to_landlord.maxLength),
        additional_occupants: z.number(),
        occupants_details: z.array(occupantSchema),
        has_pets: z.boolean(),
        pets_details: z.array(petSchema),
    })
    .refine(
        (data) => {
            // Validate move-in date is in the future
            if (data.desired_move_in_date) {
                const selectedDate = new Date(data.desired_move_in_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate > today;
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.desired_move_in_date.future,
            path: ['desired_move_in_date'],
        },
    )
    .refine(
        (data) => {
            // If has_pets is true, must have at least one pet
            if (data.has_pets && data.pets_details.length === 0) {
                return false;
            }
            return true;
        },
        {
            message: APPLICATION_MESSAGES.pet.required,
            path: ['pets_details'],
        },
    );

// Step 2: References (previous landlord, personal references)
export const referencesStepSchema = z.object({
    previous_landlord_name: z.string(),
    previous_landlord_phone: z.string(),
    previous_landlord_email: z.string(),
    references: z.array(referenceSchema),
});

// Step 3: Emergency Contact
export const emergencyStepSchema = z.object({
    emergency_contact_name: z.string(),
    emergency_contact_phone: z.string(),
    emergency_contact_relationship: z.string(),
});

// Step 4: Documents (all optional)
export const documentsStepSchema = z.object({
    application_id_document: z.any().nullable(),
    application_proof_of_income: z.any().nullable(),
    application_reference_letter: z.any().nullable(),
    additional_documents: z.array(z.any()),
});

// ===== Validation Functions =====

export interface ValidationResult {
    success: boolean;
    errors: Record<string, string>;
}

/**
 * Validate a specific step
 */
export function validateApplicationStep(stepId: ApplicationStepId, data: Record<string, unknown>): ValidationResult {
    let schema: z.ZodSchema;

    switch (stepId) {
        case 'details':
            schema = detailsStepSchema;
            break;
        case 'references':
            schema = referencesStepSchema;
            break;
        case 'emergency':
            schema = emergencyStepSchema;
            break;
        case 'documents':
            schema = documentsStepSchema;
            break;
        default:
            return { success: true, errors: {} };
    }

    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, errors: {} };
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
        const path = issue.path.map(String).join('.');
        // Only set the first error for each path
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    });

    // Additional validation for occupants with "Other" relationship
    if (stepId === 'details') {
        const occupants = data.occupants_details as Array<{ name: string; age: string; relationship: string; relationship_other: string }>;
        occupants?.forEach((occupant, index) => {
            const validationResult = occupantWithOtherSchema.safeParse(occupant);
            if (!validationResult.success) {
                validationResult.error.issues.forEach((issue) => {
                    const fieldKey = `occupant_${index}_${String(issue.path[0])}`;
                    if (!errors[fieldKey]) {
                        errors[fieldKey] = issue.message;
                    }
                });
            }
        });

        // Validate pets with "Other" type
        const hasPets = data.has_pets as boolean;
        const pets = data.pets_details as Array<{ type: string; type_other: string; breed: string; age: string; weight: string }>;
        if (hasPets) {
            pets?.forEach((pet, index) => {
                const validationResult = petWithOtherSchema.safeParse(pet);
                if (!validationResult.success) {
                    validationResult.error.issues.forEach((issue) => {
                        const fieldKey = `pet_${index}_${String(issue.path[0])}`;
                        if (!errors[fieldKey]) {
                            errors[fieldKey] = issue.message;
                        }
                    });
                }
            });
        }
    }

    // Additional validation for references
    if (stepId === 'references') {
        const references = data.references as Array<{
            name: string;
            phone: string;
            email: string;
            relationship: string;
            relationship_other: string;
            years_known: string;
        }>;
        references?.forEach((ref, index) => {
            const hasAnyData = ref.name || ref.phone || ref.email || ref.relationship || ref.years_known;
            if (hasAnyData) {
                // Validate all required fields
                if (!ref.name?.trim()) {
                    errors[`ref_${index}_name`] = APPLICATION_MESSAGES.reference.name.required;
                }
                if (!ref.phone?.trim()) {
                    errors[`ref_${index}_phone`] = APPLICATION_MESSAGES.reference.phone.required;
                }
                if (!ref.email?.trim()) {
                    errors[`ref_${index}_email`] = APPLICATION_MESSAGES.reference.email.required;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref.email)) {
                    errors[`ref_${index}_email`] = APPLICATION_MESSAGES.reference.email.invalid;
                }
                if (!ref.relationship) {
                    errors[`ref_${index}_relationship`] = APPLICATION_MESSAGES.reference.relationship.required;
                }
                if (ref.relationship === 'Other' && !ref.relationship_other?.trim()) {
                    errors[`ref_${index}_relationship_other`] = APPLICATION_MESSAGES.reference.relationship_other.required;
                }
                if (!ref.years_known) {
                    errors[`ref_${index}_years_known`] = APPLICATION_MESSAGES.reference.years_known.required;
                } else {
                    const yearsKnown = parseInt(ref.years_known);
                    if (isNaN(yearsKnown) || yearsKnown < 0 || yearsKnown > 100) {
                        errors[`ref_${index}_years_known`] = APPLICATION_MESSAGES.reference.years_known.invalid;
                    }
                }
            }
        });
    }

    return { success: Object.keys(errors).length === 0, errors };
}

/**
 * Find the first invalid step (returns the index)
 * Returns steps.length if all steps are valid
 */
export function findFirstInvalidApplicationStep(data: Record<string, unknown>): number {
    const stepIds: ApplicationStepId[] = ['details', 'references', 'emergency', 'documents'];

    for (let i = 0; i < stepIds.length; i++) {
        const result = validateApplicationStep(stepIds[i], data);
        if (!result.success) {
            return i;
        }
    }

    return stepIds.length; // All steps valid
}

/**
 * Validate all data for submission
 */
export function validateApplicationForSubmit(data: Record<string, unknown>): ValidationResult {
    const allErrors: Record<string, string> = {};
    const stepIds: ApplicationStepId[] = ['details', 'references', 'emergency', 'documents'];

    for (const stepId of stepIds) {
        const result = validateApplicationStep(stepId, data);
        Object.assign(allErrors, result.errors);
    }

    return {
        success: Object.keys(allErrors).length === 0,
        errors: allErrors,
    };
}
