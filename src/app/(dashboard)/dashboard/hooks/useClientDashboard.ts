"use client";

import { useState, useEffect } from "react";
import { getMyClientDashboard } from "@/lib/actions/dashboard/dashboard.action";
import { DashboardClient } from "@/types/dashboard/client-dashboard.type";
import { toast } from "sonner";

interface UseClientDashboardReturn {
  dashboard: DashboardClient | null;
  isLoading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
}

export function useClientDashboard(): UseClientDashboardReturn {
  const [dashboard, setDashboard] = useState<DashboardClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getMyClientDashboard();
      setDashboard(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar el dashboard";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboard,
    isLoading,
    error,
    refreshDashboard: fetchDashboard,
  };
}
