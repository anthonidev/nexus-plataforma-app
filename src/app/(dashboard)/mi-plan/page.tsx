"use client";

import { useMyMembership } from "./hooks/useMyMembership";
import MembershipDetail from "./components/MembershipDetail";
import MembershipHistoryTable from "./components/MembershipHistoryTable";

export default function MyPlanPage() {
  const {
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
    handlePageChange,
    handleItemsPerPageChange,
  } = useMyMembership();

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mi Plan</h1>
        <p className="text-muted-foreground mt-1">
          Información detallada de tu membresía y su historial
        </p>
      </div>

      {/* Detalles de la membresía */}
      <MembershipDetail
        membership={membership}
        isLoading={membershipLoading}
        error={membershipError}
      />

      {/* Tabla de historial */}
      <MembershipHistoryTable
        historyItems={historyItems}
        isLoading={historyLoading}
        error={historyError}
        totalItems={historyMeta?.totalItems || 0}
        totalPages={historyMeta?.totalPages || 1}
        currentPage={currentPage}
        pageSize={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handleItemsPerPageChange}
      />
    </div>
  );
}
