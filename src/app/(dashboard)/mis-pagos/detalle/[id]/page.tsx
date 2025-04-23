"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { PaymentDetailError } from "@/components/common/payments/PaymentDetailError";
import { PaymentDetailSkeleton } from "@/components/common/payments/PaymentDetailSkeleton";
import { PaymentImageViewer } from "@/components/common/payments/PaymentImageViewer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "@/utils/date.utils";
import { formatCurrency } from "@/utils/format-currency.utils";
import {
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Info,
  Receipt,
  User,
  XCircle
} from "lucide-react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { usePaymentDetail } from "../../hooks/usePaymentDetail";

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const paymentId = Number(params.id);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  // Validar que el ID sea un número
  if (isNaN(paymentId)) {
    notFound();
  }

  const { payment, isLoading, error } = usePaymentDetail(paymentId);

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

  return (
    <div className="container py-8">
      <PageHeader
        title={`Detalle de Pago #${payment.id}`}
        subtitle="Información detallada del pago"
        variant="gradient"
        icon={FileText}
        backUrl="/mis-pagos"
        actions={
          <Badge
            className={`px-2 py-1 text-sm flex items-center gap-1 ${statusInfo.color}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        }
      />

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
              <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6 flex flex-col justify-between border border-primary/15 shadow-sm">
                {/* Elementos decorativos de fondo */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>

                {/* Encabezado con estilo */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                    <Receipt className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-medium text-primary/90">
                      Resumen del Pago
                    </h3>
                  </div>

                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/20">
                    <CreditCard className="h-3 w-3 mr-1 text-primary" />
                    {payment.paymentConfig.name}
                  </Badge>
                </div>

                {/* Monto destacado */}
                <div className="relative bg-background/70 backdrop-blur-md rounded-lg p-4 mb-4 shadow-sm border border-primary/10 z-10">
                  <div className="absolute -right-1 -top-1 w-20 h-20 bg-primary/5 rounded-full blur-xl"></div>
                  <p className="text-xs text-muted-foreground mb-1">Monto total</p>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(payment.amount)}
                  </div>
                </div>

                {/* Fechas en cards más estilizadas */}
                <div className="grid grid-cols-2 gap-4 mt-2 relative z-10">
                  <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-semibold">
                        Fecha de creación
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {format(new Date(payment.createdAt), "dd/MM/yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(payment.createdAt), "HH:mm")} hrs
                      </p>
                    </div>
                  </div>

                  {payment.reviewedAt ? (
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-2 text-primary">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-semibold">
                          Fecha de revisión
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {format(new Date(payment.reviewedAt), "dd/MM/yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.reviewedAt), "HH:mm")} hrs
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm rounded-lg p-3 border border-amber-200/30 dark:border-amber-700/30 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-semibold">
                          En espera de revisión
                        </span>
                      </div>
                      <p className="text-sm text-amber-600/90 dark:text-amber-400/90 font-medium">
                        Pendiente de aprobación
                      </p>
                    </div>
                  )}
                </div>

                {/* Metadata con mejor formato */}
                {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                  <div className="mt-4 bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-primary/10 shadow-sm relative z-10">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                      <Info className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Información adicional</span>
                    </div>
                    <div className="grid gap-2">
                      {Object.entries(payment.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs py-1 border-b border-border/20 last:border-0">
                          <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                          <span className="font-medium text-foreground">{value.toString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

                  <div className="pl-2 border-l-2 border-primary/20 mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nombre completo:</p>
                      <p className="text-base font-medium">
                        {payment.user.personalInfo.firstName} {payment.user.personalInfo.lastName}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Documento:</p>
                      <p className="text-base font-medium">
                        {payment.user.personalInfo.documentNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email:</p>
                      <p className="text-base font-medium break-all">
                        {payment.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {payment.reviewedBy && (
                  <div className="bg-background rounded-xl p-5 border shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-500" />
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
            {payment.images && payment.images.length > 0 ? (
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
                      <div className="flex items-center gap-1 text-primary/70 mb-1">
                        <Building className="h-3 w-3 flex-shrink-0" />
                        <p className="font-medium truncate">{image.bankName || "Banco"}</p>
                      </div>
                      <p className="font-medium truncate">
                        {image.transactionReference}
                      </p>
                      <div className="flex justify-between mt-1 text-muted-foreground">
                        <span>{formatCurrency(image.amount)}</span>
                        <span>
                          {new Date(image.transactionDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            timeZone: 'UTC'
                          })}
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

      {selectedImageUrl && (
        <PaymentImageViewer
          imageUrl={selectedImageUrl}
          onClose={handleCloseImageViewer}
        />
      )}
    </div>
  );
}