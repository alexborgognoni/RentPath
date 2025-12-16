import type { WizardStep, WizardStepConfig } from '@/hooks/usePropertyWizard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

interface WizardProgressProps {
    steps: WizardStepConfig[];
    currentStep: WizardStep;
    currentStepIndex: number;
    maxStepReached: number;
    onStepClick?: (step: WizardStep) => void;
    canGoToStep: (step: WizardStep) => boolean;
}

export function WizardProgress({ steps, currentStep, currentStepIndex, maxStepReached, onStepClick, canGoToStep }: WizardProgressProps) {
    return (
        <div className="w-full">
            {/* Mobile: Simple progress bar with step counter */}
            <div className="md:hidden">
                <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                        Step {currentStepIndex + 1} of {steps.length}
                    </span>
                    <span className="text-muted-foreground">{steps[currentStepIndex].shortTitle}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Desktop: Full step indicator */}
            <div className="hidden md:block">
                <div className="relative flex w-full items-start justify-between">
                    {/* Connector lines layer - positioned behind circles */}
                    <div
                        className="pointer-events-none absolute top-5 right-0 left-0 flex items-center"
                        style={{ paddingLeft: '20px', paddingRight: '20px' }}
                    >
                        {steps.slice(0, -1).map((step, index) => {
                            const isCompleted = index < currentStepIndex;
                            return (
                                <div key={`connector-${step.id}`} className="h-0.5 flex-1">
                                    <div
                                        className={cn(
                                            'h-full rounded-full transition-colors duration-300',
                                            isCompleted ? 'bg-primary' : 'bg-muted-foreground/20',
                                        )}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Step circles */}
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
                                    'group relative z-10 flex flex-col items-center gap-2 transition-all',
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
                                        step.optional && 'italic',
                                    )}
                                >
                                    {step.shortTitle}
                                    {step.optional && <span className="ml-1 text-muted-foreground">(opt)</span>}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
