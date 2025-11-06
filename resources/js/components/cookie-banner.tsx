import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CookieBanner() {
    const { translations } = usePage<SharedData>().props;
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem(
            'cookie-consent',
            JSON.stringify({
                necessary: true,
                analytics: true,
                marketing: true,
                timestamp: Date.now(),
            }),
        );
        setIsVisible(false);
    };

    const acceptNecessary = () => {
        localStorage.setItem(
            'cookie-consent',
            JSON.stringify({
                necessary: true,
                analytics: false,
                marketing: false,
                timestamp: Date.now(),
            }),
        );
        setIsVisible(false);
    };

    const savePreferences = (preferences: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
        localStorage.setItem(
            'cookie-consent',
            JSON.stringify({
                ...preferences,
                timestamp: Date.now(),
            }),
        );
        setIsVisible(false);
        setShowPreferences(false);
    };

    if (!isVisible) return null;

    if (showPreferences) {
        return <CookiePreferences translations={translations} onSave={savePreferences} onBack={() => setShowPreferences(false)} />;
    }

    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="relative rounded-2xl border border-border bg-card shadow-2xl">
                    <div className="p-6 sm:p-8">
                        <div className="mb-4 flex items-start justify-between">
                            <h3 className="text-xl font-bold text-foreground sm:text-2xl">{translate(translations, 'cookie-banner.banner.title')}</h3>
                            <button
                                onClick={acceptNecessary}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-muted"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <p className="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                            {translate(translations, 'cookie-banner.banner.description')}
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={acceptAll}
                                className="flex-1 cursor-pointer rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                            >
                                {translate(translations, 'cookie-banner.banner.accept_all')}
                            </button>
                            <button
                                onClick={acceptNecessary}
                                className="flex-1 cursor-pointer rounded-lg border border-border bg-surface px-6 py-3 text-center font-semibold text-foreground transition-all hover:bg-surface/80"
                            >
                                {translate(translations, 'cookie-banner.banner.necessary_only')}
                            </button>
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="flex-1 cursor-pointer rounded-lg border border-border bg-surface px-6 py-3 text-center font-semibold text-foreground transition-all hover:bg-surface/80"
                            >
                                {translate(translations, 'cookie-banner.banner.customize')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CookiePreferences({
    translations,
    onSave,
    onBack,
}: {
    translations: SharedData['translations'];
    onSave: (preferences: { necessary: boolean; analytics: boolean; marketing: boolean }) => void;
    onBack: () => void;
}) {
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: true,
        marketing: true,
    });

    const togglePreference = (key: 'analytics' | 'marketing') => {
        setPreferences((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 p-4 sm:p-6">
            <div className="mx-auto max-w-3xl">
                <div className="relative rounded-2xl border border-border bg-card shadow-2xl">
                    <div className="p-6 sm:p-8">
                        <div className="mb-6 flex items-start justify-between">
                            <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                                {translate(translations, 'cookie-banner.preferences.title')}
                            </h3>
                            <button
                                onClick={onBack}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-muted"
                                aria-label="Back"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="mb-6 space-y-4">
                            {/* Necessary Cookies */}
                            <div className="rounded-xl border border-border bg-surface/50 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="font-semibold text-foreground">
                                        {translate(translations, 'cookie-banner.preferences.necessary.title')}
                                    </h4>
                                    <span className="text-sm text-muted-foreground">
                                        {translate(translations, 'cookie-banner.preferences.necessary.always_active')}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {translate(translations, 'cookie-banner.preferences.necessary.description')}
                                </p>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="rounded-xl border border-border bg-surface/50 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="font-semibold text-foreground">
                                        {translate(translations, 'cookie-banner.preferences.analytics.title')}
                                    </h4>
                                    <button
                                        onClick={() => togglePreference('analytics')}
                                        className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                                            preferences.analytics ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted'
                                        }`}
                                        role="switch"
                                        aria-checked={preferences.analytics}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {translate(translations, 'cookie-banner.preferences.analytics.description')}
                                </p>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="rounded-xl border border-border bg-surface/50 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="font-semibold text-foreground">
                                        {translate(translations, 'cookie-banner.preferences.marketing.title')}
                                    </h4>
                                    <button
                                        onClick={() => togglePreference('marketing')}
                                        className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                                            preferences.marketing ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted'
                                        }`}
                                        role="switch"
                                        aria-checked={preferences.marketing}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {translate(translations, 'cookie-banner.preferences.marketing.description')}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={() => onSave(preferences)}
                                className="flex-1 cursor-pointer rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                            >
                                {translate(translations, 'cookie-banner.preferences.save_preferences')}
                            </button>
                            <button
                                onClick={onBack}
                                className="flex-1 cursor-pointer rounded-lg border border-border bg-surface px-6 py-3 text-center font-semibold text-foreground transition-all hover:bg-surface/80"
                            >
                                {translate(translations, 'cookie-banner.preferences.back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
