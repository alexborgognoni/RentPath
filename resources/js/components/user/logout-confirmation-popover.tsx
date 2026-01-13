import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { route } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { router, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface LogoutConfirmationPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
}

export function LogoutConfirmationPopover({ isOpen, onClose, onConfirm }: LogoutConfirmationPopoverProps) {
    const { translations } = usePage<SharedData>().props;
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
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
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleLogout = () => {
        onConfirm?.();
        router.post(route('logout'));
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
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{t(translations.layout.header, 'logoutConfirmation.title')}</h3>
                        <p className="mb-6 text-sm text-muted-foreground">{t(translations.layout.header, 'logoutConfirmation.message')}</p>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={onClose} className="cursor-pointer px-4 py-2">
                                {t(translations.layout.header, 'logoutConfirmation.cancel')}
                            </Button>
                            <Button variant="destructive" onClick={handleLogout} className="cursor-pointer px-4 py-2">
                                {t(translations.layout.header, 'logoutConfirmation.confirm')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(portalContent, document.body);
}
