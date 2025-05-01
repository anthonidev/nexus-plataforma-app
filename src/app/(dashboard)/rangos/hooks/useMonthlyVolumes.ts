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
  filters: {
    status?: "PENDING" | "PROCESSED" | "CANCELLED";
    startDate?: string;
    endDate?: string;
  };

  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;
  handleStatusChange: (
    status: "PENDING" | "PROCESSED" | "CANCELLED" | undefined
  ) => void;
  handleStartDateChange: (date: string | undefined) => void;
  handleEndDateChange: (date: string | undefined) => void;
  resetFilters: () => void;
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

  const [status, setStatus] = useState<
    "PENDING" | "PROCESSED" | "CANCELLED" | undefined
  >(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const fetchVolumes = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setIsLoading(true);
        setError(null);

        const params: Record<string, unknown> = {
          page,
          limit,
        };

        if (status) params.status = status;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

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
    [currentPage, itemsPerPage, status, startDate, endDate]
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

  const handleStatusChange = useCallback(
    (value: "PENDING" | "PROCESSED" | "CANCELLED" | undefined) => {
      setStatus(value);
      setCurrentPage(1);
    },
    []
  );

  const handleStartDateChange = useCallback((date: string | undefined) => {
    setStartDate(date);
    setCurrentPage(1);
  }, []);

  const handleEndDateChange = useCallback((date: string | undefined) => {
    setEndDate(date);
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setStatus(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchVolumes(currentPage, itemsPerPage);
  }, [fetchVolumes, currentPage, itemsPerPage, status, startDate, endDate]);

  return {
    volumes,
    isLoading,
    error,
    meta,
    currentPage,
    itemsPerPage,
    filters: {
      status,
      startDate,
      endDate,
    },
    handlePageChange,
    handleItemsPerPageChange,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    resetFilters,
    refreshVolumes: () => fetchVolumes(currentPage, itemsPerPage),
  };
}
