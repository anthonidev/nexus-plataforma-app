"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getWeeklyVolumes } from "@/lib/actions/points/volumen.action";
import { WeeklyVolumeItem } from "@/types/points/volumen";

interface UseWeeklyVolumesReturn {
  volumes: WeeklyVolumeItem[];
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
    status: "PENDING" | "PROCESSED" | "CANCELLED" | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
  };

  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;
  handleStatusChange: (status: "PENDING" | "PROCESSED" | "CANCELLED" | undefined) => void;
  handleStartDateChange: (date: string | undefined) => void;
  handleEndDateChange: (date: string | undefined) => void;
  resetFilters: () => void;
  refreshVolumes: () => Promise<void>;
}

export function useWeeklyVolumes(
  initialPage: number = 1,
  initialLimit: number = 10
): UseWeeklyVolumesReturn {
  const [volumes, setVolumes] = useState<WeeklyVolumeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseWeeklyVolumesReturn["meta"]>(null);

  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  const [status, setStatus] = useState<"PENDING" | "PROCESSED" | "CANCELLED" | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const fetchWeeklyVolumes = useCallback(
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

        const response = await getWeeklyVolumes(params);

        setVolumes(response.items);
        setMeta(response.meta);

        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar los volúmenes semanales";

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
    setCurrentPage(1);
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
    fetchWeeklyVolumes(currentPage, itemsPerPage);
  }, [fetchWeeklyVolumes, currentPage, itemsPerPage, status, startDate, endDate]);

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
    refreshVolumes: () => fetchWeeklyVolumes(currentPage, itemsPerPage),
  };
}