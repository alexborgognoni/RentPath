import type { SharedData } from '@/types';
import type { Property } from '@/types/dashboard';
import { copyToClipboard } from '@/utils/clipboard';
import { getRootDomainUrl, route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { Check, Copy, Edit, FileText, Link2, RefreshCw, Settings, Share, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { InviteTokensModal } from './invite-tokens-modal';

interface PropertySidebarProps {
    property: Property;
    tenantCount: number;
}

export function PropertySidebar({ property, tenantCount }: PropertySidebarProps) {
    const { appUrlScheme, appDomain, appPort, translations } = usePage<SharedData>().props;
    const t = (key: string, params?: Record<string, string | number>) => translate(translations, key, params);
    // Application access: 'link_required' = needs invite token, 'open' = anyone can apply
    const [applicationAccess, setApplicationAccess] = useState<'open' | 'link_required' | 'invite_only'>(property.application_access ?? 'open');
    const requiresToken = applicationAccess === 'link_required' || applicationAccess === 'invite_only';
    const [defaultToken, setDefaultToken] = useState<{ token: string; used_count: number; view_count: number } | null>(
        property.default_token || null,
    );
    const [copiedToken, setCopiedToken] = useState(false);
    const [regeneratingToken, setRegeneratingToken] = useState(false);

    // Check URL params on mount to open modal if ?manageTokens=true
    const [showTokensModal, setShowTokensModal] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('manageTokens') === 'true';
    });

    // Update URL when modal state changes
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (showTokensModal) {
            params.set('manageTokens', 'true');
        } else {
            params.delete('manageTokens');
        }

        const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    }, [showTokensModal]);

    const formatCurrency = (amount: number, currency: string) => {
        const currencyMap: Record<string, string> = {
            eur: 'EUR',
            usd: 'USD',
            gbp: 'GBP',
            chf: 'CHF',
        };

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyMap[currency] || 'EUR',
        }).format(amount);
    };

    const handleEdit = () => {
        router.visit(route('properties.edit', { property: property.id }));
    };

    const handleDelete = () => {
        if (confirm(t('properties.sidebar.deletePropertyConfirm'))) {
            router.delete(route('properties.destroy', { property: property.id }), {
                onSuccess: () => {
                    router.visit(route('manager.properties.index'));
                },
            });
        }
    };

    const handleToggleApplicationAccess = async () => {
        try {
            const response = await fetch(route('properties.togglePublicAccess', { property: property.id }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setApplicationAccess(data.application_access);

                // If enabling link_required and default token was created/returned, update state
                if (data.default_token) {
                    setDefaultToken({
                        token: data.default_token.token,
                        used_count: data.default_token.used_count,
                        view_count: data.default_token.view_count ?? 0,
                    });
                } else {
                    setDefaultToken(null);
                }
            }
        } catch (error) {
            console.error('Failed to toggle application access:', error);
        }
    };

    const handleRegenerateDefaultToken = async () => {
        setRegeneratingToken(true);
        try {
            const response = await fetch(route('properties.regenerateDefaultToken', { property: property.id }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setDefaultToken({
                    token: data.token,
                    used_count: data.used_count,
                    view_count: data.view_count ?? 0,
                });
            }
        } catch (error) {
            console.error('Failed to regenerate token:', error);
        } finally {
            setRegeneratingToken(false);
        }
    };

    const handleCopyLink = async () => {
        const rootDomain = getRootDomainUrl(appUrlScheme, appDomain, appPort);
        const propertyUrl =
            requiresToken && defaultToken?.token
                ? `${rootDomain}/properties/${property.id}?token=${defaultToken.token}`
                : `${rootDomain}/properties/${property.id}`;

        const success = await copyToClipboard(propertyUrl);
        if (success) {
            setCopiedToken(true);
            setTimeout(() => setCopiedToken(false), 2000);
        }
    };

    const getStatusBadge = () => {
        // Property lifecycle status (simplified)
        const statusConfig: Record<string, { labelKey: string; className: string }> = {
            draft: {
                labelKey: 'properties.statusDraft',
                className: 'bg-muted/50 text-muted-foreground',
            },
            vacant: {
                labelKey: 'properties.statusVacant',
                className: 'bg-success/10 text-success',
            },
            leased: {
                labelKey: 'properties.statusLeased',
                className: 'bg-cyan-500/10 text-cyan-400',
            },
            maintenance: {
                labelKey: 'properties.statusMaintenance',
                className: 'bg-orange-500/10 text-orange-400',
            },
            archived: {
                labelKey: 'properties.statusArchived',
                className: 'bg-muted/50 text-muted-foreground',
            },
        };

        const config = statusConfig[property.status] || statusConfig.draft;

        return <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>{t(config.labelKey)}</span>;
    };

    return (
        <div className="space-y-4">
            {/* Quick Stats */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-3 flex items-center text-base font-semibold text-foreground">
                    <FileText className="mr-2 text-primary" size={18} />
                    {t('properties.sidebar.quickStats')}
                </h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('properties.sidebar.monthlyRent')}</span>
                        <span className="text-sm font-semibold text-foreground">{formatCurrency(property.rent_amount, property.rent_currency)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('properties.sidebar.applications')}</span>
                        <span className="flex items-center text-sm font-semibold text-foreground">
                            <Users className="mr-1" size={14} />
                            {tenantCount}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('properties.sidebar.status')}</span>
                        {getStatusBadge()}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-3 flex items-center text-base font-semibold text-foreground">
                    <Settings className="mr-2 text-primary" size={18} />
                    {t('properties.sidebar.actions')}
                </h3>

                <div className="space-y-2">
                    <button
                        onClick={handleEdit}
                        className="flex w-full cursor-pointer items-center rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:scale-105 hover:bg-background"
                    >
                        <Edit className="mr-3" size={16} />
                        {t('properties.sidebar.editProperty')}
                    </button>

                    <button
                        onClick={() => router.visit(route('manager.applications.index', { property: property.id }))}
                        className="flex w-full cursor-pointer items-center rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:scale-105 hover:bg-background"
                    >
                        <Users className="mr-3" size={16} />
                        {t('applications.viewApplications')} ({tenantCount})
                    </button>
                </div>
            </div>

            {/* Application Access */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <h3 className="mb-3 flex items-center text-base font-semibold text-foreground">
                    <Share className="mr-2 text-primary" size={18} />
                    {t('properties.sidebar.applicationAccess')}
                </h3>

                {/* Application Access Toggle */}
                <div className="mb-3 flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                    <div className="flex items-center">
                        <Link2 className="mr-2 text-muted-foreground" size={16} />
                        <span className="text-sm font-medium">{t('properties.sidebar.requireInvite')}</span>
                    </div>
                    <button
                        onClick={handleToggleApplicationAccess}
                        className={`relative h-6 w-11 rounded-full transition-colors ${requiresToken ? 'bg-primary' : 'bg-muted'}`}
                    >
                        <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                requiresToken ? 'right-0.5' : 'left-0.5'
                            }`}
                        />
                    </button>
                </div>

                {requiresToken && (
                    <>
                        <p className="mb-3 text-sm text-muted-foreground">{t('properties.sidebar.inviteRequiredDesc')}</p>

                        {defaultToken && (
                            <div className="space-y-3">
                                {/* Default Token Info */}
                                <div className="rounded-lg border border-border bg-background/30 p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">{t('properties.sidebar.defaultInviteLink')}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {defaultToken.used_count === 1
                                                ? t('properties.sidebar.usedTime', { count: defaultToken.used_count })
                                                : t('properties.sidebar.usedTimes', { count: defaultToken.used_count })}
                                        </span>
                                    </div>
                                </div>

                                {/* Copy Invite Link Button */}
                                <button
                                    onClick={handleCopyLink}
                                    className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-all hover:bg-primary/90"
                                >
                                    {copiedToken ? (
                                        <>
                                            <Check className="mr-2" size={16} />
                                            {t('properties.sidebar.copied')}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2" size={16} />
                                            {t('properties.sidebar.copyInviteLink')}
                                        </>
                                    )}
                                </button>

                                {/* Regenerate Default Token Button */}
                                <button
                                    onClick={handleRegenerateDefaultToken}
                                    disabled={regeneratingToken}
                                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-background disabled:opacity-50"
                                >
                                    <RefreshCw className={`mr-2 ${regeneratingToken ? 'animate-spin' : ''}`} size={16} />
                                    {t('properties.sidebar.regenerateLink')}
                                </button>

                                {/* Manage Custom Tokens Button */}
                                <button
                                    onClick={() => setShowTokensModal(true)}
                                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                                >
                                    <Settings className="mr-2" size={16} />
                                    {t('properties.sidebar.manageCustomLinks')}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!requiresToken && (
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{t('properties.sidebar.publicAccessDesc')}</p>

                        {/* Copy Public Link Button */}
                        <button
                            onClick={handleCopyLink}
                            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-all hover:bg-primary/90"
                        >
                            {copiedToken ? (
                                <>
                                    <Check className="mr-2" size={16} />
                                    {t('properties.sidebar.copied')}
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-2" size={16} />
                                    {t('properties.sidebar.copyLink')}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-destructive/20 bg-card p-4 shadow-sm">
                <h3 className="mb-3 flex items-center text-base font-semibold text-destructive">
                    <Trash2 className="mr-2" size={18} />
                    {t('properties.sidebar.dangerZone')}
                </h3>

                <p className="mb-3 text-sm text-muted-foreground">{t('properties.sidebar.deleteWarning')}</p>

                <button
                    onClick={handleDelete}
                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-destructive bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/20"
                >
                    <Trash2 className="mr-2" size={16} />
                    {t('properties.sidebar.deleteProperty')}
                </button>
            </div>

            {/* Invite Tokens Modal */}
            <InviteTokensModal propertyId={property.id} isOpen={showTokensModal} onClose={() => setShowTokensModal(false)} />
        </div>
    );
}
