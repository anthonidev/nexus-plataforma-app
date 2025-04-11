"use client";

import { PaymentsTable } from "./components/PaymentsTable";
import { PaymentsFilters } from "./components/PaymentsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useFinancePayments } from "./hooks/useFinancePayments";

export default function PaymentsPageAdmin() {
  const [openFilters, setOpenFilters] = useState(false);

  const {
    payments,
    paymentConfigs,
    isLoading,
    // totalItems,
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Pagos</h1>
          <p className="text-muted-foreground mt-1">
            Visualiza y filtra todos los pagos realizados
          </p>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

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
