"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getOrderDetailClient } from "@/lib/actions/ecommerce/ecommerce-client.action";
import { OrderDetailClientResponse } from "@/types/ecommerce/client/ecommerce.types";

export function useOrderDetail(orderId: number) {
    const [orderDetail, setOrderDetail] = useState<OrderDetailClientResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetail = useCallback(async () => {
        if (!orderId) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await getOrderDetailClient(orderId);
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

    useEffect(() => {
        fetchOrderDetail();
    }, [fetchOrderDetail]);

    return {
        orderDetail,
        isLoading,
        error,
        refresh: fetchOrderDetail,
    };
}