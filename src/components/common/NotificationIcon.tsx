"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, CheckCircle, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function NotificationIcon() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
    const [isOpen, setIsOpen] = useState(false);

    // Obtener notificaciones con filtro según la pestaña activa
    const {
        unreadCount,
        notifications,
        markAsRead,
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

    // Formatear fecha relativa
    const getRelativeTime = (date: Date) => {
        return formatDistanceToNow(new Date(date), {
            addSuffix: true,
            locale: es
        });
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 rounded-lg hover:bg-secondary transition-colors outline-none flex items-center gap-1.5"
                >
                    <Bell size={20} className="text-muted-foreground" />

                    {/* Contador de notificaciones */}
                    {unreadCount > 0 && (
                        <span className="text-xs font-medium text-muted-foreground">
                            {unreadCount > 5 ? `+5` : unreadCount}
                        </span>
                    )}

                    {/* Indicador de ping */}
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full">
                            <span className="absolute inset-0 rounded-full animate-ping bg-destructive/60" />
                        </span>
                    )}
                </motion.button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 bg-popover text-popover-foreground"
            >
                <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium">Notificaciones</span>
                    {unreadCount > 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {unreadCount} {unreadCount === 1 ? "nueva" : "nuevas"}
                        </span>
                    )}
                </div>

                <Separator className="bg-border" />

                {/* Tabs para filtrar entre todas o solo no leídas */}
                <div className="px-3 pt-1 pb-0">
                    <Tabs
                        value={activeTab}
                        onValueChange={(v) => setActiveTab(v as "all" | "unread")}
                        className="w-full"
                    >
                        <TabsList className="w-full grid grid-cols-2 h-8">
                            <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
                            <TabsTrigger value="unread" className="text-xs">No leídas</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <AnimatePresence>
                    {notifications.length > 0 ? (
                        <>
                            {/* Lista de notificaciones */}
                            <div className="max-h-[250px] overflow-y-auto py-1">
                                {notifications.map((notification, index) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <DropdownMenuItem
                                            className={`flex flex-col items-start gap-1 px-3 py-2 cursor-pointer focus:bg-secondary/80 hover:bg-secondary/80 ${!notification.isRead ? 'bg-primary/5' : ''
                                                }`}
                                            onClick={() => handleNotificationClick(notification.id, notification.isRead, notification.actionUrl)}
                                        >
                                            <div className="flex justify-between items-start w-full">
                                                <span className="font-medium">{notification.title}</span>
                                                {notification.isRead && (
                                                    <CheckCircle className="h-3 w-3 text-primary flex-shrink-0 mt-1" />
                                                )}
                                            </div>

                                            <span className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </span>

                                            <span className="text-xs text-muted-foreground mt-1">
                                                {getRelativeTime(notification.createdAt)}
                                            </span>

                                            {index !== notifications.length - 1 && (
                                                <Separator className="bg-border/50 w-full mt-2" />
                                            )}
                                        </DropdownMenuItem>
                                    </motion.div>
                                ))}
                            </div>

                            <Separator className="bg-border" />

                            <div className="p-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-between"
                                    onClick={handleViewAll}
                                >
                                    <span>Ver todas las notificaciones</span>
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="p-6 text-sm text-center text-muted-foreground">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <Bell className="h-8 w-8 text-muted-foreground/50" />
                                <p>
                                    {activeTab === "unread"
                                        ? "No hay notificaciones sin leer"
                                        : "No hay notificaciones"}
                                </p>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={handleViewAll}
                                >
                                    <span>Ver historial completo</span>
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


