import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="absolute inset-0">
                <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gradient-to-br from-secondary/5 to-primary/5 blur-3xl dark:from-secondary/10 dark:to-primary/10" />
                <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-2xl dark:from-primary/10 dark:to-secondary/10" />
            </div>
            
            <div className="relative w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={home()} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary">
                                <Home className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-text-primary">RentPath</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-text-primary">{title}</h1>
                            <p className="text-center text-sm text-text-secondary">{description}</p>
                        </div>
                    </div>
                    
                    {/* Card wrapper for form content */}
                    <div className="rounded-2xl bg-surface border border-border p-8 shadow-lg backdrop-blur-sm">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
