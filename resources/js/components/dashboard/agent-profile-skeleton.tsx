import { Skeleton } from '@/components/ui/skeleton';

export function AgentProfileSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8 flex items-start justify-between">
                <div className="flex items-center">
                    <Skeleton className="mr-3 h-7 w-7 rounded" />
                    <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>

            <div className="flex flex-col gap-8 md:flex-row">
                {/* Profile Picture Skeleton */}
                <div className="flex-shrink-0">
                    <Skeleton className="h-32 w-32 rounded-2xl" />
                </div>

                {/* Profile Info Skeleton */}
                <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div>
                        <Skeleton className="mb-2 h-4 w-12" />
                        <Skeleton className="h-6 w-24" />
                    </div>

                    {/* Email */}
                    <div>
                        <Skeleton className="mb-2 h-4 w-12" />
                        <Skeleton className="h-6 w-40" />
                    </div>

                    {/* Phone */}
                    <div>
                        <Skeleton className="mb-2 h-4 w-12" />
                        <Skeleton className="h-6 w-32" />
                    </div>

                    {/* Role */}
                    <div>
                        <Skeleton className="mb-2 h-4 w-10" />
                        <Skeleton className="h-6 w-36" />
                    </div>

                    {/* Company */}
                    <div>
                        <Skeleton className="mb-2 h-4 w-16" />
                        <Skeleton className="h-6 w-28" />
                    </div>

                    {/* Agency ID */}
                    <div>
                        <Skeleton className="mb-2 h-4 w-32" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                </div>
            </div>
        </div>
    );
}
