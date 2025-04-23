"use client";

import { getUserPaymentById } from "@/lib/actions/payments/payment.action";
import { PaymentDetailUserResponse } from "@/types/payment/payment-detail-user.type";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function usePaymentDetail(paymentId: number) {
  const [payment, setPayment] = useState<PaymentDetailUserResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const paymentData = await getUserPaymentById(paymentId);
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

  useEffect(() => {
    fetchPaymentDetail();
  }, [fetchPaymentDetail]);

  return {
    payment,
    isLoading,
    error,
    refetch: fetchPaymentDetail,
  };
}
