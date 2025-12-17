import { Button } from '@/components/ui/button';
import { motion, useAnimation } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useCallback } from 'react';

interface WizardNavigationProps {
    onBack?: () => void;
    onNext?: () => boolean; // Returns true if validation passed, false otherwise
    onSkip?: () => void;
    onSubmit?: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    isSubmitting?: boolean;
    nextLabel?: string;
    backLabel?: string;
    showSkip?: boolean;
    skipLabel?: string;
}

export function WizardNavigation({
    onBack,
    onNext,
    onSkip,
    onSubmit,
    isFirstStep,
    isLastStep,
    isSubmitting = false,
    nextLabel,
    backLabel = 'Back',
    showSkip = false,
    skipLabel = 'Skip for now',
}: WizardNavigationProps) {
    const shakeAnimation = useAnimation();

    const scrollToFirstError = useCallback(() => {
        // Small delay to ensure errors are rendered in DOM
        setTimeout(() => {
            const firstInvalidField = document.querySelector('[aria-invalid="true"]');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus the field if it's focusable
                if (firstInvalidField instanceof HTMLElement) {
                    firstInvalidField.focus({ preventScroll: true });
                }
            }
        }, 50);
    }, []);

    const triggerShake = useCallback(async () => {
        await shakeAnimation.start({
            x: [0, -8, 8, -8, 8, -4, 4, 0],
            transition: { duration: 0.4, ease: 'easeInOut' },
        });
    }, [shakeAnimation]);

    const handleNext = useCallback(() => {
        if (isLastStep && onSubmit) {
            onSubmit();
        } else if (onNext) {
            const success = onNext();
            if (!success) {
                triggerShake();
                scrollToFirstError();
            }
        }
    }, [isLastStep, onSubmit, onNext, triggerShake, scrollToFirstError]);

    return (
        <div className="flex items-center justify-between rounded-b-2xl border-t border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
            {/* Left side: Back button */}
            <div>
                {!isFirstStep && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Button>
                )}
            </div>

            {/* Right side: Skip and Next/Submit */}
            <div className="flex items-center gap-3">
                {showSkip && onSkip && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onSkip}
                        disabled={isSubmitting}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        {skipLabel}
                    </Button>
                )}

                <motion.div animate={shakeAnimation}>
                    <Button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="min-w-[140px] gap-2 bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                {nextLabel || (isLastStep ? 'Publish Listing' : 'Continue')}
                                {!isLastStep && <ArrowRight className="h-4 w-4" />}
                            </>
                        )}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
