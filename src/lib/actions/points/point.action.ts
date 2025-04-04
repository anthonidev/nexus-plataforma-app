"use server";
import { httpClient } from "@/lib/api/http-client";
import {
  PointsTransactionsResponse,
  UserPointsResponse,
} from "@/types/points/point";

export async function getMyPoints(): Promise<UserPointsResponse> {
  try {
    return await httpClient<UserPointsResponse>("/api/points/user-points");
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}

export async function getPointsTransactions(
  params?: Record<string, unknown> | undefined
): Promise<PointsTransactionsResponse> {
  try {
    return await httpClient<PointsTransactionsResponse>(
      "/api/points/transactions",
      {
        params: params,
      }
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}
