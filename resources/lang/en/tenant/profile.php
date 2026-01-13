<?php

return [
    'title' => 'My Profile',
    'subtitle' => 'Your tenant information for rental applications',
    'editButton' => 'Edit',
    'completeness' => 'Profile Completeness',

    // Personal info
    'personalInfo' => 'Personal Information',
    'dateOfBirth' => 'Date of Birth',
    'nationality' => 'Nationality',
    'phone' => 'Phone',
    'notProvided' => 'Not provided',

    // Employment
    'employment' => 'Employment & Income',
    'employmentStatus' => 'Status',
    'employer' => 'Employer',
    'monthlyIncome' => 'Monthly Income',
    'employmentTypes' => [
        'employed' => 'Employed',
        'selfEmployed' => 'Self Employed',
        'student' => 'Student',
        'unemployed' => 'Unemployed',
        'retired' => 'Retired',
    ],

    // Documents
    'documents' => 'Documents',
    'idDocument' => 'ID Document',
    'proofOfIncome' => 'Proof of Income',
    'referenceLetter' => 'Reference Letter',
    'uploaded' => 'Uploaded',
    'notUploaded' => 'Not uploaded',

    // Address
    'currentAddress' => 'Current Address',

    // Empty state
    'empty' => [
        'title' => 'No Profile Yet',
        'description' => 'Your tenant profile will be created when you submit your first application. The information you provide will be reused for future applications.',
        'cta' => 'Browse Properties',
    ],

    // Edit mode
    'edit' => [
        'complete' => 'Complete',
        'incomplete' => 'Incomplete',
        'done' => 'Done',
        'optional' => 'Optional',
        'completenessHint' => 'Complete your profile to improve your application success rate.',
        'identityDocuments' => 'Identity Documents',
        'employmentDocuments' => 'Employment Documents',
        'guarantorInfo' => 'Guarantor Information',
        'emergencyContact' => 'Emergency Contact',

        // Fields
        'fields' => [
            'dateOfBirth' => 'Date of Birth',
            'nationality' => 'Nationality',
            'phone' => 'Phone Number',
            'streetName' => 'Street Name',
            'houseNumber' => 'House Number',
            'addressLine2' => 'Address Line 2',
            'city' => 'City',
            'country' => 'Country',
            'employmentStatus' => 'Employment Status',
            'employerName' => 'Employer Name',
            'jobTitle' => 'Job Title',
            'employmentType' => 'Employment Type',
            'startDate' => 'Start Date',
            'monthlyIncome' => 'Monthly Income (Gross)',
            'university' => 'University',
            'program' => 'Program of Study',
            'graduationDate' => 'Expected Graduation',
            'incomeSource' => 'Income Source',
        ],

        // Employment types dropdown
        'employmentTypeOptions' => [
            'fullTime' => 'Full Time',
            'partTime' => 'Part Time',
            'contract' => 'Contract',
            'temporary' => 'Temporary',
        ],

        // Documents
        'documents' => [
            'idFront' => 'ID Document (Front)',
            'idBack' => 'ID Document (Back)',
            'employmentContract' => 'Employment Contract',
            'payslip1' => 'Payslip 1',
            'payslip2' => 'Payslip 2',
            'payslip3' => 'Payslip 3',
            'studentProof' => 'Student Enrollment Proof',
            'pensionProof' => 'Pension Statement',
            'incomeProof' => 'Proof of Income',
            'guarantorId' => 'Guarantor ID',
            'guarantorIncome' => 'Guarantor Income Proof',
        ],

        // Guarantor
        'guarantor' => [
            'hasGuarantor' => 'I have a guarantor',
            'description' => 'A guarantor can strengthen your application by providing additional financial security.',
            'none' => 'No guarantor added',
            'name' => 'Guarantor Name',
            'relationship' => 'Relationship',
            'phone' => 'Phone',
            'email' => 'Email',
            'address' => 'Address',
            'employer' => 'Employer',
            'monthlyIncome' => 'Monthly Income',
            'relationships' => [
                'parent' => 'Parent',
                'grandparent' => 'Grandparent',
                'sibling' => 'Sibling',
                'spouse' => 'Spouse',
                'partner' => 'Partner',
                'otherFamily' => 'Other Family',
                'friend' => 'Friend',
                'employer' => 'Employer',
                'other' => 'Other',
            ],
        ],

        // Emergency contact
        'emergency' => [
            'name' => 'Contact Name',
            'phone' => 'Phone',
            'relationship' => 'Relationship',
            'none' => 'No emergency contact added',
        ],
    ],
];
