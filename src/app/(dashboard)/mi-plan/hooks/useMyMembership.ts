"use client";

import {
  getHistoryPlans,
  getMyMembership,
} from "@/lib/actions/membership/membership.action";
import {
  MembershipDetailResponse,
  MembershipHistoryResponse,
} from "@/types/plan/membership";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseMyMembershipReturn {
  // Datos de la membresía
  membership: MembershipDetailResponse | null;
  membershipLoading: boolean;
  membershipError: string | null;

  // Datos del historial
  historyItems: MembershipHistoryResponse["items"];
  historyLoading: boolean;
  historyError: string | null;
  historyMeta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;

  // Paginación del historial
  currentPage: number;
  itemsPerPage: number;

  // Funciones para controlar la paginación
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;

  // Funciones para recargar datos
  refreshMembership: () => Promise<void>;
  refreshHistory: () => Promise<void>;
}

export function useMyMembership(
  initialPage: number = 1,
  initialLimit: number = 10
): UseMyMembershipReturn {
  // Estados para la membresía
  const [membership, setMembership] = useState<MembershipDetailResponse | null>(
    null
  );
  const [membershipLoading, setMembershipLoading] = useState<boolean>(true);
  const [membershipError, setMembershipError] = useState<string | null>(null);

  // Estados para el historial
  const [historyItems, setHistoryItems] = useState<
    MembershipHistoryResponse["items"]
  >([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyMeta, setHistoryMeta] =
    useState<UseMyMembershipReturn["historyMeta"]>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Función para obtener los detalles de la membresía
  const fetchMembership = useCallback(async () => {
    try {
      setMembershipLoading(true);
      setMembershipError(null);

      const response = await getMyMembership();
      setMembership(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los detalles de la membresía";

      setMembershipError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setMembershipLoading(false);
    }
  }, []);

  // Función para obtener el historial de planes
  const fetchHistory = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setHistoryLoading(true);
        setHistoryError(null);

        const params = {
          page,
          limit,
        };

        const response = await getHistoryPlans(params);

        setHistoryItems(response.items);
        setHistoryMeta(response.meta);

        // Actualizar la página actual y elementos por página según la respuesta
        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar el historial de planes";

        setHistoryError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setHistoryLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Función para cambiar de página
  const handlePageChange = useCallback(
    (page: number) => {
      if (historyMeta && (page < 1 || page > historyMeta.totalPages)) return;
      setCurrentPage(page);
    },
    [historyMeta]
  );

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  useEffect(() => {
    fetchHistory(currentPage, itemsPerPage);
  }, [fetchHistory, currentPage, itemsPerPage]);

  return {
    // Datos de la membresía
    membership,
    membershipLoading,
    membershipError,

    // Datos del historial
    historyItems,
    historyLoading,
    historyError,
    historyMeta,

    // Paginación
    currentPage,
    itemsPerPage,

    // Funciones
    handlePageChange,
    handleItemsPerPageChange,
    refreshMembership: fetchMembership,
    refreshHistory: () => fetchHistory(currentPage, itemsPerPage),
  };
}
