"use server";

import { httpClient } from "@/lib/api/http-client";
import { UbigeoResponse } from "@/types/profile/ubigeo.type";

export async function getUbigeos(): Promise<UbigeoResponse> {
  try {
    return await httpClient<UbigeoResponse>("/api/ubigeos");
  } catch (error) {
    console.error("Error al obtener ubigeos:", error);
    throw error;
  }
}
