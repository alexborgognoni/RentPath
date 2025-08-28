import { AgentProfileSkeleton } from '@/components/dashboard/agent-profile-skeleton';
import { PropertiesSectionSkeleton } from '@/components/dashboard/properties-section-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Background blobs similar to home page */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-gradient-to-br from-secondary/10 to-primary/10 blur-3xl dark:from-secondary/20 dark:to-primary/20" />
                <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-2xl dark:from-primary/20 dark:to-secondary/20" />
                <div className="absolute top-1/3 left-1/3 h-32 w-32 rounded-full bg-gradient-to-br from-secondary/5 to-primary/5 blur-2xl dark:from-secondary/10 dark:to-primary/10" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumbs skeleton */}
                <div className="mb-6">
                    <Skeleton className="h-6 w-24" />
                </div>

                {/* Agent Profile Skeleton */}
                <AgentProfileSkeleton />

                {/* Properties Section Skeleton */}
                <div className="mt-8">
                    <PropertiesSectionSkeleton />
                </div>
            </div>
        </div>
    );
}
