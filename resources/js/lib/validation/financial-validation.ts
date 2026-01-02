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
    // Document fields
    employment_contract?: string;
    payslip_1?: string;
    payslip_2?: string;
    payslip_3?: string;
    income_proof?: string;
    student_proof?: string;
    pension_statement?: string;
    benefits_statement?: string;
    other_income_proof?: string;
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

/**
 * Document context for checking existing uploads
 */
export interface DocumentContext {
    employment_contract?: string | null;
    payslip_1?: string | null;
    payslip_2?: string | null;
    payslip_3?: string | null;
    income_proof?: string | null;
    student_proof?: string | null;
    pension_statement?: string | null;
    benefits_statement?: string | null;
    other_income_proof?: string | null;
    id_document_front?: string | null;
    id_document_back?: string | null;
}

/**
 * Validates financial documents based on employment status.
 * This function can be used in both components and Zod schemas.
 *
 * @param data - Object with employment status
 * @param existingDocs - Object with existing document filenames (from uploaded files)
 * @param entityType - The type of entity (tenant, co_signer, guarantor)
 * @returns Object with field names as keys and error messages as values
 */
export function validateFinancialDocuments(
    data: Record<string, string>,
    existingDocs: DocumentContext | null,
    entityType: FinancialEntityType = 'tenant',
): FinancialValidationErrors {
    const errors: FinancialValidationErrors = {};
    const status = data.employment_status;

    // No documents required if no employment status
    if (!status) {
        return errors;
    }

    // Helper to check if document exists
    const hasDoc = (field: keyof DocumentContext) => {
        return existingDocs && existingDocs[field];
    };

    // EMPLOYED documents
    if (status === 'employed') {
        if (!hasDoc('employment_contract')) {
            errors.employment_contract = 'Employment contract is required';
        }
        if (!hasDoc('payslip_1')) {
            errors.payslip_1 = 'Recent payslip is required';
        }
        if (!hasDoc('payslip_2')) {
            errors.payslip_2 = 'Second payslip is required';
        }
        if (!hasDoc('payslip_3')) {
            errors.payslip_3 = 'Third payslip is required';
        }
    }

    // SELF-EMPLOYED documents
    if (status === 'self_employed') {
        if (!hasDoc('income_proof') && !hasDoc('other_income_proof')) {
            errors.income_proof = 'Proof of income is required (tax returns, bank statements, or accountant letter)';
        }
    }

    // STUDENT documents
    if (status === 'student') {
        if (!hasDoc('student_proof')) {
            errors.student_proof = 'Student enrollment proof is required';
        }
    }

    // RETIRED documents
    if (status === 'retired') {
        if (!hasDoc('pension_statement')) {
            errors.pension_statement = 'Pension statement is required';
        }
    }

    // UNEMPLOYED documents
    if (status === 'unemployed') {
        const incomeSource = data.unemployed_income_source;
        if (incomeSource === 'unemployment_benefits') {
            if (!hasDoc('benefits_statement')) {
                errors.benefits_statement = 'Benefits statement is required';
            }
        } else if (incomeSource) {
            if (!hasDoc('other_income_proof')) {
                errors.other_income_proof = 'Proof of income is required';
            }
        }
    }

    // OTHER documents
    if (status === 'other') {
        if (!hasDoc('other_income_proof')) {
            errors.other_income_proof = 'Proof of income is required';
        }
    }

    return errors;
}

/**
 * Validates ID documents.
 *
 * @param existingDocs - Object with existing document filenames
 * @returns Object with field names as keys and error messages as values
 */
export function validateIdDocuments(existingDocs: DocumentContext | null): Record<string, string> {
    const errors: Record<string, string> = {};

    // Front is always required
    if (!existingDocs?.id_document_front) {
        errors.id_document_front = 'ID document (front) is required';
    }

    // Back is always required
    if (!existingDocs?.id_document_back) {
        errors.id_document_back = 'ID document (back) is required';
    }

    return errors;
}
