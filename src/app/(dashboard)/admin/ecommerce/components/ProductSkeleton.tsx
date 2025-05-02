import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

export function ProductSkeleton() {
    return (
        <div className="container max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-3"
                    disabled
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                </Button>
                <Skeleton className="h-10 w-1/3 mb-2" />
                <Skeleton className="h-5 w-1/2" />
            </div>

            <Tabs defaultValue="info" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="info">
                        <Skeleton className="h-5 w-24" />
                    </TabsTrigger>
                    <TabsTrigger value="images">
                        <Skeleton className="h-5 w-20" />
                    </TabsTrigger>
                    <TabsTrigger value="benefits">
                        <Skeleton className="h-5 w-24" />
                    </TabsTrigger>
                    <TabsTrigger value="stock">
                        <Skeleton className="h-5 w-24" />
                    </TabsTrigger>
                </TabsList>

                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-24 w-full" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-24" />
                            </div>

                            <div className="flex justify-end">
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}