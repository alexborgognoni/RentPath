import ***REMOVED*** cn ***REMOVED*** from '@/lib/utils';
import ***REMOVED*** type LucideProps ***REMOVED*** from 'lucide-react';
import ***REMOVED*** type ComponentType ***REMOVED*** from 'react';

interface IconProps extends Omit<LucideProps, 'ref'> ***REMOVED***
    iconNode: ComponentType<LucideProps>;
***REMOVED***

export function Icon(***REMOVED*** iconNode: IconComponent, className, ...props ***REMOVED***: IconProps) ***REMOVED***
    return <IconComponent className=***REMOVED***cn('h-4 w-4', className)***REMOVED*** ***REMOVED***...props***REMOVED*** />;
***REMOVED***
