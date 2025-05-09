"use client";

import { useUsersByState } from "@/app/(dashboard)/billing/dashboard/hooks/useUsersByState";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts";
import { RefreshCw, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const RADIAN = Math.PI / 180;

// Custom label component for the pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for small segments

    return (
        <text
            x={x}
            y={y}
            fill="var(--card-foreground)"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight="500"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-md shadow-sm p-3 text-sm">
                <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
                <p className="text-xs text-muted-foreground">{`${(payload[0].payload.percent * 100).toFixed(1)}% del total`}</p>
            </div>
        );
    }
    return null;
};

export function UserStateChart() {
    const { stateData, isLoading, error, total, refreshData } = useUsersByState();

    if (isLoading) {
        return <UserStateChartSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users2 className="h-5 w-5 text-primary" />
                        Estado de Usuarios
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="flex flex-col items-center justify-center p-6 text-center border rounded-md border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/30">
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

    // Calculate percentages for each segment
    const dataWithPercent = stateData.map(item => ({
        ...item,
        percent: item.value / total
    }));

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base font-semibold">Estado de Usuarios</CardTitle>
                    <CardDescription>
                        {total} usuarios en total
                    </CardDescription>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={refreshData}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 px-2 pt-4 pb-0">
                <div className="h-[280px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={dataWithPercent}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                            >
                                {dataWithPercent.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.fill}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                formatter={(value, entry, index) => (
                                    <span className="text-xs">{value}</span>
                                )}
                                wrapperStyle={{ paddingTop: 20 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4 pb-3 px-6 mt-auto">
                <div className="flex flex-col gap-1 text-sm">
                    <p className="text-muted-foreground text-xs">
                        Distribución de usuarios según su estado de actividad en la plataforma
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}

function UserStateChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <div className="w-48 h-48 rounded-full flex items-center justify-center relative">
                    <Skeleton className="h-48 w-48 rounded-full absolute" />
                    <Skeleton className="h-24 w-24 rounded-full" />
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4 pb-3 px-6 mt-auto">
                <Skeleton className="h-4 w-full" />
            </CardFooter>
        </Card>
    );
}