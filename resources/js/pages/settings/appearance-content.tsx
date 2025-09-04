import { Monitor, Moon, Palette, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AppearanceContent() {
    const [theme, setTheme] = useState<'light' | 'system' | 'dark'>('system');

    useEffect(() => {
        // Check current theme on mount
        const savedTheme = localStorage.getItem('theme') as 'light' | 'system' | 'dark' || 'system';
        setTheme(savedTheme);
        
        if (savedTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', prefersDark);
        } else {
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);

    const handleThemeChange = (newTheme: 'light' | 'system' | 'dark') => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', prefersDark);
        } else {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="mb-2 flex items-center text-3xl font-bold text-foreground">
                    <Palette className="mr-3 text-primary" size={32} />
                    Appearance
                </h1>
                <p className="text-muted-foreground">Customize how the interface looks and feels</p>
            </div>

            {/* Theme Settings */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Theme</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    Choose between light, system, and dark mode to customize your viewing experience.
                </p>

                {/* Theme Toggle */}
                <div className="relative flex rounded-lg border border-border bg-background p-1">
                    {/* Full-width gradient background with clip-path window */}
                    <div
                        className="absolute top-1 bottom-1 left-1 right-1 rounded-md bg-gradient-to-r from-primary to-secondary shadow-sm transition-all duration-400 ease-in-out"
                        style={{
                            clipPath: theme === 'light' 
                                ? 'inset(0 66.67% 0 0 round 6px)' 
                                : theme === 'dark'
                                ? 'inset(0 33.33% 0 33.33% round 6px)'
                                : 'inset(0 0 0 66.67% round 6px)'
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => handleThemeChange('light')}
                        className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${
                            theme === 'light' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Sun className="h-4 w-4" />
                        Light
                    </button>
                    <button
                        type="button"
                        onClick={() => handleThemeChange('dark')}
                        className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${
                            theme === 'dark' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Moon className="h-4 w-4" />
                        Dark
                    </button>
                    <button
                        type="button"
                        onClick={() => handleThemeChange('system')}
                        className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer ${
                            theme === 'system' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        <Monitor className="h-4 w-4" />
                        System
                    </button>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                    Your theme preference will be saved and applied across all pages.
                </div>
            </div>
        </div>
    );
}