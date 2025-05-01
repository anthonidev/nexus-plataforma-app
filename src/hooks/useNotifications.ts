// src/hooks/useNotifications.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import {
  deleteNotification,
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "@/lib/actions/notifications/notification.action";
import {
  Notification,
  NotificationFilters,
  NotificationResponse,
} from "@/types/notifications/notification.type";

export function useNotifications(initialFilters?: NotificationFilters) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<NotificationResponse["meta"] | null>(null);
  const [filters, setFilters] = useState<NotificationFilters>(
    initialFilters || { page: 1, limit: 10 }
  );

  // Inicialización de Socket.IO
  useEffect(() => {
    if (!session?.user?.id) return;

    const socketInstance = io(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
      {
        query: {
          userId: session.user.id,
        },
        transports: ["websocket"],
        withCredentials: true,
      }
    );

    socketInstance.on("connect", () => {
      console.log("Conectado al servidor de notificaciones");
    });

    socketInstance.on("disconnect", () => {
      console.log("Desconectado del servidor de notificaciones");
    });

    socketInstance.on("newNotification", (notification: Notification) => {
      console.log("Nueva notificación recibida:", notification);

      // Actualizar el estado local con la nueva notificación
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Mostrar toast con la notificación
      toast(notification.title, {
        description: notification.message,
        action: notification.actionUrl
          ? {
              label: "Ver",
              onClick: () =>
                (window.location.href = notification.actionUrl || "#"),
            }
          : undefined,
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [session?.user?.id]);

  // Cargar notificaciones
  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getNotifications(filters);
      setNotifications(response.items);
      setMeta(response.meta);

      // También actualizar el conteo de no leídas
      const countResponse = await getUnreadCount();
      setUnreadCount(countResponse.count);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar notificaciones";
      setError(errorMessage);
      console.error("Error al cargar notificaciones:", err);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, filters]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Marcar notificación(es) como leída(s)
  const handleMarkAsRead = useCallback(async (ids: number[]) => {
    try {
      const response = await markAsRead(ids);

      if (response.success) {
        // Actualizar el estado local
        setNotifications((prev) =>
          prev.map((notification) =>
            ids.includes(notification.id)
              ? { ...notification, isRead: true, readAt: new Date() }
              : notification
          )
        );

        // Actualizar conteo de no leídas
        const countResponse = await getUnreadCount();
        setUnreadCount(countResponse.count);

        return response;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al marcar como leída";
      toast.error(errorMessage);
      console.error("Error al marcar notificación como leída:", err);
      throw err;
    }
  }, []);

  // Marcar todas como leídas
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const response = await markAllAsRead();

      if (response.success) {
        // Actualizar el estado local
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
            readAt: new Date(),
          }))
        );

        // Actualizar conteo de no leídas
        setUnreadCount(0);

        return response;
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al marcar todas como leídas";
      toast.error(errorMessage);
      console.error(
        "Error al marcar todas las notificaciones como leídas:",
        err
      );
      throw err;
    }
  }, []);

  // Eliminar notificación
  const handleDeleteNotification = useCallback(
    async (id: number) => {
      try {
        const response = await deleteNotification(id);

        if (response.success) {
          // Actualizar el estado local
          setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id)
          );

          // Si la notificación no estaba leída, actualizar conteo
          const wasUnread = notifications.find((n) => n.id === id && !n.isRead);
          if (wasUnread) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }

          return response;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al eliminar notificación";
        toast.error(errorMessage);
        console.error("Error al eliminar notificación:", err);
        throw err;
      }
    },
    [notifications]
  );

  // Actualizar filtros
  const updateFilters = useCallback(
    (newFilters: Partial<NotificationFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: newFilters.page !== undefined ? newFilters.page : 1, // Si cambian otros filtros, volver a pág 1
      }));
    },
    []
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    meta,
    filters,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    updateFilters,
    refresh: fetchNotifications,
  };
}
