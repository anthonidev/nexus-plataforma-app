"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, RefreshCw } from "lucide-react";
import { Notification, NotificationType } from "@/types/notifications/notification.type";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";
import { TablePagination } from "@/components/common/table/TablePagination";

import NotificationFilters from "./components/NotificationFilters";
import NotificationList from "./components/NotificationList";
import { NotificationSkeleton } from "./components/NotificationSkeleton";

export default function NotificationsPage() {
    const router = useRouter();
    const [filterType, setFilterType] = useState<NotificationType | "ALL" | string>("ALL");
    const [filterRead, setFilterRead] = useState<"ALL" | "READ" | "UNREAD">("ALL");
    const [isMarkingAll, setIsMarkingAll] = useState(false);

    const {
        notifications,
        isLoading,
        error,
        meta,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updateFilters,
        refresh
    } = useNotifications({
        limit: 10,
        type: filterType !== "ALL" ? filterType as NotificationType : undefined,
        isRead: filterRead === "READ" ? true : filterRead === "UNREAD" ? false : undefined
    });

    // Manejar clic en una notificación
    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Si no está leída, marcarla como leída
            if (!notification.isRead) {
                await markAsRead([notification.id]);
            }

            // Si tiene URL de acción, navegar a ella
            if (notification.actionUrl) {
                router.push(notification.actionUrl);
            }
        } catch (error) {
            console.error("Error al procesar clic en notificación:", error);
            toast.error("No se pudo procesar la notificación");
        }
    };

    // Marcar una notificación como leída
    const handleMarkAsRead = async (id: number) => {
        try {
            await markAsRead([id]);
            toast.success("Notificación marcada como leída");
        } catch (error) {
            console.error("Error al marcar notificación como leída:", error);
            toast.error("No se pudo marcar la notificación como leída");
        }
    };

    // Marcar todas como leídas
    const handleMarkAllAsRead = async () => {
        setIsMarkingAll(true);
        try {
            await markAllAsRead();
            toast.success("Todas las notificaciones marcadas como leídas");
        } catch (error) {
            console.error("Error al marcar todas como leídas:", error);
            toast.error("No se pudieron marcar todas las notificaciones como leídas");
        } finally {
            setIsMarkingAll(false);
        }
    };

    // Eliminar notificación
    const handleDeleteNotification = async (id: number) => {
        try {
            await deleteNotification(id);
            toast.success("Notificación eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar notificación:", error);
            toast.error("No se pudo eliminar la notificación");
        }
    };

    // Para paginación
    const handlePageChange = (page: number) => {
        updateFilters({ page });
    };

    const handlePageSizeChange = (pageSize: number) => {
        updateFilters({ limit: pageSize });
    };

    // Para filtros
    const handleFilterTypeChange = (value: string) => {
        setFilterType(value);
        updateFilters({
            type: value !== "ALL" ? value as NotificationType : undefined,
            page: 1 // Resetear a página 1 al cambiar filtros
        });
    };

    const handleFilterReadChange = (value: "ALL" | "READ" | "UNREAD") => {
        setFilterRead(value);
        updateFilters({
            isRead: value === "READ" ? true : value === "UNREAD" ? false : undefined,
            page: 1 // Resetear a página 1 al cambiar filtros
        });
    };

    return (
        <div className="container py-6 md:py-8">
            <PageHeader
                title="Notificaciones"
                subtitle="Gestiona todas tus notificaciones"
                variant="gradient"
                icon={Bell}
                actions={
                    <Button
                        variant="outline"
                        onClick={() => refresh()}
                        disabled={isLoading}
                        className="h-9"
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                        />
                        Actualizar
                    </Button>
                }
            />

            <Card className="mt-6">
                <CardContent className="p-4 md:p-6">
                    {/* Componente de filtros */}
                    <NotificationFilters
                        filterType={filterType}
                        filterRead={filterRead}
                        onFilterTypeChange={handleFilterTypeChange}
                        onFilterReadChange={handleFilterReadChange}
                        onMarkAllAsRead={handleMarkAllAsRead}
                        isMarkingAll={isMarkingAll}
                        unreadCount={unreadCount}
                    />

                    {/* Loading, error o lista de notificaciones */}
                    {isLoading ? (
                        <NotificationSkeleton />
                    ) : error ? (
                        <div className="p-6 text-center">
                            <p className="text-red-500 dark:text-red-400">Error: {error}</p>
                            <Button variant="outline" onClick={refresh} className="mt-4">
                                Reintentar
                            </Button>
                        </div>
                    ) : (
                        <NotificationList
                            notifications={notifications}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDeleteNotification}
                            onNotificationClick={handleNotificationClick}
                        />
                    )}

                    {/* Paginación */}
                    {meta && notifications.length > 0 && (
                        <div className="mt-6">
                            <TablePagination
                                pagination={{
                                    pageIndex: meta.currentPage - 1,
                                    pageSize: meta.itemsPerPage,
                                }}
                                pageCount={meta.totalPages}
                                pageIndex={meta.currentPage - 1}
                                canNextPage={meta.currentPage >= meta.totalPages}
                                canPreviousPage={meta.currentPage <= 1}
                                setPageIndex={(page) => handlePageChange(Number(page) + 1)}
                                setPageSize={() => handlePageSizeChange}
                                previousPage={() => handlePageChange(Math.max(1, meta.currentPage - 1))}
                                nextPage={() => handlePageChange(Math.min(meta.totalPages, meta.currentPage + 1))}
                                totalItems={meta.totalItems}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}