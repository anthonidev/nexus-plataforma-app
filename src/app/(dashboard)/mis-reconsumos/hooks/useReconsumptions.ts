"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createReconsumption,
  updateAutoRenewal,
} from "@/lib/actions/membership/reconsumtion.action";
import { getListReconsumptions } from "@/lib/actions/membership/membership.action";
import { ReconsumptionsResponse } from "@/types/plan/membership";
import { PaymentImageModalType } from "@/app/(dashboard)/planes-de-membresia/validations/suscription.zod";

interface UseReconsumptionsReturn {
  // Datos de reconsumos
  reconsumptions: ReconsumptionsResponse["items"];
  isLoading: boolean;
  error: string | null;
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;
  canReconsume: boolean;
  autoRenewal: boolean;

  // Paginación
  currentPage: number;
  itemsPerPage: number;
  listReconsumptions: ReconsumptionsResponse | undefined;
  // Estado del formulario de reconsumo
  payments: PaymentImageModalType[];
  isPaymentModalOpen: boolean;
  totalPaidAmount: number;
  remainingAmount: number;
  reconsumptionAmount: number;
  isPaymentComplete: boolean;
  isSubmitting: boolean;

  // Funciones para manejar pagos
  addPayment: (payment: Omit<PaymentImageModalType, "fileIndex">) => void;
  deletePayment: (index: number) => void;
  editPayment: (
    index: number,
    updatedPayment: Omit<PaymentImageModalType, "fileIndex">
  ) => void;
  handlePaymentModalOpen: () => void;
  handlePaymentModalClose: () => void;

  // Funciones para navegación y actualización
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;
  refreshReconsumptions: () => Promise<void>;
  handleCreateReconsumption: () => Promise<void>;
  handleToggleAutoRenewal: (value: boolean) => Promise<void>;
}

export function useReconsumptions(
  initialPage: number = 1,
  initialLimit: number = 10
): UseReconsumptionsReturn {
  const router = useRouter();

  // Estados para la lista de reconsumos
  const [reconsumptions, setReconsumptions] = useState<
    ReconsumptionsResponse["items"]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<UseReconsumptionsReturn["meta"]>(null);
  const [canReconsume, setCanReconsume] = useState<boolean>(false);
  const [autoRenewal, setAutoRenewal] = useState<boolean>(false);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Estados para el formulario de reconsumo
  const [payments, setPayments] = useState<PaymentImageModalType[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reconsumptionAmount, setReconsumptionAmount] = useState<number>(0);
  const [listReconsumptions, setListReconsumptions] =
    useState<ReconsumptionsResponse>();

  // Calcular montos
  const totalPaidAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const remainingAmount = Math.max(0, reconsumptionAmount - totalPaidAmount);
  const isPaymentComplete =
    totalPaidAmount === reconsumptionAmount && payments.length > 0;

  // Función para obtener la lista de reconsumos
  const fetchReconsumptions = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {
          page,
          limit,
        };

        const response = await getListReconsumptions(params);
        setListReconsumptions(response);
        setReconsumptions(response.items);
        setMeta(response.meta);
        console.log("Reconsumptions response:", response);
        setCanReconsume(response.canReconsume);
        setAutoRenewal(response.autoRenewal);
        setReconsumptionAmount(response.reconsumptionAmount);

        // Actualizar la página actual y elementos por página según la respuesta
        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar los reconsumos";

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Funciones para manejar pagos
  const addPayment = (payment: Omit<PaymentImageModalType, "fileIndex">) => {
    const updatedPayments: PaymentImageModalType[] = [
      ...payments,
      {
        ...payment,
        bankName: payment.bankName || "",
        fileIndex: payments.length,
      },
    ];
    setPayments(updatedPayments);
    setIsPaymentModalOpen(false);
  };

  const deletePayment = (index: number) => {
    const updatedPayments: PaymentImageModalType[] = payments
      .filter((_, i) => i !== index)
      .map((payment, newIndex) => ({
        ...payment,
        fileIndex: newIndex,
      }));
    setPayments(updatedPayments);
  };

  const editPayment = (
    index: number,
    updatedPayment: Omit<PaymentImageModalType, "fileIndex">
  ) => {
    const updatedPayments: PaymentImageModalType[] = [...payments];
    updatedPayments[index] = {
      ...updatedPayment,
      bankName: updatedPayment.bankName || "",
      fileIndex: index,
    };
    setPayments(updatedPayments);
  };

  const handlePaymentModalOpen = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentModalClose = () => {
    setIsPaymentModalOpen(false);
  };

  // Función para cambiar de página
  const handlePageChange = useCallback(
    (page: number) => {
      if (meta && (page < 1 || page > meta.totalPages)) return;
      setCurrentPage(page);
    },
    [meta]
  );

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  // Función para crear un reconsumo
  const handleCreateReconsumption = useCallback(async () => {
    if (!isPaymentComplete) {
      toast.error(`El monto total debe ser ${reconsumptionAmount}`);
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("totalAmount", reconsumptionAmount.toFixed(2));

      const paymentsData = payments.map((payment, index) => ({
        bankName: payment.bankName || "",
        transactionReference: payment.transactionReference,
        transactionDate: payment.transactionDate,
        amount: payment.amount,
        fileIndex: index,
      }));

      formData.append("payments", JSON.stringify(paymentsData));

      payments.forEach((payment) => {
        formData.append("paymentImages", payment.file);
      });

      const result = await createReconsumption(formData);

      if (result.success) {
        toast.success(result.message || "Reconsumo creado exitosamente");
        setPayments([]);
        await fetchReconsumptions();
      } else {
        toast.error(result.message || "Error al procesar el reconsumo");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Ocurrió un error al crear el reconsumo";

      toast.error(errorMessage);
      console.error("Reconsumo error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [reconsumptionAmount, isPaymentComplete, payments, fetchReconsumptions]);

  // Función para actualizar la renovación automática
  const handleToggleAutoRenewal = useCallback(async (value: boolean) => {
    try {
      const response = await updateAutoRenewal(value);

      if (response.success) {
        setAutoRenewal(value);
        toast.success(
          response.message || "Configuración actualizada correctamente"
        );
      } else {
        toast.error(response.message || "Error al actualizar la configuración");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al actualizar la renovación automática";

      toast.error(errorMessage);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchReconsumptions(currentPage, itemsPerPage);
  }, [fetchReconsumptions, currentPage, itemsPerPage]);

  return {
    // Datos de reconsumos
    reconsumptions,
    isLoading,
    error,
    meta,
    canReconsume,
    autoRenewal,

    // Paginación
    currentPage,
    itemsPerPage,
    listReconsumptions,

    // Estado del formulario de reconsumo
    payments,
    isPaymentModalOpen,
    totalPaidAmount,
    remainingAmount,
    reconsumptionAmount,
    isPaymentComplete,
    isSubmitting,

    // Funciones para manejar pagos
    addPayment,
    deletePayment,
    editPayment,
    handlePaymentModalOpen,
    handlePaymentModalClose,

    // Funciones para navegación y actualización
    handlePageChange,
    handleItemsPerPageChange,
    refreshReconsumptions: () => fetchReconsumptions(currentPage, itemsPerPage),
    handleCreateReconsumption,
    handleToggleAutoRenewal,
  };
}
