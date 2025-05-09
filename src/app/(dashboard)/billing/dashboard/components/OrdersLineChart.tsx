"use client";

import { useOrdersByDay } from "@/app/(dashboard)/billing/dashboard/hooks/useOrdersByDay";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { RefreshCw, TrendingUp, AlertCircle, TrendingDown, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersLineChart() {
    const {
        orderData,
        isLoading,
        error,
        totalOrders,
        growthRate,
        refreshData
    } = useOrdersByDay();

    if (isLoading) {
        return <OrdersLineChartSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Tendencia de Pedidos
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="flex flex-col items-center justify-center p-6 text-center border rounded-md border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30">
                        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshData}
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

    if (orderData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Tendencia de Pedidos
                    </CardTitle>
                    <CardDescription>No hay datos disponibles</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-muted-foreground">No hay datos de pedidos para mostrar</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshData}
                            className="mt-4"
                        >
                            <RefreshCw className="h-3.5 w-3.5 mr-2" />
                            Actualizar datos
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Tendencia de Pedidos
                    </CardTitle>
                    <CardDescription>
                        Últimos 30 días ({totalOrders} pedidos en total)
                    </CardDescription>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={refreshData}
                    className="h-8 w-8"
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={orderData}
                            margin={{
                                top: 20,
                                left: 0,
                                right: 20,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <Line
                                dataKey="cantidad"
                                type="monotone"
                                stroke="var(--chart-1)"
                                strokeWidth={3}
                                dot={{
                                    fill: "var(--chart-1)",
                                    r: 6,
                                    strokeWidth: 0
                                }}
                                activeDot={{
                                    r: 8,
                                    stroke: "var(--background)",
                                    strokeWidth: 2
                                }}
                                isAnimationActive={true}
                                animationDuration={1000}
                            >
                                <LabelList
                                    dataKey="cantidad"
                                    position="top"
                                    offset={15}
                                    className="fill-foreground"
                                    fontSize={12}
                                    formatter={(value: number) => value}
                                />
                            </Line>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
                <div className={`flex gap-2 font-medium leading-none ${growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                    {growthRate >= 0 ? (
                        <>
                            <TrendingUp className="h-4 w-4" />
                            <span>Incremento de {growthRate}% en las últimas 2 semanas</span>
                        </>
                    ) : (
                        <>
                            <TrendingDown className="h-4 w-4" />
                            <span>Descenso de {Math.abs(growthRate)}% en las últimas 2 semanas</span>
                        </>
                    )}
                </div>
                <div className="leading-none text-muted-foreground">
                    Comparado con las 2 semanas anteriores
                </div>
            </CardFooter>
        </Card>
    );
}

function OrdersLineChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t pt-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-36" />
            </CardFooter>
        </Card>
    );
}