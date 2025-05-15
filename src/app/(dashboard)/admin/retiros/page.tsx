"use client";

import WithdrawalsHeader from "./components/WithdrawalsHeader";
import WithdrawalsTable from "./components/WithdrawalsTable";
import { useFinanceWithdrawals } from "./hooks/useFinanceWithdrawals";

export default function AdminWithdrawalsPage() {
  const {
    withdrawals,
    isLoading,
    error,
    meta,

    currentPage,
    itemsPerPage,

    handlePageChange,
    handleItemsPerPageChange,
    refreshWithdrawals,
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
        onRefresh={refreshWithdrawals}
      />
    </div>
  );
}