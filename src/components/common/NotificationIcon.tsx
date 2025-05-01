import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    CheckCircle,
    ChevronRight,
    Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotificationIcon() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("all");
    const [isOpen, setIsOpen] = useState(false);
    const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

    // Obtener notificaciones con filtro según la pestaña activa
    const {
        unreadCount,
        notifications,
        markAsRead,
        markAllAsRead,
        refresh,
        updateFilters
    } = useNotifications({
        limit: 5,
        isRead: activeTab === "all" ? undefined : false
    });

    // Refrescar cuando cambie la pestaña
    useEffect(() => {
        if (isOpen) {
            updateFilters({ isRead: activeTab === "all" ? undefined : false });
        }
    }, [activeTab, isOpen, updateFilters]);

    // Cuando se abre el panel, cargar notificaciones frescas
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            refresh();
        }
    };

    // Manejar clic en una notificación
    const handleNotificationClick = async (notificationId: number, isRead: boolean, actionUrl?: string) => {
        try {
            if (!isRead) {
                await markAsRead([notificationId]);
            }

            if (actionUrl) {
                router.push(actionUrl);
            }
            setIsOpen(false);
        } catch (error) {
            console.error("Error al marcar notificación como leída:", error);
        }
    };

    // Manejar clic en "Ver todas"
    const handleViewAll = () => {
        router.push("/notificaciones");
        setIsOpen(false);
    };

    // Marcar todas como leídas
    const handleMarkAllAsRead = async () => {
        setIsMarkingAllAsRead(true);
        try {
            await markAllAsRead();
        } catch (error) {
            console.error("Error al marcar todas como leídas:", error);
        } finally {
            setIsMarkingAllAsRead(false);
        }
    };

    // Formatear fecha relativa de manera sencilla
    interface Notification {
        id: number;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: string;
        actionUrl?: string;
    }

    const getRelativeTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
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
            // Formatear fecha como DD/MM/YYYY
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    };

    // Obtener las notificaciones a mostrar según la pestaña
    const visibleNotifications = activeTab === "all"
        ? notifications
        : notifications.filter(n => !n.isRead);

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <motion.div
                    className="relative flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative w-10 h-10 rounded-full"
                    >
                        <Bell size={20} className="text-muted-foreground" />

                        {/* Badge con contador */}
                        {unreadCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] flex items-center justify-center p-0 text-[0.7rem]"
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Badge>
                        )}

                        {/* Animación de ping para llamar la atención */}
                        {unreadCount > 0 && (
                            <motion.span
                                className="absolute top-0 right-0 w-full h-full rounded-full"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: [0.8, 1.2, 0.8],
                                    opacity: [0, 0.4, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        )}
                    </Button>
                </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 p-0"
                sideOffset={8}
            >
                {/* Header con título y contador */}
                <div className="flex items-center justify-between p-3 bg-muted/20 border-b">
                    <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-primary" />
                        <span className="font-medium">Notificaciones</span>
                    </div>

                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                            {unreadCount} {unreadCount === 1 ? 'nueva' : 'nuevas'}
                        </Badge>
                    )}
                </div>

                {/* Tabs para filtrar */}
                <div className="p-1 border-b">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="w-full grid grid-cols-2 h-8">
                            <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                            <TabsTrigger value="unread" className="text-xs">No leídas</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <AnimatePresence mode="wait">
                    {visibleNotifications.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Lista de notificaciones */}
                            <ScrollArea className="max-h-[300px] overflow-y-auto">
                                {visibleNotifications.map((notification, index) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <DropdownMenuItem
                                            onClick={() => handleNotificationClick(notification.id, notification.isRead, notification.actionUrl)}
                                            className={`flex flex-col items-start gap-1 px-3 py-2 ${!notification.isRead ? 'bg-primary/5' : ''
                                                }`}
                                        >
                                            <div className="flex justify-between items-start w-full">
                                                <span className="font-medium text-sm line-clamp-1">
                                                    {notification.title}
                                                </span>
                                                <div className="flex items-center">
                                                    {notification.isRead ? (
                                                        <CheckCircle className="h-3 w-3 text-primary flex-shrink-0 ml-2" />
                                                    ) : (
                                                        <Clock className="h-3 w-3 text-amber-500 flex-shrink-0 ml-2" />
                                                    )}
                                                </div>
                                            </div>

                                            <span className="text-xs text-muted-foreground line-clamp-2 w-full">
                                                {notification.message}
                                            </span>

                                            <div className="flex justify-between items-center w-full mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {getRelativeTime(notification.createdAt.toString())}
                                                </span>

                                                {notification.actionUrl && (
                                                    <span className="text-xs flex items-center text-primary">
                                                        Ver <ChevronRight className="h-3 w-3 ml-1" />
                                                    </span>
                                                )}
                                            </div>

                                            {index !== visibleNotifications.length - 1 && (
                                                <DropdownMenuSeparator className="my-1" />
                                            )}
                                        </DropdownMenuItem>
                                    </motion.div>
                                ))}
                            </ScrollArea>

                            {/* Footer con acciones */}
                            <div className="p-2 border-t bg-muted/10">
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleMarkAllAsRead}
                                        disabled={unreadCount === 0 || isMarkingAllAsRead}
                                        className="text-xs h-8"
                                    >
                                        {isMarkingAllAsRead ? (
                                            <span className="flex items-center gap-1">
                                                <motion.span
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Clock className="h-3 w-3" />
                                                </motion.span>
                                                Marcando...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                Marcar leídas
                                            </span>
                                        )}
                                    </Button>

                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={handleViewAll}
                                        className="text-xs h-8"
                                    >
                                        Ver todas
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-6 flex flex-col items-center justify-center"
                        >
                            <div className="bg-muted/20 p-4 rounded-full mb-3">
                                <Bell className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-center text-muted-foreground mb-3">
                                {activeTab === "all"
                                    ? "No tienes notificaciones"
                                    : "No tienes notificaciones sin leer"}
                            </p>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleViewAll}
                                className="mt-2"
                            >
                                Ver historial
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}