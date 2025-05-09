"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { PaymentDetailError } from "@/components/common/payments/PaymentDetailError";
import { PaymentDetailSkeleton } from "@/components/common/payments/PaymentDetailSkeleton";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { useFinancePaymentDetail } from "../../hooks/useFinancePaymentDetail";
import PaymentActionButtons from "./components/PaymentActionButtons";
import PaymentDetailModals from "./components/PaymentDetailModals";
import PaymentImagesSection from "./components/PaymentImagesSection";
import PaymentInfoSection from "./components/PaymentInfoSection";
import PaymentUserSection from "./components/PaymentUserSection";

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const paymentId = Number(params.id);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  if (isNaN(paymentId)) {
    notFound();
  }

  const {
    payment,
    isLoading,
    error,
    isApproveModalOpen,
    isRejectModalOpen,
    rejectionReason,
    setRejectionReason,
    isSubmitting,
    openApproveModal,
    openRejectModal,
    closeModals,
    handleApprovePayment,
    handleRejectPayment,
    approveResponse,
    rejectResponse,
    isResponseModalOpen,
    closeResponseModal,
    navigateToPaymentsList,
  } = useFinancePaymentDetail(paymentId);

  const handleImageClick = (url: string) => {
    setSelectedImageUrl(url);
  };

  const handleCloseImageViewer = () => {
    setSelectedImageUrl(null);
  };

  // Mapeo de estados a estilos y colores
  const statusMap = {
    PENDING: {
      label: "Pendiente",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
    APPROVED: {
      label: "Aprobado",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    },
    REJECTED: {
      label: "Rechazado",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    },
  };

  if (isLoading) {
    return <PaymentDetailSkeleton />;
  }

  if (error || !payment) {
    return <PaymentDetailError error={error} />;
  }

  const statusInfo = statusMap[payment.status] || {
    label: payment.status,
    color: "bg-gray-100 text-gray-800",
  };

  const canApproveOrReject = payment.status === "PENDING";

  return (
    <div className="container py-8">
      <PageHeader
        title={`Detalle de Pago #${payment.id}`}
        subtitle="Información detallada del pago administrativo"
        variant="gradient"
        icon={FileText}
        backUrl="/admin/pagos"
        actions={
          <>
            <Badge
              className={`px-2 py-1 text-sm flex items-center gap-1 ${statusInfo.color}`}
            >
              {statusInfo.label}
            </Badge>

            {canApproveOrReject && (
              <PaymentActionButtons
                onApprove={openApproveModal}
                onReject={openRejectModal}
              />
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PaymentInfoSection payment={payment} />
          <PaymentUserSection payment={payment} />
        </div>

        {/* Imágenes de comprobantes */}
        <PaymentImagesSection
          images={payment.images}
          onImageClick={handleImageClick}
          methodPayment={payment.methodPayment}
        />
      </div>

      {/* Modales */}
      <PaymentDetailModals
        payment={payment}
        isApproveModalOpen={isApproveModalOpen}
        isRejectModalOpen={isRejectModalOpen}
        isResponseModalOpen={isResponseModalOpen}
        isSubmitting={isSubmitting}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        selectedImageUrl={selectedImageUrl}
        closeModals={closeModals}
        handleApprovePayment={handleApprovePayment}
        handleRejectPayment={handleRejectPayment}
        closeResponseModal={closeResponseModal}
        navigateToPaymentsList={navigateToPaymentsList}
        approveResponse={approveResponse}
        rejectResponse={rejectResponse}
        onCloseImageViewer={handleCloseImageViewer}
      />
    </div>
  );
}