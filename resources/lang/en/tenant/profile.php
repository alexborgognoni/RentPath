<?php

return [
    'title' => 'My Profile',
    'subtitle' => 'Your tenant information for rental applications',
    'editButton' => 'Edit',
    'completeness' => 'Profile Completeness',

    // Header
    'header' => [
        'unnamed_user' => 'Unnamed User',
        'status' => [
            'verified' => 'Verified',
            'pending' => 'Pending Review',
            'needs_attention' => 'Needs Attention',
        ],
        'rejection_reason' => 'Reason:',
    ],

    // Completeness meter
    'completeness_meter' => [
        'getting_started' => 'Getting started',
        'making_progress' => 'Making progress',
        'halfway_there' => 'Halfway there',
        'almost_done' => 'Almost done',
        'profile_complete' => 'Profile complete!',
        'ready_message' => 'Your profile is ready for applications',
        'more_to_complete' => ':percent% more to complete',
    ],

    // Section titles
    'sections' => [
        'personal' => 'Personal Information',
        'address' => 'Current Address',
        'identity' => 'Identity Documents',
        'employment' => 'Employment & Income',
        'documents' => [
            'title' => 'Additional Documents',
            'no_additional_required' => 'No additional documents required. Employment documents can be uploaded in the Employment section.',
            'immigration_hint' => 'Since you\'re applying in a different country from your nationality, you may need to provide additional documents.',
            'residence_permit' => 'Residence Permit',
            'right_to_rent' => 'Right to Rent Document',
        ],
    ],

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

    // Privacy & Data
    'privacy' => [
        'title' => 'Your Data & Privacy',
        'description' => 'Your profile data is used to streamline rental applications. You can clear all saved data at any time.',
        'clearAllData' => 'Clear All Data',
        'privacyPolicy' => 'Privacy Policy',
        'clearConfirmation' => [
            'title' => 'Clear All Profile Data?',
            'message' => 'This will permanently delete all your saved profile information and uploaded documents.',
            'warning1' => 'All personal information will be removed',
            'warning2' => 'All uploaded documents will be deleted',
            'warning3' => 'This action cannot be undone',
            'cancel' => 'Cancel',
            'confirm' => 'Clear All Data',
            'clearing' => 'Clearing...',
        ],
    ],
];
