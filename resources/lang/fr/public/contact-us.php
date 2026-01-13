<?php

return [
    // Page Header
    'pageTitle' => 'Contactez-nous',
    'pageSubtitle' => 'Vous avez une question ou besoin d\'aide? Nous serions ravis d\'echanger avec vous. Envoyez-nous un message et nous vous repondrons des que possible.',

    // Contact Information Cards
    'contactInfo' => [
        'email' => [
            'title' => 'Ecrivez-nous',
            'description' => 'Envoyez-nous un e-mail a tout moment et nous vous recontacterons.',
        ],
        'phone' => [
            'title' => 'Appelez-nous',
            'description' => 'Du lundi au vendredi de 9h00 a 18h00 CET',
        ],
        'address' => [
            'title' => 'Venez nous voir',
            'description' => 'Passez dire bonjour a notre siege.',
        ],
    ],

    // Contact Form
    'form' => [
        'title' => 'Envoyez-nous un message',
        'description' => 'Remplissez le formulaire ci-dessous et nous vous repondrons dans les plus brefs delais.',
        'fields' => [
            'name' => [
                'label' => 'Nom',
                'placeholder' => 'Votre nom',
            ],
            'email' => [
                'label' => 'E-mail',
                'placeholder' => 'votre.email@exemple.com',
            ],
            'subject' => [
                'label' => 'Objet',
                'placeholder' => 'De quoi s\'agit-il ?',
            ],
            'message' => [
                'label' => 'Message',
                'placeholder' => 'Dites-nous en plus sur votre question ou sur la maniere dont nous pouvons vous aider...',
            ],
        ],
        'submitButton' => 'Envoyer le message',
        'submittingButton' => 'Envoi en cours...',
    ],

    // Success State
    'success' => [
        'title' => 'Message envoye!',
        'description' => 'Merci de nous avoir contactes. Nous vous repondrons dans les plus brefs delais.',
        'sendAnotherButton' => 'Envoyer un autre message',
    ],
];
