"use server";

import { httpClient } from "@/lib/api/http-client";
import { MonthlyVolumenResponse, RankResponse } from "@/types/ranks/rank.types";

export async function getRanks(
  params?: Record<string, unknown> | undefined
): Promise<RankResponse> {
  try {
    return await httpClient<RankResponse>("/api/ranks", {
      params: params,
    });
  } catch (error) {
    console.error("Error al obtener los ranks:", error);
    throw error;
  }
}

export async function getVolumenMensual(
  params?: Record<string, unknown> | undefined
): Promise<MonthlyVolumenResponse> {
  try {
    return await httpClient<MonthlyVolumenResponse>(
      "/api/ranks/monthly-volumes",
      {
        params: params,
      }
    );
  } catch (error) {
    console.error("Error al obtener los ranks:", error);
    throw error;
  }
}
