"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "@/lib/actions/withdrawals/finance-withdrawals";
import {
  FinanceWithdrawals,
  Item,
} from "@/types/withdrawals/finance-withdrawals.type";

interface UseFinanceWithdrawalsReturn {
  // Datos de retiros
  withdrawals: Item[];
  isLoading: boolean;
  error: string | null;
  meta: FinanceWithdrawals["meta"] | null;

  // Estado de modales
  isApproveModalOpen: boolean;
  isRejectModalOpen: boolean;
  isResponseModalOpen: boolean;

  // Estado del formulario
  selectedWithdrawal: Item | null;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  isSubmitting: boolean;
  approveData: {
    codeOperation: string;
    banckNameApproval: string;
    dateOperation: string;
    numberTicket: string;
  };
  setApproveData: (
    data: Partial<UseFinanceWithdrawalsReturn["approveData"]>
  ) => void;

  // Respuestas de operaciones
  approveResponse: any | null;
  rejectResponse: any | null;

  // Paginación
  currentPage: number;
  itemsPerPage: number;

  // Modal handlers
  openApproveModal: (withdrawal: Item) => void;
  openRejectModal: (withdrawal: Item) => void;
  closeModals: () => void;
  closeResponseModal: () => void;

  // Acción handlers
  handleApproveWithdrawal: () => Promise<void>;
  handleRejectWithdrawal: () => Promise<void>;

  // Navegación y actualización
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;
  refreshWithdrawals: () => Promise<void>;
  navigateToWithdrawalsList: () => void;
}

export function useFinanceWithdrawals(
  initialPage: number = 1,
  initialLimit: number = 10
): UseFinanceWithdrawalsReturn {
  // Estados para los datos de retiros
  const [withdrawals, setWithdrawals] = useState<Item[]>([]);
  const [meta, setMeta] = useState<FinanceWithdrawals["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para modales
  const [isApproveModalOpen, setIsApproveModalOpen] = useState<boolean>(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [isResponseModalOpen, setIsResponseModalOpen] =
    useState<boolean>(false);

  // Estado de selección y formulario
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Item | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [approveData, setApproveDataState] = useState<
    UseFinanceWithdrawalsReturn["approveData"]
  >({
    codeOperation: "",
    banckNameApproval: "",
    dateOperation: new Date().toISOString().split("T")[0],
    numberTicket: "",
  });

  // Respuestas de operaciones
  const [approveResponse, setApproveResponse] = useState<any | null>(null);
  const [rejectResponse, setRejectResponse] = useState<any | null>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Función para actualizar los datos del formulario de aprobación
  const setApproveData = (
    data: Partial<UseFinanceWithdrawalsReturn["approveData"]>
  ) => {
    setApproveDataState((prev) => ({ ...prev, ...data }));
  };

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

        const response = await getAllWithdrawals(params);
        setWithdrawals(response.items);
        setMeta(response.meta);

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

  // Handler para abrir modal de aprobación
  const openApproveModal = useCallback((withdrawal: Item) => {
    setSelectedWithdrawal(withdrawal);
    setIsApproveModalOpen(true);
  }, []);

  // Handler para abrir modal de rechazo
  const openRejectModal = useCallback((withdrawal: Item) => {
    setSelectedWithdrawal(withdrawal);
    setIsRejectModalOpen(true);
  }, []);

  // Handler para cerrar todos los modales de acción
  const closeModals = useCallback(() => {
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(false);
    setSelectedWithdrawal(null);
    setRejectionReason("");
    setApproveDataState({
      codeOperation: "",
      banckNameApproval: "",
      dateOperation: new Date().toISOString().split("T")[0],
      numberTicket: "",
    });
  }, []);

  // Handler para cerrar modal de respuesta
  const closeResponseModal = useCallback(() => {
    setIsResponseModalOpen(false);
    setApproveResponse(null);
    setRejectResponse(null);
  }, []);

  // Handler para aprobar un retiro
  const handleApproveWithdrawal = useCallback(async () => {
    if (!selectedWithdrawal) {
      toast.error("No se ha seleccionado un retiro para aprobar");
      return;
    }

    // Validar que todos los campos estén completos
    if (
      !approveData.codeOperation ||
      !approveData.banckNameApproval ||
      !approveData.dateOperation ||
      !approveData.numberTicket
    ) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await approveWithdrawal(
        selectedWithdrawal.id,
        approveData
      );

      setApproveResponse(response);
      closeModals();
      setIsResponseModalOpen(true);

      // Refrescar la lista de retiros
      await fetchWithdrawals();

      toast.success("Retiro aprobado exitosamente");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al aprobar el retiro";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedWithdrawal, approveData, closeModals, fetchWithdrawals]);

  // Handler para rechazar un retiro
  const handleRejectWithdrawal = useCallback(async () => {
    if (!selectedWithdrawal) {
      toast.error("No se ha seleccionado un retiro para rechazar");
      return;
    }

    // Validar que haya un motivo de rechazo
    if (!rejectionReason.trim()) {
      toast.error("Por favor ingrese un motivo de rechazo");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await rejectWithdrawal(
        selectedWithdrawal.id,
        rejectionReason
      );

      setRejectResponse(response);
      closeModals();
      setIsResponseModalOpen(true);

      // Refrescar la lista de retiros
      await fetchWithdrawals();

      toast.success("Retiro rechazado exitosamente");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al rechazar el retiro";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedWithdrawal, rejectionReason, closeModals, fetchWithdrawals]);

  // Handler para cambiar de página
  const handlePageChange = useCallback(
    (page: number) => {
      if (meta && (page < 1 || page > meta.totalPages)) return;
      setCurrentPage(page);
    },
    [meta]
  );

  // Handler para cambiar elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  // Handler para navegar a la lista de retiros
  const navigateToWithdrawalsList = useCallback(() => {
    // Implementación para redirección si es necesaria
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return {
    // Datos de retiros
    withdrawals,
    isLoading,
    error,
    meta,

    // Estado de modales
    isApproveModalOpen,
    isRejectModalOpen,
    isResponseModalOpen,

    // Estado del formulario
    selectedWithdrawal,
    rejectionReason,
    setRejectionReason,
    isSubmitting,
    approveData,
    setApproveData,

    // Respuestas de operaciones
    approveResponse,
    rejectResponse,

    // Paginación
    currentPage,
    itemsPerPage,

    // Modal handlers
    openApproveModal,
    openRejectModal,
    closeModals,
    closeResponseModal,

    // Acción handlers
    handleApproveWithdrawal,
    handleRejectWithdrawal,

    // Navegación y actualización
    handlePageChange,
    handleItemsPerPageChange,
    refreshWithdrawals: fetchWithdrawals,
    navigateToWithdrawalsList,
  };
}
