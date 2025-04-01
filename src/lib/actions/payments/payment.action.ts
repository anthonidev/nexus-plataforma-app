"use server";
import { httpClient } from "@/lib/api/http-client";
import { Payment, PaymentsResponse } from "@/types/payment/payment.type";
export async function getUserPayments(
  params?: Record<string, unknown> | undefined
): Promise<PaymentsResponse> {
  try {
    return await httpClient<PaymentsResponse>("/api/payments", {
      params: params,
    });
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getUserPaymentById(paymentId: number): Promise<Payment> {
  try {
    return await httpClient<Payment>(`/api/payments/${paymentId}`);
  } catch (error) {
    console.error(`Error al obtener el pago con ID ${paymentId}:`, error);
    throw error;
  }
}
