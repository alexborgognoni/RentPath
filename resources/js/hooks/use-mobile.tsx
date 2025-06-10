import ***REMOVED*** useEffect, useState ***REMOVED*** from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() ***REMOVED***
    const [isMobile, setIsMobile] = useState<boolean>();

    useEffect(() => ***REMOVED***
        const mql = window.matchMedia(`(max-width: $***REMOVED***MOBILE_BREAKPOINT - 1***REMOVED***px)`);

        const onChange = () => ***REMOVED***
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    ***REMOVED***;

        mql.addEventListener('change', onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

        return () => mql.removeEventListener('change', onChange);
***REMOVED***, []);

    return !!isMobile;
***REMOVED***
