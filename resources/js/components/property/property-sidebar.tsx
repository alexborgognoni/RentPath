import type { Property } from '@/types/dashboard';
import { router } from '@inertiajs/react';
import { Check, Copy, Edit, FileText, Link2, RefreshCw, Settings, Share, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface PropertySidebarProps {
    property: Property;
    tenantCount: number;
}

export function PropertySidebar({ property, tenantCount }: PropertySidebarProps) {
    const [publicAccessEnabled, setPublicAccessEnabled] = useState(property.public_apply_url_enabled || false);
    const [inviteToken, setInviteToken] = useState(property.invite_token || null);
    const [tokenExpiresAt, setTokenExpiresAt] = useState(property.invite_token_expires_at || null);
    const [copiedToken, setCopiedToken] = useState(false);
    const [generatingToken, setGeneratingToken] = useState(false);

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
        router.visit(`/properties/${property.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            router.delete(`/properties/${property.id}`, {
                onSuccess: () => {
                    router.visit('/dashboard');
                },
            });
        }
    };

    const handleTogglePublicAccess = async () => {
        try {
            const response = await fetch(`/properties/${property.id}/toggle-public-access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPublicAccessEnabled(data.public_apply_url_enabled);
            }
        } catch (error) {
            console.error('Failed to toggle public access:', error);
        }
    };

    const handleGenerateToken = async () => {
        setGeneratingToken(true);
        try {
            const response = await fetch(`/properties/${property.id}/invite-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ expiration_days: 30 }),
            });

            if (response.ok) {
                const data = await response.json();
                setInviteToken(data.token);
                setTokenExpiresAt(data.expires_at);
            }
        } catch (error) {
            console.error('Failed to generate token:', error);
        } finally {
            setGeneratingToken(false);
        }
    };

    const handleCopyInviteLink = () => {
        if (inviteToken) {
            const inviteUrl = `${window.location.origin}/property/${property.id}?token=${inviteToken}`;
            navigator.clipboard.writeText(inviteUrl);
            setCopiedToken(true);
            setTimeout(() => setCopiedToken(false), 2000);
        }
    };

    const handleInvalidateToken = async () => {
        if (confirm('Are you sure you want to invalidate the current invite link?')) {
            try {
                const response = await fetch(`/properties/${property.id}/invite-token`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (response.ok) {
                    setInviteToken(null);
                    setTokenExpiresAt(null);
                }
            } catch (error) {
                console.error('Failed to invalidate token:', error);
            }
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

                {/* Public Access Toggle */}
                <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-background/50 p-3">
                    <div className="flex items-center">
                        <Link2 className="mr-2 text-muted-foreground" size={16} />
                        <span className="text-sm font-medium">Public Applications</span>
                    </div>
                    <button
                        onClick={handleTogglePublicAccess}
                        className={`relative h-6 w-11 rounded-full transition-colors ${publicAccessEnabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                        <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                                publicAccessEnabled ? 'right-0.5' : 'left-0.5'
                            }`}
                        />
                    </button>
                </div>

                {!publicAccessEnabled && (
                    <>
                        <p className="mb-4 text-xs text-muted-foreground">
                            Public access is disabled. Generate an invite link to share with specific applicants.
                        </p>

                        {/* Generate/Regenerate Token Button */}
                        <button
                            onClick={handleGenerateToken}
                            disabled={generatingToken}
                            className="mb-3 flex w-full cursor-pointer items-center justify-center rounded-lg border border-border bg-background/50 px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-background disabled:opacity-50"
                        >
                            <RefreshCw className={`mr-2 ${generatingToken ? 'animate-spin' : ''}`} size={16} />
                            {inviteToken ? 'Regenerate Invite Link' : 'Generate Invite Link'}
                        </button>

                        {inviteToken && (
                            <div className="space-y-3">
                                {/* Copy Invite Link Button */}
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
                                            Copy Invite Link
                                        </>
                                    )}
                                </button>

                                {/* Token Expiration Info */}
                                {tokenExpiresAt && (
                                    <p className="text-center text-xs text-muted-foreground">
                                        Expires: {new Date(tokenExpiresAt).toLocaleDateString()}
                                    </p>
                                )}

                                {/* Invalidate Token Button */}
                                <button
                                    onClick={handleInvalidateToken}
                                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive/20"
                                >
                                    <Trash2 className="mr-2" size={14} />
                                    Invalidate Link
                                </button>
                            </div>
                        )}
                    </>
                )}

                {publicAccessEnabled && (
                    <p className="text-xs text-muted-foreground">Anyone with the property link can apply. No invite token needed.</p>
                )}
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
        </div>
    );
}
