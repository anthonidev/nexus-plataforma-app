"use client";

import { getUserPayments } from "@/lib/actions/payments/payment.action";
import { Payment, PaymentConfig } from "@/types/payment/payment.type";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export interface PaymentsFilters {
  page?: number;
  limit?: number;
  order?: "ASC" | "DESC";
  paymentConfigId?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  startDate?: string;
  endDate?: string;
  search?: string;
}

interface UsePaymentsReturn {
  // Data y metadata
  payments: Payment[];
  paymentConfigs: PaymentConfig[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;

  // Filtros directos
  status: "PENDING" | "APPROVED" | "REJECTED" | undefined;
  paymentConfigId: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  order: "ASC" | "DESC";

  // Handlers específicos
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (limit: number) => void;
  handleStatusChange: (
    status: "PENDING" | "APPROVED" | "REJECTED" | undefined
  ) => void;
  handlePaymentConfigChange: (id: number | undefined) => void;
  handleStartDateChange: (date: string | undefined) => void;
  handleEndDateChange: (date: string | undefined) => void;
  handleOrderChange: (order: "ASC" | "DESC") => void;

  // Reseteo y actualización manual
  resetFilters: () => void;
  refresh: () => Promise<void>;
}

interface UsePaymentsProps {
  initialPage?: number;
  initialLimit?: number;
  initialStatus?: "PENDING" | "APPROVED" | "REJECTED";
  initialOrder?: "ASC" | "DESC";
}

export function usePayments({
  initialPage = 1,
  initialLimit = 10,
  initialStatus = undefined,
  initialOrder = "DESC",
}: UsePaymentsProps = {}): UsePaymentsReturn {
  // Estados para las listas de datos
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentConfigs, setPaymentConfigs] = useState<PaymentConfig[]>([]);

  // Estados para la carga y errores
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para la paginación
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Estados para los filtros
  const [status, setStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | undefined
  >(initialStatus);
  const [paymentConfigId, setPaymentConfigId] = useState<number | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<"ASC" | "DESC">(initialOrder);

  // Función principal para obtener pagos
  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Preparar los parámetros para la consulta
      const params: Record<string, unknown> = {
        page: currentPage,
        limit: itemsPerPage,
        order: order,
      };

      // Añadir filtros opcionales si están definidos
      if (status) params.status = status;
      if (paymentConfigId) params.paymentConfigId = paymentConfigId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      // Realizar la consulta a la API
      const response = await getUserPayments(params);

      // Actualizar estados con la respuesta
      setPayments(response.items);
      setPaymentConfigs(response.meta.paymentConfigs);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);

      // La API podría devolver valores diferentes a los solicitados, actualizamos para mantener consistencia
      setCurrentPage(response.meta.currentPage);
      setItemsPerPage(response.meta.itemsPerPage);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar los pagos";

      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error al cargar los pagos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    order,
    status,
    paymentConfigId,
    startDate,
    endDate,
  ]);

  // Cargar pagos cuando los filtros cambien
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Manejadores de cambios de filtros
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || (totalPages > 0 && page > totalPages)) return;
      setCurrentPage(page);
    },
    [totalPages]
  );

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Volver a la primera página cuando cambia el límite
  }, []);

  const handleStatusChange = useCallback(
    (value: "PENDING" | "APPROVED" | "REJECTED" | undefined) => {
      setStatus(value);
      setCurrentPage(1);
    },
    []
  );

  const handlePaymentConfigChange = useCallback((id: number | undefined) => {
    setPaymentConfigId(id);
    setCurrentPage(1);
  }, []);

  const handleStartDateChange = useCallback((date: string | undefined) => {
    setStartDate(date);
    setCurrentPage(1);
  }, []);

  const handleEndDateChange = useCallback((date: string | undefined) => {
    setEndDate(date);
    setCurrentPage(1);
  }, []);

  const handleOrderChange = useCallback((newOrder: "ASC" | "DESC") => {
    setOrder(newOrder);
    setCurrentPage(1);
  }, []);

  // Función para resetear todos los filtros
  const resetFilters = useCallback(() => {
    setStatus(undefined);
    setPaymentConfigId(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setOrder("DESC");
    setCurrentPage(1);
    setItemsPerPage(10);
  }, []);

  return {
    // Data y metadata
    payments,
    paymentConfigs,
    isLoading,
    error,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,

    // Filtros directos para acceso en componentes
    status,
    paymentConfigId,
    startDate,
    endDate,
    order,

    // Handlers específicos
    handlePageChange,
    handleItemsPerPageChange,
    handleStatusChange,
    handlePaymentConfigChange,
    handleStartDateChange,
    handleEndDateChange,
    handleOrderChange,

    // Reseteo y actualización manual
    resetFilters,
    refresh: fetchPayments,
  };
}
