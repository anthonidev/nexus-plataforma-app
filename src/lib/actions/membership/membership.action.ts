"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  MembershipDetailResponse,
  MembershipHistoryResponse,
  ReconsumptionsResponse,
} from "@/types/plan/membership";

export async function getMyMembership(): Promise<MembershipDetailResponse> {
  try {
    return await httpClient<MembershipDetailResponse>(
      "/api/user-memberships/membership-detail"
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getListReconsumptions(
  params?: Record<string, unknown> | undefined
): Promise<ReconsumptionsResponse> {
  try {
    return await httpClient<ReconsumptionsResponse>(
      "/api/user-memberships/reconsumptions",
      {
        params: params,
      }
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getHistoryPlans(
  params?: Record<string, unknown> | undefined
): Promise<MembershipHistoryResponse> {
  try {
    return await httpClient<MembershipHistoryResponse>(
      "/api/user-memberships/history",
      {
        params: params,
      }
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}
