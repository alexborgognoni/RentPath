import { landing } from '@/routes';
import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';

export function LogoHomeButton() {
    return (
        <Link
            href={landing()}
            className="flex items-center space-x-2 rounded-lg border border-border bg-background px-3 py-2 transition-all duration-200 hover:bg-surface dark:border-border dark:bg-surface dark:hover:bg-background"
        >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-r from-primary to-secondary">
                <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-text-primary dark:text-text-primary text-lg font-bold">RentPath</span>
        </Link>
    );
}
