import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MembershipHistoryItem } from "@/types/plan/membership";
import { format } from "date-fns";
import { Calendar, Info, Tag } from "lucide-react";
import ActionBadge from "./ActionBadge";


interface MobileTableViewProps {
    historyItems: MembershipHistoryItem[];
    openModal: (item: MembershipHistoryItem) => void;

}
function MobileTableView({ historyItems, openModal }: MobileTableViewProps) {
    if (!historyItems.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground border rounded-md bg-muted/5">
                <Info className="h-12 w-12 text-muted-foreground/70 mb-2" />
                <p>No se encontraron registros de historial</p>
                <p className="text-sm mt-1">No hay actividad registrada para esta membresía</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {historyItems.map((item) => {
                const date = item.createdAt
                    ? new Date(item.createdAt)
                    : null;

                return (
                    <Card key={item.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col divide-y">
                                {/* Cabecera con acción e ID */}
                                <div className="flex items-center justify-between p-4 bg-muted/20">
                                    <ActionBadge action={item.action} />
                                    <div className="text-sm text-muted-foreground">
                                        <span>#{item.id}</span>
                                    </div>
                                </div>

                                {/* Contenido principal */}
                                <div className="p-4 space-y-3">
                                    {item.notes && (
                                        <div className="flex items-start gap-2">
                                            <Tag className="h-4 w-4 text-primary mt-1" />
                                            <div className="text-sm">
                                                {item.notes}
                                            </div>
                                        </div>
                                    )}

                                    {date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex flex-col">
                                                <span className="text-sm">{format(date, "dd/MM/yyyy")}</span>
                                                <span className="text-xs text-muted-foreground">{format(date, "HH:mm")}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Pie con botón de acción si hay detalles */}
                                {item.changes && (
                                    <div className="p-3 bg-muted/10">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full flex items-center justify-center gap-2"
                                            onClick={() => openModal(item)}
                                        >
                                            <Info className="h-4 w-4" />
                                            <span>Ver cambios</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default MobileTableView;