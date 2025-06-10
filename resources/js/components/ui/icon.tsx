import ***REMOVED*** LucideIcon ***REMOVED*** from 'lucide-react';

interface IconProps ***REMOVED***
    iconNode?: LucideIcon | null;
    className?: string;
***REMOVED***

export function Icon(***REMOVED*** iconNode: IconComponent, className ***REMOVED***: IconProps) ***REMOVED***
    if (!IconComponent) ***REMOVED***
        return null;
***REMOVED***

    return <IconComponent className=***REMOVED***className***REMOVED*** />;
***REMOVED***
