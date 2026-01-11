import { SettingsNavigation } from '@/components/navigation/settings-navigation';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { JSX, useEffect, useState } from 'react';

// Import settings page components
import AppearanceContent from '@/pages/settings/appearance-content';
import PasswordContent from '@/pages/settings/password-content';
import ProfileContent from '@/pages/settings/profile-content';

type SettingsPage = 'account' | 'password' | 'appearance';

interface SettingsProps {
    mustVerifyEmail?: boolean;
    status?: string;
}

/**
 * Settings - Pure settings component without layout wrapper
 *
 * This component should be wrapped by the appropriate layout
 * (TenantLayout or ManagerLayout) in the page files.
 */
export default function Settings({ mustVerifyEmail = false, status }: SettingsProps) {
    const getInitialPage = (): SettingsPage => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageFromUrl = urlParams.get('initialPage') as SettingsPage | null;

        const path = window.location.pathname;
        if (path.includes('/account')) return 'account';
        if (path.includes('/password')) return 'password';
        if (path.includes('/appearance')) return 'appearance';

        return pageFromUrl || 'account';
    };

    const getPageOrder = (page: SettingsPage): number => {
        const order = { account: 0, password: 1, appearance: 2 };
        return order[page];
    };

    const [currentPage, setCurrentPage] = useState<SettingsPage>(getInitialPage);
    const [prevPageOrder, setPrevPageOrder] = useState(getPageOrder(getInitialPage()));

    // Navigate to a page
    const handleNavigate = (page: SettingsPage) => {
        setCurrentPage(page);
        window.history.pushState({}, '', `/settings/${page}`);
    };

    // Update prevPageOrder after currentPage changes to fix exit animation
    useEffect(() => {
        setPrevPageOrder(getPageOrder(currentPage));
    }, [currentPage]);

    const renderContent = () => {
        const currentOrder = getPageOrder(currentPage);

        // Moving to higher page index slides content up, lower slides down
        const yOffset = currentOrder > prevPageOrder ? 40 : -40;

        const pageVariants = {
            initial: { opacity: 0, y: yOffset },
            in: { opacity: 1, y: 0 },
            out: { opacity: 0, y: -yOffset },
        };
        const pageTransition = {
            type: 'tween',
            ease: 'easeInOut',
            duration: 0.4,
        } as const;

        const renderPage = (key: SettingsPage, content: JSX.Element) => (
            <motion.div key={key} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                {content}
            </motion.div>
        );

        switch (currentPage) {
            case 'account':
                return renderPage('account', <ProfileContent mustVerifyEmail={mustVerifyEmail} status={status} />);
            case 'password':
                return renderPage('password', <PasswordContent />);
            case 'appearance':
                return renderPage('appearance', <AppearanceContent />);
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Settings" />
            {/* Responsive layout: stack menu above content on small screens */}
            <div className="flex flex-col gap-8 lg:flex-row">
                <SettingsNavigation currentPage={currentPage} onNavigate={handleNavigate} />
                <div className="flex-1 lg:max-w-4xl">
                    <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
                </div>
            </div>
        </>
    );
}
