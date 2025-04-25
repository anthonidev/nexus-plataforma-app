// MobileTableView.tsx
import { WeeklyVolumeItem } from "@/types/points/volumen";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import {
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Info,
    MoveLeft,
    MoveRight,
    XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MobileTableViewProps {
    volumes: WeeklyVolumeItem[];
    onViewDetail: (volume: WeeklyVolumeItem) => void;
}

export function MobileTableView({ volumes, onViewDetail }: MobileTableViewProps) {
    if (!volumes.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground border rounded-md bg-muted/5">
                <Info className="h-12 w-12 text-muted-foreground/70 mb-2" />
                <p>No se encontraron volúmenes semanales</p>
                <p className="text-sm mt-1">Intenta ajustar los filtros para ver más resultados</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {volumes.map((volume) => {
                const startDate = new Date(volume.weekStartDate);
                const endDate = new Date(volume.weekEndDate);

                let statusBadge;
                switch (volume.status) {
                    case "PENDING":
                        statusBadge = (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40 flex items-center gap-1.5 px-2 py-0.5">
                                <Clock className="h-3 w-3" />
                                <span>Pendiente</span>
                            </Badge>
                        );
                        break;
                    case "PROCESSED":
                        statusBadge = (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40 flex items-center gap-1.5 px-2 py-0.5">
                                <CheckCircle className="h-3 w-3" />
                                <span>Procesado</span>
                            </Badge>
                        );
                        break;
                    case "CANCELLED":
                        statusBadge = (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40 flex items-center gap-1.5 px-2 py-0.5">
                                <XCircle className="h-3 w-3" />
                                <span>Cancelado</span>
                            </Badge>
                        );
                        break;
                    default:
                        statusBadge = <Badge variant="outline">{volume.status}</Badge>;
                }

                return (
                    <Card key={volume.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col divide-y">
                                {/* Cabecera con estado e ID */}
                                <div className="flex items-center justify-between p-4 bg-muted/20">
                                    {statusBadge}
                                    <div className="text-sm text-muted-foreground">
                                        <span>#{volume.id}</span>
                                    </div>
                                </div>

                                {/* Contenido principal */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm">{format(startDate, "dd/MM/yyyy")}</span>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <span>al</span>
                                                <span>{format(endDate, "dd/MM/yyyy")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <MoveLeft className="h-4 w-4 text-blue-500" />
                                            <div>
                                                <div className="text-xs text-muted-foreground">Vol. Izquierdo</div>
                                                <div className="font-semibold text-blue-600 dark:text-blue-400">
                                                    {volume.leftVolume.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MoveRight className="h-4 w-4 text-emerald-500" />
                                            <div>
                                                <div className="text-xs text-muted-foreground">Vol. Derecho</div>
                                                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {volume.rightVolume.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {volume.paidAmount !== null && volume.paidAmount > 0 && (
                                        <div className="flex items-center gap-2 mt-2 bg-primary/5 p-2 rounded-md">
                                            <DollarSign className="h-4 w-4 text-primary" />
                                            <div>
                                                <div className="text-xs text-muted-foreground">Comisión</div>
                                                <div className="font-semibold text-primary">
                                                    {formatCurrency(volume.paidAmount)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Pie con botón de acción */}
                                <div className="p-3 bg-muted/10">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => onViewDetail(volume)}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>Ver detalles</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}