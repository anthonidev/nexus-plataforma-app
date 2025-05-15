import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function WithdrawalDetailSkeleton() {
    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center mb-2">
                        <Link href="/admin/retiros" passHref>
                            <Button variant="ghost" size="sm" className="mr-2 -ml-3">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Volver
                            </Button>
                        </Link>
                        <Skeleton className="h-9 w-64" />
                    </div>
                    <Skeleton className="h-5 w-80" />
                </div>

                <div className="flex gap-2">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-28" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Información general */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Información del retiro */}
                            <div className="space-y-4">
                                <Skeleton className="h-36 w-full rounded-lg" />
                                <Skeleton className="h-32 w-full rounded-lg" />
                                <Skeleton className="h-24 w-full rounded-lg" />
                            </div>

                            {/* Información del usuario */}
                            <div className="space-y-4">
                                <Skeleton className="h-56 w-full rounded-lg" />
                                <Skeleton className="h-32 w-full rounded-lg" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resumen de puntos */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <Skeleton className="h-28 w-full rounded-lg" />
                    </CardContent>
                </Card>
            </div>

            {/* Lista de puntos utilizados */}
            <Card className="mb-6">
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-72 w-full rounded-lg" />
                    <div className="flex items-center justify-between mt-4">
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-9 w-48" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}