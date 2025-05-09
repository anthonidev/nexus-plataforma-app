"use client";

import { useUsersCreatedByDate } from "@/app/(dashboard)/billing/dashboard/hooks/useUsersCreatedByDate";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { RefreshCw, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useCallback, useMemo } from "react";

// Define chart configuration
const chartConfig = {
    users: {
        label: "Usuarios",
        color: "var(--chart-1)",
    }
};

export function UserCreationBarChart() {
    const {
        userData,
        isLoading,
        error,
        timeRange,
        setTimeRange,
        totalUsers,
        refreshData
    } = useUsersCreatedByDate();

    // Convert time range to readable text
    const timeRangeText = useMemo(() => {
        return {
            "6m": "6 meses",
            "3m": "3 meses",
            "1m": "mes"
        }[timeRange];
    }, [timeRange]);

    // Handle time range change
    const handleTimeRangeChange = useCallback((range: "6m" | "3m" | "1m") => {
        setTimeRange(range);
    }, [setTimeRange]);

    if (isLoading) {
        return <UserCreationBarChartSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5">
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Nuevos Usuarios
                        </CardTitle>
                        <CardDescription>
                            Usuarios creados en los últimos {timeRangeText}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
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

    if (userData.length === 0) {
        return (
            <Card>
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5">
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            Nuevos Usuarios
                        </CardTitle>
                        <CardDescription>
                            No hay datos para el período seleccionado
                        </CardDescription>
                    </div>
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

    // Format tooltip
    const formatTooltip = (value: string) => {
        const date = new Date(value);
        return format(date, "d 'de' MMMM, yyyy", { locale: es });
    };

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Nuevos Usuarios
                    </CardTitle>
                    <CardDescription>
                        {totalUsers} usuarios creados en los últimos {timeRangeText}
                    </CardDescription>
                </div>
                <div className="flex border-t sm:border-t-0 sm:border-l">
                    {[
                        { key: "3m", label: "3 meses" },
                        { key: "1m", label: "1 mes" },
                        { key: "6m", label: "6 meses" },
                    ].map((item) => (
                        <button
                            key={item.key}
                            data-active={timeRange === item.key}
                            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-l first:border-l-0 px-4 py-4 text-center text-sm data-[active=true]:bg-muted/50 hover:bg-muted/30 transition-colors sm:px-6 sm:py-5"
                            onClick={() => handleTimeRangeChange(item.key as "6m" | "3m" | "1m")}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-l px-3 py-3 text-center hover:bg-muted/30 transition-colors sm:px-4 sm:py-5"
                        onClick={refreshData}
                        title="Actualizar datos"
                    >
                        <RefreshCw className="h-4 w-4 mx-auto" />
                    </button>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={userData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 10,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return format(date, "d MMM", { locale: es });
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <Bar
                                dataKey="cantidad"
                                name="usuarios"
                                fill="var(--chart-1)"
                                radius={[4, 4, 0, 0]}
                                barSize={24}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

function UserCreationBarChartSkeleton() {
    return (
        <Card>
            <CardHeader className="flex items-center justify-between space-y-0 border-b py-5">
                <div>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-1" />
                </div>
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-16 rounded-md" />
                    ))}
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
    );
}