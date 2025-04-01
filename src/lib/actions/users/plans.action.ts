"use server";

import { httpClient } from "@/lib/api/http-client";
import { MembershipPlan } from "@/types/plan/plan.types";

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
