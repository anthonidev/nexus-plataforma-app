import { TablePagination } from "@/components/common/table/TablePagination";
import { TableSkeleton } from "@/components/common/table/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ItemOrder } from "@/types/ecommerce/client/ecommerce.types";
import { formatCurrency } from "@/utils/format-currency.utils";
import { BarChart3, Eye, Package, RefreshCw, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface OrdersTableProps {
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

export function OrdersTable({
    orders,
    isLoading,
    error,
    meta,
    currentPage,
    itemsPerPage,
    onPageChange,
    onPageSizeChange,
    onRefresh,
}: OrdersTableProps) {
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
                    <div className="rounded-md border overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-muted/50">
                                        <TableHead className="font-semibold text-sm">Pedido</TableHead>
                                        <TableHead className="font-semibold text-sm">Fecha</TableHead>
                                        <TableHead className="font-semibold text-sm">Productos</TableHead>
                                        <TableHead className="font-semibold text-sm">Total</TableHead>
                                        <TableHead className="font-semibold text-sm">Estado</TableHead>
                                        <TableHead className="font-semibold text-sm text-right">Acción</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id} className="transition-colors hover:bg-muted/50">
                                            <TableCell className="font-medium">#{order.id}</TableCell>
                                            <TableCell>
                                                {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                                            </TableCell>
                                            <TableCell>{order.totalItems}</TableCell>
                                            <TableCell className="font-semibold text-primary">
                                                {formatCurrency(order.totalAmount)}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/tienda/pedidos/detalle/${order.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        <span>Ver</span>
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

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