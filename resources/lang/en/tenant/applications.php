<?php

return [
    // Applications list
    'title' => 'My Applications',
    'subtitle' => 'Track and manage your rental applications',

    'filter' => [
        'all' => 'All Statuses',
        'search' => 'Search properties...',
        'draft' => 'Draft',
        'submitted' => 'Submitted',
        'underReview' => 'Under Review',
        'visitScheduled' => 'Visit Scheduled',
        'visitCompleted' => 'Visit Completed',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
        'withdrawn' => 'Withdrawn',
        'leased' => 'Leased',
    ],

    'empty' => [
        'title' => 'No Applications Yet',
        'description' => 'When you apply to properties, they will appear here.',
        'cta' => 'Browse Properties',
    ],

    'noResults' => 'No applications found',
    'noResultsDescription' => 'Try adjusting your filters.',
    'viewDetails' => 'View Details',

    // Application detail view
    'detail' => [
        'pageTitle' => 'Application',
        'backToApplications' => 'Back to Applications',
        'propertyInfo' => 'Property',
        'viewProperty' => 'View Property',
        'applicationDetails' => 'Application Details',
        'desiredMoveIn' => 'Desired Move-In Date',
        'leaseDuration' => 'Lease Duration',
        'months' => 'months',
        'totalOccupants' => 'Total Occupants',
        'pets' => 'Pets',
        'yes' => 'Yes',
        'no' => 'No',
        'messageToLandlord' => 'Your Message',

        // Employment
        'employmentInfo' => 'Employment & Income',
        'employmentStatus' => 'Employment Status',
        'employer' => 'Employer',
        'jobTitle' => 'Job Title',
        'monthlyIncome' => 'Monthly Income',
        'employmentType' => 'Employment Type',
        'notProvided' => 'Not provided',

        // Student
        'studentInfo' => 'Student Information',
        'university' => 'University',
        'program' => 'Program',

        // Guarantor
        'guarantorInfo' => 'Guarantor Information',
        'guarantorName' => 'Name',
        'relationship' => 'Relationship',

        // Documents
        'documents' => 'Submitted Documents',
        'idDocument' => 'ID Document',
        'employmentContract' => 'Employment Contract',
        'payslips' => 'Payslips',
        'proofOfIncome' => 'Proof of Income',
        'referenceLetter' => 'Reference Letter',
        'studentProof' => 'Student Proof',

        // Property visit
        'propertyVisit' => 'Property Visit',
        'scheduledDate' => 'Scheduled Date & Time',
        'visitCompletedOn' => 'Visit completed on',

        // Manager contact
        'managerContact' => 'Property Manager Contact',
        'company' => 'Company',
        'email' => 'Email',
        'phone' => 'Phone',

        // Timeline
        'timelineTitle' => 'Timeline',
        'timeline' => [
            'submitted' => 'Application Submitted',
            'underReview' => 'Under Review',
            'visitScheduled' => 'Visit Scheduled',
            'visitCompleted' => 'Visit Completed',
            'approved' => 'Application Approved',
            'rejected' => 'Application Rejected',
            'leaseSigned' => 'Lease Signed',
        ],

        // Quick info & actions
        'quickInfo' => 'Quick Info',
        'appliedOn' => 'Applied On',
        'income' => 'Income',
        'moveIn' => 'Move-In',
        'lease' => 'Lease',
        'actions' => 'Actions',
        'messageLandlord' => 'Message Landlord',
        'withdraw' => 'Withdraw Application',
        'withdrawing' => 'Withdrawing...',
        'withdrawConfirm' => 'Are you sure you want to withdraw this application? This action cannot be undone.',

        // Status messages
        'rejectedTitle' => 'Application Not Approved',
        'rejectionDetails' => 'Details:',
        'approvedTitle' => 'Congratulations! Your Application is Approved',
        'approvedMessage' => 'The property manager will contact you soon to finalize the lease agreement.',
        'notes' => 'Notes',
    ],
];
