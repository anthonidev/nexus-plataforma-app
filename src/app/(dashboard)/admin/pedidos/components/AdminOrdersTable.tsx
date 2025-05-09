import { TablePagination } from "@/components/common/table/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ItemOrder } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { ClipboardList, Eye, Package, RefreshCw } from "lucide-react";
import Link from "next/link";

interface AdminOrdersTableProps {
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

export function AdminOrdersTable({
    orders,
    isLoading,
    error,
    meta,
    currentPage,
    itemsPerPage,
    onPageChange,
    onPageSizeChange,
    onRefresh,
}: AdminOrdersTableProps) {
    if (error) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                        <ClipboardList className="h-4 w-4 text-red-500" />
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
        );
    }

    if (orders.length === 0 && !isLoading) {
        return (
            <div className="text-center p-8 border rounded-lg">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No hay pedidos</h3>
                <p className="text-muted-foreground mb-4">
                    No se encontraron pedidos que coincidan con los filtros aplicados.
                </p>
            </div>
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
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="font-semibold text-sm">ID</TableHead>
                            <TableHead className="font-semibold text-sm">Cliente</TableHead>
                            <TableHead className="font-semibold text-sm">Fecha</TableHead>
                            <TableHead className="font-semibold text-sm">Productos</TableHead>
                            <TableHead className="font-semibold text-sm">Total</TableHead>
                            <TableHead className="font-semibold text-sm">Estado</TableHead>
                            <TableHead className="font-semibold text-sm text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="transition-colors hover:bg-muted/50"
                            >
                                <TableCell className="font-medium">#{order.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {order.user?.personalInfo?.firstName} {order.user?.personalInfo?.lastName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {order.user?.email}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                                </TableCell>
                                <TableCell>{order.totalItems}</TableCell>
                                <TableCell className="font-semibold text-primary">
                                    {formatCurrency(order.totalAmount)}
                                </TableCell>
                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/admin/pedidos/detalle/${order.id}`}>

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
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {meta && (
                <div className="p-3 border-t">
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
                </div>
            )}
        </div>
    );
}