"use client";

import { useMembershipPlans } from "@/app/(dashboard)/billing/dashboard/hooks/useMembershipPlans";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

export function MembershipPlanRadialChart() {
    const {
        planData,
        isLoading,
        error,
        total,
        growthRate,
        refreshData
    } = useMembershipPlans();

    if (isLoading) {
        return <MembershipPlanRadialChartSkeleton />;
    }

    if (error) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Distribución de Planes</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 items-center pb-0">
                    <div className="flex flex-col items-center justify-center p-6 text-center border rounded-md border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30 w-full">
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

    if (planData.length === 0) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Distribución de Planes</CardTitle>
                    <CardDescription>No hay datos disponibles</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 items-center pb-0">
                    <div className="flex flex-col items-center justify-center h-[250px]">
                        <p className="text-muted-foreground">No hay datos de planes para mostrar</p>
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

    // Prepare data for the radial chart
    const chartData = [
        {
            name: "Total",
            Ejecutivo: planData.find(p => p.name === "Ejecutivo")?.value || 0,
            Premium: planData.find(p => p.name === "Premium")?.value || 0,
            VIP: planData.find(p => p.name === "VIP")?.value || 0,
        }
    ];

    // Create a tooltip renderer
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const plan = payload[0].name;
            const value = payload[0].value;
            const percentage = ((value / total) * 100).toFixed(1);

            return (
                <div className="bg-card border border-border rounded-md shadow-md p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: payload[0].fill }}
                        ></div>
                        <span className="font-medium">{plan}</span>
                    </div>
                    <div className="text-muted-foreground">
                        <div>{value} miembros</div>
                        <div>{percentage}% del total</div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={refreshData}
                    className="h-8 w-8 absolute right-4 top-4"
                    title="Actualizar datos"
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
                <CardTitle>Distribución de Planes</CardTitle>
                <CardDescription>Membresías activas por tipo de plan</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center pb-0 pt-4">
                <div className="mx-auto aspect-square w-full max-w-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            data={chartData}
                            startAngle={180}
                            endAngle={0}
                            innerRadius={80}
                            outerRadius={140}
                            barSize={20}
                            cy="55%"
                        >
                            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) - 16}
                                                        className="fill-foreground text-2xl font-bold"
                                                    >
                                                        {total.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 4}
                                                        className="fill-muted-foreground text-xs"
                                                    >
                                                        Membresías
                                                    </tspan>
                                                </text>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PolarRadiusAxis>
                            <RadialBar
                                dataKey="VIP"
                                fill={chartConfig.VIP.color}
                                background={{ fill: "var(--border)" }}
                                stackId="a"
                                cornerRadius={5}
                                label={{
                                    position: 'insideStart',
                                    fill: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: 11
                                }}
                                className="stroke-transparent stroke-2"
                            />
                            <RadialBar
                                dataKey="Premium"
                                fill={chartConfig.Premium.color}
                                stackId="a"
                                cornerRadius={5}
                                label={{
                                    position: 'insideStart',
                                    fill: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: 11
                                }}
                                className="stroke-transparent stroke-2"
                            />
                            <RadialBar
                                dataKey="Ejecutivo"
                                fill={chartConfig.Ejecutivo.color}
                                stackId="a"
                                cornerRadius={5}
                                label={{
                                    position: 'insideStart',
                                    fill: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: 11
                                }}
                                className="stroke-transparent stroke-2"
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>

            <div className="px-6 py-4 grid grid-cols-3 gap-2">
                {planData.map((plan, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: plan.fill }}
                            ></div>
                            <span className="text-xs font-medium">{plan.name}</span>
                        </div>
                        <div className="text-sm font-bold">{plan.value}</div>
                        <div className="text-xs text-muted-foreground">
                            {((plan.value / total) * 100).toFixed(0)}%
                        </div>
                    </div>
                ))}
            </div>

            <CardFooter className="flex-col gap-2 text-sm border-t pt-4">
                <div className="flex items-center gap-2 font-medium leading-none text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Incremento de {growthRate}% este mes</span>
                </div>
                <div className="leading-none text-muted-foreground text-xs">
                    Comparado con el mes anterior
                </div>
            </CardFooter>
        </Card>
    );
}

function MembershipPlanRadialChartSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent className="flex flex-1 items-center justify-center pb-0">
                <Skeleton className="mx-auto aspect-square w-full max-w-[250px] rounded-full" />
            </CardContent>
            <div className="px-6 py-4 grid grid-cols-3 gap-2">
                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                ))}
            </div>
            <CardFooter className="flex-col gap-2 border-t pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
            </CardFooter>
        </Card>
    );
}