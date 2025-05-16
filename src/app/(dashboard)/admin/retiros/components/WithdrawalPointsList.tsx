"use client";

import { TablePagination } from "@/components/common/table/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Items } from "@/types/withdrawals/finance-withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import {
    Calendar,
    CheckCircle2,
    CircleDollarSign,
    HelpCircle,
    Info,
    XCircle,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface WithdrawalPointsListProps {
    points: Items[];
    pointsMeta: any;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    isLoading: boolean;
}

export function WithdrawalPointsList({
    points,
    pointsMeta,
    currentPage,
    itemsPerPage,
    onPageChange,
    onPageSizeChange,
    isLoading,
}: WithdrawalPointsListProps) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Mapeo de estados a estilos y componentes
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        Pendiente
                    </Badge>
                );
            case "APPROVED":
            case "COMPLETED":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        Completado
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                        Rechazado
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                        {status}
                    </Badge>
                );
        }
    };

    // Obtener el icono correspondiente al tipo de punto
    const getPointTypeIcon = (type: string) => {
        switch (type) {
            case "BINARY_COMMISSION":
                return <CircleDollarSign className="h-4 w-4 text-blue-500" />;
            case "DIRECT_BONUS":
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case "WITHDRAWAL":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <HelpCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    // Vista móvil
    const renderMobileView = () => {
        if (points.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground border rounded-md bg-muted/5">
                    <Info className="h-12 w-12 text-muted-foreground/70 mb-2" />
                    <p>No hay puntos utilizados para este retiro</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {points.map((point, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                                {getPointTypeIcon(point.points.type)}
                                <span className="font-medium">
                                    {point.points.type === "BINARY_COMMISSION"
                                        ? "Comisión Binaria"
                                        : point.points.type === "DIRECT_BONUS"
                                            ? "Bono Directo"
                                            : point.points.type === "WITHDRAWAL"
                                                ? "Retiro"
                                                : point.points.type}
                                </span>
                            </div>
                            {getStatusBadge(point.points.status)}
                        </div>

                        <div className="space-y-2 mt-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Monto utilizado:</span>
                                <span className="font-semibold">{formatCurrency(point.amountUsed)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Monto total:</span>
                                <span>{formatCurrency(point.points.amount)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Fecha:</span>
                                <span className="text-sm">
                                    {format(new Date(point.points.createdAt), "dd/MM/yyyy")}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    // Vista desktop
    const renderDesktopView = () => {
        return (
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Monto Utilizado</TableHead>
                            <TableHead>Monto Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha Creación</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {points.length > 0 ? (
                            points.map((point, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">#{point.points.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getPointTypeIcon(point.points.type)}
                                            <span>
                                                {point.points.type === "BINARY_COMMISSION"
                                                    ? "Comisión Binaria"
                                                    : point.points.type === "DIRECT_BONUS"
                                                        ? "Bono Directo"
                                                        : point.points.type === "WITHDRAWAL"
                                                            ? "Retiro"
                                                            : point.points.type}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{formatCurrency(point.amountUsed)}</TableCell>
                                    <TableCell>{formatCurrency(point.points.amount)}</TableCell>
                                    <TableCell>{getStatusBadge(point.points.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>
                                                {format(new Date(point.points.createdAt), "dd/MM/yyyy")}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No hay puntos utilizados para este retiro
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-[300px] w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {isMobile ? renderMobileView() : renderDesktopView()}

            {pointsMeta && pointsMeta.totalPages > 1 && (
                <TablePagination
                    pagination={{
                        pageIndex: currentPage - 1,
                        pageSize: itemsPerPage,
                    }}
                    pageCount={pointsMeta.totalPages}
                    pageIndex={currentPage - 1}
                    totalItems={pointsMeta.totalItems}
                    setPageIndex={(updatedPageIndex) => onPageChange(Number(updatedPageIndex) + 1)}
                    setPageSize={() => onPageSizeChange}
                    previousPage={() => onPageChange(currentPage - 1)}
                    nextPage={() => onPageChange(currentPage + 1)}
                    canPreviousPage={currentPage <= 1}
                    canNextPage={currentPage >= pointsMeta.totalPages}
                />
            )}
        </div>
    );
}