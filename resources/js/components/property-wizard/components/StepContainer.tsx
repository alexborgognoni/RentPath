import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StepContainerProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export function StepContainer({ title, description, children, className }: StepContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn('flex flex-1 flex-col', className)}
        >
            {/* Step header */}
            <div className="mb-8 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold text-foreground md:text-3xl"
                >
                    {title}
                </motion.h2>
                {description && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-2 text-muted-foreground">
                        {description}
                    </motion.p>
                )}
            </div>

            {/* Step content */}
            <div className="flex-1">{children}</div>
        </motion.div>
    );
}
