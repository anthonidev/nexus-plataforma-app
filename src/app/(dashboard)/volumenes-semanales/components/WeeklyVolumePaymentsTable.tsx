import { TablePagination } from "@/components/common/table/TablePagination";
import { TableSkeleton } from "@/components/common/table/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DetailVolumeResponse } from "@/types/points/volumen";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, CircleDollarSign, Info, RefreshCw, X } from "lucide-react";

interface WeeklyVolumePaymentsTableProps {
    volume: DetailVolumeResponse | null;
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onRefresh: () => Promise<void>;
}

export function WeeklyVolumePaymentsTable({
    volume,
    isLoading,
    error,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onRefresh
}: WeeklyVolumePaymentsTableProps) {
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
                                <CircleDollarSign className="h-4 w-4 text-red-500" />
                            </div>
                            <h3 className="font-medium text-red-800 dark:text-red-300">
                                Error al cargar pagos
                            </h3>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        <Button
                            onClick={onRefresh}
                            variant="outline"
                            size="sm"
                            className="mt-4 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
                        >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            Reintentar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!volume?.weeklyVolumesHistory?.items || volume.weeklyVolumesHistory.items.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                        Pagos Asociados
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Info className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-muted-foreground mb-2">No hay pagos asociados a este volumen semanal</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Obtener datos de paginación
    const { weeklyVolumesHistory } = volume;
    const { meta } = weeklyVolumesHistory;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                        Pagos Asociados a Comisiones
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={onRefresh} className="h-8 w-8 p-0">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="font-semibold text-sm">#ID</TableHead>
                                <TableHead className="font-semibold text-sm">Lado</TableHead>
                                <TableHead className="font-semibold text-sm">Volumen</TableHead>
                                <TableHead className="font-semibold text-sm">Monto</TableHead>
                                <TableHead className="font-semibold text-sm">Fecha</TableHead>
                                <TableHead className="font-semibold text-sm">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {weeklyVolumesHistory.items.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                        {item.payment.id}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={item.selectedSide === "LEFT"
                                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40"
                                        }>
                                            {item.selectedSide === "LEFT" ? "Izquierdo" : "Derecho"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {item.volume.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-semibold text-primary">
                                        {formatCurrency(item.payment.amount)}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(item.payment.status)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {meta && (
                    <div className="mt-4">
                        <TablePagination
                            pagination={{
                                pageIndex: currentPage - 1,
                                pageSize,
                            }}
                            pageIndex={currentPage - 1}
                            pageCount={meta.totalPages}
                            setPageSize={() => onPageSizeChange}
                            previousPage={() => onPageChange(currentPage - 1)}
                            nextPage={() => onPageChange(currentPage + 1)}
                            canPreviousPage={currentPage <= 1}
                            canNextPage={currentPage >= meta.totalPages}
                            totalItems={meta.totalItems}
                            setPageIndex={(index) => onPageChange(Number(index) + 1)}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function getStatusBadge(status: string) {
    switch (status) {
        case "PENDING":
            return (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    Pendiente
                </Badge>
            );
        case "APPROVED":
            return (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    <Check className="h-3 w-3 mr-1" />
                    Aprobado
                </Badge>
            );
        case "REJECTED":
            return (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <X className="h-3 w-3 mr-1" />
                    Rechazado
                </Badge>
            );
        case "COMPLETED":
            return (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    <Check className="h-3 w-3 mr-1" />
                    Completado
                </Badge>
            );
        default:
            return <Badge>{status}</Badge>;
    }
}