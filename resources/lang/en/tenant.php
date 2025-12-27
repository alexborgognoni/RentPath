<?php

return [
    // Navigation
    'nav' => [
        'dashboard' => 'Dashboard',
        'properties' => 'Properties',
        'applications' => 'Applications',
        'messages' => 'Messages',
        'profile' => 'Profile',
    ],

    // Dashboard
    'dashboard' => [
        'title' => 'Dashboard',
        'welcome' => 'Welcome back',
        'subtitle' => 'Manage your rental applications and messages',
        'browse_properties' => 'Browse Properties',
        'empty' => [
            'title' => 'Start Your Rental Journey',
            'description' => 'Browse available properties and submit your first application. Your applications and messages will appear here.',
            'cta' => 'Browse Properties',
        ],
        'stats' => [
            'active_apps' => 'Active Applications',
            'pending_review' => 'Pending Review',
            'approved' => 'Approved',
            'unread_messages' => 'Unread Messages',
        ],
        'quick_actions' => [
            'browse' => 'Browse Properties',
            'browse_desc' => 'Find your next home',
            'applications' => 'My Applications',
            'applications_desc' => 'Track your applications',
            'messages' => 'Messages',
            'messages_desc' => 'Chat with landlords',
            'profile' => 'My Profile',
            'profile_desc' => 'Update your information',
        ],
        'recent_applications' => 'Recent Applications',
        'view_all' => 'View All',
        'status' => [
            'draft' => 'Draft',
            'submitted' => 'Submitted',
            'under_review' => 'Under Review',
            'visit_scheduled' => 'Visit Scheduled',
            'visit_completed' => 'Visit Completed',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'withdrawn' => 'Withdrawn',
            'leased' => 'Leased',
            'archived' => 'Archived',
        ],
        'card' => [
            'view_details' => 'View Details',
            'applied_on' => 'Applied',
        ],
    ],

    // Applications list
    'applications' => [
        'title' => 'My Applications',
        'subtitle' => 'Track and manage your rental applications',
        'filter' => [
            'all' => 'All Statuses',
            'search' => 'Search properties...',
            'draft' => 'Draft',
            'submitted' => 'Submitted',
            'under_review' => 'Under Review',
            'visit_scheduled' => 'Visit Scheduled',
            'visit_completed' => 'Visit Completed',
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
        'no_results' => 'No applications found',
        'no_results_description' => 'Try adjusting your filters.',
        'view_details' => 'View Details',
    ],

    // Profile
    'profile' => [
        'title' => 'My Profile',
        'subtitle' => 'Your tenant information for rental applications',
        'edit' => 'Edit Profile',
        'completeness' => 'Profile Completeness',
        'personal_info' => 'Personal Information',
        'date_of_birth' => 'Date of Birth',
        'nationality' => 'Nationality',
        'phone' => 'Phone',
        'not_provided' => 'Not provided',
        'employment' => 'Employment',
        'employment_status' => 'Status',
        'employer' => 'Employer',
        'monthly_income' => 'Monthly Income',
        'employment_types' => [
            'employed' => 'Employed',
            'self_employed' => 'Self Employed',
            'student' => 'Student',
            'unemployed' => 'Unemployed',
            'retired' => 'Retired',
        ],
        'documents' => 'Documents',
        'id_document' => 'ID Document',
        'proof_of_income' => 'Proof of Income',
        'reference_letter' => 'Reference Letter',
        'uploaded' => 'Uploaded',
        'not_uploaded' => 'Not uploaded',
        'current_address' => 'Current Address',
        'empty' => [
            'title' => 'No Profile Yet',
            'description' => 'Your tenant profile will be created when you submit your first application. The information you provide will be reused for future applications.',
            'cta' => 'Browse Properties',
        ],
    ],

    // Common
    'common' => [
        'today' => 'Today',
        'yesterday' => 'Yesterday',
        'days_ago' => 'days ago',
    ],
];
