import ***REMOVED*** cn ***REMOVED*** from '@/lib/utils';
import ***REMOVED*** Link ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** ComponentProps ***REMOVED*** from 'react';

type LinkProps = ComponentProps<typeof Link>;

export default function TextLink(***REMOVED*** className = '', children, ...props ***REMOVED***: LinkProps) ***REMOVED***
    return (
        <Link
            className=***REMOVED***cn(
                'text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500',
                className,
            )***REMOVED***
            ***REMOVED***...props***REMOVED***
        >
            ***REMOVED***children***REMOVED***
        </Link>
    );
***REMOVED***
