<?php

return [
    // Page Header
    'page_title' => 'Kontaktieren Sie uns',
    'page_subtitle' => 'Haben Sie eine Frage oder benötigen Sie Hilfe? Wir freuen uns, mit Ihnen ins Gespräch zu kommen. Senden Sie uns eine Nachricht und wir antworten Ihnen so schnell wie möglich.',

    // Contact Information Cards
    'contact_info' => [
        'email' => [
            'title' => 'Schreiben Sie uns',
            'description' => 'Senden Sie uns jederzeit eine E-Mail und wir melden uns bei Ihnen.',
        ],
        'phone' => [
            'title' => 'Rufen Sie uns an',
            'description' => 'Mo–Fr von 9:00 bis 18:00 Uhr MEZ',
        ],
        'address' => [
            'title' => 'Besuchen Sie uns',
            'description' => 'Schauen Sie gerne in unserer Zentrale vorbei.',
        ],
    ],
    // Contact Form
    'form' => [
        'title' => 'Senden Sie uns eine Nachricht',
        'description' => 'Füllen Sie das untenstehende Formular aus, und wir werden Ihnen so schnell wie möglich antworten.',
        'fields' => [
            'name' => [
                'label' => 'Name',
                'placeholder' => 'Ihr Name',
            ],
            'email' => [
                'label' => 'E-Mail',
                'placeholder' => 'ihre.email@beispiel.com',
            ],
            'subject' => [
                'label' => 'Betreff',
                'placeholder' => 'Worum geht es?',
            ],
            'message' => [
                'label' => 'Nachricht',
                'placeholder' => 'Beschreiben Sie Ihr Anliegen oder wie wir Ihnen helfen können...',
            ],
        ],
        'submit_button' => 'Nachricht senden',
        'submitting_button' => 'Wird gesendet...',
    ],

    // Success State
    'success' => [
        'title' => 'Nachricht gesendet!',
        'description' => 'Vielen Dank für Ihre Kontaktaufnahme. Wir melden uns so so schnell wie möglich bei Ihnen zurück.',
        'send_another_button' => 'Weitere Nachricht senden',
    ],
];
