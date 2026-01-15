import type { SectionId, SectionStatus } from '@/hooks/use-profile-form';
import { cn } from '@/lib/utils';
import type { TenantProfileTranslations } from '@/types/translations';
import { translate } from '@/utils/translate-utils';
import { motion } from 'framer-motion';
import { Check, Rocket, Target, TrendingUp, Trophy } from 'lucide-react';

interface ProgressMilestone {
    threshold: number;
    labelKey: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<{ className?: string }>;
}

const MILESTONES: ProgressMilestone[] = [
    { threshold: 0, labelKey: 'completeness_meter.getting_started', color: 'text-orange-500', bgColor: 'bg-orange-500', icon: Rocket },
    { threshold: 25, labelKey: 'completeness_meter.making_progress', color: 'text-yellow-500', bgColor: 'bg-yellow-500', icon: TrendingUp },
    { threshold: 50, labelKey: 'completeness_meter.halfway_there', color: 'text-blue-500', bgColor: 'bg-blue-500', icon: Target },
    { threshold: 75, labelKey: 'completeness_meter.almost_done', color: 'text-purple-500', bgColor: 'bg-purple-500', icon: Target },
    { threshold: 100, labelKey: 'completeness_meter.profile_complete', color: 'text-green-500', bgColor: 'bg-green-500', icon: Trophy },
];

interface ProgressRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}

function ProgressRing({ percentage, size = 80, strokeWidth = 6, className }: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    // Find the current milestone for color
    const milestone = [...MILESTONES].reverse().find((m) => percentage >= m.threshold) || MILESTONES[0];

    return (
        <div className={cn('relative', className)} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted" />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className={milestone.color}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
            </svg>
            {/* Center percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{percentage}%</span>
            </div>
        </div>
    );
}

export interface ProfileCompletenessProps {
    completeness: number;
    sections: SectionStatus[];
    nextSuggestion?: string | null;
    onSectionClick?: (sectionId: SectionId) => void;
    translations: TenantProfileTranslations;
    className?: string;
}

export function ProfileCompleteness({ completeness, sections, onSectionClick, translations, className }: ProfileCompletenessProps) {
    const milestone = [...MILESTONES].reverse().find((m) => completeness >= m.threshold) || MILESTONES[0];
    const MilestoneIcon = milestone.icon;

    return (
        <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
            {/* Header with progress ring */}
            <div className="flex items-center gap-4">
                <ProgressRing percentage={completeness} size={80} strokeWidth={6} />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <MilestoneIcon className={cn('h-5 w-5', milestone.color)} />
                        <span className={cn('font-semibold', milestone.color)}>{translate(translations, milestone.labelKey)}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {completeness === 100
                            ? translate(translations, 'completeness_meter.ready_message')
                            : translate(translations, 'completeness_meter.more_to_complete', { percent: 100 - completeness })}
                    </p>
                </div>
            </div>

            {/* Section breakdown */}
            <div className="mt-4 space-y-2">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        type="button"
                        onClick={() => onSectionClick?.(section.id)}
                        className={cn(
                            'flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                            section.isComplete ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-muted/50 text-muted-foreground hover:bg-muted',
                        )}
                    >
                        <span>{section.title}</span>
                        <div className="flex items-center gap-2">
                            {section.isComplete ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <span className="text-xs">
                                    {section.completedFields}/{section.fieldCount}
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

/**
 * Compact version for mobile sticky footer or inline display.
 */
export interface ProfileCompletenessCompactProps {
    completeness: number;
    className?: string;
}

export function ProfileCompletenessCompact({ completeness, className }: ProfileCompletenessCompactProps) {
    const milestone = [...MILESTONES].reverse().find((m) => completeness >= m.threshold) || MILESTONES[0];

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {/* Progress bar */}
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                    className={cn('h-full rounded-full', milestone.bgColor)}
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
            <span className={cn('text-sm font-semibold', milestone.color)}>{completeness}%</span>
        </div>
    );
}
