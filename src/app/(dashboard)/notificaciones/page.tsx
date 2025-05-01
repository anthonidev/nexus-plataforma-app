"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { TablePagination } from "@/components/common/table/TablePagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useNotifications
} from "@/hooks/useNotifications";
import {
    Notification,
    NotificationType
} from "@/types/notifications/notification.type";
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
    Eye,
    Filter,
    Info,
    MoreVertical,
    RefreshCw,
    Search,
    Sparkles,
    Trash2,
    User2,
    Users,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NotificationsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<NotificationType | "ALL" | string>("ALL");
    const [filterRead, setFilterRead] = useState<"ALL" | "READ" | "UNREAD">("ALL");
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

    const {
        notifications,
        isLoading,
        error,
        meta,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        updateFilters,
        refresh
    } = useNotifications({ limit: 15 });

    // Filtrar notificaciones según búsqueda y filtros
    const filteredNotifications = notifications.filter(notification => {
        // Filtro por texto
        const matchesSearch = searchTerm === "" ||
            notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            notification.message.toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por tipo
        const matchesType = filterType === "ALL" || notification.type === filterType;

        // Filtro por estado de lectura
        const matchesReadStatus =
            filterRead === "ALL" ||
            (filterRead === "READ" && notification.isRead) ||
            (filterRead === "UNREAD" && !notification.isRead);

        return matchesSearch && matchesType && matchesReadStatus;
    });

    // Manejar clic en una notificación
    const handleNotificationClick = async (notification: Notification) => {
        try {
            if (!notification.isRead) {
                await markAsRead([notification.id]);
            }

            if (notification.actionUrl) {
                router.push(notification.actionUrl);
            }
        } catch (error) {
            console.error("Error al marcar notificación como leída:", error);
        }
    };

    // Marcar seleccionadas como leídas
    const handleMarkSelectedAsRead = async () => {
        if (selectedNotifications.length === 0) return;

        try {
            await markAsRead(selectedNotifications);
            toast.success(`${selectedNotifications.length} notificaciones marcadas como leídas`);
            setSelectedNotifications([]);
        } catch (error) {
            console.error("Error al marcar notificaciones seleccionadas como leídas:", error);
        }
    };

    // Eliminar notificación
    const handleDeleteNotification = async (id: number) => {
        try {
            await deleteNotification(id);
            toast.success("Notificación eliminada correctamente");
        } catch (error) {
            console.error("Error al eliminar notificación:", error);
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

    // Para paginación
    const handlePageChange = (page: number) => {
        updateFilters({ page });
    };

    const handlePageSizeChange = (pageSize: number) => {
        updateFilters({ limit: pageSize });
    };

    return (
        <div className="container py-8">
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
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                        />
                        Actualizar
                    </Button>
                }
            />

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Centro de Notificaciones
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Barra de filtros */}
                    <div className="flex flex-col gap-4 md:flex-row md:justify-between mb-6">
                        <div className="flex-1 flex flex-col md:flex-row gap-4">
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar en notificaciones..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2">
                                <div className="w-full md:w-48">
                                    <Select
                                        value={filterType}
                                        onValueChange={(value) => setFilterType(value)}
                                    >
                                        <SelectTrigger className="flex gap-1">
                                            <Filter className="h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Filtrar por tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Todos los tipos</SelectItem>
                                            {Object.values(NotificationType).map((type) => (
                                                <SelectItem key={type} value={type} className="flex items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        {getNotificationIcon(type as NotificationType)}
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
                                </div>

                                <div className="w-full md:w-44">
                                    <Select
                                        value={filterRead}
                                        onValueChange={(value: "ALL" | "READ" | "UNREAD") => setFilterRead(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Estado de lectura" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Todas</SelectItem>
                                            <SelectItem value="READ">Leídas</SelectItem>
                                            <SelectItem value="UNREAD">No leídas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleMarkSelectedAsRead}
                                disabled={selectedNotifications.length === 0}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Marcar como leídas
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Marcar todas como leídas
                            </Button>
                        </div>
                    </div>

                    {/* Lista de notificaciones */}
                    {isLoading ? (
                        <NotificationsLoadingSkeleton />
                    ) : filteredNotifications.length === 0 ? (
                        <EmptyNotifications />
                    ) : (
                        <div className="space-y-2">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border rounded-lg transition-all hover:bg-muted/30 ${!notification.isRead ? "bg-primary/5 border-primary/10" : ""
                                        } ${selectedNotifications.includes(notification.id) ? "ring-2 ring-primary" : ""}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${notification.isRead
                                            ? "bg-muted text-muted-foreground"
                                            : "bg-primary/10 text-primary"
                                            }`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        <div
                                            className="flex-1 min-w-0 cursor-pointer"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-base font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                                    {notification.title}
                                                    {!notification.isRead && (
                                                        <span className="ml-2 inline-block h-2 w-2 bg-primary rounded-full"></span>
                                                    )}
                                                </h4>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(notification.createdAt)}
                                                </span>
                                            </div>

                                            <p className={`mt-1 ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                                {notification.message}
                                            </p>

                                            {notification.actionUrl && (
                                                <div className="flex justify-end mt-2">
                                                    <span className="text-xs flex items-center text-primary">
                                                        Ver detalle <ChevronRight className="h-3 w-3 ml-1" />
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {!notification.isRead && (
                                                        <DropdownMenuItem
                                                            onClick={() => markAsRead([notification.id])}
                                                            className="gap-2"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span>Marcar como leída</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteNotification(notification.id)}
                                                        className="text-red-600 dark:text-red-400 gap-2"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span>Eliminar</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Paginación */}
                            {meta && (
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
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function NotificationsLoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                    <div className="flex items-start gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-5 w-48 mb-2" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function EmptyNotifications() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-center mb-2">No hay notificaciones</h3>
            <p className="text-muted-foreground text-center max-w-md">
                No se encontraron notificaciones que coincidan con los filtros actuales. Intenta con otros filtros o vuelve a comprobar más tarde.
            </p>
        </div>
    );
}