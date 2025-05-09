"use client";

import { getTotalMembershipByPlan } from "@/lib/actions/dashboard/dashboard.action";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface MembershipPlanData {
  name: string;
  value: number;
  fill: string;
}

export function useMembershipPlans() {
  const [planData, setPlanData] = useState<MembershipPlanData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [growthRate, setGrowthRate] = useState<number>(5.2); // Default value, ideally would be calculated from historic data

  // Define colors for each plan
  const planColors: Record<string, string> = {
    Ejecutivo: "var(--chart-1)",
    Premium: "var(--chart-2)",
    VIP: "var(--chart-3)",
  };

  const fetchMembershipPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getTotalMembershipByPlan();

      if (response) {
        // Transform the data into the format needed for the chart
        const formattedData = Object.entries(response).map(([key, value]) => ({
          name: key,
          value: value as number,
          fill: planColors[key] || "var(--chart-1)",
        }));

        // Sort by value in descending order
        formattedData.sort((a, b) => b.value - a.value);

        setPlanData(formattedData);

        // Calculate total
        const totalPlans = formattedData.reduce(
          (sum, item) => sum + item.value,
          0
        );
        setTotal(totalPlans);

        // Calculate growth rate (normally, this would be calculated with historic data)
        // For this example, we'll use a placeholder approach
        setGrowthRate(Math.floor(Math.random() * 6) + 2); // Random between 2-7% for demo
      } else {
        setError("No se pudo obtener la distribución de planes de membresía");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar la distribución de planes de membresía";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembershipPlans();
  }, [fetchMembershipPlans]);

  return {
    planData,
    isLoading,
    error,
    total,
    growthRate,
    refreshData: fetchMembershipPlans,
  };
}
