"use server";

import { httpClient } from "@/lib/api/http-client";
import { MembershipPlan, PaymentDetail } from "@/types/plan/plan.types";
import { revalidatePath } from "next/cache";

export async function getMembershipPlans(
  isActive?: boolean
): Promise<MembershipPlan[]> {
  try {
    const params = isActive !== undefined ? { isActive } : undefined;
    const response = await httpClient<MembershipPlan[]>(
      "/api/membership-plans",
      {
        params,
      }
    );

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
    // Parse payments from the FormData
    const paymentsString = formData.get("payments") as string;
    let payments: PaymentDetail[] = [];

    try {
      // Ensure payments is a valid JSON array
      payments = JSON.parse(paymentsString);

      // Validate payments structure
      if (!Array.isArray(payments) || payments.length === 0) {
        throw new Error("Pagos inválidos");
      }
    } catch (parseError) {
      console.error("Error parsing payments:", parseError);
      throw new Error("No se pudieron procesar los comprobantes de pago");
    }

    // Send subscription request
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
