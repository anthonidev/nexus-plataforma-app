"use client";

import { Skeleton } from "@/components/ui/skeleton";


export function RanksMobileSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" />
            <div
                className={`
                grid grid-cols-1 gap-4 
                sm:grid-cols-2
                md:grid-cols-3
                xl:grid-cols-4
              
                `}
            >

                {[...Array(8)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div>
                                    <Skeleton className="h-5 w-24 mb-1" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                            <Skeleton className="h-7 w-20" />
                        </div>

                        <Skeleton className="h-5 w-32" />

                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-2 w-full" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-5 w-10" />
                                <Skeleton className="h-2 w-full" />
                                <Skeleton className="h-3 w-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}