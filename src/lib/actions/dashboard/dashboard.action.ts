"use server";

import { httpClient } from "@/lib/api/http-client";
import { DashboardClient } from "@/types/dashboard/client-dashboard.type";

export async function getMyClientDashboard(): Promise<DashboardClient> {
  try {
    return await httpClient<DashboardClient>("/api/dashboard");
  } catch (error) {
    console.error("Error al obtener los pagos del usuario:", error);
    throw error;
  }
}
