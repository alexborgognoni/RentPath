import { Skeleton } from '@/components/ui/skeleton';

export function PropertyCardSkeleton() {
    return (
        <div className="group rounded-2xl border border-border bg-card p-6 transition-all hover:scale-105 hover:border-primary/50">
            {/* Property Image Skeleton */}
            <div className="mb-4">
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>

            {/* Title */}
            <Skeleton className="mb-2 h-6 w-3/4" />

            {/* Address */}
            <Skeleton className="mb-3 h-4 w-1/2" />

            {/* Price */}
            <Skeleton className="mb-4 h-5 w-24" />

            {/* Property details */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
            </div>

            {/* Button */}
            <Skeleton className="h-12 w-full rounded-xl" />
        </div>
    );
}
