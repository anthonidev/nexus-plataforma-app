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
import { WeeklyVolumeItem } from "@/types/points/volumen";
import { format } from "@/utils/date.utils";
import { formatCurrency } from "@/utils/format-currency.utils";
import {
    BarChart3,
    Calendar,
    CircleDollarSign,
    Info,
    MoveLeft,
    MoveRight,
    X,
} from "lucide-react";

interface VolumeDetailModalProps {
    volume: WeeklyVolumeItem;
    open: boolean;
    onClose: () => void;
}

export function VolumeDetailModal({
    volume,
    open,
    onClose,
}: VolumeDetailModalProps) {
    if (!volume) return null;

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

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Detalle del Volumen Semanal
                    </DialogTitle>
                    <DialogDescription>
                        Información completa del volumen #{volume.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Período</p>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 mt-1">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                    <p className="font-medium">
                                        {format(new Date(volume.weekStartDate), "dd/MM/yyyy")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <MoveRight className="h-3.5 w-3.5 text-muted-foreground" />
                                    <p className="font-medium">
                                        {format(new Date(volume.weekEndDate), "dd/MM/yyyy")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Estado</p>
                            <p className={`font-medium ${getStatusColorClass(volume.status)}`}>
                                {getStatusName(volume.status)}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Volumen Izquierdo</p>
                            <div className="flex items-center gap-1">
                                <MoveLeft className="h-3.5 w-3.5 text-blue-500" />
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {volume.leftVolume.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Volumen Derecho</p>
                            <div className="flex items-center gap-1">
                                <MoveRight className="h-3.5 w-3.5 text-emerald-500" />
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {volume.rightVolume.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {volume.paidAmount !== null && (
                        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 border border-primary/20">
                            <p className="text-sm text-muted-foreground mb-1">Comisión Generada</p>
                            <div className="flex items-center gap-2">
                                <CircleDollarSign className="h-5 w-5 text-primary" />
                                <p className="text-xl font-bold text-primary">
                                    {formatCurrency(volume.paidAmount || 0)}
                                </p>
                            </div>
                            {volume.selectedSide && (
                                <div className="mt-2 text-sm">
                                    <span className="text-muted-foreground">Lado seleccionado: </span>
                                    <span className="font-medium">
                                        {volume.selectedSide === "LEFT" ? "Izquierdo" : "Derecho"}
                                    </span>
                                </div>
                            )}
                            {volume.carryOverVolume > 0 && (
                                <div className="mt-1 text-sm">
                                    <span className="text-muted-foreground">Volumen acumulado: </span>
                                    <span className="font-medium">
                                        {volume.carryOverVolume.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {volume.metadata && Object.keys(volume.metadata).length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <div className="flex items-center gap-1 mb-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    <p className="text-sm font-medium">Información adicional</p>
                                </div>
                                <div className="bg-muted/30 p-3 rounded-md space-y-2">
                                    {Object.entries(volume.metadata).map(([key, value]) => (
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

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto flex items-center justify-center gap-1"
                    >
                        <X className="h-4 w-4" />
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}