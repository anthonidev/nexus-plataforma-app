"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { getOrderDetail, updateOrderStatus } from "@/lib/actions/ecommerce/ecommerce-admin.action";
import { DetailOrderAdminResponse } from "@/types/ecommerce/admin/ecommerce-admin.type";

export function useOrderDetail(orderId: number) {
    const [orderDetail, setOrderDetail] = useState<DetailOrderAdminResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

    const updateStatus = useCallback(async (status: "ENVIADO" | "ENTREGADO") => {
        if (!orderId || isNaN(orderId)) {
            toast.error("ID de pedido no válido");
            return;
        }

        try {
            setIsUpdating(true);
            const response = await updateOrderStatus(orderId, status);

            if (response.success) {
                toast.success(`Estado del pedido actualizado a ${status.toLowerCase()}`);
                await fetchOrderDetail(); // Recargar los datos del pedido
            } else {
                toast.error(response.message || "Error al actualizar el estado del pedido");
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : `Error al actualizar el estado del pedido #${orderId}`;

            toast.error(errorMessage);
        } finally {
            setIsUpdating(false);
        }
    }, [orderId, fetchOrderDetail]);

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
        updateStatus
    };
}