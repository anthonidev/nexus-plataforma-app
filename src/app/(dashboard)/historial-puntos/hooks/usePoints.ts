"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getMyPoints,
  getPointsTransactions,
} from "@/lib/actions/points/point.action";
import { PointTransactionItem, UserPointsResponse } from "@/types/points/point";

interface UsePointsReturn {
  // Datos de puntos del usuario
  points: UserPointsResponse | null;
  pointsLoading: boolean;
  pointsError: string | null;

  // Datos de transacciones
  transactions: PointTransactionItem[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionsMeta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;

  // Paginación
  currentPage: number;
  itemsPerPage: number;

  // Funciones para controlar la paginación
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (pageSize: number) => void;

  // Funciones para recargar datos
  refreshPoints: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export function usePoints(
  initialPage: number = 1,
  initialLimit: number = 10
): UsePointsReturn {
  // Estados para los puntos del usuario
  const [points, setPoints] = useState<UserPointsResponse | null>(null);
  const [pointsLoading, setPointsLoading] = useState<boolean>(true);
  const [pointsError, setPointsError] = useState<string | null>(null);

  // Estados para las transacciones
  const [transactions, setTransactions] = useState<PointTransactionItem[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );
  const [transactionsMeta, setTransactionsMeta] =
    useState<UsePointsReturn["transactionsMeta"]>(null);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialLimit);

  // Función para obtener los puntos del usuario
  const fetchPoints = useCallback(async () => {
    try {
      setPointsLoading(true);
      setPointsError(null);

      const response = await getMyPoints();
      setPoints(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los puntos del usuario";

      setPointsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPointsLoading(false);
    }
  }, []);

  // Función para obtener las transacciones de puntos
  const fetchTransactions = useCallback(
    async (page: number = currentPage, limit: number = itemsPerPage) => {
      try {
        setTransactionsLoading(true);
        setTransactionsError(null);

        const params = {
          page,
          limit,
        };

        const response = await getPointsTransactions(params);

        setTransactions(response.items);
        setTransactionsMeta(response.meta);

        // Actualizar la página actual y elementos por página según la respuesta
        setCurrentPage(response.meta.currentPage);
        setItemsPerPage(response.meta.itemsPerPage);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar las transacciones de puntos";

        setTransactionsError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setTransactionsLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  // Función para cambiar de página
  const handlePageChange = useCallback(
    (page: number) => {
      if (transactionsMeta && (page < 1 || page > transactionsMeta.totalPages))
        return;
      setCurrentPage(page);
    },
    [transactionsMeta]
  );

  // Función para cambiar el número de elementos por página
  const handleItemsPerPageChange = useCallback((limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Resetear a la primera página al cambiar el límite
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    fetchTransactions(currentPage, itemsPerPage);
  }, [fetchTransactions, currentPage, itemsPerPage]);

  return {
    // Datos de puntos del usuario
    points,
    pointsLoading,
    pointsError,

    // Datos de transacciones
    transactions,
    transactionsLoading,
    transactionsError,
    transactionsMeta,

    // Paginación
    currentPage,
    itemsPerPage,

    // Funciones
    handlePageChange,
    handleItemsPerPageChange,
    refreshPoints: fetchPoints,
    refreshTransactions: () => fetchTransactions(currentPage, itemsPerPage),
  };
}
