import { Head } from '@inertiajs/react';

export default function TenantDashboard() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <Head title="Tenant Dashboard" />
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold text-foreground">
                    Tenant Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                    Hello World! Coming soon...
                </p>
            </div>
        </div>
    );
}
