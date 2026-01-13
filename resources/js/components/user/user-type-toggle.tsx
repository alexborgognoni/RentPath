import { SharedData } from '@/types';
import { translate as t } from '@/utils/translate-utils';
import { usePage } from '@inertiajs/react';
import { Building2, User } from 'lucide-react';

interface UserTypeToggleProps {
    userType: 'tenant' | 'property-manager';
    onUserTypeChange: (newType: 'tenant' | 'property-manager') => void;
}

export function UserTypeToggle({ userType, onUserTypeChange }: UserTypeToggleProps) {
    const page = usePage<SharedData>();
    const { translations } = page.props;

    return (
        <div className="relative flex gap-2 rounded-lg border border-border bg-background p-1">
            {/* Sliding background */}
            <div
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-8px)] rounded-md bg-gradient-to-r ${userType === 'property-manager' ? 'from-secondary to-primary' : 'from-primary to-secondary'} shadow-sm transition-transform duration-400 ease-in-out ${
                    userType === 'property-manager' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
                }`}
            />

            <button
                type="button"
                onClick={() => onUserTypeChange('tenant')}
                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors duration-300 ${
                    userType === 'tenant' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
            >
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">{t(translations.auth.common, 'userTypes.tenant')}</span>
            </button>
            <button
                type="button"
                onClick={() => onUserTypeChange('property-manager')}
                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors duration-300 ${
                    userType === 'property-manager' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
            >
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-center leading-tight">{t(translations.auth.common, 'userTypes.propertyManager')}</span>
            </button>
        </div>
    );
}
