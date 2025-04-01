"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getMembershipPlanById,
  subscribeToPlan,
  upgradeToPlan,
} from "@/lib/actions/users/plans.action";
import { MembershipPlan } from "@/types/plan/plan.types";
import { PaymentImageModalType } from "../validations/suscription.zod";

export function useMembershipDetail(planId: number) {
  const router = useRouter();

  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [userMembership, setUserMembership] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para el manejo de pagos
  const [payments, setPayments] = useState<PaymentImageModalType[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Calcular el precio del plan (normal o de actualización)
  const planPrice = plan
    ? plan.isUpgrade && plan.upgradeCost
      ? plan.upgradeCost
      : parseFloat(plan.price)
    : 0;

  // Calcular el total pagado
  const totalPaidAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  // Calcular monto pendiente
  const remainingAmount = Math.max(0, planPrice - totalPaidAmount);

  // Verificar si el pago está completo
  const isPaymentComplete =
    totalPaidAmount === planPrice && payments.length > 0;

  const fetchPlanDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMembershipPlanById(planId);
      setPlan(response.plan);
      setUserMembership(response.userMembership);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los detalles del plan";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [planId]);

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

  const validatePayments = () => {
    if (payments.length === 0) {
      toast.error("Debe agregar al menos un comprobante de pago");
      return false;
    }

    if (totalPaidAmount !== planPrice) {
      toast.error(`El monto total debe ser ${planPrice}`);
      return false;
    }

    return true;
  };

  const handleSubscription = useCallback(async () => {
    if (!validatePayments()) return;

    try {
      setIsSubmitting(true);

      // Crear FormData
      const formData = new FormData();

      // Append basic details
      formData.append("planId", String(planId));
      formData.append("totalAmount", planPrice.toFixed(2));

      // Prepare payments with correct structure
      const paymentsData = payments.map((payment, index) => ({
        bankName: payment.bankName || "",
        transactionReference: payment.transactionReference,
        transactionDate: payment.transactionDate,
        amount: payment.amount,
        fileIndex: index,
      }));

      // Append payments as JSON string
      formData.append("payments", JSON.stringify(paymentsData));

      // Append payment images in order
      payments.forEach((payment) => {
        formData.append("paymentImages", payment.file);
      });

      // Call the appropriate API
      let result;

      if (plan?.isUpgrade) {
        result = await upgradeToPlan(formData);
      } else {
        result = await subscribeToPlan(formData);
      }

      if (result.success) {
        toast.success(result.message);
        router.push("/planes");
      } else {
        toast.error(result.message || "Error al procesar la solicitud");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : plan?.isUpgrade
          ? "Ocurrió un error al actualizar el plan"
          : "Ocurrió un error al suscribirse al plan";

      toast.error(errorMessage);
      console.error(
        plan?.isUpgrade ? "Upgrade error:" : "Subscription error:",
        err
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [router, plan, planId, planPrice, payments]);

  useEffect(() => {
    fetchPlanDetails();
  }, [fetchPlanDetails]);

  return {
    // Plan data
    plan,
    userMembership,
    isLoading,
    error,
    isSubmitting,

    // Payment data
    payments,
    isPaymentModalOpen,
    totalPaidAmount,
    remainingAmount,
    planPrice,
    isPaymentComplete,

    // Payment actions
    addPayment,
    deletePayment,
    editPayment,
    handlePaymentModalOpen,
    handlePaymentModalClose,

    // Form submission
    handleSubscription,

    // Utils
    refetchPlan: fetchPlanDetails,
  };
}
