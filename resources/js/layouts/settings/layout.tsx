import Heading from '@/components/heading';
import ***REMOVED*** Button ***REMOVED*** from '@/components/ui/button';
import ***REMOVED*** Separator ***REMOVED*** from '@/components/ui/separator';
import ***REMOVED*** cn ***REMOVED*** from '@/lib/utils';
import ***REMOVED*** type NavItem ***REMOVED*** from '@/types';
import ***REMOVED*** Link ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** type PropsWithChildren ***REMOVED*** from 'react';

const sidebarNavItems: NavItem[] = [
    ***REMOVED***
        title: 'Profile',
        href: '/settings/profile',
        icon: null,
***REMOVED***,
    ***REMOVED***
        title: 'Password',
        href: '/settings/password',
        icon: null,
***REMOVED***,
    ***REMOVED***
        title: 'Appearance',
        href: '/settings/appearance',
        icon: null,
***REMOVED***,
];

export default function SettingsLayout(***REMOVED*** children ***REMOVED***: PropsWithChildren) ***REMOVED***
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') ***REMOVED***
        return null;
***REMOVED***

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        ***REMOVED***sidebarNavItems.map((item, index) => (
                            <Button
                                key=***REMOVED***`$***REMOVED***item.href***REMOVED***-$***REMOVED***index***REMOVED***`***REMOVED***
                                size="sm"
                                variant="ghost"
                                asChild
                                className=***REMOVED***cn('w-full justify-start', ***REMOVED***
                                    'bg-muted': currentPath === item.href,
                            ***REMOVED***)***REMOVED***
                            >
                                <Link href=***REMOVED***item.href***REMOVED*** prefetch>
                                    ***REMOVED***item.title***REMOVED***
                                </Link>
                            </Button>
                        ))***REMOVED***
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">***REMOVED***children***REMOVED***</section>
                </div>
            </div>
        </div>
    );
***REMOVED***
