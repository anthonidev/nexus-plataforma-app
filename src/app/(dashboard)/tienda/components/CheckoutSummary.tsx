"use client";

import { useState } from "react";
import { CreditCard, AlertCircle, UploadCloud, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency.utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaymentSummary } from "../../planes-de-membresia/components/PaymentSummary";
import { PaymentImageModalType } from "../../planes-de-membresia/validations/suscription.zod";

interface CheckoutSummaryProps {
    totalAmount: number;
    totalPaidAmount: number;
    remainingAmount: number;
    isPaymentComplete: boolean;
    isSubmitting: boolean;
    payments: PaymentImageModalType[];
    notes: string;
    onNotesChange: (value: string) => void;
    onAddPayment: () => void;
    onDeletePayment: (index: number) => void;
    onEditPayment: (index: number, payment: PaymentImageModalType) => void;
    onSubmitOrder: () => void;
}

export function CheckoutSummary({
    totalAmount,
    totalPaidAmount,
    remainingAmount,
    isPaymentComplete,
    isSubmitting,
    payments,
    notes,
    onNotesChange,
    onAddPayment,
    onDeletePayment,
    onEditPayment,
    onSubmitOrder
}: CheckoutSummaryProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Pago y envío
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Notas */}
                <div>
                    <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                    <Textarea
                        id="notes"
                        placeholder="Instrucciones especiales para tu pedido..."
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        className="mt-1.5"
                    />
                </div>

                {/* Comprobantes de pago */}
                <div className="space-y-4">
                    <PaymentSummary
                        payments={payments}
                        onDeletePayment={onDeletePayment}
                        onEditPayment={onEditPayment}
                    />
                </div>

                {/* Resumen de pago */}
                <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                        <span>Total del carrito:</span>
                        <span className="font-medium">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total pagado:</span>
                        <span className={`font-bold ${totalPaidAmount === totalAmount ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(totalPaidAmount)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Pendiente:</span>
                        <span className={`font-bold ${remainingAmount === 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(remainingAmount)}
                        </span>
                    </div>
                </div>

                {/* Alerta si hay monto pendiente */}
                {remainingAmount > 0 && (
                    <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Para completar tu orden, debes cubrir el monto total de {formatCurrency(totalAmount)}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Botón para agregar comprobante */}
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onAddPayment}
                >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Agregar Comprobante de Pago
                </Button>

                {/* Botón para finalizar la compra */}
                <Button
                    type="button"
                    className="w-full"
                    disabled={!isPaymentComplete || isSubmitting}
                    onClick={onSubmitOrder}
                >
                    {isSubmitting ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                        </>
                    ) : remainingAmount > 0 ? (
                        `Pendiente: ${formatCurrency(remainingAmount)}`
                    ) : (
                        "Finalizar compra"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}