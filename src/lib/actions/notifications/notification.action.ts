"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  MarkAsReadResponse,
  NotificationFilters,
  NotificationResponse,
  UnreadCountResponse,
} from "@/types/notifications/notification.type";

export async function getNotifications(
  params?: NotificationFilters
): Promise<NotificationResponse> {
  try {
    return await httpClient<NotificationResponse>("/api/notifications", {
      params: params as Record<string, unknown>,
    });
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    throw error;
  }
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  try {
    return await httpClient<UnreadCountResponse>(
      "/api/notifications/unread-count"
    );
  } catch (error) {
    console.error(
      "Error al obtener conteo de notificaciones no leídas:",
      error
    );
    throw error;
  }
}

export async function markAsRead(
  notificationIds: number[]
): Promise<MarkAsReadResponse> {
  try {
    return await httpClient<MarkAsReadResponse>(
      "/api/notifications/mark-as-read",
      {
        method: "PATCH",
        body: { ids: notificationIds },
      }
    );
  } catch (error) {
    console.error("Error al marcar notificaciones como leídas:", error);
    throw error;
  }
}

export async function markAllAsRead(): Promise<MarkAsReadResponse> {
  try {
    return await httpClient<MarkAsReadResponse>(
      "/api/notifications/mark-all-as-read",
      {
        method: "PATCH",
      }
    );
  } catch (error) {
    console.error(
      "Error al marcar todas las notificaciones como leídas:",
      error
    );
    throw error;
  }
}

export async function deleteNotification(
  id: number
): Promise<MarkAsReadResponse> {
  try {
    return await httpClient<MarkAsReadResponse>(`/api/notifications/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Error al eliminar notificación con ID ${id}:`, error);
    throw error;
  }
}
