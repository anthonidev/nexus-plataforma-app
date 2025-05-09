"use client";

import { getPaymentsByConcepts } from "@/lib/actions/dashboard/dashboard.action";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { subMonths, format } from "date-fns";
import { es } from "date-fns/locale";

interface PaymentConceptData {
  month: string;
  date: string;
  membresia: number;
  upgrade: number;
  reconsumo: number;
  orden: number;
}

type TimeRange = "6m" | "3m" | "1m";

export function usePaymentsByConcepts() {
  const [paymentData, setPaymentData] = useState<PaymentConceptData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("3m");
  const [totalsByType, setTotalsByType] = useState<Record<string, number>>({
    membresia: 0,
    upgrade: 0,
    reconsumo: 0,
    orden: 0,
    total: 0,
  });
  const [growthRate, setGrowthRate] = useState<number>(0);

  const fetchPaymentsByConcepts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Calculate date ranges based on selected time range
      const endDate = new Date();
      let startDate: Date;

      if (timeRange === "1m") {
        startDate = subMonths(endDate, 1);
      } else if (timeRange === "3m") {
        startDate = subMonths(endDate, 3);
      } else {
        startDate = subMonths(endDate, 6);
      }

      // Format dates for API params
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");

      const response = await getPaymentsByConcepts({
        startDate: startDateStr,
        endDate: endDateStr,
      });

      if (response && Array.isArray(response)) {
        // Transform and prepare data for the chart
        const formattedData: PaymentConceptData[] = response.map((item) => {
          const date = new Date(item.date);
          return {
            date: format(date, "yyyy-MM-dd"),
            month: format(date, "MMM yyyy", { locale: es }),
            membresia: item.membresia,
            upgrade: item.upgrade,
            reconsumo: item.reconsumo,
            orden: item.orden,
          };
        });

        // Sort by date
        formattedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Group by month for better visualization
        const monthlyData = groupByMonth(formattedData);

        // Calculate totals by type
        const totals = {
          membresia: 0,
          upgrade: 0,
          reconsumo: 0,
          orden: 0,
          total: 0,
        };

        monthlyData.forEach((item) => {
          totals.membresia += item.membresia;
          totals.upgrade += item.upgrade;
          totals.reconsumo += item.reconsumo;
          totals.orden += item.orden;
        });

        totals.total =
          totals.membresia + totals.upgrade + totals.reconsumo + totals.orden;
        setTotalsByType(totals);

        // Calculate growth rate
        if (monthlyData.length >= 2) {
          const halfPoint = Math.floor(monthlyData.length / 2);
          const firstHalf = monthlyData.slice(0, halfPoint);
          const secondHalf = monthlyData.slice(halfPoint);

          const firstHalfTotal = firstHalf.reduce(
            (sum, item) =>
              sum + item.membresia + item.upgrade + item.reconsumo + item.orden,
            0
          );

          const secondHalfTotal = secondHalf.reduce(
            (sum, item) =>
              sum + item.membresia + item.upgrade + item.reconsumo + item.orden,
            0
          );

          const growth =
            firstHalfTotal > 0
              ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100
              : 0;

          setGrowthRate(Math.round(growth * 10) / 10); // Round to 1 decimal place
        }

        setPaymentData(monthlyData);
      } else {
        setError("No se pudieron obtener los datos de pagos por conceptos");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar datos de pagos por conceptos";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  // Function to group data by month
  const groupByMonth = (data: PaymentConceptData[]): PaymentConceptData[] => {
    if (data.length === 0) return [];

    const monthlyMap: Record<string, PaymentConceptData> = {};

    data.forEach((item) => {
      const month = item.month;

      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          month,
          date: item.date,
          membresia: 0,
          upgrade: 0,
          reconsumo: 0,
          orden: 0,
        };
      }

      monthlyMap[month].membresia += item.membresia;
      monthlyMap[month].upgrade += item.upgrade;
      monthlyMap[month].reconsumo += item.reconsumo;
      monthlyMap[month].orden += item.orden;
    });

    // Convert back to array and sort by date
    return Object.values(monthlyMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // Fetch data when timeRange changes
  useEffect(() => {
    fetchPaymentsByConcepts();
  }, [fetchPaymentsByConcepts, timeRange]);

  return {
    paymentData,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    totalsByType,
    growthRate,
    refreshData: fetchPaymentsByConcepts,
  };
}
