"use client";

import {
  createWithdrawal,
  getInfoWithdrawals,
  getUserWithdrawals,
} from "@/lib/actions/withdrawals/withdrawals";
import {
  WithdrawalsInfo,
  WithdrawalsResponse,
} from "@/types/withdrawals/withdrawals.type";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseWithdrawalsReturn {
  // Datos de retiros
  withdrawals: WithdrawalsResponse | null;
  withdrawalsInfo: WithdrawalsInfo | null;
  isLoading: boolean;
  error: string | null;

  // Estado del modal
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Estado del formulario
  withdrawalAmount: number;
  setWithdrawalAmount: (amount: number) => void;
  isSubmitting: boolean;

  // Paginación
  currentPage: number;
  itemsPerPage: number;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;

  // Acciones
  submitWithdrawal: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useWithdrawals(
  initialPage: number = 1,
  initialLimit: number = 10
): UseWithdrawalsReturn {
  // Estados para los datos de retiros
  const [withdrawals, setWithdrawals] = useState<WithdrawalsResponse | null>(
    null
  );
  const [withdrawalsInfo, setWithdrawalsInfo] =
    useState<WithdrawalsInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para el modal y formulario
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Función para obtener la lista de retiros
  const fetchWithdrawals = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = {
          page,
          limit,
        };

        const response = await getUserWithdrawals(params);
        setWithdrawals(response);

        // Actualizar la página actual y elementos por página según la respuesta
        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar los retiros";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Función para obtener la información de retiros
  const fetchWithdrawalsInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getInfoWithdrawals();
      setWithdrawalsInfo(response);

      // Inicializar el monto de retiro con el mínimo si está disponible
      if (response.config?.minimumAmount) {
        setWithdrawalAmount(response.config.minimumAmount);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar la información de retiros";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para refrescar todos los datos
  const refreshData = useCallback(async () => {
    await Promise.all([
      fetchWithdrawals(currentPage, itemsPerPage),
      fetchWithdrawalsInfo(),
    ]);
  }, [fetchWithdrawals, fetchWithdrawalsInfo, currentPage, itemsPerPage]);

  // Funciones para manejar el modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Función para solicitar un retiro
  const submitWithdrawal = useCallback(async () => {
    if (!withdrawalsInfo?.canWithdraw) {
      toast.error(
        withdrawalsInfo?.reason || "No puedes realizar retiros en este momento"
      );
      return;
    }

    // Verificar el monto mínimo
    if (withdrawalAmount < (withdrawalsInfo.config.minimumAmount || 0)) {
      toast.error(
        `El monto mínimo de retiro es ${withdrawalsInfo.config.minimumAmount}`
      );
      return;
    }

    // Verificar el monto máximo si existe
    if (
      withdrawalsInfo.config.maximumAmount &&
      withdrawalAmount > withdrawalsInfo.config.maximumAmount
    ) {
      toast.error(
        `El monto máximo de retiro es ${withdrawalsInfo.config.maximumAmount}`
      );
      return;
    }

    // Verificar puntos disponibles
    if (withdrawalAmount > (withdrawalsInfo.availablePoints || 0)) {
      toast.error(
        `No tienes suficientes puntos disponibles. Máximo: ${withdrawalsInfo.availablePoints}`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createWithdrawal(withdrawalAmount);

      toast.success("Solicitud de retiro creada exitosamente");
      closeModal();

      // Refrescar los datos después de crear el retiro
      await refreshData();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al procesar la solicitud de retiro";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [withdrawalAmount, withdrawalsInfo, refreshData]);

  // Función para cambiar de página
  const handlePageChange = useCallback(
    (page: number) => {
      if (withdrawals?.meta && (page < 1 || page > withdrawals.meta.totalPages))
        return;
      setCurrentPage(page);
    },
    [withdrawals?.meta]
  );

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Actualizar los datos cuando cambia la página o los elementos por página
  useEffect(() => {
    fetchWithdrawals(currentPage, itemsPerPage);
  }, [fetchWithdrawals, currentPage, itemsPerPage]);

  return {
    // Datos de retiros
    withdrawals,
    withdrawalsInfo,
    isLoading,
    error,

    // Estado del modal
    isModalOpen,
    openModal,
    closeModal,

    // Estado del formulario
    withdrawalAmount,
    setWithdrawalAmount,
    isSubmitting,

    // Paginación
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,

    // Acciones
    submitWithdrawal,
    refreshData,
  };
}
