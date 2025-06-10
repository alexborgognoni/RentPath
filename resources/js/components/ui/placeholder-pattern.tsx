import ***REMOVED*** useId ***REMOVED*** from 'react';

interface PlaceholderPatternProps ***REMOVED***
    className?: string;
***REMOVED***

export function PlaceholderPattern(***REMOVED*** className ***REMOVED***: PlaceholderPatternProps) ***REMOVED***
    const patternId = useId();

    return (
        <svg className=***REMOVED***className***REMOVED*** fill="none">
            <defs>
                <pattern id=***REMOVED***patternId***REMOVED*** x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                </pattern>
            </defs>
            <rect stroke="none" fill=***REMOVED***`url(#$***REMOVED***patternId***REMOVED***)`***REMOVED*** width="100%" height="100%"></rect>
        </svg>
    );
***REMOVED***
