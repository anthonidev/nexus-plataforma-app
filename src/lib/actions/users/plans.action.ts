"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  MembershipPlan,
  MembershipPlanResponse,
} from "@/types/plan/plan.types";
import { revalidatePath } from "next/cache";

export async function getMembershipPlans(
  isActive?: boolean
): Promise<MembershipPlanResponse> {
  try {
    const params = isActive !== undefined ? { isActive } : undefined;
    const response = await httpClient<MembershipPlanResponse>(
      "/api/membership-plans",
      {
        params,
      }
    );
    console.log("Planes de membresía obtenidos:", response);

    return response;
  } catch (error) {
    console.error("Error al obtener planes de membresía:", error);
    throw error;
  }
}

export async function getMembershipPlanById(
  id: number
): Promise<MembershipPlan> {
  try {
    return await httpClient<MembershipPlan>(`/api/membership-plans/${id}`);
  } catch (error) {
    console.error(`Error al obtener plan de membresía con ID ${id}:`, error);
    throw error;
  }
}
export async function subscribeToPlan(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
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

    // Send subscription request
    console.log("Enviando datos de suscripción:", formData);
    const response = await httpClient<{ success: boolean; message: string }>(
      "/api/user-memberships/subscribe",
      {
        method: "POST",
        body: formData,
        contentType: "multipart/form-data",
        skipJsonStringify: true,
      }
    );

    // Revalidate relevant paths
    revalidatePath("/planes");
    revalidatePath("/");

    return response;
  } catch (error) {
    console.error("Error al suscribirse al plan:", error);

    // Throw a more user-friendly error
    throw new Error(
      error instanceof Error
        ? error.message
        : "No se pudo procesar la suscripción. Inténtelo nuevamente."
    );
  }
}
