import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { NotificationType } from "@/types/notifications/notification.type";
import { Check, Filter } from "lucide-react";
import { getNotificationIcon } from "../utils/notificationUtils";

interface NotificationFiltersProps {
    filterType: string;
    filterRead: "ALL" | "READ" | "UNREAD";
    onFilterTypeChange: (value: string) => void;
    onFilterReadChange: (value: "ALL" | "READ" | "UNREAD") => void;
    onMarkAllAsRead: () => Promise<void>;
    isMarkingAll: boolean;
    unreadCount: number;
}

export default function NotificationFilters({
    filterType,
    filterRead,
    onFilterTypeChange,
    onFilterReadChange,
    onMarkAllAsRead,
    isMarkingAll,
    unreadCount,
}: NotificationFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 bg-card border rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2 md:mb-0">
                    <Filter className="h-4 w-4" />
                    <span>Filtrar por:</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Select
                        value={filterType}
                        onValueChange={onFilterTypeChange}
                    >
                        <SelectTrigger className="w-full sm:w-48 h-9">
                            <SelectValue placeholder="Tipo de notificación" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todos los tipos</SelectItem>
                            {Object.values(NotificationType).map((type) => (
                                <SelectItem key={type} value={type} className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        {getNotificationIcon(type)}
                                        <span>
                                            {type === NotificationType.VOLUME_ADDED ? "Volumen añadido" :
                                                type === NotificationType.COMMISSION_EARNED ? "Comisión ganada" :
                                                    type === NotificationType.RANK_ACHIEVED ? "Rango alcanzado" :
                                                        type === NotificationType.REFERRAL_REGISTERED ? "Referido registrado" :
                                                            type === NotificationType.PAYMENT_APPROVED ? "Pago aprobado" :
                                                                type === NotificationType.PAYMENT_REJECTED ? "Pago rechazado" :
                                                                    type === NotificationType.MEMBERSHIP_EXPIRING ? "Membresía a vencer" :
                                                                        type === NotificationType.POINTS_MOVEMENT ? "Movimiento de puntos" :
                                                                            type === NotificationType.RECONSUMPTION_REMINDER ? "Recordatorio de reconsumo" :
                                                                                type === NotificationType.SYSTEM_ANNOUNCEMENT ? "Anuncio del sistema" :
                                                                                    type === NotificationType.DIRECT_BONUS ? "Bono directo" :
                                                                                        type === NotificationType.MEMBERSHIP_UPGRADE ? "Membresía actualizada" :
                                                                                            type}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filterRead}
                        onValueChange={(value: "ALL" | "READ" | "UNREAD") => onFilterReadChange(value)}
                    >
                        <SelectTrigger className="w-full sm:w-40 h-9">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todas</SelectItem>
                            <SelectItem value="READ">Leídas</SelectItem>
                            <SelectItem value="UNREAD">No leídas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                disabled={isMarkingAll || unreadCount === 0}
                className="whitespace-nowrap h-9"
            >
                {isMarkingAll ? (
                    <>
                        <span className="animate-spin mr-2">⏳</span>
                        Marcando...
                    </>
                ) : (
                    <>
                        <Check className="mr-2 h-4 w-4" />
                        Marcar todas como leídas
                    </>
                )}
            </Button>
        </div>
    );
}