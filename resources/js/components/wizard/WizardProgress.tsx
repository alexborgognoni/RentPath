import type { WizardStepConfig } from '@/hooks/useWizard';
import { cn } from '@/lib/utils';
import type { SharedData } from '@/types';
import { translate } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

interface WizardProgressProps<TStepId extends string> {
    steps: WizardStepConfig<TStepId>[];
    currentStep: TStepId;
    currentStepIndex: number;
    maxStepReached: number;
    onStepClick?: (step: TStepId) => void;
    canGoToStep: (step: TStepId) => boolean;
}

export function WizardProgress<TStepId extends string>({
    steps,
    currentStep,
    currentStepIndex,
    maxStepReached,
    onStepClick,
    canGoToStep,
}: WizardProgressProps<TStepId>) {
    const { translations } = usePage<SharedData>().props;
    const t = (key: string, params?: Record<string, string | number>) => translate(translations, key, params);

    // Safety bounds check for step index
    const safeStepIndex = Math.max(0, Math.min(currentStepIndex, steps.length - 1));
    const currentStepConfig = steps[safeStepIndex];

    return (
        <div className="w-full">
            {/* Mobile: Simple progress bar with step counter */}
            <div className="md:hidden">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                        {t('wizard.progress.stepOf', { current: safeStepIndex + 1, total: steps.length })}
                    </span>
                    <span className="text-muted-foreground">{currentStepConfig?.shortTitle}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                        initial={{ width: 0 }}
                        animate={{ width: `${((safeStepIndex + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Desktop: Full step indicator with Flexbox */}
            <div className="hidden md:block">
                <div className="relative flex">
                    {/* Connector line - spans from center of first step to center of last step */}
                    <div
                        className="pointer-events-none absolute top-5 h-0.5"
                        style={{
                            left: `calc(100% / ${steps.length} / 2)`,
                            right: `calc(100% / ${steps.length} / 2)`,
                        }}
                    >
                        {/* Background track */}
                        <div className="absolute inset-0 rounded-full bg-muted-foreground/20" />
                        {/* Completed portion - colored to max step reached */}
                        <div
                            className="absolute top-0 bottom-0 left-0 rounded-full bg-primary transition-all duration-300"
                            style={{
                                width: maxStepReached > 0 ? `${(Math.min(maxStepReached, steps.length - 1) / (steps.length - 1)) * 100}%` : '0%',
                            }}
                        />
                    </div>

                    {/* Step circles - each takes equal width, content centered */}
                    {steps.map((step, index) => {
                        const isCurrent = step.id === currentStep;
                        const isCompleted = index < maxStepReached;
                        const isClickable = canGoToStep(step.id) && !isCurrent;
                        const isLocked = index > maxStepReached;

                        return (
                            <button
                                key={step.id}
                                onClick={() => isClickable && onStepClick?.(step.id)}
                                disabled={!isClickable}
                                className={cn(
                                    'group relative z-10 flex flex-1 flex-col items-center gap-2 transition-all',
                                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed',
                                )}
                            >
                                {/* Circle - all states need solid opaque backgrounds to hide connector line */}
                                <div
                                    className={cn(
                                        'relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200',
                                        isCurrent && 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25',
                                        isCompleted && !isCurrent && 'border-primary bg-primary text-primary-foreground',
                                        isLocked && 'border-muted-foreground/20 bg-muted text-muted-foreground/50',
                                        !isCurrent && !isCompleted && !isLocked && 'border-muted-foreground/30 bg-card text-muted-foreground',
                                        isClickable && 'group-hover:border-primary/50 group-hover:text-primary',
                                    )}
                                >
                                    {isLocked ? (
                                        <Lock className="h-4 w-4" />
                                    ) : isCompleted && !isCurrent ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                    {/* Active pulse */}
                                    {isCurrent && <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />}
                                </div>

                                {/* Label */}
                                <span
                                    className={cn(
                                        'text-xs font-medium transition-colors',
                                        isCurrent && 'text-primary',
                                        isCompleted && !isCurrent && 'text-foreground',
                                        isLocked && 'text-muted-foreground/50',
                                        !isCurrent && !isCompleted && !isLocked && 'text-muted-foreground',
                                    )}
                                >
                                    {step.shortTitle}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
