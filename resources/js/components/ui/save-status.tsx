import { cn } from '@/lib/utils';
import type { AutosaveStatus } from '@/hooks/useAutosave';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Cloud, Loader2 } from 'lucide-react';

interface SaveStatusProps {
    status: AutosaveStatus;
    lastSavedAt: Date | null;
    className?: string;
}

function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 5) return 'just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return date.toLocaleDateString();
}

const statusConfig: Record<AutosaveStatus, {
    icon: React.ElementType;
    text: string;
    className: string;
    animate?: boolean;
}> = {
    idle: {
        icon: Cloud,
        text: 'Draft',
        className: 'text-muted-foreground',
    },
    pending: {
        icon: Cloud,
        text: 'Unsaved changes',
        className: 'text-amber-500',
    },
    saving: {
        icon: Loader2,
        text: 'Saving...',
        className: 'text-primary',
        animate: true,
    },
    saved: {
        icon: Check,
        text: 'Saved',
        className: 'text-emerald-500',
    },
    error: {
        icon: AlertCircle,
        text: 'Failed to save',
        className: 'text-destructive',
    },
};

export function SaveStatus({ status, lastSavedAt, className }: SaveStatusProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <div className={cn('flex items-center gap-1.5 text-sm', className)}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className={cn('flex items-center gap-1.5', config.className)}
                >
                    <Icon className={cn('h-4 w-4', config.animate && 'animate-spin')} />
                    <span>
                        {config.text}
                        {status === 'saved' && lastSavedAt && (
                            <span className="text-muted-foreground"> · {formatRelativeTime(lastSavedAt)}</span>
                        )}
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
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
