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
import { ArrowDown, ArrowUp, Box, MinusCircle, PlusCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface StockHistoryItem {
    id: number;
    actionType: string;
    previousQuantity: number;
    newQuantity: number;
    quantityChanged: number;
    notes: string;
    createdAt: Date;
    updatedBy: {
        id: string;
        email: string;
    };
}

interface StockHistoryProps {
    stockHistory: StockHistoryItem[];
    meta: {
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    } | null;
    onPageChange: (page: number) => void;
    onPageSizeChange: (limit: number) => void;
    onUpdateStock: () => void;
    currentStock: number;
}

export function StockHistory({
    stockHistory,
    meta,
    onPageChange,
    onPageSizeChange,
    onUpdateStock,
    currentStock,
}: StockHistoryProps) {
    const getActionTypeDisplay = (actionType: string) => {
        switch (actionType) {
            case "INCREASE":
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        Aumento
                    </Badge>
                );
            case "DECREASE":
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-0">
                        <ArrowDown className="h-3 w-3 mr-1" />
                        Reducción
                    </Badge>
                );
            case "UPDATE":
                return (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Actualización
                    </Badge>
                );
            default:
                return <Badge variant="outline">{actionType}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Historial de Stock</h3>
                    <p className="text-sm text-muted-foreground">
                        Stock actual: <span className="font-medium">{currentStock}</span> unidades
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onUpdateStock}>
                        <PlusCircle className="h-4 w-4 mr-2 text-green-500" />
                        Actualizar Stock
                    </Button>
                </div>
            </div>

            {stockHistory.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted/10">
                    <div className="mx-auto w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center mb-2">
                        <Box className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-base font-medium mb-1">Sin registro de movimientos</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        No hay historial de stock para este producto.
                    </p>
                    <Button onClick={onUpdateStock}>
                        Registrar movimiento de stock
                    </Button>
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Cantidad anterior</TableHead>
                                <TableHead>Cambio</TableHead>
                                <TableHead>Cantidad nueva</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead className="hidden md:table-cell">Notas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stockHistory.map((record) => (
                                <TableRow key={record.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        {record.createdAt
                                            ? format(new Date(record.createdAt), "dd/MM/yyyy HH:mm", {
                                                locale: es,
                                            })
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>{getActionTypeDisplay(record.actionType)}</TableCell>
                                    <TableCell>{record.previousQuantity}</TableCell>
                                    <TableCell>
                                        <span
                                            className={
                                                record.quantityChanged > 0
                                                    ? "text-green-600 dark:text-green-400"
                                                    : record.quantityChanged < 0
                                                        ? "text-red-600 dark:text-red-400"
                                                        : ""
                                            }
                                        >
                                            {record.quantityChanged > 0 ? "+" : ""}
                                            {record.quantityChanged}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">{record.newQuantity}</TableCell>
                                    <TableCell>{record.updatedBy?.email || "Sistema"}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {record.notes || (
                                            <span className="text-muted-foreground text-sm">Sin notas</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {meta && (
                <TablePagination
                    pagination={{
                        pageIndex: meta.currentPage - 1,
                        pageSize: meta.itemsPerPage,
                    }}
                    pageCount={meta.totalPages}
                    pageIndex={meta.currentPage - 1}
                    canNextPage={meta.currentPage >= meta.totalPages}
                    canPreviousPage={meta.currentPage <= 1}
                    setPageIndex={(page) => onPageChange(Number(page) + 1)}
                    setPageSize={() => onPageSizeChange}
                    previousPage={() => onPageChange(Math.max(1, meta.currentPage - 1))}
                    nextPage={() => onPageChange(Math.min(meta.totalPages, meta.currentPage + 1))}
                    totalItems={meta.totalItems}
                />
            )}
        </div>
    );
}