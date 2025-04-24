"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useFinancePayments } from "./hooks/useFinancePayments";
import { PaymentsFilters } from "./components/PaymentsFilters";
import { PaymentsTable } from "./components/PaymentsTable";

export default function PaymentsAdminPage() {
  const [openFilters, setOpenFilters] = useState(false);

  const {
    payments,
    paymentConfigs,
    isLoading,
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    status,
    paymentConfigId,
    startDate,
    endDate,
    order,
    search,
    handlePageChange,
    handleItemsPerPageChange,
    handleStatusChange,
    handlePaymentConfigChange,
    handleStartDateChange,
    handleEndDateChange,
    handleOrderChange,
    handleSearchChange,
    resetFilters,
    refresh,
  } = useFinancePayments();

  return (
    <div className="container py-8">
      <PageHeader
        title="Administración de Pagos"
        subtitle="Gestiona y filtra todos los pagos de los usuarios"
        variant="gradient"
        icon={FileText}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => setOpenFilters(!openFilters)}
            >
              {openFilters ? "Ocultar filtros" : "Mostrar filtros"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              title="Actualizar"
              onClick={() => refresh()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          {openFilters && (
            <PaymentsFilters
              status={status}
              paymentConfigId={paymentConfigId}
              startDate={startDate}
              endDate={endDate}
              order={order}
              search={search}
              paymentConfigs={paymentConfigs}
              onStatusChange={handleStatusChange}
              onPaymentConfigChange={handlePaymentConfigChange}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onOrderChange={handleOrderChange}
              onSearchChange={handleSearchChange}
              onReset={resetFilters}
              className="mb-6"
            />
          )}

          <PaymentsTable
            payments={payments}
            isLoading={isLoading}
            pageCount={totalPages}
            pageIndex={currentPage - 1}
            pageSize={itemsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handleItemsPerPageChange}
            totalItems={totalItems}
          />
        </CardContent>
      </Card>
    </div>
  );
}