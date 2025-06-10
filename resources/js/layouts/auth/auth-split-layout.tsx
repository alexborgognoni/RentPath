import AppLogoIcon from '@/components/app-logo-icon';
import ***REMOVED*** type SharedData ***REMOVED*** from '@/types';
import ***REMOVED*** Link, usePage ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** type PropsWithChildren ***REMOVED*** from 'react';

interface AuthLayoutProps ***REMOVED***
    title?: string;
    description?: string;
***REMOVED***

export default function AuthSplitLayout(***REMOVED*** children, title, description ***REMOVED***: PropsWithChildren<AuthLayoutProps>) ***REMOVED***
    const ***REMOVED*** name, quote ***REMOVED*** = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-zinc-900" />
                <Link href=***REMOVED***route('home')***REMOVED*** className="relative z-20 flex items-center text-lg font-medium">
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    ***REMOVED***name***REMOVED***
                </Link>
                ***REMOVED***quote && (
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">&ldquo;***REMOVED***quote.message***REMOVED***&rdquo;</p>
                            <footer className="text-sm text-neutral-300">***REMOVED***quote.author***REMOVED***</footer>
                        </blockquote>
                    </div>
                )***REMOVED***
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link href=***REMOVED***route('home')***REMOVED*** className="relative z-20 flex items-center justify-center lg:hidden">
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">***REMOVED***title***REMOVED***</h1>
                        <p className="text-sm text-balance text-muted-foreground">***REMOVED***description***REMOVED***</p>
                    </div>
                    ***REMOVED***children***REMOVED***
                </div>
            </div>
        </div>
    );
***REMOVED***
