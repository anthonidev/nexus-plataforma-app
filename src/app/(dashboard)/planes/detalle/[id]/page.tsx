// src/app/(dashboard)/planes/detalle/[id]/page.tsx
"use client";

import { notFound, useParams } from "next/navigation";
import { useState } from "react";

import { PaymentImageModal } from "../../components/PaymentImageModal";
import { useMembershipDetail } from "../../hooks/useMembershipDetail";
import {
  ErrorState,
  LoadingState,
} from "../../components/detail/LoadingAndErrorStates";
import { PlanDetailsCard } from "../../components/detail/PlanDetailsCard";
import { SubscriptionFormCard } from "../../components/detail/SubscriptionFormCard";

export default function MembershipPlanDetailPage() {
  const params = useParams<{ id: string }>();
  const planId = Number(params.id);

  // Validate plan ID
  if (isNaN(planId)) {
    notFound();
  }

  // Use custom hook for plan details and subscription
  const {
    plan,
    userMembership,
    isLoading,
    error,
    isSubmitting,

    // Payment data
    payments,
    isPaymentModalOpen,
    totalPaidAmount,
    remainingAmount,
    planPrice,
    isPaymentComplete,

    // Payment actions
    addPayment,
    deletePayment,
    editPayment,
    handlePaymentModalOpen,
    handlePaymentModalClose,

    // Form submission
    handleSubscription,
  } = useMembershipDetail(planId);

  // Estado para edición de pagos
  const [editingPayment, setEditingPayment] = useState<{
    index: number;
    payment: any;
  } | null>(null);

  // Determinar si es una actualización o una nueva suscripción
  const isUpgrade = plan?.isUpgrade || false;

  // Handler para editar un pago
  const handleEditPayment = (index: number, payment: any) => {
    setEditingPayment({ index, payment });
  };

  // Handler para completar edición
  const handleEditComplete = (payment: any) => {
    if (editingPayment) {
      editPayment(editingPayment.index, payment);
      setEditingPayment(null);
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !plan) {
    return <ErrorState error={error || "Plan no encontrado"} />;
  }

  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
      <PlanDetailsCard
        plan={plan}
        isUpgrade={isUpgrade}
        planPrice={planPrice}
        userMembership={userMembership}
      />

      <SubscriptionFormCard
        isUpgrade={isUpgrade}
        planPrice={planPrice}
        totalPaidAmount={totalPaidAmount}
        remainingAmount={remainingAmount}
        isSubmitting={isSubmitting}
        isPaymentComplete={isPaymentComplete}
        payments={payments}
        onOpenPaymentModal={handlePaymentModalOpen}
        onDeletePayment={deletePayment}
        onEditPayment={handleEditPayment}
        onSubmit={handleSubscription}
      />

      <PaymentImageModal
        isOpen={isPaymentModalOpen}
        onClose={handlePaymentModalClose}
        onSubmit={addPayment}
        initialData={{
          bankName: "",
          transactionReference: "",
          transactionDate: new Date().toISOString().split("T")[0],
          amount: remainingAmount > 0 ? remainingAmount : planPrice,
          file: undefined,
        }}
      />

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
