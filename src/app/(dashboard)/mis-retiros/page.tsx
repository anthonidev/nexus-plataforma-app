"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";
import WithdrawalModal from "./components/WithdrawalModal";
import WithdrawalsSummaryCard from "./components/WithdrawalsSummaryCard";
import WithdrawalsTable from "./components/WithdrawalsTable";
import { useWithdrawals } from "./hooks/useWithdrawals";

export default function MisRetirosPage() {
  const {
    withdrawals,
    withdrawalsInfo,
    isLoading,
    error,

    isModalOpen,
    openModal,
    closeModal,

    withdrawalAmount,
    setWithdrawalAmount,
    isSubmitting,

    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,

    submitWithdrawal,
    refreshData,
  } = useWithdrawals();

  const canWithdraw = withdrawalsInfo?.canWithdraw || false;

  return (
    <div className="container py-8">

      <PageHeader
        title="Mis Retiros"
        subtitle="Visualiza tus puntos disponibles y solicita retiros"
        variant="gradient"
        icon={FileText}
        actions={
          <div >
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Actualizar</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={openModal}
              disabled={!canWithdraw || isLoading}
            >
              <span>Solicitar Retiro</span>
            </Button>
          </div>
        }
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