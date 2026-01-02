/**
 * Validation errors for financial fields
 */
export interface FinancialValidationErrors {
    employment_status?: string;
    employer_name?: string;
    job_title?: string;
    employment_type?: string;
    employment_start_date?: string;
    gross_annual_income?: string;
    net_monthly_income?: string;
    business_name?: string;
    business_type?: string;
    business_start_date?: string;
    gross_annual_revenue?: string;
    university_name?: string;
    program_of_study?: string;
    student_income_source_type?: string;
    student_monthly_income?: string;
    pension_type?: string;
    pension_monthly_income?: string;
    unemployed_income_source?: string;
    unemployment_benefits_amount?: string;
    other_employment_situation?: string;
    other_situation_monthly_income?: string;
    other_situation_income_source?: string;
}

export type FinancialEntityType = 'tenant' | 'co_signer' | 'guarantor';

/**
 * Validates financial fields based on employment status.
 * This function can be used in both components and Zod schemas.
 *
 * @param data - Object with financial field values
 * @param entityType - The type of entity (tenant, co_signer, guarantor)
 * @returns Object with field names as keys and error messages as values
 */
export function validateFinancialFields(data: Record<string, string>, entityType: FinancialEntityType = 'tenant'): FinancialValidationErrors {
    const errors: FinancialValidationErrors = {};
    const status = data.employment_status;

    // Employment status is required
    if (!status) {
        errors.employment_status = 'Employment status is required';
        return errors;
    }

    // EMPLOYED validations
    if (status === 'employed') {
        if (!data.employer_name?.trim()) {
            errors.employer_name = 'Employer name is required';
        }
        if (!data.job_title?.trim()) {
            errors.job_title = 'Job title is required';
        }
        if (entityType === 'tenant' || entityType === 'co_signer') {
            if (!data.employment_type?.trim()) {
                errors.employment_type = 'Employment type is required';
            }
            if (!data.employment_start_date?.trim()) {
                errors.employment_start_date = 'Employment start date is required';
            }
            if (!data.gross_annual_income) {
                errors.gross_annual_income = 'Gross annual income is required';
            }
        }
        if (!data.net_monthly_income) {
            errors.net_monthly_income = 'Net monthly income is required';
        }
    }

    // SELF-EMPLOYED validations
    if (status === 'self_employed') {
        if (entityType === 'tenant' || entityType === 'co_signer') {
            if (!data.business_name?.trim()) {
                errors.business_name = 'Business name is required';
            }
            if (!data.business_type?.trim()) {
                errors.business_type = 'Business type is required';
            }
            if (!data.business_start_date?.trim()) {
                errors.business_start_date = 'Business start date is required';
            }
            if (!data.gross_annual_revenue) {
                errors.gross_annual_revenue = 'Gross annual revenue is required';
            }
        }
        if (!data.net_monthly_income) {
            errors.net_monthly_income = 'Net monthly income is required';
        }
    }

    // STUDENT validations (tenant and co_signer only)
    if (status === 'student' && (entityType === 'tenant' || entityType === 'co_signer')) {
        if (!data.university_name?.trim()) {
            errors.university_name = 'University name is required';
        }
        if (!data.program_of_study?.trim()) {
            errors.program_of_study = 'Program of study is required';
        }
        if (!data.student_income_source_type?.trim()) {
            errors.student_income_source_type = 'Income source is required';
        }
        if (!data.student_monthly_income) {
            errors.student_monthly_income = 'Monthly income is required';
        }
    }

    // RETIRED validations
    if (status === 'retired') {
        if (entityType === 'tenant' || entityType === 'co_signer') {
            if (!data.pension_type?.trim()) {
                errors.pension_type = 'Pension type is required';
            }
            if (!data.pension_monthly_income) {
                errors.pension_monthly_income = 'Monthly pension is required';
            }
        } else {
            // Guarantor - simpler validation
            if (!data.net_monthly_income) {
                errors.net_monthly_income = 'Net monthly income is required';
            }
        }
    }

    // UNEMPLOYED validations (tenant and co_signer only)
    if (status === 'unemployed' && (entityType === 'tenant' || entityType === 'co_signer')) {
        if (!data.unemployed_income_source?.trim()) {
            errors.unemployed_income_source = 'Income source is required';
        }
        if (!data.unemployment_benefits_amount) {
            errors.unemployment_benefits_amount = 'Income amount is required';
        }
    }

    // OTHER validations
    if (status === 'other') {
        if (entityType === 'tenant' || entityType === 'co_signer') {
            if (!data.other_employment_situation?.trim()) {
                errors.other_employment_situation = 'Please specify your situation';
            }
            if (!data.other_situation_monthly_income) {
                errors.other_situation_monthly_income = 'Monthly income is required';
            }
            if (!data.other_situation_income_source?.trim()) {
                errors.other_situation_income_source = 'Income source is required';
            }
        } else {
            // Guarantor - simpler validation
            if (!data.net_monthly_income) {
                errors.net_monthly_income = 'Net monthly income is required';
            }
        }
    }

    return errors;
}
