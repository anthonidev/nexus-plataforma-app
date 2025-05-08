import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function OrderDetailSkeleton() {
    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center mb-2">
                        <Link href="/tienda/pedidos" passHref>
                            <Button variant="ghost" size="sm" className="mr-2 -ml-3">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Volver
                            </Button>
                        </Link>
                        <Skeleton className="h-9 w-48" />
                    </div>
                    <Skeleton className="h-5 w-64" />
                </div>

                <Skeleton className="h-8 w-24" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información general */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Detalles de pedido */}
                            <div className="space-y-4">
                                <div>
                                    <Skeleton className="h-5 w-32 mb-2" />
                                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>

                                <div>
                                    <Skeleton className="h-5 w-24 mb-2" />
                                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="space-y-4">
                                <div>
                                    <Skeleton className="h-5 w-40 mb-2" />
                                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>

                                <div>
                                    <Skeleton className="h-5 w-32 mb-2" />
                                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Productos del pedido */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}