import AppLogoIcon from '@/components/app-logo-icon';
import ***REMOVED*** Card, CardContent, CardDescription, CardHeader, CardTitle ***REMOVED*** from '@/components/ui/card';
import ***REMOVED*** Link ***REMOVED*** from '@inertiajs/react';
import ***REMOVED*** type PropsWithChildren ***REMOVED*** from 'react';

export default function AuthCardLayout(***REMOVED***
    children,
    title,
    description,
***REMOVED***: PropsWithChildren<***REMOVED***
    name?: string;
    title?: string;
    description?: string;
***REMOVED***>) ***REMOVED***
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href=***REMOVED***route('home')***REMOVED*** className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-9 w-9 items-center justify-center">
                        <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                    </div>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">***REMOVED***title***REMOVED***</CardTitle>
                            <CardDescription>***REMOVED***description***REMOVED***</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">***REMOVED***children***REMOVED***</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
***REMOVED***
