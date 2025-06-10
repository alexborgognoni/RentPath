import ***REMOVED*** useCallback ***REMOVED*** from 'react';

export function useMobileNavigation() ***REMOVED***
    return useCallback(() => ***REMOVED***
        // Remove pointer-events style from body...
        document.body.style.removeProperty('pointer-events');
***REMOVED***, []);
***REMOVED***
