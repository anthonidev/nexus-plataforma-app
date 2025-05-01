import { NotificationType } from "@/types/notifications/notification.type";
import {
    Award,
    Bell,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Info,
    Sparkles,
    User2,
    Users,
    X
} from "lucide-react";
import React from "react";

export function getNotificationIcon(type: NotificationType | string): React.ReactNode {
    switch (type) {
        case NotificationType.VOLUME_ADDED:
            return <Users className="h-5 w-5 text-blue-500" />;
        case NotificationType.COMMISSION_EARNED:
            return <DollarSign className="h-5 w-5 text-green-500" />;
        case NotificationType.RANK_ACHIEVED:
            return <Award className="h-5 w-5 text-amber-500" />;
        case NotificationType.REFERRAL_REGISTERED:
            return <User2 className="h-5 w-5 text-indigo-500" />;
        case NotificationType.PAYMENT_APPROVED:
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case NotificationType.PAYMENT_REJECTED:
            return <X className="h-5 w-5 text-red-500" />;
        case NotificationType.MEMBERSHIP_EXPIRING:
            return <Clock className="h-5 w-5 text-amber-500" />;
        case NotificationType.POINTS_MOVEMENT:
            return <Sparkles className="h-5 w-5 text-purple-500" />;
        case NotificationType.RECONSUMPTION_REMINDER:
            return <Bell className="h-5 w-5 text-amber-500" />;
        case NotificationType.SYSTEM_ANNOUNCEMENT:
            return <Info className="h-5 w-5 text-blue-500" />;
        case NotificationType.DIRECT_BONUS:
            return <DollarSign className="h-5 w-5 text-green-500" />;
        case NotificationType.MEMBERSHIP_UPGRADE:
            return <CreditCard className="h-5 w-5 text-teal-500" />;
        default:
            return <Bell className="h-5 w-5 text-primary" />;
    }
}

export function formatDate(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);

    // Diferencia en milisegundos
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
        return "hace un momento";
    } else if (diffMins < 60) {
        return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
        return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
        return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    } else {
        // Formato: DD/MM/YYYY HH:MM
        return notificationDate.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ' ' + notificationDate.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}