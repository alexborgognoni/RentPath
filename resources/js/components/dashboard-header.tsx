import type React from 'react';

import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
    title: string;
    actionButton?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
}

export function DashboardHeader({ title, actionButton }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 py-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
            {actionButton && (
                <div className="ml-auto flex items-center gap-2">
                    <Button className="cursor-pointer" onClick={actionButton.onClick}>
                        {actionButton.icon && <span className="mr-2">{actionButton.icon}</span>}
                        {actionButton.label}
                    </Button>
                </div>
            )}
        </header>
    );
}
