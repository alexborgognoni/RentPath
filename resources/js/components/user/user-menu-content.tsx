import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogoutConfirmationPopover } from '@/components/user/logout-confirmation-popover';
import { UserInfo } from '@/components/user/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData, type User } from '@/types';
import { settingsRoute } from '@/utils/route';
import { translate as t } from '@/utils/translate-utils';
import { Link, usePage } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const { translations, subdomain, managerSubdomain } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirmation(true);
    };

    const handleLogoutConfirm = () => {
        cleanup();
        setShowLogoutConfirmation(false);
    };

    const handleLogoutCancel = () => {
        setShowLogoutConfirmation(false);
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full"
                        href={settingsRoute('profile', subdomain, managerSubdomain)}
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        {t(translations.layout.header, 'settings')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <button className="flex w-full items-center" onClick={handleLogoutClick}>
                    <LogOut className="mr-2" />
                    {t(translations.layout.header, 'signOut')}
                </button>
            </DropdownMenuItem>

            <LogoutConfirmationPopover isOpen={showLogoutConfirmation} onClose={handleLogoutCancel} onConfirm={handleLogoutConfirm} />
        </>
    );
}
