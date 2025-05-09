"use client";

import { useRankDistribution } from "@/app/(dashboard)/billing/dashboard/hooks/useRankDistribution";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

export function UserRankChart() {
    const { rankData, isLoading, error, refreshRankData } = useRankDistribution();

    if (isLoading) {
        return <UserRankChartSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Distribución de Usuarios por Rango
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="flex flex-col items-center justify-center p-6 text-center border rounded-md border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshRankData}
                            className="mt-4"
                        >
                            <RefreshCw className="h-3.5 w-3.5 mr-2" />
                            Reintentar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate total users
    const totalUsers = rankData.reduce((sum, item) => sum + item.count, 0);

    // Add color to each item
    const dataWithColor = rankData.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
    }));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base font-semibold">Distribución de Usuarios por Rango</CardTitle>
                    <CardDescription>
                        {totalUsers} usuarios registrados en total
                    </CardDescription>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={refreshRankData}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="pt-4 px-2">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={dataWithColor}
                            layout="vertical"
                            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                        >
                            <XAxis type="number" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--primary-hover)', fillOpacity: 0.05 }}
                                formatter={(value) => [`${value} usuarios`, "Cantidad"]}
                                labelFormatter={(label) => `Rango: ${label}`}
                                contentStyle={{
                                    backgroundColor: "var(--card)",
                                    color: "var(--card-foreground)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "var(--radius)",
                                    padding: "12px",
                                    boxShadow: "var(--shadow-sm)",
                                    fontSize: "14px"
                                }}
                                itemStyle={{
                                    color: "var(--primary)"
                                }}
                                labelStyle={{
                                    color: "var(--card-foreground)",
                                    fontWeight: "600",
                                    marginBottom: "4px"
                                }}
                                wrapperStyle={{
                                    outline: "none",
                                    zIndex: 1000
                                }}
                            />
                            <Bar
                                dataKey="count"
                                radius={[0, 4, 4, 0]}
                                barSize={24}
                                animationDuration={300}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium">Distribución por categorías de rangos</div>
                    <div className="text-xs text-muted-foreground">Mostrando el número total de usuarios por cada rango</div>
                </div>
            </CardFooter>
        </Card>
    );
}

function UserRankChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3 py-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className={`h-6 w-${i * 16} max-w-full`} />
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </CardFooter>
        </Card>
    );
}