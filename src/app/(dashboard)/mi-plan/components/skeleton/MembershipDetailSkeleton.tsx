import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
function MembershipDetailSkeleton() {
    return (
        <Card className="mb-6">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-6 w-24" />
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="rounded-xl p-6 border">
                            <div className="flex items-center justify-between mb-4">
                                <Skeleton className="h-7 w-48" />
                                <Skeleton className="h-7 w-32" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="rounded-lg p-3 border">
                                    <Skeleton className="h-5 w-32 mb-2" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-full" />
                                </div>

                                <div className="rounded-lg p-3 border">
                                    <Skeleton className="h-5 w-48 mb-2" />
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl p-5 border">
                            <div className="flex items-center gap-3 mb-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <Skeleton className="h-6 w-32" />
                            </div>

                            <div className="space-y-2 mt-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl p-4 border">
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-5 w-48" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default MembershipDetailSkeleton;