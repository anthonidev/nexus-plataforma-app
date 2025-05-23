"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createReconsumption,
  updateAutoRenewal,
} from "@/lib/actions/membership/reconsumtion.action";
import { getListReconsumptions } from "@/lib/actions/membership/membership.action";
import { ReconsumptionsResponse } from "@/types/plan/membership";
import { PaymentImageModalType } from "@/app/(dashboard)/planes-de-membresia/validations/suscription.zod";
import { usePointsUser } from "@/hooks/usePointsUser";

// Enum para los métodos de pago (similar al de órdenes)
export enum ReconsumptionPaymentMethod {
  VOUCHER = "VOUCHER",
  POINTS = "POINTS",
}

interface UseReconsumptionsReturn {
  // Datos principales
  listReconsumptions: ReconsumptionsResponse | undefined;
  isLoading: boolean;
  error: string | null;

  // Paginación
  currentPage: number;
  itemsPerPage: number;

  // Método de pago
  paymentMethod: ReconsumptionPaymentMethod;
  setPaymentMethod: (method: ReconsumptionPaymentMethod) => void;

  // Estado del formulario de reconsumo
  payments: PaymentImageModalType[];
  isPaymentModalOpen: boolean;
  totalPaidAmount: number;
  remainingAmount: number;
  isPaymentComplete: boolean;
  isSubmitting: boolean;
  notes: string;
  setNotes: (notes: string) => void;

  // Puntos
  points: {
    availablePoints: number;
    totalEarnedPoints: number;
    totalWithdrawnPoints: number;
    membershipPlan: { name: string } | null;
  };
  hasEnoughPoints: boolean;
  isLoadingPoints: boolean;

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
  // Estados principales
  const [listReconsumptions, setListReconsumptions] =
    useState<ReconsumptionsResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Estados para el formulario de reconsumo
  const [payments, setPayments] = useState<PaymentImageModalType[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  // Estado para método de pago (nuevo)
  const [paymentMethod, setPaymentMethod] =
    useState<ReconsumptionPaymentMethod>(ReconsumptionPaymentMethod.VOUCHER);

  // Obtener información de puntos del usuario
  const { points, isLoading: isLoadingPoints } = usePointsUser();

  // Calcular montos basados en los datos disponibles
  const reconsumptionAmount = listReconsumptions?.reconsumptionAmount || 0;
  const totalPaidAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const remainingAmount = Math.max(0, reconsumptionAmount - totalPaidAmount);

  // Verificar si tiene suficientes puntos para el reconsumo
  const hasEnoughPoints = points.availablePoints >= reconsumptionAmount;

  // Verificar si el pago está completo dependiendo del método
  const isPaymentComplete =
    (paymentMethod === ReconsumptionPaymentMethod.POINTS && hasEnoughPoints) ||
    (paymentMethod === ReconsumptionPaymentMethod.VOUCHER &&
      totalPaidAmount === reconsumptionAmount &&
      payments.length > 0);

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
      if (
        listReconsumptions?.meta &&
        (page < 1 || page > listReconsumptions.meta.totalPages)
      )
        return;
      setCurrentPage(page);
    },
    [listReconsumptions?.meta]
  );

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  // Validar antes de crear reconsumo
  const validateReconsumption = useCallback(() => {
    if (!listReconsumptions?.canReconsume) {
      toast.error("No puedes realizar un reconsumo en este momento");
      return false;
    }

    if (paymentMethod === ReconsumptionPaymentMethod.VOUCHER) {
      if (payments.length === 0) {
        toast.error("Debe agregar al menos un comprobante de pago");
        return false;
      }

      if (Math.abs(totalPaidAmount - reconsumptionAmount) > 0.01) {
        toast.error(
          `El monto total pagado debe ser igual al valor del reconsumo: ${reconsumptionAmount}`
        );
        return false;
      }
    } else if (paymentMethod === ReconsumptionPaymentMethod.POINTS) {
      if (!hasEnoughPoints) {
        toast.error(
          "No tienes suficientes puntos para realizar este reconsumo"
        );
        return false;
      }
    }

    return true;
  }, [
    listReconsumptions?.canReconsume,
    paymentMethod,
    payments.length,
    totalPaidAmount,
    reconsumptionAmount,
    hasEnoughPoints,
  ]);

  // Función para crear un reconsumo
  const handleCreateReconsumption = useCallback(async () => {
    if (!validateReconsumption()) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("totalAmount", reconsumptionAmount.toFixed(2));
      formData.append("methodPayment", paymentMethod);

      if (notes) {
        formData.append("notes", notes);
      }

      // Si el método es VOUCHER, añadir los pagos y imágenes
      if (paymentMethod === ReconsumptionPaymentMethod.VOUCHER) {
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
      }

      const result = await createReconsumption(formData);

      if (result.success) {
        toast.success(result.message || "Reconsumo creado exitosamente");
        setPayments([]);
        setNotes("");
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
  }, [
    validateReconsumption,
    reconsumptionAmount,
    paymentMethod,
    notes,
    payments,
    fetchReconsumptions,
  ]);

  // Función para actualizar la renovación automática
  const handleToggleAutoRenewal = useCallback(
    async (value: boolean) => {
      try {
        const response = await updateAutoRenewal(value);

        if (response.success) {
          // Actualizar los datos locales con el nuevo estado
          if (listReconsumptions) {
            setListReconsumptions({
              ...listReconsumptions,
              autoRenewal: value,
            });
          }
          toast.success(
            response.message || "Configuración actualizada correctamente"
          );
        } else {
          toast.error(
            response.message || "Error al actualizar la configuración"
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar la renovación automática";

        toast.error(errorMessage);
      }
    },
    [listReconsumptions]
  );

  // Cargar datos iniciales
  useEffect(() => {
    fetchReconsumptions(currentPage, itemsPerPage);
  }, [fetchReconsumptions, currentPage, itemsPerPage]);

  return {
    // Datos principales
    listReconsumptions,
    isLoading,
    error,

    // Paginación
    currentPage,
    itemsPerPage,

    // Método de pago
    paymentMethod,
    setPaymentMethod,

    // Estado del formulario de reconsumo
    payments,
    isPaymentModalOpen,
    totalPaidAmount,
    remainingAmount,
    isPaymentComplete,
    isSubmitting,
    notes,
    setNotes,

    // Puntos
    points,
    hasEnoughPoints,
    isLoadingPoints,

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
