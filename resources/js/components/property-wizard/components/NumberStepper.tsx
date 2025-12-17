import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label: string;
    icon?: React.ReactNode;
    suffix?: string;
    integerOnly?: boolean;
    error?: string;
}

export function NumberStepper({ value, onChange, min = 0, max = 99, step = 1, label, icon, suffix, integerOnly = false, error }: NumberStepperProps) {
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - step);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + step);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const newValue = integerOnly ? parseInt(rawValue, 10) : parseFloat(rawValue);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    // Prevent invalid characters for integer-only inputs
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (integerOnly && (e.key === '.' || e.key === ',')) {
            e.preventDefault();
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Label with optional icon */}
            <div className={cn('flex items-center gap-2 text-sm font-medium', error ? 'text-destructive' : 'text-foreground')}>
                {icon && <span className={error ? 'text-destructive' : 'text-muted-foreground'}>{icon}</span>}
                <span>{label}</span>
            </div>

            {/* Stepper controls */}
            <div className="flex items-center gap-1">
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all',
                        value <= min
                            ? 'cursor-not-allowed border-border bg-muted text-muted-foreground/40'
                            : error
                              ? 'border-destructive bg-card text-foreground hover:border-destructive hover:bg-destructive hover:text-destructive-foreground'
                              : 'border-border bg-card text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground',
                    )}
                >
                    <Minus className="h-5 w-5" />
                </motion.button>

                <div className="relative">
                    <input
                        type="number"
                        value={value}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        min={min}
                        max={max}
                        step={integerOnly ? 1 : step}
                        aria-invalid={!!error}
                        className={cn(
                            'h-12 w-20 rounded-xl border-2 bg-background text-center text-lg font-semibold text-foreground',
                            'focus:ring-4 focus:outline-none',
                            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                            error
                                ? 'border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive/10'
                                : 'border-border focus:border-primary focus:ring-primary/10',
                        )}
                    />
                    {suffix && (
                        <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>
                    )}
                </div>

                <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all',
                        value >= max
                            ? 'cursor-not-allowed border-border bg-muted text-muted-foreground/40'
                            : error
                              ? 'border-destructive bg-card text-foreground hover:border-destructive hover:bg-destructive hover:text-destructive-foreground'
                              : 'border-border bg-card text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground',
                    )}
                >
                    <Plus className="h-5 w-5" />
                </motion.button>
            </div>

            {/* Error message */}
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
