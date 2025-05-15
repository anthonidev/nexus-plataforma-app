"use client";

import {
  getWithdrawalDetail,
  approveWithdrawal as approveWithdrawalAction,
  rejectWithdrawal as rejectWithdrawalAction,
} from "@/lib/actions/withdrawals/finance-withdrawals";
import {
  FinanceWithdrawalDetailResponse,
  WithdrawalPoint,
} from "@/types/withdrawals/finance-withdrawals.type";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useWithdrawalDetail(withdrawalId: number) {
  // Estados principales
  const [withdrawal, setWithdrawal] =
    useState<FinanceWithdrawalDetailResponse | null>(null);
  const [points, setPoints] = useState<WithdrawalPoint[]>([]);
  const [pointsMeta, setPointsMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Obtener detalles del retiro
  const fetchWithdrawalDetail = useCallback(async () => {
    if (!withdrawalId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getWithdrawalDetail(withdrawalId);

      setWithdrawal(response);
      setPoints(response.withdrawalPoints || []);
      setPointsMeta(response.meta || null);

      // Actualizar estados de paginación si vienen en la respuesta
      if (response.meta) {
        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los detalles del retiro";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [withdrawalId]);

  // Aprobar retiro
  const approveWithdrawal = useCallback(async () => {
    if (!withdrawalId) return null;

    try {
      setIsProcessing(true);

      const response = await approveWithdrawalAction(withdrawalId, {
        codeOperation: "",
        banckNameApproval: "",
        dateOperation: new Date().toISOString().split("T")[0],
        numberTicket: "",
      });

      toast.success("Retiro aprobado exitosamente");
      await fetchWithdrawalDetail();

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al aprobar el retiro";

      toast.error(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [withdrawalId, fetchWithdrawalDetail]);

  // Rechazar retiro
  const rejectWithdrawal = useCallback(
    async (rejectionReason: string) => {
      if (!withdrawalId) return null;

      try {
        setIsProcessing(true);

        const response = await rejectWithdrawalAction(
          withdrawalId,
          rejectionReason
        );

        toast.success("Retiro rechazado exitosamente");
        await fetchWithdrawalDetail();

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al rechazar el retiro";

        toast.error(errorMessage);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [withdrawalId, fetchWithdrawalDetail]
  );

  // Manejar cambio de página
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || (pointsMeta && page > pointsMeta.totalPages)) return;
      setCurrentPage(page);
      fetchWithdrawalDetail();
    },
    [pointsMeta, fetchWithdrawalDetail]
  );

  // Manejar cambio de elementos por página
  const handleItemsPerPageChange = useCallback(
    (pageSize: number) => {
      setItemsPerPage(pageSize);
      setCurrentPage(1);
      fetchWithdrawalDetail();
    },
    [fetchWithdrawalDetail]
  );

  // Cargar datos iniciales
  useEffect(() => {
    fetchWithdrawalDetail();
  }, [fetchWithdrawalDetail]);

  return {
    withdrawal,
    points,
    pointsMeta,
    isLoading,
    isProcessing,
    error,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refreshData: fetchWithdrawalDetail,
    approveWithdrawal,
    rejectWithdrawal,
  };
}
