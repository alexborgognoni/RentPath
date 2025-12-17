import type { SharedData } from '@/types';
import { copyToClipboard } from '@/utils/clipboard';
import { getRootDomainUrl, route } from '@/utils/route';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Check, Copy, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CreateTokenForm } from './create-token-form';

interface InviteToken {
    id: number;
    name: string | null;
    token: string;
    type: 'private' | 'invite';
    email: string | null;
    max_uses: number | null;
    used_count: number;
    expires_at: string | null;
}

interface InviteTokensModalProps {
    propertyId: number;
    isOpen: boolean;
    onClose: () => void;
}

export function InviteTokensModal({ propertyId, isOpen, onClose }: InviteTokensModalProps) {
    const { appUrlScheme, appDomain, appPort, translations } = usePage<SharedData>().props;
    const t = (key: string) => translate(translations, key);
    const [tokens, setTokens] = useState<InviteToken[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedTokenId, setCopiedTokenId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTokens();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, propertyId]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const fetchTokens = async () => {
        setLoading(true);
        try {
            const response = await fetch(route('properties.getInviteTokens', { property: propertyId }));
            if (response.ok) {
                const data = await response.json();
                // Exclude default token from the list
                setTokens(data.tokens.filter((t: InviteToken) => t.name !== 'Default'));
            }
        } catch (error) {
            console.error('Failed to fetch tokens:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyToken = async (token: InviteToken) => {
        const rootDomain = getRootDomainUrl(appUrlScheme, appDomain, appPort);
        const inviteUrl = `${rootDomain}/properties/${propertyId}?token=${token.token}`;

        const success = await copyToClipboard(inviteUrl);
        if (success) {
            setCopiedTokenId(token.id);
            setTimeout(() => setCopiedTokenId(null), 2000);
        }
    };

    const handleDeleteToken = async (tokenId: number, skipConfirmation = false) => {
        if (!skipConfirmation && !confirm(t('properties.inviteTokens.deleteConfirm'))) {
            return;
        }

        try {
            const response = await fetch(route('properties.deleteCustomToken', { property: propertyId, tokenId }), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setTokens(tokens.filter((t) => t.id !== tokenId));
            }
        } catch (error) {
            console.error('Failed to delete token:', error);
        }
    };

    const formatExpiry = (expiresAt: string | null) => {
        if (!expiresAt) return t('properties.inviteTokens.never');
        const date = new Date(expiresAt);
        const now = new Date();
        if (date < now) return t('properties.inviteTokens.expired');
        return date.toLocaleDateString();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-6">
                    <h2 className="text-xl font-semibold text-foreground">{t('properties.inviteTokens.title')}</h2>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="animate-spin text-muted-foreground" size={24} />
                        </div>
                    ) : (
                        <>
                            {/* Create Form */}
                            {showCreateForm ? (
                                <div className="mb-4">
                                    <CreateTokenForm
                                        propertyId={propertyId}
                                        onSuccess={() => {
                                            setShowCreateForm(false);
                                            fetchTokens();
                                        }}
                                        onCancel={() => setShowCreateForm(false)}
                                    />
                                </div>
                            ) : (
                                /* Create Button */
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                                >
                                    <Plus className="mr-2" size={16} />
                                    {t('properties.inviteTokens.createCustomLink')}
                                </button>
                            )}

                            {/* Tokens List */}
                            {tokens.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-muted-foreground">{t('properties.inviteTokens.noCustomLinks')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tokens.map((token) => {
                                        const isExpired = token.expires_at && new Date(token.expires_at) < new Date();
                                        const isMaxedOut = token.max_uses !== null && token.used_count >= token.max_uses;
                                        const isInactive = isExpired || isMaxedOut;

                                        if (isInactive) {
                                            // Dedicated layout for expired/invalid tokens
                                            return (
                                                <div key={token.id} className="rounded-lg border border-border bg-background/50 p-4">
                                                    <div className="mb-3 flex items-start justify-between">
                                                        <div className="opacity-50">
                                                            <h3 className="font-medium text-foreground">
                                                                {token.name || t('properties.inviteTokens.unnamedLink')}
                                                            </h3>
                                                            {token.type === 'invite' && token.email && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {t('properties.inviteTokens.email')}: {token.email}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="rounded-full bg-destructive/20 px-2 py-1 text-xs font-medium text-destructive">
                                                            {isExpired
                                                                ? t('properties.inviteTokens.expired')
                                                                : t('properties.inviteTokens.maxUsesReached')}
                                                        </span>
                                                    </div>

                                                    <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground opacity-50">
                                                        <span>
                                                            {t('properties.inviteTokens.used')}: {token.used_count}
                                                            {token.max_uses !== null
                                                                ? ` / ${token.max_uses}`
                                                                : ` (${t('properties.inviteTokens.unlimited')})`}
                                                        </span>
                                                        <span>
                                                            {t('properties.inviteTokens.expires')}: {formatExpiry(token.expires_at)}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDeleteToken(token.id, true)}
                                                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-destructive/50 bg-destructive/15 px-3 py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive/25"
                                                    >
                                                        <Trash2 size={14} />
                                                        {t('properties.inviteTokens.deleteExpiredLink')}
                                                    </button>
                                                </div>
                                            );
                                        }

                                        // Active token layout
                                        return (
                                            <div key={token.id} className="rounded-lg border border-border bg-background/50 p-4">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-foreground">
                                                            {token.name || t('properties.inviteTokens.unnamedLink')}
                                                        </h3>
                                                        {token.type === 'invite' && token.email && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {t('properties.inviteTokens.email')}: {token.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>
                                                        {t('properties.inviteTokens.used')}: {token.used_count}
                                                        {token.max_uses !== null
                                                            ? ` / ${token.max_uses}`
                                                            : ` (${t('properties.inviteTokens.unlimited')})`}
                                                    </span>
                                                    <span>
                                                        {t('properties.inviteTokens.expires')}: {formatExpiry(token.expires_at)}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleCopyToken(token)}
                                                        className="flex flex-1 cursor-pointer items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-all hover:bg-primary/90"
                                                    >
                                                        {copiedTokenId === token.id ? (
                                                            <>
                                                                <Check className="mr-1" size={14} />
                                                                {t('properties.sidebar.copied')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="mr-1" size={14} />
                                                                {t('properties.sidebar.copyLink')}
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteToken(token.id)}
                                                        className="cursor-pointer rounded-lg border border-destructive/50 bg-destructive/15 px-3 py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive/25"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-border p-6">
                    <button
                        onClick={onClose}
                        className="w-full cursor-pointer rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-background/80"
                    >
                        {t('properties.inviteTokens.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
