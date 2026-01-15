import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Cookie, Settings, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type CookiePreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
};

type ConsentData = CookiePreferences & {
    timestamp: number;
};

function saveConsent(preferences: CookiePreferences): void {
    localStorage.setItem(
        'cookie-consent',
        JSON.stringify({
            ...preferences,
            timestamp: Date.now(),
        } satisfies ConsentData),
    );
}

export function CookieBanner() {
    const { translations } = usePage<SharedData>().props;
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Small delay for smoother page load
            const timer = setTimeout(() => {
                setIsVisible(true);
                setIsAnimating(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 200);
    };

    const acceptAll = () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
        handleClose();
    };

    const acceptNecessary = () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
        handleClose();
    };

    const handleSavePreferences = (preferences: CookiePreferences) => {
        saveConsent(preferences);
        handleClose();
    };

    if (!isVisible) return null;

    return (
        <div
            className={cn(
                'fixed right-0 bottom-0 left-0 z-50 p-4',
                'transition-all duration-300 ease-out',
                isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-banner-title"
        >
            <div className="mx-auto max-w-xl">
                {showPreferences ? (
                    <CookiePreferencesPanel translations={translations} onSave={handleSavePreferences} onBack={() => setShowPreferences(false)} />
                ) : (
                    <div className="rounded-xl border border-border bg-card shadow-lg">
                        <div className="p-5">
                            {/* Header */}
                            <div className="mb-3 flex items-center gap-2.5">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                                    <Cookie className="size-4 text-muted-foreground" />
                                </div>
                                <h2 id="cookie-banner-title" className="text-base font-semibold text-foreground">
                                    {translate(translations.layout.cookieBanner, 'banner.title')}
                                </h2>
                                <button
                                    onClick={acceptNecessary}
                                    className="ml-auto flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    aria-label="Close and accept necessary cookies only"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            {/* Description */}
                            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                                {translate(translations.layout.cookieBanner, 'banner.description')}
                            </p>

                            {/* Actions - Equal visual weight for GDPR compliance */}
                            <div className="flex flex-col gap-2.5 sm:flex-row">
                                <button
                                    onClick={acceptAll}
                                    className="flex-1 cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    {translate(translations.layout.cookieBanner, 'banner.accept_all')}
                                </button>
                                <button
                                    onClick={acceptNecessary}
                                    className="flex-1 cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    {translate(translations.layout.cookieBanner, 'banner.necessary_only')}
                                </button>
                                <button
                                    onClick={() => setShowPreferences(true)}
                                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    <Settings className="size-4" />
                                    {translate(translations.layout.cookieBanner, 'banner.customize')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CookiePreferencesPanel({
    translations,
    onSave,
    onBack,
}: {
    translations: SharedData['translations'];
    onSave: (preferences: CookiePreferences) => void;
    onBack: () => void;
}) {
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true,
        analytics: false,
        marketing: false,
    });

    const togglePreference = (key: 'analytics' | 'marketing') => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="rounded-xl border border-border bg-card shadow-lg">
            <div className="p-5">
                {/* Header */}
                <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                        <Settings className="size-4 text-muted-foreground" />
                    </div>
                    <h2 className="text-base font-semibold text-foreground">{translate(translations.layout.cookieBanner, 'preferences.title')}</h2>
                    <button
                        onClick={onBack}
                        className="ml-auto flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Back to cookie banner"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Cookie Categories */}
                <div className="mb-5 space-y-2.5">
                    {/* Necessary */}
                    <CookieCategory
                        title={translate(translations.layout.cookieBanner, 'preferences.necessary.title')}
                        description={translate(translations.layout.cookieBanner, 'preferences.necessary.description')}
                        checked={true}
                        disabled={true}
                        badge={translate(translations.layout.cookieBanner, 'preferences.necessary.always_active')}
                    />

                    {/* Analytics */}
                    <CookieCategory
                        title={translate(translations.layout.cookieBanner, 'preferences.analytics.title')}
                        description={translate(translations.layout.cookieBanner, 'preferences.analytics.description')}
                        checked={preferences.analytics}
                        onToggle={() => togglePreference('analytics')}
                    />

                    {/* Marketing */}
                    <CookieCategory
                        title={translate(translations.layout.cookieBanner, 'preferences.marketing.title')}
                        description={translate(translations.layout.cookieBanner, 'preferences.marketing.description')}
                        checked={preferences.marketing}
                        onToggle={() => togglePreference('marketing')}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2.5">
                    <button
                        onClick={() => onSave(preferences)}
                        className="flex-1 cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        {translate(translations.layout.cookieBanner, 'preferences.save_preferences')}
                    </button>
                    <button
                        onClick={onBack}
                        className="cursor-pointer rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        {translate(translations.layout.cookieBanner, 'preferences.back')}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CookieCategory({
    title,
    description,
    checked,
    disabled,
    badge,
    onToggle,
}: {
    title: string;
    description: string;
    checked: boolean;
    disabled?: boolean;
    badge?: string;
    onToggle?: () => void;
}) {
    return (
        <div className="rounded-lg border border-border bg-surface/50 p-3.5">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{title}</span>
                        {badge && <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">{badge}</span>}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
                </div>
                <Switch checked={checked} disabled={disabled} onToggle={onToggle} />
            </div>
        </div>
    );
}

function Switch({ checked, disabled, onToggle }: { checked: boolean; disabled?: boolean; onToggle?: () => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={onToggle}
            className={cn(
                'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                checked ? 'bg-primary' : 'bg-muted',
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
            )}
        >
            <span
                className={cn(
                    'pointer-events-none block size-3.5 rounded-full bg-white shadow-sm transition-transform',
                    checked ? 'translate-x-[18px]' : 'translate-x-[3px]',
                )}
            />
        </button>
    );
}
