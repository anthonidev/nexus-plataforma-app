"use client";

import { notFound, useParams } from "next/navigation";
import { useState } from "react";

import {
  ErrorState,
  LoadingState,
} from "../../components/detail/LoadingAndErrorStates";
import { PlanDetailsCard } from "../../components/detail/PlanDetailsCard";
import { SubscriptionFormCard } from "../../components/detail/SubscriptionFormCard";
import { PaymentImageModal } from "../../components/PaymentImageModal";
import { useMembershipDetail } from "../../hooks/useMembershipDetail";

export default function MembershipPlanDetailPage() {
  const params = useParams<{ id: string }>();
  const planId = Number(params.id);

  if (isNaN(planId)) {
    notFound();
  }

  const {
    plan,
    userMembership,
    isLoading,
    error,
    isSubmitting,

    payments,
    isPaymentModalOpen,
    totalPaidAmount,
    remainingAmount,
    planPrice,
    isPaymentComplete,

    addPayment,
    deletePayment,
    editPayment,
    handlePaymentModalOpen,
    handlePaymentModalClose,

    handleSubscription,
  } = useMembershipDetail(planId);

  const [editingPayment, setEditingPayment] = useState<{
    index: number;
    payment: any;
  } | null>(null);

  const isUpgrade = plan?.isUpgrade || false;

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
    return <LoadingState />;
  }

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
