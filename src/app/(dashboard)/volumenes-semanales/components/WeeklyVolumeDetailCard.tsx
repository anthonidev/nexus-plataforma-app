import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailVolumeResponse } from "@/types/points/volumen";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    MoveLeft,
    MoveRight,
    RefreshCw,
    XCircle
} from "lucide-react";
import Link from "next/link";

interface WeeklyVolumeDetailCardProps {
    volume: DetailVolumeResponse | null;
    isLoading: boolean;
    error: string | null;
    onRefresh: () => Promise<void>;
}

export function WeeklyVolumeDetailCard({
    volume,
    isLoading,
    error,
    onRefresh
}: WeeklyVolumeDetailCardProps) {

    if (isLoading) {
        return <WeeklyVolumeDetailSkeleton />;
    }

    if (error) {
        return (
            <Card className="w-full">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
                            Error al cargar el volumen semanal
                        </h3>
                        <p className="text-red-600 dark:text-red-300 mb-4 max-w-md">
                            {error}
                        </p>
                        <div className="flex gap-3">
                            <Link href="/volumenes-semanales">
                                <Button variant="outline">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver
                                </Button>
                            </Link>
                            <Button onClick={onRefresh}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reintentar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!volume) {
        return (
            <Card className="w-full">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-full mb-4">
                            <AlertTriangle className="h-10 w-10 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">
                            No se encontró el volumen semanal
                        </h3>
                        <p className="text-amber-600 dark:text-amber-300 mb-4 max-w-md">
                            El volumen semanal solicitado no existe o no tienes permisos para verlo.
                        </p>
                        <Link href="/volumenes-semanales">
                            <Button>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver al historial
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Mapear estados a nombres más amigables
    const getStatusName = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Pendiente";
            case "PROCESSED":
                return "Procesado";
            case "CANCELLED":
                return "Cancelado";
            default:
                return status;
        }
    };

    // Obtener icono según el estado
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Clock className="h-5 w-5 text-amber-500" />;
            case "PROCESSED":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "CANCELLED":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <BarChart3 className="h-5 w-5 text-primary" />;
        }
    };

    // Obtener clases de color según el estado
    const getStatusColorClass = (status: string) => {
        switch (status) {
            case "PENDING":
                return "text-amber-600 dark:text-amber-400";
            case "PROCESSED":
                return "text-green-600 dark:text-green-400";
            case "CANCELLED":
                return "text-red-600 dark:text-red-400";
            default:
                return "text-gray-600 dark:text-gray-400";
        }
    };

    // Calcular porcentaje de volumen
    const totalVolume = volume.leftVolume + volume.rightVolume;
    const leftVolumePercentage = totalVolume > 0 ? (volume.leftVolume / totalVolume) * 100 : 0;
    const rightVolumePercentage = totalVolume > 0 ? (volume.rightVolume / totalVolume) * 100 : 0;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Detalles de Volumen Semanal
                    </CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualizar
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Información básica */}
                        <div className="bg-muted/20 p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-lg">Información General</h3>
                                <div className={`flex items-center gap-2 ${getStatusColorClass(volume.status)}`}>
                                    {getStatusIcon(volume.status)}
                                    <span className="font-medium">{getStatusName(volume.status)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">ID</p>
                                    <p className="font-medium">#{volume.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        <p className="font-medium">
                                            {format(new Date(volume.weekStartDate), "PPP", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha de fin</p>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        <p className="font-medium">
                                            {format(new Date(volume.weekEndDate), "PPP", { locale: es })}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha de creación</p>
                                    <p className="font-medium">
                                        {format(new Date(volume.createdAt), "PPP", { locale: es })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Volúmenes y comisión */}
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <h3 className="font-medium text-lg mb-4">Volúmenes</h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MoveLeft className="h-5 w-5 text-blue-500" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Volumen Izquierdo</p>
                                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                    {volume.leftVolume.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {leftVolumePercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <Progress value={leftVolumePercentage} className="h-2 bg-muted" />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MoveRight className="h-5 w-5 text-emerald-500" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Volumen Derecho</p>
                                                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {volume.rightVolume.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                            {rightVolumePercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <Progress value={rightVolumePercentage} className="h-2 bg-muted" />
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Volumen Total</p>
                                        <p className="text-xl font-bold text-primary">
                                            {totalVolume.toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">Volumen Acumulado</p>
                                        <p className="font-semibold">
                                            {volume.carryOverVolume.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Comisión */}
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800/50">
                            <h3 className="font-medium text-lg mb-4">Información de Comisión</h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monto pagado</p>
                                        <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                            {volume.paidAmount !== null ? formatCurrency(volume.paidAmount) : "N/A"}
                                        </p>
                                    </div>

                                    {volume.selectedSide && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Lado seleccionado</p>
                                            <div className="flex items-center gap-2">
                                                {volume.selectedSide === "LEFT" ? (
                                                    <>
                                                        <MoveLeft className="h-4 w-4 text-blue-500" />
                                                        <p className="font-medium">Izquierdo</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <MoveRight className="h-4 w-4 text-emerald-500" />
                                                        <p className="font-medium">Derecho</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        {volume.metadata && Object.keys(volume.metadata).length > 0 && (
                            <div className="bg-muted/20 p-4 rounded-lg border">
                                <h3 className="font-medium text-lg mb-4">Información Adicional</h3>
                                <div className="space-y-2">
                                    {Object.entries(volume.metadata).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-2 gap-2">
                                            <p className="text-sm text-muted-foreground capitalize">
                                                {key.replace(/_/g, " ")}:
                                            </p>
                                            <p className="text-sm font-medium">
                                                {value !== null && value !== undefined ? String(value) : "-"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Acciones */}
                        <div className="bg-muted/10 p-4 rounded-lg border">
                            <h3 className="font-medium text-lg mb-4">Acciones</h3>
                            <div className="flex flex-col gap-2">
                                <Link href="/volumenes-semanales">
                                    <Button variant="outline" className="w-full">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Volver al Historial
                                    </Button>
                                </Link>
                                {volume.status === "PENDING" && (
                                    <Button className="w-full mt-2">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Verificar Estado
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function WeeklyVolumeDetailSkeleton() {
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-muted/20 p-4 rounded-lg border">
                            <div className="flex justify-between mb-4">
                                <Skeleton className="h-6 w-36" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i}>
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <Skeleton className="h-2 w-full" />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <Skeleton className="h-2 w-full" />
                                </div>
                                <Skeleton className="h-1 w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-8 w-32" />
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-24 mb-2" />
                                        <Skeleton className="h-6 w-28" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-8 w-32" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-muted/20 p-4 rounded-lg border">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="space-y-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="grid grid-cols-2 gap-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-muted/10 p-4 rounded-lg border">
                            <Skeleton className="h-6 w-24 mb-4" />
                            <Skeleton className="h-9 w-full mb-2" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}