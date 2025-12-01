import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
    onBack?: () => void;
    onNext?: () => void;
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
    const handleNext = () => {
        if (isLastStep && onSubmit) {
            onSubmit();
        } else if (onNext) {
            onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between border-t border-border bg-card/50 px-6 py-4 backdrop-blur-sm"
        >
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
            </div>
        </motion.div>
    );
}
