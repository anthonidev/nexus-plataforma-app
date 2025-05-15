// src/app/(dashboard)/admin/retiros/hooks/useFinanceWithdrawals.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllWithdrawals } from "@/lib/actions/withdrawals/finance-withdrawals";
import {
  FinanceWithdrawals,
  Item,
} from "@/types/withdrawals/finance-withdrawals.type";

interface UseFinanceWithdrawalsReturn {
  // Datos de retiros
  withdrawals: Item[];
  isLoading: boolean;
  error: string | null;
  meta: FinanceWithdrawals["meta"] | null;

  // Paginación
  currentPage: number;
  itemsPerPage: number;

  // Navegación y actualización
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;
  refreshWithdrawals: () => Promise<void>;
}

export function useFinanceWithdrawals(
  initialPage: number = 1,
  initialLimit: number = 10
): UseFinanceWithdrawalsReturn {
  // Estados para los datos de retiros
  const [withdrawals, setWithdrawals] = useState<Item[]>([]);
  const [meta, setMeta] = useState<FinanceWithdrawals["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Función para obtener la lista de retiros
  const fetchWithdrawals = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {
          page,
          limit,
        };

        const response = await getAllWithdrawals(params);
        setWithdrawals(response.items);
        setMeta(response.meta);

        // Actualizar la página actual y elementos por página según la respuesta
        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar los retiros";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Handler para cambiar de página
  const handlePageChange = useCallback(
    (page: number) => {
      if (meta && (page < 1 || page > meta.totalPages)) return;
      setCurrentPage(page);
    },
    [meta]
  );

  // Handler para cambiar elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return {
    // Datos de retiros
    withdrawals,
    isLoading,
    error,
    meta,

    // Paginación
    currentPage,
    itemsPerPage,

    // Navegación y actualización
    handlePageChange,
    handleItemsPerPageChange,
    refreshWithdrawals: fetchWithdrawals,
  };
}
