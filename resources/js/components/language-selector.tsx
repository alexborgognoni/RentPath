import axios from 'axios';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

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

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:bg-white/20 hover:text-white"
            >
                <span>{currentLang?.flag}</span>
                <span className="hidden sm:block">{currentLang?.name}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-lg border border-gray-600 bg-gray-800 shadow-xl">
                        <div className="py-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-gray-700 ${
                                        locale === lang.code ? 'bg-gray-700 text-cyan-400' : 'text-gray-300'
                                    }`}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
