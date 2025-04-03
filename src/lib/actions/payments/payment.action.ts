"use server";
import { httpClient } from "@/lib/api/http-client";
import { PaymentResponse } from "@/types/payment/payment-detail.type";
import { PaymentsListResponse } from "@/types/payment/payment.type";

export async function getUserPayments(
  params?: Record<string, unknown> | undefined
): Promise<PaymentsListResponse> {
  try {
    return await httpClient<PaymentsListResponse>("/api/payments", {
      params: params,
    });
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getUserPaymentById(
  paymentId: number
): Promise<PaymentResponse> {
  try {
    return await httpClient<PaymentResponse>(`/api/payments/${paymentId}`);
  } catch (error) {
    console.error(`Error al obtener el pago con ID ${paymentId}:`, error);
    throw error;
  }
}

export async function getPayments(
  params?: Record<string, unknown> | undefined
): Promise<PaymentsListResponse> {
  try {
    return await httpClient<PaymentsListResponse>("/api/finance/payments", {
      params: params,
    });
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getPaymentById(
  paymentId: number
): Promise<PaymentResponse> {
  try {
    return await httpClient<PaymentResponse>(
      `/api/finance/payments/${paymentId}`
    );
  } catch (error) {
    console.error(`Error al obtener el pago con ID ${paymentId}:`, error);
    throw error;
  }
}
