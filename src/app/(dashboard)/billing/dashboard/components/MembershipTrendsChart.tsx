"use client";

import { useMembershipsByDay } from "@/app/(dashboard)/billing/dashboard/hooks/useMembershipsByDay";
import {
    Card,
    CardContent,
    CardDescription,
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
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Tooltip } from "recharts";


// Define chart configuration
const chartConfig = {
    Ejecutivo: {
        label: "Ejecutivo",
        color: "var(--chart-1)",
    },
    Premium: {
        label: "Premium",
        color: "var(--chart-2)",
    },
    VIP: {
        label: "VIP",
        color: "var(--chart-3)",
    },
};

export function MembershipTrendsChart() {
    const {
        membershipData,
        isLoading,
        error,
        timeRange,
        setTimeRange,
        refreshData
    } = useMembershipsByDay();

    const [totalCount, setTotalCount] = useState<Record<string, number>>({
        Ejecutivo: 0,
        Premium: 0,
        VIP: 0,
        Total: 0
    });

    const [growthRate, setGrowthRate] = useState<number>(0);

    // Calculate totals when data changes
    useEffect(() => {
        if (membershipData.length > 0) {
            const counts = membershipData.reduce((acc, item) => {
                acc.Ejecutivo += item.Ejecutivo;
                acc.Premium += item.Premium;
                acc.VIP += item.VIP;
                return acc;
            }, { Ejecutivo: 0, Premium: 0, VIP: 0, Total: 0 });

            counts.Total = counts.Ejecutivo + counts.Premium + counts.VIP;

            setTotalCount(counts);

            // Calculate growth rate (comparing first and last week)
            if (membershipData.length >= 2) {
                const firstWeek = membershipData.slice(0, Math.min(7, Math.floor(membershipData.length / 3)));
                const lastWeek = membershipData.slice(-Math.min(7, Math.floor(membershipData.length / 3)));

                const firstWeekTotal = firstWeek.reduce((sum, item) =>
                    sum + item.Ejecutivo + item.Premium + item.VIP, 0);

                const lastWeekTotal = lastWeek.reduce((sum, item) =>
                    sum + item.Ejecutivo + item.Premium + item.VIP, 0);

                const growth = firstWeekTotal > 0
                    ? ((lastWeekTotal - firstWeekTotal) / firstWeekTotal) * 100
                    : 0;

                setGrowthRate(parseFloat(growth.toFixed(1)));
            }
        }
    }, [membershipData]);

    if (isLoading) {
        return <MembershipTrendsChartSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Tendencia de Membresías
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

    if (membershipData.length === 0) {
        return (
            <Card>
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                        <CardTitle>Tendencia de Membresías</CardTitle>
                        <CardDescription>
                            No hay datos para el período seleccionado
                        </CardDescription>
                    </div>
                    <Select value={timeRange} onValueChange={(value: "7d" | "30d" | "90d") => setTimeRange(value)}>
                        <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Seleccionar rango">
                            <SelectValue placeholder="Últimos 30 días" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">Últimos 90 días</SelectItem>
                            <SelectItem value="30d" className="rounded-lg">Últimos 30 días</SelectItem>
                            <SelectItem value="7d" className="rounded-lg">Últimos 7 días</SelectItem>
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
        "7d": "7 días",
        "30d": "30 días",
        "90d": "90 días"
    }[timeRange];

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Tendencia de Membresías
                    </CardTitle>
                    <CardDescription>
                        Nuevas membresías en los últimos {timeRangeText}
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
                        onValueChange={(value: "7d" | "30d" | "90d") => setTimeRange(value)}
                    >
                        <SelectTrigger
                            className="w-[160px] rounded-lg"
                            aria-label="Seleccionar rango de tiempo"
                        >
                            <SelectValue placeholder="Últimos 30 días" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Últimos 90 días
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Últimos 30 días
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Últimos 7 días
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <div className="aspect-auto h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={membershipData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                            <defs>
                                <linearGradient id="colorEjecutivo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartConfig.Ejecutivo.color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartConfig.Ejecutivo.color} stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartConfig.Premium.color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartConfig.Premium.color} stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorVIP" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartConfig.VIP.color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartConfig.VIP.color} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("es-PE", {
                                        month: "short",
                                        day: "numeric",
                                    });
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const date = new Date(label);
                                        const formattedDate = date.toLocaleDateString("es-PE", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        });

                                        // Get values for each plan
                                        const ejecutivo = payload.find(p => p.dataKey === "Ejecutivo")?.value || 0;
                                        const premium = payload.find(p => p.dataKey === "Premium")?.value || 0;
                                        const vip = payload.find(p => p.dataKey === "VIP")?.value || 0;
                                        const total = Number(ejecutivo) + Number(premium) + Number(vip);

                                        return (
                                            <div className="bg-card border border-border rounded-md shadow-md p-3 text-sm">
                                                <p className="font-medium border-b pb-1 mb-2">{formattedDate}</p>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.Ejecutivo.color }}></div>
                                                            <span className="text-card-foreground">Ejecutivo:</span>
                                                        </div>
                                                        <span className="font-medium">{ejecutivo}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.Premium.color }}></div>
                                                            <span className="text-card-foreground">Premium:</span>
                                                        </div>
                                                        <span className="font-medium">{premium}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartConfig.VIP.color }}></div>
                                                            <span className="text-card-foreground">VIP:</span>
                                                        </div>
                                                        <span className="font-medium">{vip}</span>
                                                    </div>
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
                                }}
                                cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Ejecutivo"
                                stackId="1"
                                stroke={chartConfig.Ejecutivo.color}
                                fillOpacity={1}
                                fill="url(#colorEjecutivo)"
                            />
                            <Area
                                type="monotone"
                                dataKey="Premium"
                                stackId="1"
                                stroke={chartConfig.Premium.color}
                                fillOpacity={1}
                                fill="url(#colorPremium)"
                            />
                            <Area
                                type="monotone"
                                dataKey="VIP"
                                stackId="1"
                                stroke={chartConfig.VIP.color}
                                fillOpacity={1}
                                fill="url(#colorVIP)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border bg-card p-3">
                        <div className="text-xs font-medium text-muted-foreground">Total</div>
                        <div className="text-xl font-bold">{totalCount.Total}</div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                        <div className="text-xs font-medium" style={{ color: chartConfig.Ejecutivo.color }}>Ejecutivo</div>
                        <div className="text-lg font-semibold">{totalCount.Ejecutivo}</div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                        <div className="text-xs font-medium" style={{ color: chartConfig.Premium.color }}>Premium</div>
                        <div className="text-lg font-semibold">{totalCount.Premium}</div>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                        <div className="text-xs font-medium" style={{ color: chartConfig.VIP.color }}>VIP</div>
                        <div className="text-lg font-semibold">{totalCount.VIP}</div>
                    </div>
                </div>

                <div className="mt-4 flex flex-col border-t pt-4 text-sm">
                    <div className={`flex items-center gap-1 font-medium ${growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {growthRate >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                        ) : (
                            <TrendingUp className="h-4 w-4 transform rotate-180" />
                        )}
                        <span>
                            {growthRate >= 0 ? `Incremento de ${growthRate}%` : `Descenso de ${Math.abs(growthRate)}%`}
                        </span>
                    </div>
                    <div className="text-muted-foreground text-xs mt-1">
                        Comparación entre el primer y último período
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function MembershipTrendsChartSkeleton() {
    return (
        <Card>
            <CardHeader className="flex items-center justify-between space-y-0 border-b py-5">
                <div>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-36 mt-1" />
                </div>
                <Skeleton className="h-9 w-32" />
            </CardHeader>
            <CardContent className="pt-6">
                <Skeleton className="h-[250px] w-full" />

                <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                </div>

                <div className="mt-4 border-t pt-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48 mt-1" />
                </div>
            </CardContent>
        </Card>
    );
}