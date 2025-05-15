"use client";

import { useState } from "react";
import { PaymentImageModal } from "../planes-de-membresia/components/PaymentImageModal";
import AutoRenewalCard from "./components/AutoRenewalCard";
import ReconsumptionForm from "./components/ReconsumptionForm";
import ReconsumptionsHeader from "./components/ReconsumptionsHeader";
import ReconsumptionsTable from "./components/ReconsumptionsTable";
import { ReconsumptionPaymentMethod, useReconsumptions } from "./hooks/useReconsumptions";

export default function MisReconsumosPage() {
  const {
    // Datos principales
    listReconsumptions,
    isLoading,
    error,

    // Paginación
    currentPage,
    itemsPerPage,

    // Método de pago
    paymentMethod,
    setPaymentMethod,

    // Estado del formulario de reconsumo
    payments,
    isPaymentModalOpen,
    totalPaidAmount,
    remainingAmount,
    isPaymentComplete,
    isSubmitting,
    notes,
    setNotes,

    // Puntos
    points,
    hasEnoughPoints,
    isLoadingPoints,

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
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              notes={notes}
              onNotesChange={setNotes}
              onOpenPaymentModal={handlePaymentModalOpen}
              onDeletePayment={deletePayment}
              onEditPayment={handleEditPayment}
              onSubmit={handleCreateReconsumption}
              points={points}
              hasEnoughPoints={hasEnoughPoints}
              isLoadingPoints={isLoadingPoints}
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

      {/* Modal para agregar comprobantes de pago - solo si el método es VOUCHER */}
      {listReconsumptions && paymentMethod === ReconsumptionPaymentMethod.VOUCHER && (
        <PaymentImageModal
          isOpen={isPaymentModalOpen}
          onClose={handlePaymentModalClose}
          onSubmit={addPayment}
          initialData={{
            bankName: "",
            transactionReference: "",
            transactionDate: new Date().toISOString().split("T")[0],
            amount: remainingAmount > 0 ? remainingAmount : listReconsumptions.reconsumptionAmount,
            file: undefined,
          }}
        />
      )}

      {/* Modal para editar pago */}
      {editingPayment && paymentMethod === ReconsumptionPaymentMethod.VOUCHER && (
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