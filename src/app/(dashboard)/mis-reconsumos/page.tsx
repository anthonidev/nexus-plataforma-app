"use client";

import { useReconsumptions } from "./hooks/useReconsumptions";
import { PaymentImageModal } from "../planes-de-membresia/components/PaymentImageModal";
import { useState } from "react";
import ReconsumptionsHeader from "./components/ReconsumptionsHeader";
import ReconsumptionForm from "./components/ReconsumptionForm";
import ReconsumptionsTable from "./components/ReconsumptionsTable";
import AutoRenewalCard from "./components/AutoRenewalCard";

export default function MisReconsumosPage() {
  const {
    // Datos de reconsumos
    reconsumptions,
    isLoading,
    error,
    meta,
    canReconsume,
    autoRenewal,

    // Paginación
    currentPage,
    itemsPerPage,

    // Estado del formulario de reconsumo
    payments,
    isPaymentModalOpen,
    totalPaidAmount,
    remainingAmount,
    listReconsumptions,
    reconsumptionAmount,
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

  if (isLoading) {
    return <div className="container py-8">Cargando...</div>;
  }

  const handleEditPayment = (index: number, payment: any) => {
    setEditingPayment({ index, payment });
  };

  const handleEditComplete = (payment: any) => {
    if (editingPayment) {
      editPayment(editingPayment.index, payment);
      setEditingPayment(null);
    }
  };

  return (
    <div className="container py-8">
      <ReconsumptionsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sección principal de reconsumos */}
        <div className="lg:col-span-2">
          {/* Formulario de reconsumo si el usuario puede hacer reconsumo */}
          {canReconsume && listReconsumptions && (
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
            reconsumptions={reconsumptions}
            isLoading={isLoading}
            error={error}
            meta={meta}
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
            autoRenewal={autoRenewal}
            onToggleAutoRenewal={handleToggleAutoRenewal}
          />
        </div>
      </div>

      {!isLoading && listReconsumptions && (
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
      {/* Modal para agregar/editar comprobantes de pago */}
      <PaymentImageModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        onSubmit={addPayment}
        initialData={{
          bankName: "",
          transactionReference: "",
          transactionDate: new Date().toISOString().split("T")[0],
          amount: reconsumptionAmount,
          file: undefined,
        }}
      />

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
