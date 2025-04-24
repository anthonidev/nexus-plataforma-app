"use client";

import { PaymentDetailError } from "@/components/common/payments/PaymentDetailError";
import { PaymentDetailSkeleton } from "@/components/common/payments/PaymentDetailSkeleton";
import { PaymentImageViewer } from "@/components/common/payments/PaymentImageViewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  Info,
  ThumbsDown,
  ThumbsUp,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ApprovePaymentModal } from "../../components/modals/ApprovePaymentModal";
import { PaymentResponseModal } from "../../components/modals/PaymentResponseModal";
import { RejectPaymentModal } from "../../components/modals/RejectPaymentModal";
import { useFinancePaymentDetail } from "../../hooks/useFinancePaymentDetail";

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const paymentId = Number(params.id);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Validar que el ID sea un número
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
      icon: <Clock className="h-4 w-4" />,
    },
    APPROVED: {
      label: "Aprobado",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    REJECTED: {
      label: "Rechazado",
      color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      icon: <XCircle className="h-4 w-4" />,
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
    icon: <Info className="h-4 w-4" />,
  };

  // Determinar si podemos aprobar/rechazar (solo si está pendiente)
  const canApproveOrReject = payment.status === "PENDING";

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center mb-2">
            <Link href="/admin/pagos" passHref>
              <Button variant="ghost" size="sm" className="mr-2 -ml-3">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Detalle de Pago #{payment.id}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Información detallada del pago
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={`px-2 py-1 text-sm flex items-center gap-1 ${statusInfo.color}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>

          {canApproveOrReject && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={openRejectModal}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>Rechazar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openApproveModal}
                className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Aprobar</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información general */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información resumen del pago con monto destacado */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 flex flex-col justify-between border border-primary/10">
                <h3 className="text-base font-medium mb-2 text-primary/90">
                  Resumen del Pago
                </h3>

                <div className="mt-1 mb-4">
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(payment.amount)}
                  </div>
                  <div className="text-sm mt-1 text-muted-foreground">
                    {payment.paymentConfig.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">
                        Fecha de creación
                      </span>
                    </div>
                    <p className="text-sm font-medium">
                      {format(new Date(payment.createdAt), "dd/MM/yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(payment.createdAt), "HH:mm")}
                    </p>
                  </div>

                  {payment.reviewedAt ? (
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">
                          Fecha de revisión
                        </span>
                      </div>
                      <p className="text-sm font-medium">
                        {format(new Date(payment.reviewedAt), "dd/MM/yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(payment.reviewedAt), "HH:mm")}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-medium">
                          En espera de revisión
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Pendiente de aprobación
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Información del usuario y estado */}
              <div className="space-y-5">
                <div className="bg-background rounded-xl p-5 border shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Información del Usuario</h3>
                      <p className="text-sm text-muted-foreground">
                        Detalles del propietario del pago
                      </p>
                    </div>
                  </div>

                  <div className="pl-2 border-l-2 border-primary/20 mt-4">
                    <p className="text-sm text-muted-foreground mb-1">Email:</p>
                    <p className="text-base font-medium break-all">
                      {payment.user.email}
                    </p>
                    <p className="text-sm text-muted-foreground mt-3 mb-1">
                      Nombre completo:
                    </p>
                    <p className="text-sm ">
                      {payment.user.personalInfo.firstName +
                        " " +
                        payment.user.personalInfo.lastName}{" "}
                    </p>
                    <p className="text-sm text-muted-foreground mt-3 mb-1">
                      Teléfono:
                    </p>
                    <p className="text-sm ">{payment.user.contactInfo.phone}</p>
                    <p className="text-sm text-muted-foreground mt-3 mb-1">
                      Número de documento:
                    </p>
                    <p className="text-sm ">
                      {payment.user.personalInfo.documentNumber ??
                        "Sin documento"}
                    </p>
                  </div>
                </div>

                {payment.reviewedBy && (
                  <div className="bg-background rounded-xl p-5 border shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Revisado por</h3>
                        <p className="text-sm text-muted-foreground">
                          Administrador que procesó el pago
                        </p>
                      </div>
                    </div>
                    <p className="text-base font-medium mt-2">
                      {payment.reviewedBy.email}
                    </p>
                  </div>
                )}

                {payment.rejectionReason && (
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-5 border border-red-200 dark:border-red-800/50 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-red-700 dark:text-red-400">
                          Motivo de Rechazo
                        </h3>
                        <p className="text-sm text-red-600/80 dark:text-red-300/80">
                          El pago fue rechazado
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-2 bg-red-100/50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200/50 dark:border-red-700/30">
                      {payment.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Imágenes de comprobantes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              Comprobantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payment.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {payment.images.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                    onClick={() => handleImageClick(image.url)}
                  >
                    <div className="w-full h-24 relative bg-muted">
                      <Image
                        width={500}
                        height={500}
                        src={image.url}
                        alt={`Comprobante #${image.id}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all group">
                        <div className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all">
                          <ImageIcon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2 bg-muted/30 text-xs">
                      <p className="font-medium truncate">
                        {image.transactionReference}
                      </p>
                      <div className="flex justify-between mt-1 text-muted-foreground">
                        <span>{formatCurrency(image.amount)}</span>
                        <span>
                          {format(
                            new Date(image.transactionDate),
                            "dd/MM/yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No hay comprobantes adjuntos
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modales para aprobar/rechazar pagos */}
      <ApprovePaymentModal
        isOpen={isApproveModalOpen}
        onClose={closeModals}
        onApprove={handleApprovePayment}
        payment={payment}
        isSubmitting={isSubmitting}
      />

      <RejectPaymentModal
        isOpen={isRejectModalOpen}
        onClose={closeModals}
        onReject={handleRejectPayment}
        payment={payment}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        isSubmitting={isSubmitting}
      />

      {/* Modal de respuesta */}
      <PaymentResponseModal
        isOpen={isResponseModalOpen}
        onClose={closeResponseModal}
        approveResponse={approveResponse}
        rejectResponse={rejectResponse}
        onViewAllPayments={navigateToPaymentsList}
      />

      {selectedImageUrl && (
        <PaymentImageViewer
          imageUrl={selectedImageUrl}
          onClose={handleCloseImageViewer}
        />
      )}
    </div>
  );
}
