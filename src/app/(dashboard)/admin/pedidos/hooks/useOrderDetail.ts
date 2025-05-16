"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { DetailOrderAdminResponse } from "@/types/ecommerce/admin/ecommerce-admin.type";
import {
  deliveredOrder,
  getOrderDetail,
  sendOrder,
} from "@/lib/actions/ecommerce/ecommerce-admin.action";

export function useOrderDetail(orderId: number) {
  const [orderDetail, setOrderDetail] =
    useState<DetailOrderAdminResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para los modales de confirmación
  const [showSendModal, setShowSendModal] = useState<boolean>(false);
  const [showDeliverModal, setShowDeliverModal] = useState<boolean>(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderId || isNaN(orderId)) {
      setError("ID de pedido no válido");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getOrderDetail(orderId);
      setOrderDetail(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Error al cargar los detalles del pedido #${orderId}`;

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  const handleSendOrder = useCallback(async () => {
    if (!orderId || isNaN(orderId)) {
      toast.error("ID de pedido no válido");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await sendOrder(orderId);

      if (response.success) {
        toast.success("Pedido marcado como enviado correctamente");
        await fetchOrderDetail(); // Recargar los datos del pedido
      } else {
        toast.error(
          response.message || "Error al marcar el pedido como enviado"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Error al marcar el pedido #${orderId} como enviado`;

      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [orderId, fetchOrderDetail]);

  const handleDeliverOrder = useCallback(async () => {
    if (!orderId || isNaN(orderId)) {
      toast.error("ID de pedido no válido");
      return;
    }

    try {
      setIsUpdating(true);
      const response = await deliveredOrder(orderId);

      if (response.success) {
        toast.success("Pedido marcado como entregado correctamente");
        await fetchOrderDetail(); // Recargar los datos del pedido
      } else {
        toast.error(
          response.message || "Error al marcar el pedido como entregado"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Error al marcar el pedido #${orderId} como entregado`;

      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [orderId, fetchOrderDetail]);

  // Manejadores para abrir y cerrar los modales
  const openSendModal = useCallback(() => {
    setShowSendModal(true);
  }, []);

  const closeSendModal = useCallback(() => {
    setShowSendModal(false);
  }, []);

  const openDeliverModal = useCallback(() => {
    setShowDeliverModal(true);
  }, []);

  const closeDeliverModal = useCallback(() => {
    setShowDeliverModal(false);
  }, []);

  // Cargar los datos del pedido al montar el componente
  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return {
    orderDetail,
    isLoading,
    isUpdating,
    error,
    refresh: fetchOrderDetail,

    // Modales
    showSendModal,
    showDeliverModal,
    openSendModal,
    closeSendModal,
    openDeliverModal,
    closeDeliverModal,

    // Acciones
    handleSendOrder,
    handleDeliverOrder,
  };
}
