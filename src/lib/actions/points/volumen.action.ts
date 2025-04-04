"use server";

import { httpClient } from "@/lib/api/http-client";
import { WeeklyVolumesResponse } from "@/types/points/volumen";

export async function getWeeklyVolumes(
  params?: Record<string, unknown> | undefined
): Promise<WeeklyVolumesResponse> {
  try {
    return await httpClient<WeeklyVolumesResponse>(
      "/api/points/weekly-volumes",
      {
        params: params,
      }
    );
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}
