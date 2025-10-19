import { AgentProfileSkeleton } from '@/components/dashboard/agent-profile-skeleton';
import { PropertiesSectionSkeleton } from '@/components/dashboard/properties-section-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-background">
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
