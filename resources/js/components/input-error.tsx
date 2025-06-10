import ***REMOVED*** cn ***REMOVED*** from '@/lib/utils';
import ***REMOVED*** type HTMLAttributes ***REMOVED*** from 'react';

export default function InputError(***REMOVED*** message, className = '', ...props ***REMOVED***: HTMLAttributes<HTMLParagraphElement> & ***REMOVED*** message?: string ***REMOVED***) ***REMOVED***
    return message ? (
        <p ***REMOVED***...props***REMOVED*** className=***REMOVED***cn('text-sm text-red-600 dark:text-red-400', className)***REMOVED***>
            ***REMOVED***message***REMOVED***
        </p>
    ) : null;
***REMOVED***
