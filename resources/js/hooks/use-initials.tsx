import ***REMOVED*** useCallback ***REMOVED*** from 'react';

export function useInitials() ***REMOVED***
    return useCallback((fullName: string): string => ***REMOVED***
        const names = fullName.trim().split(' ');

        if (names.length === 0) return '';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `$***REMOVED***firstInitial***REMOVED***$***REMOVED***lastInitial***REMOVED***`.toUpperCase();
***REMOVED***, []);
***REMOVED***
