"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getProductsClient } from "@/lib/actions/ecommerce/ecommerce-client.action";
import { getCategoriesEcommerce } from "@/lib/actions/ecommerce/ecommerce-admin.action";
import { Category } from "@/types/ecommerce/admin/ecommerce-admin.type";
import {
  Item,
  ProductClientFilters,
} from "@/types/ecommerce/client/ecommerce.types";

export function useProducts(initialFilters?: ProductClientFilters) {
  const [products, setProducts] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<ProductClientFilters>(
    initialFilters || { page: 1, limit: 12 }
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
        setCategories(response.categories.filter((cat) => cat.isActive));
      }
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getProductsClient(filters);

      if (response.success) {
        setProducts(response.items);
        setMeta(response.meta);
      } else {
        setError("Error al cargar productos");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar productos";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const updateFilters = useCallback(
    (newFilters: Partial<ProductClientFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page:
          newFilters.page !== undefined
            ? newFilters.page
            : Object.keys(newFilters).length > 0
            ? 1
            : prev.page,
      }));
    },
    []
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 12 });
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
    refresh: fetchProducts,
  };
}
