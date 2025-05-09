import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailTransactionResponse } from "@/types/points/point";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    RefreshCw,
    XCircle
} from "lucide-react";
import Link from "next/link";

interface TransactionDetailCardProps {
    transaction: DetailTransactionResponse | null;
    isLoading: boolean;
    error: string | null;
    onRefresh: () => Promise<void>;
}

export function TransactionDetailCard({
    transaction,
    isLoading,
    error,
    onRefresh
}: TransactionDetailCardProps) {

    if (isLoading) {
        return <TransactionDetailSkeleton />;
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
                            Error al cargar la transacción
                        </h3>
                        <p className="text-red-600 dark:text-red-300 mb-4 max-w-md">
                            {error}
                        </p>
                        <div className="flex gap-3">
                            <Link href="/historial-puntos">
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

    if (!transaction) {
        return (
            <Card className="w-full">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="bg-amber-100 dark:bg-amber-900/20 p-4 rounded-full mb-4">
                            <AlertTriangle className="h-10 w-10 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-400 mb-2">
                            No se encontró la transacción
                        </h3>
                        <p className="text-amber-600 dark:text-amber-300 mb-4 max-w-md">
                            La transacción solicitada no existe o no tienes permisos para verla.
                        </p>
                        <Link href="/historial-puntos">
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

    // Mapear tipos de transacción a nombres más amigables
    const getTypeName = (type: string) => {
        switch (type) {
            case "WITHDRAWAL":
                return "Retiro";
            case "BINARY_COMMISSION":
                return "Comisión Binaria";
            case "DIRECT_BONUS":
                return "Bono Directo";
            default:
                return type;
        }
    };

    // Mapear estados a nombres más amigables
    const getStatusName = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Pendiente";
            case "COMPLETED":
                return "Completado";
            case "CANCELLED":
                return "Cancelado";
            case "FAILED":
                return "Fallido";
            default:
                return status;
        }
    };

    // Obtener icono según el estado
    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING":
                return <Clock className="h-5 w-5 text-amber-500" />;
            case "COMPLETED":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "CANCELLED":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "FAILED":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <CreditCard className="h-5 w-5 text-primary" />;
        }
    };

    // Obtener clases de color según el estado
    const getStatusColorClass = (status: string) => {
        switch (status) {
            case "PENDING":
                return "text-amber-600 dark:text-amber-400";
            case "COMPLETED":
                return "text-green-600 dark:text-green-400";
            case "CANCELLED":
            case "FAILED":
                return "text-red-600 dark:text-red-400";
            default:
                return "text-gray-600 dark:text-gray-400";
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Detalles de la Transacción
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
                                <h3 className="font-medium text-lg">Información Básica</h3>
                                <div className={`flex items-center gap-2 ${getStatusColorClass(transaction.status)}`}>
                                    {getStatusIcon(transaction.status)}
                                    <span className="font-medium">{getStatusName(transaction.status)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">ID Transacción</p>
                                    <p className="font-medium">#{transaction.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tipo</p>
                                    <p className="font-medium">{getTypeName(transaction.type)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha</p>
                                    <p className="font-medium">
                                        {format(new Date(transaction.createdAt), "PPP", { locale: es })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Hora</p>
                                    <p className="font-medium">
                                        {format(new Date(transaction.createdAt), "HH:mm:ss")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Montos */}
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                            <h3 className="font-medium text-lg mb-4">Información de Montos</h3>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monto Total</p>
                                        <p className="text-2xl font-bold text-primary">{transaction.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monto Retirado</p>
                                        <p className="text-lg font-medium">{transaction.withdrawnAmount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Monto Pendiente</p>
                                    <p className="font-medium">{transaction.pendingAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata y detalles adicionales */}
                    <div className="space-y-6">
                        {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                            <div className="bg-muted/20 p-4 rounded-lg border">
                                <h3 className="font-medium text-lg mb-4">Información Adicional</h3>
                                <div className="space-y-2">
                                    {Object.entries(transaction.metadata).map(([key, value]) => (
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
                                <Link href="/historial-puntos">
                                    <Button variant="outline" className="w-full">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Volver al Historial
                                    </Button>
                                </Link>
                                {transaction.status === "PENDING" && (
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

function TransactionDetailSkeleton() {
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
                            <div className="space-y-3">
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
                                <Skeleton className="h-1 w-full my-3" />
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
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