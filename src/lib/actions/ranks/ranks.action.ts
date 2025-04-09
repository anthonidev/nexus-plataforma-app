"use server";

import { httpClient } from "@/lib/api/http-client";
import { RankResponse } from "@/types/ranks/rank.types";

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
