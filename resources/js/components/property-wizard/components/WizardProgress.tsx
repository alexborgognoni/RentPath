import type { WizardStep, WizardStepConfig } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface WizardProgressProps {
    steps: WizardStepConfig[];
    currentStep: WizardStep;
    completedSteps: Set<WizardStep>;
    onStepClick?: (step: WizardStep) => void;
    canGoToStep: (step: WizardStep) => boolean;
}

export function WizardProgress({ steps, currentStep, completedSteps, onStepClick, canGoToStep }: WizardProgressProps) {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    return (
        <div className="w-full">
            {/* Mobile: Simple progress bar with step counter */}
            <div className="md:hidden">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                        Step {currentIndex + 1} of {steps.length}
                    </span>
                    <span className="text-muted-foreground">{steps[currentIndex].shortTitle}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Desktop: Full step indicator */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const isCompleted = completedSteps.has(step.id);
                        const isCurrent = step.id === currentStep;
                        const isClickable = canGoToStep(step.id);
                        const isPast = index < currentIndex;

                        return (
                            <div key={step.id} className="flex flex-1 items-center">
                                {/* Step circle and label */}
                                <button
                                    onClick={() => isClickable && onStepClick?.(step.id)}
                                    disabled={!isClickable}
                                    className={cn(
                                        'group flex flex-col items-center gap-2 transition-all',
                                        isClickable ? 'cursor-pointer' : 'cursor-not-allowed',
                                    )}
                                >
                                    {/* Circle */}
                                    <div
                                        className={cn(
                                            'relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200',
                                            isCurrent && 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25',
                                            isCompleted && !isCurrent && 'border-primary bg-primary text-primary-foreground',
                                            !isCurrent && !isCompleted && 'border-muted-foreground/30 bg-background text-muted-foreground',
                                            isClickable && !isCurrent && 'group-hover:border-primary/50 group-hover:text-primary',
                                        )}
                                    >
                                        {isCompleted && !isCurrent ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                                        {/* Active pulse */}
                                        {isCurrent && <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />}
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={cn(
                                            'text-xs font-medium transition-colors',
                                            isCurrent && 'text-primary',
                                            isCompleted && !isCurrent && 'text-foreground',
                                            !isCurrent && !isCompleted && 'text-muted-foreground',
                                            step.optional && 'italic',
                                        )}
                                    >
                                        {step.shortTitle}
                                        {step.optional && <span className="ml-1 text-muted-foreground">(opt)</span>}
                                    </span>
                                </button>

                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div className="mx-2 h-0.5 flex-1">
                                        <div
                                            className={cn(
                                                'h-full rounded-full transition-colors duration-300',
                                                isPast || isCompleted ? 'bg-primary' : 'bg-muted-foreground/20',
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
