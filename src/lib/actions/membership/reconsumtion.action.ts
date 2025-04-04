"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  ReconsumptionResponse,
  UpdateAutoRenewalResponse,
} from "@/types/plan/reconsumtion";

export async function createReconsumption(
  formData: FormData
): Promise<ReconsumptionResponse> {
  try {
    // Parse and validate payments
    const paymentsString = formData.get("payments") as string;
    const payments = JSON.parse(paymentsString);
    const paymentImages = formData.getAll("paymentImages") as File[];

    // Validate payments structure
    if (!Array.isArray(payments) || payments.length === 0) {
      throw new Error("Debe proporcionar al menos un pago");
    }

    // Validate file count matches payment count
    if (paymentImages.length !== payments.length) {
      throw new Error(
        "El número de imágenes debe coincidir con el número de pagos"
      );
    }

    // Validate total amount
    const totalAmount = parseFloat(formData.get("totalAmount") as string);
    const paymentTotal = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    if (Math.abs(totalAmount - paymentTotal) > 0.01) {
      throw new Error(
        `La suma de los pagos (${paymentTotal}) debe ser igual al monto total (${totalAmount})`
      );
    }

    // Send reconsumption request
    const response = await httpClient<ReconsumptionResponse>(
      "/api/user-memberships/reconsumption",
      {
        method: "POST",
        body: formData,
        contentType: "multipart/form-data",
        skipJsonStringify: true,
      }
    );

    return response;
  } catch (error) {
    console.error("Error al realizar el reconsumo:", error);

    // Throw a more user-friendly error
    throw new Error(
      error instanceof Error
        ? error.message
        : "No se pudo procesar el reconsumo. Inténtelo nuevamente."
    );
  }
}

export async function updateAutoRenewal(
  autoRenewal: boolean
): Promise<UpdateAutoRenewalResponse> {
  try {
    const response = await httpClient<UpdateAutoRenewalResponse>(
      "/api/user-memberships/auto-renewal",
      {
        method: "PATCH",
        body: { autoRenewal },
      }
    );

    return response;
  } catch (error) {
    console.error("Error al actualizar la renovación automática:", error);

    throw new Error(
      error instanceof Error
        ? error.message
        : "No se pudo actualizar la configuración de renovación automática. Inténtelo nuevamente."
    );
  }
}
