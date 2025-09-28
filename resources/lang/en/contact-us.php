<?php

return [
    // Page Header
    'page_title' => 'Contact Us',
    'page_subtitle' => 'Have a question or need help? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.',

    // Contact Information Cards
    'contact_info' => [
        'email' => [
            'title' => 'Email Us',
            'description' => 'Send us an email anytime and we\'ll get back to you.',
        ],
        'phone' => [
            'title' => 'Call Us',
            'description' => 'Mon-Fri from 9am to 6pm CET',
        ],
        'address' => [
            'title' => 'Visit Us',
            'description' => 'Come say hello at our office headquarters.',
        ],
    ],

    // Contact Form
    'form' => [
        'title' => 'Send us a message',
        'description' => 'Fill out the form below and we\'ll get back to you as soon as possible.',
        'fields' => [
            'name' => [
                'label' => 'Name',
                'placeholder' => 'Your name',
            ],
            'email' => [
                'label' => 'Email',
                'placeholder' => 'your.email@example.com',
            ],
            'subject' => [
                'label' => 'Subject',
                'placeholder' => 'What\'s this about?',
            ],
            'message' => [
                'label' => 'Message',
                'placeholder' => 'Tell us more about your question or how we can help...',
            ],
        ],
        'submit_button' => 'Send Message',
        'submitting_button' => 'Sending...',
    ],

    // Success State
    'success' => [
        'title' => 'Message Sent!',
        'description' => 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
        'send_another_button' => 'Send Another Message',
    ],
];