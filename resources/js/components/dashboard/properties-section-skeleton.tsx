import { PropertyCardSkeleton } from '@/components/dashboard/property-card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export function PropertiesSectionSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm">
            {/* Header */}
            <div className="border-b border-border p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Skeleton className="mr-3 h-7 w-7 rounded" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <Skeleton className="h-12 w-32 rounded-xl" />
                </div>
            </div>

            {/* Content */}
            <div className="p-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <PropertyCardSkeleton />
                    <PropertyCardSkeleton />
                    <PropertyCardSkeleton />
                </div>
            </div>
        </div>
    );
}
