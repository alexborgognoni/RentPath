<?php

return [
    // Page Header
    'pageTitle' => 'Datenschutzerklärung',
    'lastUpdated' => 'Zuletzt aktualisiert: Oktober 2025',

    // Introduction
    'introduction' => 'RentPath („wir", „uns" oder „unser") legt großen Wert auf den Schutz Ihrer Privatsphäre und verpflichtet sich, Ihre personenbezogenen Daten zu schützen. Diese Datenschutzerklärung erklärt, wie wir Ihre Informationen in Übereinstimmung mit der Datenschutz-Grundverordnung (DSGVO) und anderen geltenden Datenschutzgesetzen erheben, verwenden, offenlegen und sichern.',

    // Sections
    'sections' => [
        'whoWeAre' => [
            'title' => 'Wer wir sind (Verantwortlicher für die Datenverarbeitung)',
            'content' => 'RentPath ist der Verantwortliche für die Verarbeitung Ihrer personenbezogenen Daten.',
            'contactDetailsLabel' => 'Kontaktdaten:',
            'contactNote' => 'Wenn Sie Fragen zu dieser Datenschutzerklärung oder zur Verarbeitung Ihrer Daten haben, können Sie uns unter der unten genannten E-Mail-Adresse kontaktieren.',
        ],
        'informationWeCollect' => [
            'title' => 'Welche Daten wir erheben',
            'intro' => 'Wir können die folgenden Kategorien personenbezogener Daten erheben und verarbeiten:',
            'items' => [
                'accountInformation' => 'Kontoinformationen: Name, E-Mail-Adresse, Telefonnummer, Anmeldedaten.',
                'tenantApplicationData' => 'Mietbewerbungsdaten: beruflicher Werdegang, Mietverlauf, finanzielle Angaben (z. B. Gehaltsabrechnungen, Kontoauszüge), Ausweisdokumente, Referenzen.',
                'propertyManagementData' => 'Immobilienverwaltungsdaten: Informationen über Immobilien, Mietverträge, Zahlungen und Belegung.',
                'communications' => 'Kommunikation: über die Plattform ausgetauschte Nachrichten.',
                'usageData' => 'Nutzungsdaten: IP-Adresse, Geräteinformationen, Browsertyp, Betriebssystem, Aktivitätsprotokolle.',
                'cookiesTrackingData' => 'Cookies & Tracking-Daten: Informationen, die durch Cookies und ähnliche Technologien erhoben werden (siehe Abschnitt 9).',
            ],
        ],
        'lawfulBases' => [
            'title' => 'Rechtsgrundlagen für die Verarbeitung',
            'intro' => 'Wir verarbeiten Ihre personenbezogenen Daten nur, wenn eine rechtmäßige Grundlage gemäß der DSGVO vorliegt:',
            'items' => [
                'contract' => 'Vertrag: zur Bereitstellung unserer Dienste und Erfüllung von Vereinbarungen mit Vermietern, Immobilienverwaltern und Mietern.',
                'consent' => 'Einwilligung: wenn Sie uns Ihre ausdrückliche Zustimmung erteilt haben (z. B. für Marketingkommunikation, nicht unbedingt erforderliche Cookies).',
                'legalObligation' => 'Gesetzliche Verpflichtung: um geltende Gesetze, steuerliche Vorschriften und Aufbewahrungspflichten einzuhalten.',
                'legitimateInterests' => 'Berechtigte Interessen: zur Verbesserung unserer Dienste, Betrugsprävention, Gewährleistung der Sicherheit und Kommunikation wichtiger Aktualisierungen (sofern Ihre Rechte diesen Interessen nicht entgegenstehen).',
            ],
        ],
        'howWeUseData' => [
            'title' => 'Wie wir Ihre Daten verwenden',
            'intro' => 'Wir nutzen personenbezogene Daten für folgende Zwecke:',
            'items' => [
                'Erstellung und Verwaltung von Benutzerkonten.',
                'Bearbeitung von Mietbewerbungen und Ermöglichung der Kommunikation zwischen Vermietern, Verwaltern und Mietern.',
                'Verwaltung von Immobilien, Belegung und Mietverträgen.',
                'Kundenbetreuung und Beantwortung von Anfragen.',
                'Verbesserung, Überwachung und Sicherung unserer Dienste.',
                'Versand wichtiger Benachrichtigungen zu Ihrem Konto, Bewerbungen oder rechtlichen Verpflichtungen.',
                'Einhaltung gesetzlicher und regulatorischer Anforderungen.',
            ],
        ],
        'sharingData' => [
            'title' => 'Weitergabe Ihrer Daten',
            'intro' => 'Wir verkaufen Ihre personenbezogenen Daten nicht. Wir können sie weitergeben an:',
            'items' => [
                'landlordsPropertyManagers' => 'Vermieter und Immobilienverwalter zur Bearbeitung von Bewerbungen und Verwaltung von Immobilien.',
                'serviceProviders' => 'Dienstleister (z. B. Cloud-Hosting, Zahlungsabwickler, Analysetools) unter strengen Vertraulichkeitsvereinbarungen.',
                'regulatoryAuthorities' => 'Aufsichtsbehörden oder Gerichte, wenn dies gesetzlich vorgeschrieben ist oder zum Schutz unserer Rechte.',
            ],
            'note' => 'Bei einer Weitergabe stellen wir sicher, dass geeignete vertragliche und technische Schutzmaßnahmen vorhanden sind.',
        ],
        'internationalTransfers' => [
            'title' => 'Internationale Datenübermittlungen',
            'intro' => 'Wenn wir personenbezogene Daten außerhalb des Europäischen Wirtschaftsraums (EWR) übertragen, stellen wir geeignete Garantien sicher, wie z. B.:',
            'items' => [
                'adequacyDecision' => 'Übermittlungen in Länder mit einem Angemessenheitsbeschluss der Europäischen Kommission.',
                'standardContractualClauses' => 'Verwendung von Standardvertragsklauseln (SCCs), die von der Europäischen Kommission genehmigt wurden.',
            ],
        ],
        'dataRetention' => [
            'title' => 'Aufbewahrung der Daten',
            'content' => 'Wir bewahren personenbezogene Daten nur so lange auf, wie es für die in dieser Richtlinie beschriebenen Zwecke erforderlich ist oder wie es gesetzlich vorgeschrieben ist. Sobald die Daten nicht mehr benötigt werden, werden sie sicher gelöscht oder anonymisiert.',
        ],
        'yourRights' => [
            'title' => 'Ihre Rechte',
            'intro' => 'Nach der DSGVO haben Sie in Bezug auf Ihre personenbezogenen Daten folgende Rechte:',
            'items' => [
                'rightOfAccess' => 'Auskunftsrecht: Anforderung einer Kopie der Daten, die wir über Sie speichern.',
                'rightToRectification' => 'Recht auf Berichtigung: Korrektur unrichtiger oder unvollständiger Daten.',
                'rightToErasure' => 'Recht auf Löschung („Recht auf Vergessenwerden"): Löschung Ihrer Daten verlangen, wenn diese nicht mehr erforderlich sind.',
                'rightToRestrict' => 'Recht auf Einschränkung der Verarbeitung: Einschränkung der Nutzung Ihrer Daten verlangen.',
                'rightToPortability' => 'Recht auf Datenübertragbarkeit: Erhalt Ihrer Daten in einem strukturierten, gängigen und maschinenlesbaren Format.',
                'rightToObject' => 'Widerspruchsrecht: Widerspruch gegen die Verarbeitung auf Grundlage berechtigter Interessen oder Direktwerbung.',
                'rightToWithdraw' => 'Recht auf Widerruf der Einwilligung: Ihre Einwilligung jederzeit widerrufen, wenn die Verarbeitung auf dieser beruht.',
                'rightToComplain' => 'Beschwerderecht: Beschwerde bei Ihrer zuständigen Datenschutzaufsichtsbehörde einreichen.',
            ],
            'exerciseRights' => 'Um Ihre Rechte auszuüben, kontaktieren Sie uns bitte.',
        ],
        'cookiesTracking' => [
            'title' => 'Cookies & Tracking-Technologien',
            'intro' => 'Wir verwenden Cookies und ähnliche Technologien, um:',
            'items' => [
                'Grundfunktionen der Website zu ermöglichen.',
                'Leistung und Sicherheit zu verbessern.',
                'Nutzungsverhalten zu analysieren.',
                'Ihre Erfahrung zu personalisieren.',
            ],
            'note' => 'Für nicht unbedingt erforderliche Cookies holen wir Ihre Einwilligung über ein Cookie-Banner ein, in Übereinstimmung mit der ePrivacy-Richtlinie und der DSGVO. Sie können Ihre Cookie-Einstellungen in Ihrem Browser verwalten.',
        ],
        'security' => [
            'title' => 'Sicherheit',
            'content' => 'Wir setzen geeignete technische und organisatorische Maßnahmen ein, um Ihre personenbezogenen Daten vor unbefugtem Zugriff, Verlust, Missbrauch oder Veränderung zu schützen. Allerdings ist keine Übertragungsmethode über das Internet zu 100 % sicher.',
        ],
        'changes' => [
            'title' => 'Änderungen dieser Datenschutzerklärung',
            'content' => 'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Alle Aktualisierungen werden auf dieser Seite mit einem neuen Datum „Zuletzt aktualisiert" veröffentlicht.',
        ],
        'contactUs' => [
            'title' => 'Kontakt',
            'intro' => 'Wenn Sie Fragen, Anliegen oder Anfragen zu dieser Datenschutzerklärung oder zu Ihren personenbezogenen Daten haben, kontaktieren Sie uns bitte unter:',
        ],
    ],
];
