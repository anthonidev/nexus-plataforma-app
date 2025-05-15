"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function ProductDetailSkeleton() {
    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center mb-2">
                        <Link href="/tienda/productos" passHref>
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

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Área de imágenes */}
                <div className="md:col-span-7 space-y-4">
                    {/* Imagen principal */}
                    <Skeleton className="aspect-square w-full rounded-lg" />

                    {/* Miniaturas */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {[1, 2, 3, 4].map((_, index) => (
                            <Skeleton key={index} className="w-20 h-20 flex-shrink-0 rounded-md" />
                        ))}
                    </div>
                </div>

                {/* Detalles del producto */}
                <div className="md:col-span-5">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>

                            {/* Nombre y SKU */}
                            <div>
                                <Skeleton className="h-8 w-full max-w-md mb-2" />
                                <Skeleton className="h-4 w-32" />
                            </div>

                            {/* Precio */}
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>

                            <Skeleton className="h-px w-full" />

                            {/* Acciones de compra */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-5 w-40" />
                                </div>

                                <Skeleton className="h-12 w-full" />
                            </div>

                            <Skeleton className="h-px w-full" />

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>

                            <Skeleton className="h-px w-full" />

                            {/* Composición */}
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}