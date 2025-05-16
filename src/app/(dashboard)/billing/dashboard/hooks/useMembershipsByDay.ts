"use client";

import { getMembershipByDay } from "@/lib/actions/dashboard/dashboard.action";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface MembershipDayData {
  date: string;
  Ejecutivo: number;
  Premium: number;
  VIP: number;
}

type TimeRange = "7d" | "30d" | "90d";

export function useMembershipsByDay() {
  const [membershipData, setMembershipData] = useState<MembershipDayData[]>([]);
  const [filteredData, setFilteredData] = useState<MembershipDayData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembershipsByDay = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = new Date();
      const startDate = new Date(today);

      if (timeRange === "7d") {
        startDate.setDate(today.getDate() - 7);
      } else if (timeRange === "30d") {
        startDate.setDate(today.getDate() - 30);
      } else if (timeRange === "90d") {
        startDate.setDate(today.getDate() - 90);
      }

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = today.toISOString().split("T")[0];

      const response = await getMembershipByDay({
        startDate: startDateStr,
        endDate: endDateStr,
      });

      if (response) {
        const formattedData = response.map((item) => ({
          date: new Date(item.date).toISOString().split("T")[0], // Format date as YYYY-MM-DD
          Ejecutivo: item.Ejecutivo,
          Premium: item.Premium,
          VIP: item.VIP,
        }));

        formattedData.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setMembershipData(formattedData);

        // Apply filtering based on time range
        filterDataByTimeRange(formattedData, timeRange);
      } else {
        setError("No se pudo obtener los datos de membresías por día");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar datos de membresías por día";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  // Function to filter data based on time range
  const filterDataByTimeRange = useCallback(
    (data: MembershipDayData[], range: TimeRange) => {
      const today = new Date();
      const startDate = new Date(today);

      if (range === "7d") {
        startDate.setDate(today.getDate() - 7);
      } else if (range === "30d") {
        startDate.setDate(today.getDate() - 30);
      } else if (range === "90d") {
        startDate.setDate(today.getDate() - 90);
      }

      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= today;
      });

      setFilteredData(filteredData);
    },
    []
  );

  // Update filtered data when time range changes
  useEffect(() => {
    if (membershipData.length > 0) {
      filterDataByTimeRange(membershipData, timeRange);
    }
  }, [timeRange, membershipData, filterDataByTimeRange]);

  // Initial data fetch
  useEffect(() => {
    fetchMembershipsByDay();
  }, [fetchMembershipsByDay]);

  return {
    membershipData: filteredData,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    refreshData: fetchMembershipsByDay,
  };
}
