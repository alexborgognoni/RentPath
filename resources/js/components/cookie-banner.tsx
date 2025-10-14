import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CookieBanner() {
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
        localStorage.setItem('cookie-consent', JSON.stringify({
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now()
        }));
        setIsVisible(false);
    };

    const acceptNecessary = () => {
        localStorage.setItem('cookie-consent', JSON.stringify({
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now()
        }));
        setIsVisible(false);
    };

    const savePreferences = (preferences: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
        localStorage.setItem('cookie-consent', JSON.stringify({
            ...preferences,
            timestamp: Date.now()
        }));
        setIsVisible(false);
        setShowPreferences(false);
    };

    if (!isVisible) return null;

    if (showPreferences) {
        return <CookiePreferences onSave={savePreferences} onBack={() => setShowPreferences(false)} />;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="relative rounded-2xl border border-border bg-card shadow-2xl">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                                Cookie Settings
                            </h3>
                            <button
                                onClick={acceptNecessary}
                                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted cursor-pointer"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <p className="mb-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                            By clicking "Accept All", you consent to our use of cookies.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={acceptAll}
                                className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:shadow-xl cursor-pointer"
                            >
                                Accept All
                            </button>
                            <button
                                onClick={acceptNecessary}
                                className="flex-1 rounded-lg border border-border bg-surface px-6 py-3 text-center font-semibold text-foreground transition-all hover:bg-surface/80 cursor-pointer"
                            >
                                Necessary Only
                            </button>
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="flex-1 rounded-lg border border-border bg-surface px-6 py-3 text-center font-semibold text-foreground transition-all hover:bg-surface/80 cursor-pointer"
                            >
                                Customize
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CookiePreferences({
    onSave,
    onBack
}: {
    onSave: (preferences: { necessary: boolean; analytics: boolean; marketing: boolean }) => void;
    onBack: () => void;
}) {
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: true,
        marketing: true
    });

    const togglePreference = (key: 'analytics' | 'marketing') => {
        setPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
            <div className="mx-auto max-w-3xl">
                <div className="relative rounded-2xl border border-border bg-card shadow-2xl">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-start justify-between mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                                Cookie Preferences
                            </h3>
                            <button
                                onClick={onBack}
                                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted cursor-pointer"
                                aria-label="Back"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Necessary Cookies */}
                            <div className="rounded-xl border border-border bg-surface/50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-foreground">Necessary Cookies</h4>
                                    <span className="text-sm text-muted-foreground">Always Active</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Required for the website to function properly. These cannot be disabled.
                                </p>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="rounded-xl border border-border bg-surface/50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-foreground">Analytics Cookies</h4>
                                    <button
                                        onClick={() => togglePreference('analytics')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                            preferences.analytics
                                                ? 'bg-gradient-to-r from-primary to-secondary'
                                                : 'bg-muted'
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
                                    Help us understand how visitors interact with our website to improve user experience.
                                </p>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="rounded-xl border border-border bg-surface/50 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-foreground">Marketing Cookies</h4>
                                    <button
                                        onClick={() => togglePreference('marketing')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                                            preferences.marketing
                                                ? 'bg-gradient-to-r from-primary to-secondary'
                                                : 'bg-muted'
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
                                    Used to track visitors across websites to display relevant advertisements.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => onSave(preferences)}
                                className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:shadow-xl cursor-pointer"
                            >
                                Save Preferences
                            </button>
                            <button
                                onClick={onBack}
                                className="flex-1 rounded-lg border border-border bg-surface px-6 py-3 text-center font-semibold text-foreground transition-all hover:bg-surface/80 cursor-pointer"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
