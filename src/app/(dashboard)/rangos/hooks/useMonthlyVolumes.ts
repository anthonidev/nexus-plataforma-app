"use client";

import { getVolumenMensual } from "@/lib/actions/ranks/ranks.action";
import { Item } from "@/types/ranks/rank.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseMonthlyVolumesReturn {
  volumes: Item[];
  isLoading: boolean;
  error: string | null;
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;
  currentPage: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;
  refreshVolumes: () => Promise<void>;
}

export function useMonthlyVolumes(
  initialPage: number = 1,
  initialLimit: number = 10
): UseMonthlyVolumesReturn {
  const [volumes, setVolumes] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseMonthlyVolumesReturn["meta"]>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  const fetchVolumes = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {
          page,
          limit,
        };

        const response = await getVolumenMensual(params);

        setVolumes(response.items);
        setMeta(response.meta);

        // Actualizar la página actual y elementos por página según la respuesta
        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar los volúmenes mensuales";

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (meta && (page < 1 || page > meta.totalPages)) return;
      setCurrentPage(page);
    },
    [meta]
  );

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  useEffect(() => {
    fetchVolumes(currentPage, itemsPerPage);
  }, [fetchVolumes, currentPage, itemsPerPage]);

  return {
    volumes,
    isLoading,
    error,
    meta,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refreshVolumes: () => fetchVolumes(currentPage, itemsPerPage),
  };
}
