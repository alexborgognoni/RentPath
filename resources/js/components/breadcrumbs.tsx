import ***REMOVED*** Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator ***REMOVED*** from '@/components/ui/breadcrumb';
import ***REMOVED*** type BreadcrumbItem as BreadcrumbItemType ***REMOVED*** from '@/types';
import ***REMOVED*** Link ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** Fragment ***REMOVED*** from 'react';

export function Breadcrumbs(***REMOVED*** breadcrumbs ***REMOVED***: ***REMOVED*** breadcrumbs: BreadcrumbItemType[] ***REMOVED***) ***REMOVED***
    return (
        <>
            ***REMOVED***breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        ***REMOVED***breadcrumbs.map((item, index) => ***REMOVED***
                            const isLast = index === breadcrumbs.length - 1;
                            return (
                                <Fragment key=***REMOVED***index***REMOVED***>
                                    <BreadcrumbItem>
                                        ***REMOVED***isLast ? (
                                            <BreadcrumbPage>***REMOVED***item.title***REMOVED***</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href=***REMOVED***item.href***REMOVED***>***REMOVED***item.title***REMOVED***</Link>
                                            </BreadcrumbLink>
                                        )***REMOVED***
                                    </BreadcrumbItem>
                                    ***REMOVED***!isLast && <BreadcrumbSeparator />***REMOVED***
                                </Fragment>
                            );
                    ***REMOVED***)***REMOVED***
                    </BreadcrumbList>
                </Breadcrumb>
            )***REMOVED***
        </>
    );
***REMOVED***
