import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PaymentResponse } from "@/types/payment/payment-detail.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import { Calendar, Clock, CreditCard, FileText, Info, XCircle } from "lucide-react";

interface PaymentInfoSectionProps {
    payment: PaymentResponse;
}

export default function PaymentInfoSection({ payment }: PaymentInfoSectionProps) {
    const isApproved = payment.status === "APPROVED" || payment.status === "COMPLETED";

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Información General
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn(
                    "grid grid-cols-1  gap-8",
                    isApproved && payment.banckName && "xl:grid-cols-2",
                    payment.rejectionReason && payment.status === "REJECTED" && "xl:grid-cols-2"
                )}>
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
                                    <span className="text-xs font-medium">Fecha de creación</span>
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

                        {/* Metadata con mejor formato */}
                        {payment.metadata && Object.keys(payment.metadata).length > 0 && (
                            <div className="mt-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/10 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-medium">Información adicional</span>
                                </div>
                                <div className="grid gap-1">
                                    {Object.entries(payment.metadata).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-xs py-1 border-b border-border/20 last:border-0">
                                            <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                                            <span className="font-medium">{value?.toString() || "-"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {isApproved && payment.banckName && (
                        <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800/30">
                            <h3 className="text-base font-medium mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Detalles de la Aprobación
                            </h3>

                            <div className="space-y-4">
                                <div className="bg-white dark:bg-green-900/20 rounded-lg p-3 shadow-sm border border-green-100 dark:border-green-800/20">
                                    <p className="text-sm text-muted-foreground mb-1">Código de operación:</p>
                                    <p className="text-base font-medium text-green-700 dark:text-green-400">
                                        {payment.codeOperation || "No especificado"}
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-green-900/20 rounded-lg p-3 shadow-sm border border-green-100 dark:border-green-800/20">
                                    <p className="text-sm text-muted-foreground mb-1">Banco:</p>
                                    <p className="text-base font-medium text-green-700 dark:text-green-400">
                                        {payment.banckName}
                                    </p>
                                </div>

                                {payment.dateOperation && (
                                    <div className="bg-white dark:bg-green-900/20 rounded-lg p-3 shadow-sm border border-green-100 dark:border-green-800/20">
                                        <p className="text-sm text-muted-foreground mb-1">Fecha de operación:</p>
                                        <p className="text-base font-medium text-green-700 dark:text-green-400">
                                            {format(new Date(payment.dateOperation), "dd/MM/yyyy")}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-white dark:bg-green-900/20 rounded-lg p-3 shadow-sm border border-green-100 dark:border-green-800/20">
                                    <p className="text-sm text-muted-foreground mb-1">Número de ticket:</p>
                                    <p className="text-base font-medium text-green-700 dark:text-green-400">
                                        {payment.numberTicket || "No especificado"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {payment.rejectionReason && payment.status === "REJECTED" && (
                        <Card className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800/50 shadow-sm">
                            <CardContent className="p-5">
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
                            </CardContent>
                        </Card>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}