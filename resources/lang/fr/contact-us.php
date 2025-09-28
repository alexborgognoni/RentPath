<?php

return [
    // Page Header
    'page_title' => 'Contactez-nous',
    'page_subtitle' => 'Vous avez une question ou besoin d’aide? Nous serions ravis d’échanger avec vous. Envoyez-nous un message et nous vous répondrons dès que possible.',

    // Contact Information Cards
    'contact_info' => [
        'email' => [
            'title' => 'Écrivez-nous',
            'description' => 'Envoyez-nous un e-mail à tout moment et nous vous recontacterons.',
        ],
        'phone' => [
            'title' => 'Appelez-nous',
            'description' => 'Du lundi au vendredi de 9h00 à 18h00 CET',
        ],
        'address' => [
            'title' => 'Venez nous voir',
            'description' => 'Passez dire bonjour à notre siège.',
        ],
    ],

    // Contact Form
    'form' => [
        'title' => 'Envoyez-nous un message',
        'description' => 'Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.',
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
                'placeholder' => 'De quoi s’agit-il ?',
            ],
            'message' => [
                'label' => 'Message',
                'placeholder' => 'Dites-nous en plus sur votre question ou sur la manière dont nous pouvons vous aider…',
            ],
        ],
        'submit_button' => 'Envoyer le message',
        'submitting_button' => 'Envoi en cours...',
    ],

    // Success State
    'success' => [
        'title' => 'Message envoyé!',
        'description' => 'Merci de nous avoir contactés. Nous vous répondrons dans les plues brefs délais.',
        'send_another_button' => 'Envoyer un autre message',
    ],
];
