import { LogoHomeButton } from '@/components/logo-home-button';
import { LanguageSelector } from '@/components/language-selector';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            {/* Language Selector in top right */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
                <LanguageSelector />
            </div>

            <div className="relative w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <LogoHomeButton />

                        <div className="space-y-2 text-center">
                            <h1 className="text-text-primary text-xl font-medium">{title}</h1>
                            <p className="text-text-secondary text-center text-sm">{description}</p>
                        </div>
                    </div>

                    {/* Card wrapper for form content */}
                    <div className="xs:rounded-2xl xs:border xs:border-border xs:bg-surface xs:p-8 xs:shadow-lg xs:backdrop-blur-sm">{children}</div>
                </div>
            </div>
        </div>
    );
}
