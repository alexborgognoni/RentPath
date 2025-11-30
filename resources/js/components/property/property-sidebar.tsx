import type { Property } from '@/types/dashboard';
import { copyToClipboard } from '@/utils/clipboard';
import { route } from '@/utils/route';
import { router } from '@inertiajs/react';
import { Check, Copy, Edit, FileText, Link2, RefreshCw, Settings, Share, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { InviteTokensModal } from './invite-tokens-modal';

interface PropertySidebarProps {
    property: Property;
    tenantCount: number;
}

export function PropertySidebar({ property, tenantCount }: PropertySidebarProps) {
    const [requiresInvite, setRequiresInvite] = useState(property.requires_invite ?? true);
    const [defaultToken, setDefaultToken] = useState<{ token: string; used_count: number } | null>(property.default_token || null);
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
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            router.delete(route('properties.destroy', { property: property.id }), {
                onSuccess: () => {
                    router.visit(route('manager.properties.index'));
                },
            });
        }
    };

    const handleTogglePublicAccess = async () => {
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
                setRequiresInvite(data.requires_invite);

                // If enabling and default token was created/returned, update state
                if (data.default_token) {
                    setDefaultToken({
                        token: data.default_token.token,
                        used_count: data.default_token.used_count,
                    });
                } else {
                    setDefaultToken(null);
                }
            }
        } catch (error) {
            console.error('Failed to toggle invite requirement:', error);
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
                });
            }
        } catch (error) {
            console.error('Failed to regenerate token:', error);
        } finally {
            setRegeneratingToken(false);
        }
    };

    const handleCopyInviteLink = async () => {
        if (!defaultToken?.token) {
            return;
        }

        const rootDomain = window.location.origin.replace('manager.', '');
        const inviteUrl = `${rootDomain}/properties/${property.id}?token=${defaultToken.token}`;

        const success = await copyToClipboard(inviteUrl);
        if (success) {
            setCopiedToken(true);
            setTimeout(() => setCopiedToken(false), 2000);
        }
    };

    const getStatusBadge = () => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            inactive: {
                label: 'Inactive',
                className: 'bg-muted/50 text-muted-foreground',
            },
            available: {
                label: 'Available',
                className: 'bg-success/10 text-success',
            },
            application_received: {
                label: 'Applications',
                className: 'bg-blue-500/10 text-blue-400',
            },
            under_review: {
                label: 'Under Review',
                className: 'bg-amber-500/10 text-amber-400',
            },
            visit_scheduled: {
                label: 'Visit Scheduled',
                className: 'bg-purple-500/10 text-purple-400',
            },
            approved: {
                label: 'Approved',
                className: 'bg-emerald-500/10 text-emerald-400',
            },
            leased: {
                label: 'Leased',
                className: 'bg-cyan-500/10 text-cyan-400',
            },
            maintenance: {
                label: 'Maintenance',
                className: 'bg-orange-500/10 text-orange-400',
            },
            archived: {
                label: 'Archived',
                className: 'bg-muted/50 text-muted-foreground',
            },
        };

        const config = statusConfig[property.status] || statusConfig.inactive;

        return <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>{config.label}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <FileText className="mr-2 text-primary" size={20} />
                    Quick Stats
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monthly Rent</span>
                        <span className="font-semibold text-foreground">{formatCurrency(property.rent_amount, property.rent_currency)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Applications</span>
                        <span className="flex items-center font-semibold text-foreground">
                            <Users className="mr-1" size={16} />
                            {tenantCount}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        {getStatusBadge()}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <Settings className="mr-2 text-primary" size={20} />
                    Actions
                </h3>

                <div className="space-y-3">
                    <button
                        onClick={handleEdit}
                        className="flex w-full cursor-pointer items-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:scale-105 hover:bg-background"
                    >
                        <Edit className="mr-3" size={16} />
                        Edit Property
                    </button>
                </div>
            </div>

            {/* Application Access */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-foreground">
                    <Share className="mr-2 text-primary" size={20} />
                    Application Access
                </h3>

                {/* Invite Requirement Toggle */}
                <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                    <div className="flex items-center">
                        <Link2 className="mr-2 text-muted-foreground" size={16} />
                        <span className="text-sm font-medium">Require Invite</span>
                    </div>
                    <button
                        onClick={handleTogglePublicAccess}
                        className={`relative h-6 w-11 rounded-full transition-colors ${requiresInvite ? 'bg-primary' : 'bg-muted'}`}
                    >
                        <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                requiresInvite ? 'right-0.5' : 'left-0.5'
                            }`}
                        />
                    </button>
                </div>

                {requiresInvite && (
                    <>
                        <p className="mb-4 text-xs text-muted-foreground">
                            Invite required. Share the default invite link or create custom links with specific restrictions.
                        </p>

                        {defaultToken && (
                            <div className="space-y-3">
                                {/* Default Token Info */}
                                <div className="rounded-lg border border-border bg-background/30 p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-muted-foreground">Default Invite Link</span>
                                        <span className="text-xs text-muted-foreground">
                                            Used {defaultToken.used_count} {defaultToken.used_count === 1 ? 'time' : 'times'}
                                        </span>
                                    </div>
                                </div>

                                {/* Copy Default Invite Link Button */}
                                <button
                                    onClick={handleCopyInviteLink}
                                    className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-all hover:bg-primary/90"
                                >
                                    {copiedToken ? (
                                        <>
                                            <Check className="mr-2" size={16} />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="mr-2" size={16} />
                                            Copy Default Link
                                        </>
                                    )}
                                </button>

                                {/* Regenerate Default Token Button */}
                                <button
                                    onClick={handleRegenerateDefaultToken}
                                    disabled={regeneratingToken}
                                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-border bg-background/50 px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-background disabled:opacity-50"
                                >
                                    <RefreshCw className={`mr-2 ${regeneratingToken ? 'animate-spin' : ''}`} size={14} />
                                    Regenerate Default Link
                                </button>

                                {/* Manage Custom Tokens Button */}
                                <button
                                    onClick={() => setShowTokensModal(true)}
                                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-all hover:bg-primary/20"
                                >
                                    <Settings className="mr-2" size={14} />
                                    Manage Custom Invite Links
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!requiresInvite && <p className="text-xs text-muted-foreground">Anyone with the property link can apply. No invite token needed.</p>}
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-destructive">
                    <Trash2 className="mr-2" size={20} />
                    Danger Zone
                </h3>

                <p className="mb-4 text-sm text-muted-foreground">Deleting this property will permanently remove all associated data.</p>

                <button
                    onClick={handleDelete}
                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition-all hover:bg-destructive/20"
                >
                    <Trash2 className="mr-2" size={16} />
                    Delete Property
                </button>
            </div>

            {/* Invite Tokens Modal */}
            <InviteTokensModal propertyId={property.id} isOpen={showTokensModal} onClose={() => setShowTokensModal(false)} />
        </div>
    );
}
