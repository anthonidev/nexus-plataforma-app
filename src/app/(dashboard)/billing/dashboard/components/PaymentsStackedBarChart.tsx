"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaymentsByConcepts } from "../hooks/usePaymentsByConcept";

// Define chart configuration and colors
const chartConfig = {
    membresia: {
        label: "Membresía",
        color: "var(--chart-1)",
    },
    upgrade: {
        label: "Upgrade",
        color: "var(--chart-2)",
    },
    reconsumo: {
        label: "Reconsumo",
        color: "var(--chart-3)",
    },
    orden: {
        label: "Orden",
        color: "var(--chart-4)",
    },
};

export function PaymentsStackedBarChart() {
    const {
        paymentData,
        isLoading,
        error,
        timeRange,
        setTimeRange,
        totalsByType,
        growthRate,
        refreshData
    } = usePaymentsByConcepts();

    if (isLoading) {
        return <PaymentsStackedBarChartSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Pagos por Conceptos
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

    if (paymentData.length === 0) {
        return (
            <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Pagos por Conceptos
                        </CardTitle>
                        <CardDescription>
                            No hay datos para el período seleccionado
                        </CardDescription>
                    </div>
                    <Select
                        value={timeRange}
                        onValueChange={(value: "6m" | "3m" | "1m") => setTimeRange(value)}
                    >
                        <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
                            <SelectValue placeholder="Últimos 3 meses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="6m" className="rounded-lg">Últimos 6 meses</SelectItem>
                            <SelectItem value="3m" className="rounded-lg">Últimos 3 meses</SelectItem>
                            <SelectItem value="1m" className="rounded-lg">Último mes</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-[250px]">
                    <div className="text-center text-muted-foreground">
                        <p>No hay datos para mostrar en el período seleccionado</p>
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

    // Convert time range to readable text
    const timeRangeText = {
        "6m": "6 meses",
        "3m": "3 meses",
        "1m": "mes"
    }[timeRange];

    // Create a custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Calculate total for this data point
            const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

            return (
                <div className="bg-card border border-border rounded-md shadow-md p-3 text-sm">
                    <div className="font-medium border-b pb-1 mb-2">{label}</div>
                    <div className="space-y-1.5">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: entry.fill }}
                                    />
                                    <span className="text-card-foreground">
                                        {entry.name === "membresia" ? "Membresía" :
                                            entry.name === "upgrade" ? "Upgrade" :
                                                entry.name === "reconsumo" ? "Reconsumo" : "Orden"}:
                                    </span>
                                </div>
                                <span className="font-medium">{entry.value}</span>
                            </div>
                        ))}
                        <div className="border-t mt-1 pt-1.5">
                            <div className="flex items-center justify-between font-medium">
                                <span>Total:</span>
                                <span>{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Pagos por Conceptos
                    </CardTitle>
                    <CardDescription>
                        Últimos {timeRangeText} - Total: {totalsByType.total}
                    </CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={refreshData}
                        className="h-8 w-8"
                        title="Actualizar datos"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Select
                        value={timeRange}
                        onValueChange={(value: "6m" | "3m" | "1m") => setTimeRange(value)}
                    >
                        <SelectTrigger className="w-[160px] rounded-lg">
                            <SelectValue placeholder="Últimos 3 meses" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="6m" className="rounded-lg">Últimos 6 meses</SelectItem>
                            <SelectItem value="3m" className="rounded-lg">Últimos 3 meses</SelectItem>
                            <SelectItem value="1m" className="rounded-lg">Último mes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={paymentData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={40}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
                            />
                            <Bar
                                dataKey="membresia"
                                stackId="a"
                                fill={chartConfig.membresia.color}
                                name="membresia"
                                radius={[0, 0, 0, 0]}
                            />
                            <Bar
                                dataKey="upgrade"
                                stackId="a"
                                fill={chartConfig.upgrade.color}
                                name="upgrade"
                                radius={[0, 0, 0, 0]}
                            />
                            <Bar
                                dataKey="reconsumo"
                                stackId="a"
                                fill={chartConfig.reconsumo.color}
                                name="reconsumo"
                                radius={[0, 0, 0, 0]}
                            />
                            <Bar
                                dataKey="orden"
                                stackId="a"
                                fill={chartConfig.orden.color}
                                name="orden"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                    {Object.entries(chartConfig).map(([key, config]) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: config.color }}
                            />
                            <span className="text-sm">{config.label}</span>
                            <span className="text-sm font-medium ml-1">
                                {totalsByType[key as keyof typeof totalsByType] || 0}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
                <div className={`flex gap-2 font-medium leading-none ${growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                    {growthRate >= 0 ? (
                        <>
                            <TrendingUp className="h-4 w-4" />
                            <span>Incremento de {growthRate}% en pagos</span>
                        </>
                    ) : (
                        <>
                            <TrendingDown className="h-4 w-4" />
                            <span>Descenso de {Math.abs(growthRate)}% en pagos</span>
                        </>
                    )}
                </div>
                <div className="leading-none text-muted-foreground">
                    Comparado con el período anterior
                </div>
            </CardFooter>
        </Card>
    );
}

function PaymentsStackedBarChartSkeleton() {
    return (
        <Card>
            <CardHeader className="flex items-center justify-between space-y-0 border-b py-5">
                <div>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-36 mt-1" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <Skeleton className="h-[250px] w-full" />

                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-6 w-28" />
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t pt-4">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-36" />
            </CardFooter>
        </Card>
    );
}