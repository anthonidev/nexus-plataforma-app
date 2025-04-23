"use client";

import { getUserPayments } from "@/lib/actions/payments/payment.action";
import {
  PaymentConfigListUserItem,
  PaymentListUserItem,
} from "@/types/payment/payment-user.type";

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
  payments: PaymentListUserItem[];
  paymentConfigs: PaymentConfigListUserItem[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;

  status: "PENDING" | "APPROVED" | "REJECTED" | undefined;
  paymentConfigId: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  order: "ASC" | "DESC";

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
  const [payments, setPayments] = useState<PaymentListUserItem[]>([]);
  const [paymentConfigs, setPaymentConfigs] = useState<
    PaymentConfigListUserItem[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  const [status, setStatus] = useState<
    "PENDING" | "APPROVED" | "REJECTED" | undefined
  >(initialStatus);
  const [paymentConfigId, setPaymentConfigId] = useState<number | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<"ASC" | "DESC">(initialOrder);

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: Record<string, unknown> = {
        page: currentPage,
        limit: itemsPerPage,
        order: order,
      };

      if (status) params.status = status;
      if (paymentConfigId) params.paymentConfigId = paymentConfigId;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await getUserPayments(params);

      setPayments(response.items);
      setPaymentConfigs(response.meta.paymentConfigs);
      setTotalItems(response.meta.totalItems);
      setTotalPages(response.meta.totalPages);

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

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || (totalPages > 0 && page > totalPages)) return;
      setCurrentPage(page);
    },
    [totalPages]
  );

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1);
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
    payments,
    paymentConfigs,
    isLoading,
    error,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,

    status,
    paymentConfigId,
    startDate,
    endDate,
    order,

    handlePageChange,
    handleItemsPerPageChange,
    handleStatusChange,
    handlePaymentConfigChange,
    handleStartDateChange,
    handleEndDateChange,
    handleOrderChange,

    resetFilters,
    refresh: fetchPayments,
  };
}
