import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TenantProfileTranslations } from '@/types/translations';
import { translate } from '@/utils/translate-utils';
import { router } from '@inertiajs/react';
import { AlertTriangle, ExternalLink, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PrivacyDataCardProps {
    translations: TenantProfileTranslations;
    onDataCleared?: () => void;
    className?: string;
}

interface ClearDataConfirmationPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isClearing: boolean;
    translations: TenantProfileTranslations;
}

function ClearDataConfirmationPopover({ isOpen, onClose, onConfirm, isClearing, translations }: ClearDataConfirmationPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isClearing) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, isClearing]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isClearing) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const portalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={handleOverlayClick}>
            {/* Background overlay with blur and darkening */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            {/* Popover content */}
            <div
                ref={popoverRef}
                className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl duration-200 animate-in fade-in-0 zoom-in-95"
            >
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{translate(translations, 'privacy.clearConfirmation.title')}</h3>
                        <p className="mb-4 text-sm text-muted-foreground">{translate(translations, 'privacy.clearConfirmation.message')}</p>
                        <ul className="mb-6 space-y-1 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                {translate(translations, 'privacy.clearConfirmation.warning1')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                {translate(translations, 'privacy.clearConfirmation.warning2')}
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                {translate(translations, 'privacy.clearConfirmation.warning3')}
                            </li>
                        </ul>

                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose} disabled={isClearing} className="cursor-pointer px-4 py-2">
                                {translate(translations, 'privacy.clearConfirmation.cancel')}
                            </Button>
                            <Button variant="destructive" onClick={onConfirm} disabled={isClearing} className="cursor-pointer px-4 py-2">
                                {isClearing
                                    ? translate(translations, 'privacy.clearConfirmation.clearing')
                                    : translate(translations, 'privacy.clearConfirmation.confirm')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(portalContent, document.body);
}

export function PrivacyDataCard({ translations, onDataCleared, className }: PrivacyDataCardProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleClearData = useCallback(() => {
        setIsClearing(true);
        router.delete('/tenant-profile/clear-all', {
            preserveScroll: false,
            onSuccess: () => {
                setShowConfirmation(false);
                setIsClearing(false);
                onDataCleared?.();
                // Force reload to refresh all page data and form state
                router.reload({ only: ['profile', 'hasProfile', 'completeness', 'documents', 'profileDocuments'] });
            },
            onError: () => {
                console.error('Failed to clear data');
                setIsClearing(false);
            },
        });
    }, [onDataCleared]);

    return (
        <>
            <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
                {/* Header */}
                <div>
                    <h3 className="font-semibold text-foreground">{translate(translations, 'privacy.title')}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{translate(translations, 'privacy.description')}</p>
                </div>

                {/* Actions */}
                <div className="mt-4 border-t border-border pt-4">
                    <div className="space-y-3">
                        <Button
                            variant="destructive"
                            size="default"
                            onClick={() => setShowConfirmation(true)}
                            className="w-full cursor-pointer gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            {translate(translations, 'privacy.clearAllData')}
                        </Button>

                        <div className="flex justify-center">
                            <a
                                href="/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {translate(translations, 'privacy.privacyPolicy')}
                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <ClearDataConfirmationPopover
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleClearData}
                isClearing={isClearing}
                translations={translations}
            />
        </>
    );
}
