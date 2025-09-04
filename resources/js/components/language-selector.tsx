import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
];

interface LanguageSelectorProps {
    currentLanguage?: string;
}
export function LanguageSelector({ currentLanguage }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { props } = usePage<SharedData>();
    const locale = currentLanguage || props.locale;
    const selectorRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find((lang) => lang.code === locale);

    const handleLanguageChange = async (langCode: string) => {
        try {
            await axios.post('/locale', { locale: langCode });
            // Reload the page to reflect new translations
            window.location.reload();
        } catch (err) {
            console.error('Failed to change language', err);
        }
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('scroll', handleScroll, true);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    return (
        <div ref={selectorRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-text-secondary hover:text-text-primary bg-surface flex items-center space-x-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-background cursor-pointer"
            >
                <span>{currentLang?.flag}</span>
                <span className="hidden sm:block">{currentLang?.name}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="bg-surface absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-lg border border-border shadow-xl">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-background cursor-pointer ${
                                    locale === lang.code ? 'bg-background text-primary' : 'text-text-secondary'
                                }`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
