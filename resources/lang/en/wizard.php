<?php

return [
    // Page titles and main UI
    'page' => [
        'addProperty' => 'Add New Property',
        'editProperty' => 'Edit Property',
        'publishListing' => 'Publish Listing',
        'updateListing' => 'Update Listing',
    ],

    // Navigation
    'nav' => [
        'back' => 'Back',
        'continue' => 'Continue',
        'skip' => 'Skip for now',
        'submit' => 'Submit',
        'submitting' => 'Submitting...',
    ],

    // Progress
    'progress' => [
        'stepOf' => 'Step :current of :total',
        'optional' => '(opt)',
    ],

    // Step titles and descriptions
    'steps' => [
        'propertyType' => [
            'title' => 'Property Type',
            'shortTitle' => 'Type',
            'description' => 'What kind of property are you listing?',
        ],
        'location' => [
            'title' => 'Location',
            'shortTitle' => 'Location',
            'description' => 'Where is your property located?',
        ],
        'specifications' => [
            'title' => 'Specifications',
            'shortTitle' => 'Specs',
            'description' => 'Tell us about the details',
        ],
        'amenities' => [
            'title' => 'Amenities',
            'shortTitle' => 'Amenities',
            'description' => 'What features does it include?',
        ],
        'energy' => [
            'title' => 'Energy',
            'shortTitle' => 'Energy',
            'description' => 'Energy efficiency information',
        ],
        'pricing' => [
            'title' => 'Pricing',
            'shortTitle' => 'Pricing',
            'description' => 'Set your rental price',
        ],
        'media' => [
            'title' => 'Photos & Details',
            'shortTitle' => 'Media',
            'description' => 'Add photos and description',
        ],
        'review' => [
            'title' => 'Review',
            'shortTitle' => 'Review',
            'description' => 'Review and publish',
        ],
    ],

    // Property Type Step
    'propertyTypeStep' => [
        'title' => 'What type of property are you listing?',
        'description' => 'Choose the category that best describes your property',
        'whatKind' => 'What kind of :type?',

        // Property types
        'types' => [
            'apartment' => 'Apartment',
            'apartmentDesc' => 'Flats, studios, penthouses',
            'house' => 'House',
            'houseDesc' => 'Detached, villas, bungalows',
            'room' => 'Room',
            'roomDesc' => 'Private rooms, co-living',
            'commercial' => 'Commercial',
            'commercialDesc' => 'Offices, retail spaces',
            'industrial' => 'Industrial',
            'industrialDesc' => 'Warehouses, factories',
            'parking' => 'Parking',
            'parkingDesc' => 'Garages, parking spots',
        ],

        // Subtypes
        'subtypes' => [
            'studio' => 'Studio',
            'loft' => 'Loft',
            'duplex' => 'Duplex',
            'triplex' => 'Triplex',
            'penthouse' => 'Penthouse',
            'serviced' => 'Serviced Apartment',
            'detached' => 'Detached House',
            'semi-detached' => 'Semi-detached',
            'villa' => 'Villa',
            'bungalow' => 'Bungalow',
            'private_room' => 'Private Room',
            'student_room' => 'Student Room',
            'co-living' => 'Co-living Space',
            'office' => 'Office Space',
            'retail' => 'Retail Shop',
            'warehouse' => 'Warehouse',
            'factory' => 'Factory',
            'garage' => 'Garage',
            'indoor_spot' => 'Indoor Parking Spot',
            'outdoor_spot' => 'Outdoor Parking Spot',
        ],
    ],

    // Location Step
    'locationStep' => [
        'title' => 'Where is your property located?',
        'description' => 'Enter the address where tenants will live',
        'number' => 'Number',
        'streetName' => 'Street Name',
        'apartmentSuite' => 'Apartment, Suite, Unit',
        'optional' => 'optional',
        'city' => 'City',
        'postalCode' => 'Postal Code',
        'stateRegion' => 'State/Region',
        'country' => 'Country',
        'privacyNote' => 'Your exact address will only be shared with approved applicants',

        // Placeholders
        'placeholders' => [
            'number' => '123',
            'streetName' => 'Main Street',
            'apartmentSuite' => 'Apt 4B, Floor 2, etc.',
            'city' => 'Zurich',
            'postalCode' => '8001',
            'stateRegion' => 'Canton, State, etc.',
        ],

        // Countries
        'countries' => [
            'CH' => 'Switzerland',
            'DE' => 'Germany',
            'FR' => 'France',
            'AT' => 'Austria',
            'IT' => 'Italy',
            'US' => 'United States',
            'GB' => 'United Kingdom',
            'NL' => 'Netherlands',
            'BE' => 'Belgium',
            'ES' => 'Spain',
        ],
    ],

    // Specifications Step
    'specificationsStep' => [
        'title' => 'Tell us about the space',
        'description' => 'These details help tenants find the perfect match',

        // Section titles
        'sections' => [
            'rooms' => 'Rooms',
            'space' => 'Space',
            'parking' => 'Parking',
            'building' => 'Building',
        ],

        // Field labels
        'fields' => [
            'bedrooms' => 'Bedrooms',
            'bathrooms' => 'Bathrooms',
            'livingSpace' => 'Living Space',
            'balconyTerrace' => 'Balcony/Terrace',
            'landSize' => 'Land Size',
            'indoorSpots' => 'Indoor Spots',
            'outdoorSpots' => 'Outdoor Spots',
            'floorLevel' => 'Floor Level',
            'yearBuilt' => 'Year Built',
            'hasElevator' => 'Has Elevator',
            'parkingSpaceSize' => 'Parking Space Size',
        ],
    ],

    // Amenities Step
    'amenitiesStep' => [
        'title' => 'What does your property offer?',
        'description' => 'Select all the features and amenities included',
        'helperText' => "Don't worry if something isn't listed — you can add more details in the description later",

        // Categories
        'categories' => [
            'kitchen' => 'Kitchen',
            'building' => 'Building Features',
            'outdoor' => 'Outdoor Spaces',
        ],

        // Amenities
        'amenities' => [
            'equippedKitchen' => 'Equipped Kitchen',
            'separateKitchen' => 'Separate Kitchen',
            'cellarStorage' => 'Cellar Storage',
            'laundryRoom' => 'Laundry Room',
            'fireplace' => 'Fireplace',
            'airConditioning' => 'Air Conditioning',
            'gardenAccess' => 'Garden Access',
            'rooftopAccess' => 'Rooftop Access',
        ],
    ],

    // Energy Step
    'energyStep' => [
        'title' => 'Energy & Efficiency',
        'description' => 'Help eco-conscious tenants find your property',
        'optionalNote' => 'This step is optional',
        'energyPerformance' => 'Energy Performance Rating',
        'energyHelp' => 'A+ is the most efficient, G is the least',
        'thermalInsulation' => 'Thermal Insulation Rating',
        'heatingSystem' => 'Heating System',

        // Heating types
        'heatingTypes' => [
            'gas' => 'Gas',
            'electric' => 'Electric',
            'district' => 'District Heating',
            'heat_pump' => 'Heat Pump',
            'wood' => 'Wood',
            'other' => 'Other',
        ],
    ],

    // Pricing Step
    'pricingStep' => [
        'title' => 'Set your pricing',
        'description' => 'How much will you charge for rent?',
        'perMonth' => '/month',
        'whenAvailable' => 'When is it available?',
        'availableImmediately' => 'Available Immediately',
        'orChooseDate' => 'or choose a date',
        'acceptApplications' => 'Accept applications?',
        'openForApplications' => 'Open for applications',
        'startReceiving' => 'Start receiving applications',
        'notYet' => 'Not yet',
        'openLater' => 'Open for applications later',
    ],

    // Media Step
    'mediaStep' => [
        'title' => 'Make it shine',
        'description' => 'Great photos and a compelling title attract more applicants',
        'propertyTitle' => 'Property Title',
        'titlePlaceholder' => 'e.g., Sunny 2BR Apartment with Balcony in City Center',
        'descriptionLabel' => 'Description',
        'descriptionOptional' => 'optional but recommended',
        'descriptionPlaceholder' => 'Describe what makes your property special. Mention nearby amenities, transport links, and anything else tenants should know...',
        'propertyPhotos' => 'Property Photos',
        'main' => 'Main',
        'setAsMain' => 'Set as main',
        'addMore' => 'Add more',
        'dragToReorder' => 'Drag to reorder. Hover to set the main photo.',
        'uploadPhotos' => 'Upload property photos',
        'clickOrDrag' => 'Click or drag images here',
        'maxSize' => 'Max :size per image',
        'allowedFormats' => 'JPG, PNG, WebP',
    ],

    // Review Step
    'reviewStep' => [
        'title' => 'Review your listing',
        'titleEdit' => 'Your Property Listing',
        'description' => 'Make sure everything looks good before publishing',
        'descriptionEdit' => 'Click Edit on any section to make changes',
        'fixIssues' => 'Please fix the following issues:',
        'edit' => 'Edit',
        'morePhotos' => '+:count more photos',
        'noPhotos' => 'No photos added',
        'untitledProperty' => 'Untitled Property',
        'locationNotSet' => 'Location not set',
        'perMonth' => '/month',
        'immediately' => 'Immediately',

        // Section titles
        'sections' => [
            'propertyType' => 'Property Type',
            'location' => 'Location',
            'specifications' => 'Specifications',
            'amenities' => 'Amenities',
            'energy' => 'Energy',
            'pricingAvailability' => 'Pricing & Availability',
            'description' => 'Description',
        ],

        // Labels
        'labels' => [
            'bedrooms' => ':count Bedrooms',
            'bedroom' => ':count Bedroom',
            'bathrooms' => ':count Bathrooms',
            'bathroom' => ':count Bathroom',
            'livingSpace' => ':size m² living',
            'balcony' => ':size m² balcony',
            'land' => ':size m² land',
            'parking' => ':count parking',
            'floor' => 'Floor :level',
            'elevator' => 'Elevator',
            'monthlyRent' => 'Monthly Rent',
            'available' => 'Available',
            'energyClass' => 'Energy Class:',
            'insulation' => 'Insulation:',
            'heating' => 'Heating:',
        ],

        // Amenity labels (short)
        'amenityLabels' => [
            'equippedKitchen' => 'Equipped Kitchen',
            'separateKitchen' => 'Separate Kitchen',
            'cellar' => 'Cellar',
            'laundry' => 'Laundry',
            'fireplace' => 'Fireplace',
            'airConditioning' => 'A/C',
            'garden' => 'Garden',
            'rooftop' => 'Rooftop',
        ],

        'finalNote' => 'By publishing, you confirm that the information above is accurate and complete.',
    ],
];
