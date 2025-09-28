<?php

return [
    // Page Header
    'page_title' => 'Contacteer Ons',
    'page_subtitle' => 'Heeft u een vraag of heeft u hulp nodig? We horen graag van u. Stuur ons een bericht en we reageren zo snel mogelijk.',

    // Contact Information Cards
    'contact_info' => [
        'email' => [
            'title' => 'E-mail Ons',
            'description' => 'Stuur ons op elk moment een e-mail en we nemen zo snel mogelijk contact met u op.',
        ],
        'phone' => [
            'title' => 'Bel Ons',
            'description' => 'Ma-Vr van 09:00 tot 18:00 CET',
        ],
        'address' => [
            'title' => 'Bezoek Ons',
            'description' => 'Kom langs en zeg hallo op ons hoofdkantoor.',
        ],
    ],

    // Contact Form
    'form' => [
        'title' => 'Stuur ons een bericht',
        'description' => 'Vul het onderstaande formulier in en we nemen zo snel mogelijk contact met u op.',
        'fields' => [
            'name' => [
                'label' => 'Naam',
                'placeholder' => 'Uw naam',
            ],
            'email' => [
                'label' => 'E-mail',
                'placeholder' => 'uw.email@example.com',
            ],
            'subject' => [
                'label' => 'Onderwerp',
                'placeholder' => 'Waar gaat dit over?',
            ],
            'message' => [
                'label' => 'Bericht',
                'placeholder' => 'Vertel ons meer over uw vraag of hoe we kunnen helpen...',
            ],
        ],
        'submit_button' => 'Verstuur Bericht',
        'submitting_button' => 'Bezig met verzenden...',
    ],

    // Success State
    'success' => [
        'title' => 'Bericht Verzonden!',
        'description' => 'Bedankt voor uw bericht. We nemen binnen 24 uur contact met u op.',
        'send_another_button' => 'Verstuur Nog Een Bericht',
    ],
];
