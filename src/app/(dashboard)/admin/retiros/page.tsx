"use client";

import { useFinanceWithdrawals } from "./hooks/useFinanceWithdrawals";
import WithdrawalsHeader from "./components/WithdrawalsHeader";
import WithdrawalsTable from "./components/WithdrawalsTable";
import ApproveWithdrawalModal from "./components/modals/ApproveWithdrawalModal";
import RejectWithdrawalModal from "./components/modals/RejectWithdrawalModal";
import WithdrawalResponseModal from "./components/modals/WithdrawalResponseModal";

export default function AdminWithdrawalsPage() {
  const {
    // Datos principales
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
    refreshWithdrawals,
    navigateToWithdrawalsList,
  } = useFinanceWithdrawals();

  return (
    <div className="container py-8">
      <WithdrawalsHeader onRefresh={refreshWithdrawals} isLoading={isLoading} />

      <WithdrawalsTable
        withdrawals={withdrawals}
        isLoading={isLoading}
        error={error}
        meta={meta}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handleItemsPerPageChange}
        onApprove={openApproveModal}
        onReject={openRejectModal}
        onRefresh={refreshWithdrawals}
      />

      {/* Modales de acción */}
      {selectedWithdrawal && (
        <>
          <ApproveWithdrawalModal
            isOpen={isApproveModalOpen}
            onClose={closeModals}
            onApprove={handleApproveWithdrawal}
            withdrawal={selectedWithdrawal}
            approveData={approveData}
            setApproveData={setApproveData}
            isSubmitting={isSubmitting}
          />

          <RejectWithdrawalModal
            isOpen={isRejectModalOpen}
            onClose={closeModals}
            onReject={handleRejectWithdrawal}
            withdrawal={selectedWithdrawal}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            isSubmitting={isSubmitting}
          />
        </>
      )}

      {/* Modal de respuesta */}
      <WithdrawalResponseModal
        isOpen={isResponseModalOpen}
        onClose={closeResponseModal}
        approveResponse={approveResponse}
        rejectResponse={rejectResponse}
        onViewAllWithdrawals={navigateToWithdrawalsList}
      />
    </div>
  );
}
