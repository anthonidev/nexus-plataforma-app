"use client";

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
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

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

  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!session?.user) return;

    try {
      const countResponse = await getUnreadCount();

      if (countResponse && typeof countResponse.count === "number") {
        setUnreadCount(countResponse.count);
      } else {
        console.warn(
          "El conteo de notificaciones no tiene el formato esperado:",
          countResponse
        );
      }
    } catch (err) {
      console.error(
        "Error al obtener conteo de notificaciones no leídas:",
        err
      );
    }
  }, [session?.user]);

  useEffect(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    if (!session?.user?.id) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL no está definido");
      setError("Error de configuración: URL del API no definida");
      return;
    }

    const connectSocket = () => {
      try {
        console.log(
          `Intentando conectar al servidor de notificaciones: ${apiUrl}/notifications`
        );

        const socketInstance = io(`${apiUrl}/notifications`, {
          query: {
            userId: session.user.id,
          },
          transports: ["websocket"],
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
          console.log("✅ Conectado al servidor de notificaciones");
          reconnectAttempts.current = 0; // Resetear los intentos al conectar exitosamente
        });

        socketInstance.on("connect_error", (err) => {
          console.error(
            "❌ Error al conectar con el servidor de notificaciones:",
            err
          );

          if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.error(
              `Máximo número de intentos de reconexión (${maxReconnectAttempts}) alcanzado.`
            );
            return;
          }

          reconnectAttempts.current += 1;
          const delay = 5000 * Math.pow(2, reconnectAttempts.current - 1); // Backoff exponencial

          console.log(
            `Intentando reconectar en ${delay / 1000} segundos (intento ${
              reconnectAttempts.current
            }/${maxReconnectAttempts})...`
          );

          reconnectTimeout.current = setTimeout(() => {
            if (socketInstance) socketInstance.connect();
          }, delay);
        });

        socketInstance.on("disconnect", (reason) => {
          console.log(`Desconectado del servidor de notificaciones: ${reason}`);
        });

        socketInstance.on("error", (err) => {
          console.error("Error en el socket:", err);
        });

        socketInstance.on("newNotification", (notification: Notification) => {
          console.log("📬 Nueva notificación recibida:", notification);

          if (!notification || !notification.id) {
            console.error("Formato de notificación inválido:", notification);
            return;
          }

          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          toast(notification.title, {
            description: notification.message,
            action: notification.actionUrl
              ? {
                  label: "Ver",
                  onClick: () => {
                    if (typeof window !== "undefined") {
                      window.location.href = notification.actionUrl || "#";
                    }
                  },
                }
              : undefined,
          });

          fetchUnreadCount();
        });

        setSocket(socketInstance);

        return () => {
          console.log("Desconectando socket...");
          socketInstance.disconnect();

          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
          }
        };
      } catch (err) {
        console.error("Error al inicializar el socket:", err);
        setError("Error al conectar con el servidor de notificaciones");
        return undefined;
      }
    };

    const cleanup = connectSocket();
    return cleanup;
  }, [session?.user?.id, fetchUnreadCount]);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getNotifications(filters);

      if (response && Array.isArray(response.items)) {
        setNotifications(response.items);

        if (response.meta) {
          setMeta(response.meta);
        }
      } else {
        console.error(
          "Formato de respuesta de notificaciones inválido:",
          response
        );
        setError("Error en el formato de respuesta");
      }

      await fetchUnreadCount();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar notificaciones";
      setError(errorMessage);
      console.error("Error al cargar notificaciones:", err);

      try {
        await fetchUnreadCount();
      } catch (countErr) {
        console.error("Error también al obtener conteo:", countErr);
      }
    } finally {
      setIsLoading(false);
    }
  }, [session?.user, filters, fetchUnreadCount]);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [fetchNotifications, session?.user]);

  useEffect(() => {
    if (session?.user) {
      fetchNotifications();
    }
  }, [filters, fetchNotifications, session?.user]);

  const handleMarkAsRead = useCallback(
    async (ids: number[]) => {
      if (!ids.length)
        return { success: false, message: "No hay IDs para marcar" };

      try {
        const response = await markAsRead(ids);

        setNotifications((prev) =>
          prev.map((notification) =>
            ids.includes(notification.id)
              ? { ...notification, isRead: true, readAt: new Date() }
              : notification
          )
        );

        await fetchUnreadCount();

        return (
          response || {
            success: true,
            message: "Notificaciones marcadas como leídas",
          }
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al marcar como leída";
        toast.error(errorMessage);
        console.error("Error al marcar notificación como leída:", err);

        return { success: false, message: errorMessage };
      }
    },
    [fetchUnreadCount]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const response = await markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          readAt: new Date(),
        }))
      );

      setUnreadCount(0);

      return (
        response || {
          success: true,
          message: "Todas las notificaciones marcadas como leídas",
        }
      );
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

      return { success: false, message: errorMessage };
    }
  }, []);

  const handleDeleteNotification = useCallback(
    async (id: number) => {
      if (!id) return { success: false, message: "ID no válido" };

      try {
        const response = await deleteNotification(id);

        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );

        const wasUnread = notifications.find((n) => n.id === id && !n.isRead);
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        return response || { success: true, message: "Notificación eliminada" };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al eliminar notificación";
        toast.error(errorMessage);
        console.error("Error al eliminar notificación:", err);

        return { success: false, message: errorMessage };
      }
    },
    [notifications]
  );

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

  const forceRefresh = useCallback(async () => {
    await fetchNotifications();
    await fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

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
    refresh: forceRefresh,
  };
}
