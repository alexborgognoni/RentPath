import { cn } from '@/lib/utils';
import type { AutosaveStatus } from '@/hooks/use-property-wizard';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SaveStatusProps {
    status: AutosaveStatus;
    lastSavedAt: Date | null;
    onSave?: () => void;
    className?: string;
    /**
     * How long to show "Saved" before auto-hiding (in ms).
     * Set to 0 to never auto-hide.
     * Default: 3000ms (3 seconds)
     */
    autoHideDelay?: number;
}

const statusConfig: Record<AutosaveStatus, {
    icon: React.ElementType;
    text: string;
    className: string;
    animate?: boolean;
}> = {
    idle: {
        icon: Check,
        text: '',
        className: 'text-muted-foreground',
    },
    pending: {
        icon: Loader2,
        text: 'Unsaved',
        className: 'text-warning',
    },
    saving: {
        icon: Loader2,
        text: 'Saving...',
        className: 'text-muted-foreground',
        animate: true,
    },
    saved: {
        icon: Check,
        text: 'Saved',
        className: 'text-success',
    },
    error: {
        icon: AlertCircle,
        text: 'Failed to save',
        className: 'text-destructive',
    },
};

export function SaveStatus({ status, onSave, className, autoHideDelay = 3000 }: SaveStatusProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Control visibility based on status
    useEffect(() => {
        if (status === 'saving') {
            // Show immediately when saving
            setIsVisible(true);
        } else if (status === 'saved') {
            // Keep visible, but start hide timer
            setIsVisible(true);
            if (autoHideDelay > 0) {
                const timer = setTimeout(() => {
                    setIsVisible(false);
                }, autoHideDelay);
                return () => clearTimeout(timer);
            }
        } else if (status === 'error') {
            // Always show errors until resolved
            setIsVisible(true);
        } else {
            // Hide for idle and pending (pending will show briefly during debounce)
            setIsVisible(false);
        }
    }, [status, autoHideDelay]);

    const config = statusConfig[status];
    const Icon = config.icon;
    const showSaveButton = onSave && status === 'error';

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={cn('flex items-center gap-2 text-sm', className)}
                >
                    <div className={cn('flex items-center gap-1.5', config.className)}>
                        <Icon className={cn('h-4 w-4', config.animate && 'animate-spin')} />
                        <span>{config.text}</span>
                    </div>

                    {/* Manual save button for errors */}
                    {showSaveButton && (
                        <button
                            onClick={onSave}
                            className="flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                        >
                            <Save className="h-3 w-3" />
                            Retry
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface SaveStatusCompactProps {
    status: AutosaveStatus;
    className?: string;
}

export function SaveStatusCompact({ status, className }: SaveStatusCompactProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    if (status === 'idle') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={cn('flex items-center gap-1', config.className, className)}
            >
                <Icon className={cn('h-3.5 w-3.5', config.animate && 'animate-spin')} />
            </motion.div>
        </AnimatePresence>
    );
}
