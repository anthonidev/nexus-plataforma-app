"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
    Award,
    Bell,
    Check,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    Info,
    Sparkles,
    Trash2,
    User2,
    Users,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Notification,
    NotificationType
} from "@/types/notifications/notification.type";
import { useRouter } from "next/navigation";

interface NotificationsPanelProps {
    notifications: Notification[];
    onMarkAsRead: (ids: number[]) => Promise<any>;
    onMarkAllAsRead: () => Promise<any>;
    onClose: () => void;
}

export function NotificationsPanel({
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onClose,
}: NotificationsPanelProps) {
    const router = useRouter();
    const [isMarkingAll, setIsMarkingAll] = useState(false);
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const displayNotifications = activeTab === "all"
        ? notifications
        : unreadNotifications;

    // Manejar clic en una notificación
    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await onMarkAsRead([notification.id]);
        }

        if (notification.actionUrl) {
            router.push(notification.actionUrl);
            onClose();
        }
    };

    // Marcar todas como leídas
    const handleMarkAllAsRead = async () => {
        setIsMarkingAll(true);
        try {
            await onMarkAllAsRead();
        } finally {
            setIsMarkingAll(false);
        }
    };

    // Obtener icono según el tipo de notificación
    const getNotificationIcon = (type: NotificationType) => {
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
                return <Check className="h-5 w-5 text-green-500" />;
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
    };

    // Formatear fecha relativa (hoy, ayer) o absoluta
    const formatDate = (date: Date) => {
        const now = new Date();
        const timeDistance = formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: es
        });

        // Si es hoy o ayer, mostrar hora relativa
        if (timeDistance.includes("hace menos de un día") ||
            timeDistance.includes("hace 1 día")) {
            return timeDistance;
        }

        // Si es esta semana, mostrar día
        const diffDays = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 7) {
            return format(new Date(date), "EEEE 'a las' HH:mm", { locale: es });
        }

        // Si es más antiguo, mostrar fecha completa
        return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: es });
    };

    return (
        <div className="flex flex-col h-[500px]">
            <div className="flex items-center justify-between border-b p-3">
                <h3 className="font-semibold flex items-center gap-1.5">
                    <Bell className="h-4 w-4" />
                    Notificaciones
                    {unreadNotifications.length > 0 && (
                        <span className="ml-1 text-xs py-0.5 px-1.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                            {unreadNotifications.length}
                        </span>
                    )}
                </h3>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={unreadNotifications.length === 0 || isMarkingAll}
                        className="text-xs h-8"
                    >
                        {isMarkingAll ? (
                            <>
                                <span className="animate-spin mr-1">⏳</span>
                                Marcando...
                            </>
                        ) : (
                            <>Marcar todas como leídas</>
                        )}
                    </Button>
                </div>
            </div>

            <Tabs
                defaultValue="all"
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as "all" | "unread")}
                className="w-full"
            >
                <div className="border-b px-3">
                    <TabsList className="h-9 grid w-full grid-cols-2 mb-1">
                        <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                        <TabsTrigger value="unread" className="text-xs">No leídas</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all" className="m-0">
                    <NotificationsList
                        notifications={notifications}
                        onNotificationClick={handleNotificationClick}
                        getNotificationIcon={getNotificationIcon}
                        formatDate={formatDate}
                    />
                </TabsContent>

                <TabsContent value="unread" className="m-0">
                    <NotificationsList
                        notifications={unreadNotifications}
                        onNotificationClick={handleNotificationClick}
                        getNotificationIcon={getNotificationIcon}
                        formatDate={formatDate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}

interface NotificationsListProps {
    notifications: Notification[];
    onNotificationClick: (notification: Notification) => void;
    getNotificationIcon: (type: NotificationType) => React.ReactNode;
    formatDate: (date: Date) => string;
}

function NotificationsList({
    notifications,
    onNotificationClick,
    getNotificationIcon,
    formatDate
}: NotificationsListProps) {
    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <Bell className="h-10 w-10 mb-3 text-muted-foreground/50" />
                <p className="text-sm">No hay notificaciones</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[400px]">
            <div className="flex flex-col divide-y">
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                        className={`p-3 cursor-pointer transition-all ${!notification.isRead ? 'bg-primary/5' : ''}`}
                        onClick={() => onNotificationClick(notification)}
                    >
                        <div className="flex gap-3">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${notification.isRead
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-primary/10 text-primary'
                                }`}>
                                {getNotificationIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {notification.title}
                                    </h4>
                                    <div className="flex items-center gap-1">
                                        {!notification.isRead && (
                                            <span className="h-2 w-2 bg-primary rounded-full"></span>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <p className={`text-sm truncate ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.message}
                                </p>

                                {notification.actionUrl && (
                                    <div className="flex justify-end mt-1">
                                        <span className="text-xs flex items-center text-primary">
                                            Ver detalle <ChevronRight className="h-3 w-3 ml-1" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </ScrollArea>
    );
}