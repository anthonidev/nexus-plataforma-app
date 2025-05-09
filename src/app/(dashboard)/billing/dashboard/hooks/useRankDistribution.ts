"use client";

import { getTotalUserByRank } from "@/lib/actions/dashboard/dashboard.action";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface RankDistribution {
  name: string;
  count: number;
}

export function useRankDistribution() {
  const [rankData, setRankData] = useState<RankDistribution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankDistribution = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getTotalUserByRank();

      if (response) {
        // Transform the data into the format needed for the chart
        const formattedData = Object.entries(response).map(([name, count]) => ({
          name,
          count: count as number,
        }));

        // Sort by count in descending order
        formattedData.sort((a, b) => b.count - a.count);

        setRankData(formattedData);
      } else {
        setError("No se pudo obtener la distribución de rangos");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar la distribución de rangos";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRankDistribution();
  }, [fetchRankDistribution]);

  return {
    rankData,
    isLoading,
    error,
    refreshRankData: fetchRankDistribution,
  };
}
