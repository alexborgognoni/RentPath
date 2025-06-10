import AppLogoIcon from '@/components/app-logo-icon';
import ***REMOVED*** Link ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** type PropsWithChildren ***REMOVED*** from 'react';

interface AuthLayoutProps ***REMOVED***
    name?: string;
    title?: string;
    description?: string;
***REMOVED***

export default function AuthSimpleLayout(***REMOVED*** children, title, description ***REMOVED***: PropsWithChildren<AuthLayoutProps>) ***REMOVED***
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href=***REMOVED***route('home')***REMOVED*** className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                            </div>
                            <span className="sr-only">***REMOVED***title***REMOVED***</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">***REMOVED***title***REMOVED***</h1>
                            <p className="text-center text-sm text-muted-foreground">***REMOVED***description***REMOVED***</p>
                        </div>
                    </div>
                    ***REMOVED***children***REMOVED***
                </div>
            </div>
        </div>
    );
***REMOVED***
