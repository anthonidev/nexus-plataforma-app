"use client";

import { useReconsumptions } from "./hooks/useReconsumptions";
import { PaymentImageModal } from "../planes-de-membresia/components/PaymentImageModal";
import { useState } from "react";
import ReconsumptionsHeader from "./components/ReconsumptionsHeader";
import ReconsumptionForm from "./components/ReconsumptionForm";
import ReconsumptionsTable from "./components/ReconsumptionsTable";
import AutoRenewalCard from "./components/AutoRenewalCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function MisReconsumosPage() {
  const {
    // Datos principales
    listReconsumptions,
    isLoading,
    error,

    // Paginación
    currentPage,
    itemsPerPage,

    // Estado del formulario de reconsumo
    payments,
    isPaymentModalOpen,
    totalPaidAmount,
    remainingAmount,
    isPaymentComplete,
    isSubmitting,

    // Funciones para manejar pagos
    addPayment,
    deletePayment,
    editPayment,
    handlePaymentModalOpen,
    handlePaymentModalClose,

    // Funciones para navegación y actualización
    handlePageChange,
    handleItemsPerPageChange,
    refreshReconsumptions,
    handleCreateReconsumption,
    handleToggleAutoRenewal,
  } = useReconsumptions();

  const [editingPayment, setEditingPayment] = useState<{
    index: number;
    payment: any;
  } | null>(null);

  const handleEditPayment = (index: number, payment: any) => {
    setEditingPayment({ index, payment });
  };

  const handleEditComplete = (payment: any) => {
    if (editingPayment) {
      editPayment(editingPayment.index, payment);
      setEditingPayment(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-56 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-20 w-full mb-3" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <ReconsumptionsHeader
        onRefresh={refreshReconsumptions}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sección principal de reconsumos */}
        <div className="lg:col-span-2">
          {/* Formulario de reconsumo si el usuario puede hacer reconsumo */}
          {listReconsumptions?.canReconsume && (
            <ReconsumptionForm
              payments={payments}
              totalPaidAmount={totalPaidAmount}
              remainingAmount={remainingAmount}
              reconsumptionAmount={listReconsumptions.reconsumptionAmount}
              isPaymentComplete={isPaymentComplete}
              isSubmitting={isSubmitting}
              onOpenPaymentModal={handlePaymentModalOpen}
              onDeletePayment={deletePayment}
              onEditPayment={handleEditPayment}
              onSubmit={handleCreateReconsumption}
            />
          )}

          {/* Tabla de reconsumos */}
          <ReconsumptionsTable
            reconsumptions={listReconsumptions?.items || []}
            isLoading={isLoading}
            error={error}
            meta={listReconsumptions?.meta || null}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handleItemsPerPageChange}
            onRefresh={refreshReconsumptions}
          />
        </div>

        {/* Sección lateral con configuración */}
        <div>
          <AutoRenewalCard
            autoRenewal={listReconsumptions?.autoRenewal || false}
            onToggleAutoRenewal={handleToggleAutoRenewal}
          />
        </div>
      </div>

      {/* Modal para agregar comprobantes de pago */}
      {listReconsumptions && (
        <PaymentImageModal
          isOpen={isPaymentModalOpen}
          onClose={handlePaymentModalClose}
          onSubmit={addPayment}
          initialData={{
            bankName: "",
            transactionReference: "",
            transactionDate: new Date().toISOString().split("T")[0],
            amount: listReconsumptions.reconsumptionAmount,
            file: undefined,
          }}
        />
      )}

      {/* Modal para editar pago */}
      {editingPayment && (
        <PaymentImageModal
          isOpen={!!editingPayment}
          onClose={() => setEditingPayment(null)}
          onSubmit={handleEditComplete}
          initialData={editingPayment.payment}
        />
      )}
    </div>
  );
}
