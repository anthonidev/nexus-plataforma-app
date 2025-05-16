"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  approvePayment,
  getPaymentById,
  rejectPayment,
  updatePayment,
} from "@/lib/actions/payments/payment.action";
import {
  PaymentResponse,
  ResponseApprovePayment,
  ResponseRejectPayment,
} from "@/types/payment/payment-detail.type";

export function useFinancePaymentDetail(paymentId: number) {
  const router = useRouter();
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approveResponse, setApproveResponse] =
    useState<ResponseApprovePayment | null>(null);
  const [rejectResponse, setRejectResponse] =
    useState<ResponseRejectPayment | null>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

  const fetchPaymentDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const paymentData = await getPaymentById(paymentId);
      setPayment(paymentData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los detalles del pago";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [paymentId]);

  const openApproveModal = useCallback(() => {
    setIsApproveModalOpen(true);
  }, []);

  const openRejectModal = useCallback(() => {
    setIsRejectModalOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(false);
    setRejectionReason("");
  }, []);

  const handleApprovePayment = useCallback(
    async (approvalData: {
      codeOperation: string;
      banckName: string;
      dateOperation: string;
      numberTicket: string;
    }) => {
      try {
        setIsSubmitting(true);

        const response = await approvePayment(paymentId, approvalData);

        setApproveResponse(response);
        closeModals();
        setIsResponseModalOpen(true);

        fetchPaymentDetail();

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al aprobar el pago";

        toast.error(errorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [paymentId, closeModals, fetchPaymentDetail]
  );

  const handleRejectPayment = useCallback(async () => {
    try {
      if (!rejectionReason.trim()) {
        toast.error("Debe ingresar un motivo de rechazo");
        return null;
      }

      setIsSubmitting(true);

      const response = await rejectPayment(paymentId, rejectionReason);

      setRejectResponse(response);
      closeModals();
      setIsResponseModalOpen(true);

      fetchPaymentDetail();

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al rechazar el pago";

      toast.error(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [paymentId, rejectionReason, closeModals, fetchPaymentDetail]);

  const handleUpdatePayment = useCallback(
    async (updateData: { codeOperation: string; numberTicket: string }) => {
      try {
        setIsSubmitting(true);

        await updatePayment(paymentId, updateData);

        toast.success("Información del pago actualizada correctamente");
        fetchPaymentDetail();

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al actualizar la información del pago";

        toast.error(errorMessage);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [paymentId, fetchPaymentDetail]
  );

  const navigateToPaymentsList = useCallback(() => {
    router.push("/admin/pagos");
  }, [router]);

  const closeResponseModal = useCallback(() => {
    setIsResponseModalOpen(false);
    setApproveResponse(null);
    setRejectResponse(null);
  }, []);

  useEffect(() => {
    fetchPaymentDetail();
  }, [fetchPaymentDetail]);

  return {
    payment,
    isLoading,
    error,
    refetch: fetchPaymentDetail,

    isApproveModalOpen,
    isRejectModalOpen,
    rejectionReason,
    setRejectionReason,
    isSubmitting,

    openApproveModal,
    openRejectModal,
    closeModals,

    handleApprovePayment,
    handleRejectPayment,
    handleUpdatePayment,

    approveResponse,
    rejectResponse,
    isResponseModalOpen,
    closeResponseModal,
    navigateToPaymentsList,
  };
}
