import { TablePagination } from "@/components/common/table/TablePagination";
import { TableSkeleton } from "@/components/common/table/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemOrder } from "@/types/ecommerce/client/ecommerce.types";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Eye, Package, RefreshCw, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface OrdersMobileViewProps {
    orders: ItemOrder[];
    isLoading: boolean;
    error: string | null;
    meta: {
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    } | null;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onRefresh?: () => Promise<void>;
}

export function OrdersMobileView({
    orders,
    isLoading,
    error,
    meta,
    currentPage,
    itemsPerPage,
    onPageChange,
    onPageSizeChange,
    onRefresh,
}: OrdersMobileViewProps) {
    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                                <ShoppingBag className="h-4 w-4 text-red-500" />
                            </div>
                            <h3 className="font-medium text-red-800 dark:text-red-300">
                                Error al cargar pedidos
                            </h3>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        {onRefresh && (
                            <Button
                                onClick={onRefresh}
                                variant="outline"
                                size="sm"
                                className="mt-4 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
                            >
                                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                                Reintentar
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (orders.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        Historial de Pedidos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-8 border rounded-lg">
                        <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                            <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No hay pedidos</h3>
                        <p className="text-muted-foreground mb-4">
                            Aún no has realizado ningún pedido en nuestra tienda.
                        </p>
                        <Link href="/tienda/productos">
                            <Button>Ir a la tienda</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDIENTE":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40">
                        Pendiente
                    </Badge>
                );
            case "APROBADO":
                return (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40">
                        Aprobado
                    </Badge>
                );
            case "ENVIADO":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40">
                        Enviado
                    </Badge>
                );
            case "ENTREGADO":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40">
                        Entregado
                    </Badge>
                );
            case "RECHAZADO":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40">
                        Rechazado
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    Historial de Pedidos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex flex-col divide-y">
                                    {/* Cabecera con estado e ID */}
                                    <div className="flex items-center justify-between p-4 bg-muted/20">
                                        {getStatusBadge(order.status)}
                                        <div className="text-sm font-medium">
                                            <span>#{order.id}</span>
                                        </div>
                                    </div>

                                    {/* Contenido principal */}
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-start gap-2">
                                            <div className="text-xs text-muted-foreground">Fecha:</div>
                                            <div className="text-sm">
                                                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <div className="text-xs text-muted-foreground">Productos:</div>
                                            <div className="text-sm font-medium">{order.totalItems}</div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <div className="text-xs text-muted-foreground">Total:</div>
                                            <div className="text-sm font-bold text-primary">
                                                {formatCurrency(order.totalAmount)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pie con botón de acción */}
                                    <div className="p-3 bg-muted/10">
                                        <Link href={`/tienda/pedidos/detalle/${order.id}`}>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="w-full flex items-center justify-center gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Ver detalles</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {meta && (
                        <TablePagination
                            pagination={{
                                pageIndex: currentPage - 1,
                                pageSize: itemsPerPage,
                            }}
                            pageCount={meta.totalPages}
                            pageIndex={currentPage - 1}
                            canNextPage={currentPage >= meta.totalPages}
                            canPreviousPage={currentPage <= 1}
                            setPageIndex={(idx) => onPageChange(Number(idx) + 1)}
                            setPageSize={() => onPageSizeChange}
                            previousPage={() => onPageChange(Math.max(1, currentPage - 1))}
                            nextPage={() => onPageChange(Math.min(meta.totalPages, currentPage + 1))}
                            totalItems={meta.totalItems}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}