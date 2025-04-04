"use client";

import { usePoints } from "./hooks/usePoints";
import PointsTransactionsTable from "./components/PointsTransactionsTable";
import PointsSummaryCard from "./components/PointsSummaryCard";

export default function HistorialPuntosPage() {
  const {
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
    refreshPoints,
    refreshTransactions,
  } = usePoints();

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Historial de Puntos
        </h1>
        <p className="text-muted-foreground mt-1">
          Consulta tus puntos disponibles y el historial de movimientos
        </p>
      </div>

      {/* Resumen de puntos */}
      <PointsSummaryCard
        points={points}
        isLoading={pointsLoading}
        error={pointsError}
      />

      {/* Tabla de transacciones */}
      <PointsTransactionsTable
        transactions={transactions}
        isLoading={transactionsLoading}
        error={transactionsError}
        meta={transactionsMeta}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handleItemsPerPageChange}
        onRefresh={refreshTransactions}
      />
    </div>
  );
}
