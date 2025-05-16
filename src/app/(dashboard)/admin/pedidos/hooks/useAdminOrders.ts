"use client";

import {
    listOrdersAdmin,
} from "@/lib/actions/ecommerce/ecommerce-admin.action";
import { ItemOrder, OrderAdminFilters, ProductAdminFilters } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useAdminOrders(initialPage: number = 1, initialLimit: number = 10) {
    const [orders, setOrders] = useState<ItemOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<{
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    } | null>(null);

    const [filters, setFilters] = useState<OrderAdminFilters>({
        page: initialPage,
        limit: initialLimit,
    });

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await listOrdersAdmin(filters);

            if (response.success) {
                setOrders(response.items);
                setMeta(response.meta);
            } else {
                setError("Error al cargar pedidos");
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Error al cargar pedidos";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    const handlePageChange = useCallback((page: number) => {
        setFilters((prev) => ({
            ...prev,
            page,
        }));
    }, []);

    const handleItemsPerPageChange = useCallback((limit: number) => {
        setFilters((prev) => ({
            ...prev,
            limit,
            page: 1, // Reset to first page when changing items per page
        }));
    }, []);

    const updateFilters = useCallback((newFilters: Partial<ProductAdminFilters>) => {
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: newFilters.page !== undefined ? newFilters.page : 1, // Reset to first page when filters change
        }));
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        isLoading,
        error,
        meta,
        filters,
        updateFilters,
        handlePageChange,
        handleItemsPerPageChange,
        refresh: fetchOrders,
    };
}