"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  DetailVolumeResponse,
  WeeklyVolumesResponse,
} from "@/types/points/volumen";

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

export async function getWeeklyVolumeById(
  id: number,
  params?: Record<string, unknown> | undefined
): Promise<DetailVolumeResponse> {
  try {
    return await httpClient<DetailVolumeResponse>(
      `/api/points/weekly-volume-details/${id}`,
      {
        params: params,
      }
    );
  } catch (error) {
    console.error("Error al obtener el volumen semanal por ID:", error);
    throw error;
  }
}
