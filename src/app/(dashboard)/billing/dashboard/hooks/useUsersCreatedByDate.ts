"use client";

import { getUsersCreatedByDate } from "@/lib/actions/dashboard/dashboard.action";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { subMonths, format } from "date-fns";
import { es } from "date-fns/locale";

interface UserCreationData {
  date: string;
  cantidad: number;
}

type TimeRange = "6m" | "3m" | "1m";

export function useUsersCreatedByDate() {
  const [userData, setUserData] = useState<UserCreationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("3m");
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchUsersCreatedByDate = useCallback(async () => {
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

      const response = await getUsersCreatedByDate({
        startDate: startDateStr,
        endDate: endDateStr,
      });

      if (response && Array.isArray(response)) {
        // Transform and prepare data for the chart
        const formattedData: UserCreationData[] = response.map((item) => {
          const date = new Date(item.date);
          return {
            date: format(date, "yyyy-MM-dd"),
            cantidad: item.cantidad,
          };
        });

        // Sort by date
        formattedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Calculate total users created in this period
        const total = formattedData.reduce(
          (sum, item) => sum + item.cantidad,
          0
        );
        setTotalUsers(total);

        setUserData(formattedData);
      } else {
        setError(
          "No se pudieron obtener los datos de usuarios creados por fecha"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar datos de usuarios creados por fecha";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  // Fetch data when timeRange changes
  useEffect(() => {
    fetchUsersCreatedByDate();
  }, [fetchUsersCreatedByDate, timeRange]);

  return {
    userData,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    totalUsers,
    refreshData: fetchUsersCreatedByDate,
  };
}
