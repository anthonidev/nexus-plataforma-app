"use client";

import { usePoints } from "./hooks/usePoints";
import PointsTransactionsTable from "./components/PointsTransactionsTable";
import PointsSummaryCard from "./components/PointsSummaryCard";
import { PageHeader } from "@/components/common/PageHeader";
import { PiggyBank } from "lucide-react";

export default function HistorialPuntosPage() {
  const {
    points,
    pointsLoading,
    pointsError,

    transactions,
    transactionsLoading,
    transactionsError,
    transactionsMeta,

    currentPage,
    itemsPerPage,

    handlePageChange,
    handleItemsPerPageChange,
    refreshTransactions,
  } = usePoints();

  return (
    <div className="container py-8">

      <PageHeader
        title="Historial de Puntos"
        subtitle="Consulta tus puntos disponibles y el historial de movimientos"
        variant="gradient"
        icon={PiggyBank}

      />

      <PointsSummaryCard
        points={points}
        isLoading={pointsLoading}
        error={pointsError}
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
      />
    </div>
  );
}
