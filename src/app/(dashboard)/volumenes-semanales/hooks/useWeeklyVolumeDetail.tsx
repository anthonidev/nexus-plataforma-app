"use client";

import { getWeeklyVolumeById } from "@/lib/actions/points/volumen.action";
import { DetailVolumeResponse } from "@/types/points/volumen";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseWeeklyVolumeDetailProps {
    volumeId: number;
}

interface UseWeeklyVolumeDetailReturn {
    volume: DetailVolumeResponse | null;
    isLoading: boolean;
    error: string | null;

    // Para la paginación de pagos
    paymentsPage: number;
    paymentsPageSize: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (pageSize: number) => void;

    // Para refrescar los datos
    refreshVolume: () => Promise<void>;
}

export function useWeeklyVolumeDetail({
    volumeId
}: UseWeeklyVolumeDetailProps): UseWeeklyVolumeDetailReturn {
    const [volume, setVolume] = useState<DetailVolumeResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para la paginación de pagos
    const [paymentsPage, setPaymentsPage] = useState<number>(1);
    const [paymentsPageSize, setPaymentsPageSize] = useState<number>(10);

    const fetchVolumeDetail = useCallback(async () => {
        if (!volumeId) {
            setError("ID de volumen semanal no válido");
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const params: Record<string, unknown> = {
                page: paymentsPage,
                limit: paymentsPageSize
            };

            const response = await getWeeklyVolumeById(volumeId, params);

            if (response) {
                setVolume(response);
            } else {
                setError("No se pudo obtener la información del volumen semanal");
            }
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error al cargar los detalles del volumen semanal";

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [volumeId, paymentsPage, paymentsPageSize]);

    // Cargar datos iniciales
    useEffect(() => {
        fetchVolumeDetail();
    }, [fetchVolumeDetail]);

    // Funciones para manejar la paginación
    const handlePageChange = useCallback((page: number) => {
        setPaymentsPage(page);
    }, []);

    const handlePageSizeChange = useCallback((pageSize: number) => {
        setPaymentsPageSize(pageSize);
        setPaymentsPage(1); // Resetear a primera página cuando cambia el tamaño
    }, []);

    return {
        volume,
        isLoading,
        error,
        paymentsPage,
        paymentsPageSize,
        handlePageChange,
        handlePageSizeChange,
        refreshVolume: fetchVolumeDetail
    };
}