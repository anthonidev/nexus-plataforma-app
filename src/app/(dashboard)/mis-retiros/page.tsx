"use client";

import { useWithdrawals } from "./hooks/useWithdrawals";
import WithdrawalsHeader from "./components/WithdrawalsHeader";
import WithdrawalsSummaryCard from "./components/WithdrawalsSummaryCard";
import WithdrawalsTable from "./components/WithdrawalsTable";
import WithdrawalModal from "./components/WithdrawalModal";

export default function MisRetirosPage() {
  const {
    // Datos principales
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
  } = useWithdrawals();

  const canWithdraw = withdrawalsInfo?.canWithdraw || false;

  return (
    <div className="container py-8">
      <WithdrawalsHeader
        onRefresh={refreshData}
        onOpenWithdrawalModal={openModal}
        canWithdraw={canWithdraw}
        isLoading={isLoading}
      />

      <WithdrawalsSummaryCard
        withdrawalsInfo={withdrawalsInfo}
        isLoading={isLoading}
        error={error}
      />

      <WithdrawalsTable
        withdrawals={withdrawals?.items || []}
        isLoading={isLoading}
        error={error}
        meta={withdrawals?.meta || null}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handleItemsPerPageChange}
        onRefresh={refreshData}
      />

      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={submitWithdrawal}
        withdrawalsInfo={withdrawalsInfo}
        withdrawalAmount={withdrawalAmount}
        setWithdrawalAmount={setWithdrawalAmount}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
