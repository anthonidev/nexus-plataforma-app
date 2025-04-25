"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { PiggyBank, RefreshCw } from "lucide-react";
import PointsTransactionsTable from "./components/PointsTransactionsTable";
import PointsSummaryCard from "./components/PointsSummaryCard";
import { usePoints } from "./hooks/usePoints";

export default function HistorialPuntosPage() {
  const {
    // Datos de puntos
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

    // Filtros
    filters,

    // Funciones para paginación
    handlePageChange,
    handleItemsPerPageChange,

    // Funciones para filtros
    handleStatusChange,
    handleTypeChange,
    handleStartDateChange,
    handleEndDateChange,
    resetFilters,

    // Funciones para recargar datos
    refreshPoints,
    refreshTransactions,
  } = usePoints();

  // Función para refrescar todos los datos
  const handleRefreshAll = async () => {
    await Promise.all([refreshPoints(), refreshTransactions()]);
  };

  return (
    <div className="container py-8">
      <PageHeader
        title="Historial de Puntos"
        subtitle="Consulta tus puntos disponibles y el historial de movimientos"
        variant="gradient"
        icon={PiggyBank}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={pointsLoading || transactionsLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${pointsLoading || transactionsLoading ? "animate-spin" : ""
                }`}
            />
            Actualizar
          </Button>
        }
      />

      <PointsSummaryCard
        points={points}
        isLoading={pointsLoading}
        error={pointsError}
        onRefresh={refreshPoints}
      />

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

        // Pasar los filtros y sus manejadores
        filters={filters}
        onStatusChange={handleStatusChange}
        onTypeChange={handleTypeChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onResetFilters={resetFilters}
      />
    </div>
  );
}