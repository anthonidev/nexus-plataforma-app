"use client";

import { getOrdersByDay } from "@/lib/actions/dashboard/dashboard.action";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { subDays, format } from "date-fns";
import { es } from "date-fns/locale";

interface OrderDayData {
  month: string;
  date: string;
  cantidad: number;
}

export function useOrdersByDay() {
  const [orderData, setOrderData] = useState<OrderDayData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [growthRate, setGrowthRate] = useState<number>(0);

  const fetchOrdersByDay = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Calculate date ranges for the last 30 days
      const endDate = new Date();
      const startDate = subDays(endDate, 30);

      // Format dates for API params
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const endDateStr = format(endDate, "yyyy-MM-dd");

      const response = await getOrdersByDay({
        startDate: startDateStr,
        endDate: endDateStr,
      });

      if (response && Array.isArray(response)) {
        // Format data for the chart
        const formattedData = response.map((item) => {
          const date = new Date(item.date);
          return {
            date: format(date, "yyyy-MM-dd"),
            month: format(date, "MMM d", { locale: es }),
            cantidad: item.cantidad,
          };
        });

        // Calculate total orders
        const total = formattedData.reduce(
          (sum, item) => sum + item.cantidad,
          0
        );
        setTotalOrders(total);

        // Calculate growth rate (comparing first half vs second half)
        if (formattedData.length > 0) {
          const midpoint = Math.floor(formattedData.length / 2);
          const firstHalf = formattedData.slice(0, midpoint);
          const secondHalf = formattedData.slice(midpoint);

          const firstHalfTotal = firstHalf.reduce(
            (sum, item) => sum + item.cantidad,
            0
          );
          const secondHalfTotal = secondHalf.reduce(
            (sum, item) => sum + item.cantidad,
            0
          );

          const growth =
            firstHalfTotal > 0
              ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100
              : 0;

          setGrowthRate(Math.round(growth * 10) / 10); // Round to 1 decimal place
        }

        // Sort by date (ascending)
        formattedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Group data into weeks
        const groupedData = groupByWeek(formattedData);

        setOrderData(groupedData);
      } else {
        setError("No se pudieron obtener los datos de órdenes por día");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar datos de órdenes por día";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to group daily data into weekly data points for better visualization
  const groupByWeek = (data: OrderDayData[]): OrderDayData[] => {
    if (data.length === 0) return [];

    // Create weekly buckets (get 6 buckets for a smoother chart)
    const numPoints = Math.min(6, data.length);
    const bucketSize = Math.ceil(data.length / numPoints);

    const result: OrderDayData[] = [];

    for (let i = 0; i < data.length; i += bucketSize) {
      const bucket = data.slice(i, i + bucketSize);
      if (bucket.length > 0) {
        // Calculate total for the bucket
        const totalQuantity = bucket.reduce(
          (sum, item) => sum + item.cantidad,
          0
        );

        // Use the first and last date for the label
        const firstDate = new Date(bucket[0].date);
        const lastDate = new Date(bucket[bucket.length - 1].date);

        const label = `${format(firstDate, "d", { locale: es })}-${format(
          lastDate,
          "d MMM",
          { locale: es }
        )}`;

        result.push({
          month: label,
          date: bucket[0].date,
          cantidad: totalQuantity,
        });
      }
    }

    return result;
  };

  useEffect(() => {
    fetchOrdersByDay();
  }, [fetchOrdersByDay]);

  return {
    orderData,
    isLoading,
    error,
    totalOrders,
    growthRate,
    refreshData: fetchOrdersByDay,
  };
}
