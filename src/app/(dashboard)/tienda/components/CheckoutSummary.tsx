"use client";

import { useState } from "react";
import { CreditCard, AlertCircle, UploadCloud, RefreshCw, Coins, FileText } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency.utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaymentSummary } from "../../planes-de-membresia/components/PaymentSummary";
import { PaymentImageModalType } from "../../planes-de-membresia/validations/suscription.zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MethodPayment } from "../hooks/useCartCheckout";
import { usePointsUser } from "@/hooks/usePointsUser";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface CheckoutSummaryProps {
    totalAmount: number;
    totalPaidAmount: number;
    remainingAmount: number;
    isPaymentComplete: boolean;
    isSubmitting: boolean;
    payments: PaymentImageModalType[];
    notes: string;
    paymentMethod: MethodPayment;
    onNotesChange: (value: string) => void;
    onAddPayment: () => void;
    onDeletePayment: (index: number) => void;
    onEditPayment: (index: number, payment: PaymentImageModalType) => void;
    onSubmitOrder: () => void;
    onPaymentMethodChange: (method: MethodPayment) => void;
}

export function CheckoutSummary({
    totalAmount,
    totalPaidAmount,
    remainingAmount,
    isPaymentComplete,
    isSubmitting,
    payments,
    notes,
    paymentMethod,
    onNotesChange,
    onAddPayment,
    onDeletePayment,
    onEditPayment,
    onSubmitOrder,
    onPaymentMethodChange
}: CheckoutSummaryProps) {
    const { points, isLoading: isLoadingPoints } = usePointsUser();
    const hasEnoughPoints = points.availablePoints >= totalAmount;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Pago y envío
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Método de pago */}
                <div className="space-y-3">
                    <Label>Método de pago</Label>
                    <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) => onPaymentMethodChange(value as MethodPayment)}
                        className="space-y-3"
                    >
                        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/20 transition-colors">
                            <RadioGroupItem value={MethodPayment.VOUCHER} id="voucher" />
                            <Label htmlFor="voucher" className="flex items-center gap-2 cursor-pointer">
                                <FileText className="h-4 w-4 text-primary" />
                                <span>Pago con comprobante</span>
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/20 transition-colors">
                            <RadioGroupItem value={MethodPayment.POINTS} id="points" disabled={!hasEnoughPoints} />
                            <Label
                                htmlFor="points"
                                className={`flex items-center gap-2 cursor-pointer ${!hasEnoughPoints ? 'opacity-50' : ''}`}
                            >
                                <Coins className="h-4 w-4 text-primary" />
                                <span>Pago con puntos</span>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <AlertCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">Información sobre puntos</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Puedes usar tus puntos disponibles para comprar productos.
                                            </p>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Tus puntos disponibles:</span>
                                                {isLoadingPoints ? (
                                                    <Skeleton className="h-4 w-16" />
                                                ) : (
                                                    <span className="text-sm font-medium">{points.availablePoints}</span>
                                                )}
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Costo de la compra:</span>
                                                <span className="text-sm font-medium">{totalAmount}</span>
                                            </div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </Label>
                        </div>
                    </RadioGroup>

                    {/* Mostrar mensaje si no tiene suficientes puntos */}
                    {paymentMethod === MethodPayment.POINTS && !hasEnoughPoints && (
                        <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                No tienes suficientes puntos disponibles para esta compra.
                                Puntos disponibles: {points.availablePoints}, necesitas: {totalAmount}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

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

                {/* Comprobantes de pago - solo mostrar si el método es VOUCHER */}
                {paymentMethod === MethodPayment.VOUCHER && (
                    <div className="space-y-4">
                        <PaymentSummary
                            payments={payments}
                            onDeletePayment={onDeletePayment}
                            onEditPayment={onEditPayment}
                        />

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
                    </div>
                )}

                {/* Resumen de pago */}
                <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                        <span>Total del carrito:</span>
                        <span className="font-medium">{formatCurrency(totalAmount)}</span>
                    </div>

                    {/* Solo mostrar si el método es VOUCHER */}
                    {paymentMethod === MethodPayment.VOUCHER && (
                        <>
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
                        </>
                    )}

                    {/* Mostrar si el método es POINTS */}
                    {paymentMethod === MethodPayment.POINTS && (
                        <div className="flex justify-between">
                            <span>A pagar con puntos:</span>
                            <span className="font-bold text-primary">{totalAmount} puntos</span>
                        </div>
                    )}
                </div>

                {/* Alerta si hay monto pendiente en caso de VOUCHER */}
                {paymentMethod === MethodPayment.VOUCHER && remainingAmount > 0 && (
                    <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Para completar tu orden, debes cubrir el monto total de {formatCurrency(totalAmount)}
                        </AlertDescription>
                    </Alert>
                )}

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
                    ) : paymentMethod === MethodPayment.VOUCHER && remainingAmount > 0 ? (
                        `Pendiente: ${formatCurrency(remainingAmount)}`
                    ) : paymentMethod === MethodPayment.POINTS ? (
                        "Pagar con puntos"
                    ) : (
                        "Finalizar compra"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}