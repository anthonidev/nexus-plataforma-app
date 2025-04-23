"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, RefreshCw } from "lucide-react";
import { useState } from "react";
import { PaymentsFilters } from "./components/PaymentsFilters";
import { PaymentsTable } from "./components/PaymentsTable";
import { usePayments } from "./hooks/usePayments";

export default function PaymentsPage() {
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
  } = usePayments();

  return (
    <div className="container py-8">

      <PageHeader
        title="Mis Pagos"
        subtitle="Visualiza y filtra todos tus pagos realizados"
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
            totalItems={totalItems}
          />
        </CardContent>
      </Card>
    </div>
  );
}
