"use client";

import { getTotalUsersByState } from "@/lib/actions/dashboard/dashboard.action";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UserStateData {
    name: string;
    value: number;
    fill: string;
}

export function useUsersByState() {
    const [stateData, setStateData] = useState<UserStateData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number>(0);

    // Define colors for each state
    const stateColors: Record<string, string> = {
        activos: "var(--chart-1)",
        inactivos: "var(--chart-2)",
        pendientes: "var(--chart-3)",
        expirados: "var(--chart-4)",
        "sin membresia": "var(--chart-5)",
    };

    // Format display names
    const stateNames: Record<string, string> = {
        activos: "Activos",
        inactivos: "Inactivos",
        pendientes: "Pendientes",
        expirados: "Expirados",
        "sin membresia": "Sin Membresía",
    };

    const fetchUsersByState = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await getTotalUsersByState();

            if (response) {
                // Get total users
                const totalUsers = response.total;
                setTotal(totalUsers);

                // Transform the data into the format needed for the chart
                const formattedData = Object.entries(response)
                    .filter(([key]) => key !== 'total') // Exclude total from the chart
                    .map(([key, value]) => ({
                        name: stateNames[key] || key,
                        value: value as number,
                        fill: stateColors[key] || "var(--chart-1)",
                        key: key // Keep original key for reference
                    }));

                setStateData(formattedData);
            } else {
                setError("No se pudo obtener la distribución de usuarios por estado");
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error al cargar la distribución de usuarios por estado";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsersByState();
    }, [fetchUsersByState]);

    return {
        stateData,
        isLoading,
        error,
        total,
        refreshData: fetchUsersByState
    };
}