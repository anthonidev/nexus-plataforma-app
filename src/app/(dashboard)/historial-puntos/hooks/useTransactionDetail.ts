"use client";

import { getPointsTransactionById } from "@/lib/actions/points/point.action";
import { DetailTransactionResponse } from "@/types/points/point";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseTransactionDetailProps {
  transactionId: number;
}

interface UseTransactionDetailReturn {
  transaction: DetailTransactionResponse | null;
  isLoading: boolean;
  error: string | null;

  // Para la paginación de pagos
  paymentsPage: number;
  paymentsPageSize: number;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;

  // Para refrescar los datos
  refreshTransaction: () => Promise<void>;
}

export function useTransactionDetail({
  transactionId,
}: UseTransactionDetailProps): UseTransactionDetailReturn {
  const [transaction, setTransaction] =
    useState<DetailTransactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para la paginación de pagos
  const [paymentsPage, setPaymentsPage] = useState<number>(1);
  const [paymentsPageSize, setPaymentsPageSize] = useState<number>(10);

  const fetchTransactionDetail = useCallback(async () => {
    if (!transactionId) {
      setError("ID de transacción no válido");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, unknown> = {
        page: paymentsPage,
        limit: paymentsPageSize,
      };

      const response = await getPointsTransactionById(transactionId, params);

      if (response) {
        setTransaction(response);
      } else {
        setError("No se pudo obtener la información de la transacción");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los detalles de la transacción";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [transactionId, paymentsPage, paymentsPageSize]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchTransactionDetail();
  }, [fetchTransactionDetail]);

  // Funciones para manejar la paginación
  const handlePageChange = useCallback((page: number) => {
    setPaymentsPage(page);
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPaymentsPageSize(pageSize);
    setPaymentsPage(1); // Resetear a primera página cuando cambia el tamaño
  }, []);

  return {
    transaction,
    isLoading,
    error,
    paymentsPage,
    paymentsPageSize,
    handlePageChange,
    handlePageSizeChange,
    refreshTransaction: fetchTransactionDetail,
  };
}
