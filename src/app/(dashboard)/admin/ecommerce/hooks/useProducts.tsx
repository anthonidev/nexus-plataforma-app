"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getCategoriesEcommerce, getProducts, } from "@/lib/actions/ecommerce/ecommerce-admin.action";
import { Category, ProductAdmin, ProductAdminFilters } from "@/types/ecommerce/admin/ecommerce-admin.type";

export function useProducts(initialFilters?: ProductAdminFilters) {
    const [products, setProducts] = useState<ProductAdmin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<ProductAdminFilters>(
        initialFilters || { page: 1, limit: 10 }
    );
    const [meta, setMeta] = useState<{
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    } | null>(null);


    const fetchCategories = useCallback(async () => {
        try {
            const response = await getCategoriesEcommerce();
            if (response.success) {
                setCategories(response.categories);
            }
        } catch (err) {
            console.error("Error al cargar categorías:", err);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await getProducts(filters);

            if (response.success) {
                setProducts(response.items);
                setMeta(response.meta);
            } else {
                setError("Error al cargar productos");
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error al cargar productos";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    const updateFilters = useCallback((newFilters: Partial<ProductAdminFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: newFilters.page !== undefined
                ? newFilters.page
                : (Object.keys(newFilters).length > 0 ? 1 : prev.page)
        }));
    }, []);

    const handlePageChange = useCallback((page: number) => {
        updateFilters({ page });
    }, [updateFilters]);

    const resetFilters = useCallback(() => {
        setFilters({ page: 1, limit: 10 });
    }, []);


    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        isLoading,
        error,
        categories,
        filters,
        meta,
        updateFilters,
        handlePageChange,
        resetFilters,
        refresh: fetchProducts
    };
}