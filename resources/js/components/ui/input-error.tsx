import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export function InputError({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p {...props} className={cn('text-sm text-error', className)}>
            {message}
        </p>
    ) : null;
}
