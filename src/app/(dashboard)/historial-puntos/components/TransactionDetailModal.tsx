import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PointTransactionItem } from "@/types/points/point";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Calendar,
    CreditCard,
    ExternalLink,
    Info,
    X,
} from "lucide-react";
import Link from "next/link";

interface TransactionDetailModalProps {
    transaction: PointTransactionItem;
    open: boolean;
    onClose: () => void;
}

export function TransactionDetailModal({
    transaction,
    open,
    onClose,
}: TransactionDetailModalProps) {
    if (!transaction) return null;

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
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Detalles de la Transacción
                    </DialogTitle>
                    <DialogDescription>
                        Información completa de la transacción #{transaction.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Tipo</p>
                            <p className="font-medium">{getTypeName(transaction.type)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Estado</p>
                            <p className={`font-medium ${getStatusColorClass(transaction.status)}`}>
                                {getStatusName(transaction.status)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Cantidad</p>
                            <p className="text-xl font-bold text-primary">
                                {transaction.amount.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Fecha</p>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <p className="font-medium">
                                    {format(new Date(transaction.createdAt), "PPP", {
                                        locale: es,
                                    })}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(transaction.createdAt), "HH:mm:ss")}
                            </p>
                        </div>
                    </div>

                    {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <div className="flex items-center gap-1 mb-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-medium">Información adicional</p>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-md space-y-2">
                                    {Object.entries(transaction.metadata).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-2 gap-2">
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {key.replace(/_/g, " ")}:
                                            </p>
                                            <p className="text-xs font-medium">
                                                {value !== null && value !== undefined ? String(value) : "-"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <DialogFooter className="flex sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cerrar
                    </Button>

                    <Link
                        href={`/historial-puntos/detalle/${transaction.id}`}
                        className="flex-1"
                        onClick={onClose}
                    >
                        <Button
                            className="w-full"
                            variant="default"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver Detalle Completo
                        </Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}