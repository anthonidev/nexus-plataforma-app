"use client";

import { PaymentsTable } from "./components/PaymentsTable";
import { PaymentsFilters } from "./components/PaymentsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useFinancePayments } from "./hooks/useFinancePayments";
import { PageHeader } from "@/components/common/PageHeader";

export default function PaymentsPageAdmin() {
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
    handlePageChange,
    handleItemsPerPageChange,
    handleStatusChange,
    handlePaymentConfigChange,
    handleStartDateChange,
    handleEndDateChange,
    handleOrderChange,
    resetFilters,
    refresh,
  } = useFinancePayments();

  return (
    <div className="container py-8">
      <PageHeader
        title="Pagos"
        subtitle="Visualiza y filtra todos los pagos realizados"
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
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">
            Historial de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {openFilters && (
            <PaymentsFilters
              status={status}
              paymentConfigId={paymentConfigId}
              startDate={startDate}
              endDate={endDate}
              order={order}
              paymentConfigs={paymentConfigs}
              onStatusChange={handleStatusChange}
              onPaymentConfigChange={handlePaymentConfigChange}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onOrderChange={handleOrderChange}
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
          />
        </CardContent>
      </Card>
    </div>
  );
}
