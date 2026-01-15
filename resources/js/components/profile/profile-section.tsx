import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SaveStatusCompact } from '@/components/ui/save-status';
import type { AutosaveStatus, SectionId } from '@/hooks/use-profile-form';
import { cn } from '@/lib/utils';
import type { TenantProfileTranslations } from '@/types/translations';
import { translate } from '@/utils/translate-utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ProfileSectionProps {
    id: SectionId;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    isComplete: boolean;
    isRequired?: boolean;
    isExpanded: boolean;
    onToggle: () => void;
    children: ReactNode;
    // Optional save status display in header
    autosaveStatus?: AutosaveStatus;
    translations: TenantProfileTranslations;
    className?: string;
}

export function ProfileSection({
    title,
    icon: Icon,
    isComplete,
    isRequired = true,
    isExpanded,
    onToggle,
    children,
    autosaveStatus,
    translations,
    className,
}: ProfileSectionProps) {
    return (
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
            <div className={cn('rounded-xl border border-border bg-card', className)}>
                {/* Section Header */}
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            'flex w-full cursor-pointer items-center justify-between p-4 text-left transition-colors hover:bg-muted/50',
                            isExpanded ? 'rounded-t-xl' : 'rounded-xl',
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-lg',
                                    isComplete ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground',
                                )}
                            >
                                {isComplete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                            </div>
                            <div>
                                <h3 className="font-semibold">{title}</h3>
                                <div className="flex items-center gap-2">
                                    {isComplete ? (
                                        <span className="text-xs text-green-600">{translate(translations, 'edit.complete')}</span>
                                    ) : isRequired ? (
                                        <span className="text-xs text-muted-foreground">{translate(translations, 'edit.incomplete')}</span>
                                    ) : (
                                        <Badge variant="secondary" className="text-xs">
                                            {translate(translations, 'edit.optional')}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Autosave status indicator */}
                            {autosaveStatus && <SaveStatusCompact status={autosaveStatus} />}

                            {/* Chevron */}
                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            </motion.div>
                        </div>
                    </button>
                </CollapsibleTrigger>

                {/* Section Content */}
                <CollapsibleContent forceMount>
                    <AnimatePresence initial={false}>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="border-t border-border p-4">{children}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}
