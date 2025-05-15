"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency.utils";
import { motion } from "framer-motion";
import { AlertCircle, Calendar, Coins, FileText, Plus, RefreshCw } from "lucide-react";
import { PaymentSummary } from "../../planes-de-membresia/components/PaymentSummary";
import { PaymentImageModalType } from "../../planes-de-membresia/validations/suscription.zod";
import { ReconsumptionPaymentMethod } from "../hooks/useReconsumptions";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ReconsumptionFormProps {
  payments: PaymentImageModalType[];
  totalPaidAmount: number;
  remainingAmount: number;
  reconsumptionAmount: number;
  isPaymentComplete: boolean;
  isSubmitting: boolean;
  paymentMethod: ReconsumptionPaymentMethod;
  onPaymentMethodChange: (method: ReconsumptionPaymentMethod) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onOpenPaymentModal: () => void;
  onDeletePayment: (index: number) => void;
  onEditPayment: (index: number, payment: PaymentImageModalType) => void;
  onSubmit: () => void;
  points: {
    availablePoints: number;
    totalEarnedPoints: number;
    totalWithdrawnPoints: number;
    membershipPlan: { name: string } | null;
  };
  hasEnoughPoints: boolean;
  isLoadingPoints: boolean;
}

export default function ReconsumptionForm({
  payments,
  totalPaidAmount,
  remainingAmount,
  reconsumptionAmount,
  isPaymentComplete,
  isSubmitting,
  paymentMethod,
  onPaymentMethodChange,
  notes,
  onNotesChange,
  onOpenPaymentModal,
  onDeletePayment,
  onEditPayment,
  onSubmit,
  points,
  hasEnoughPoints,
  isLoadingPoints
}: ReconsumptionFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-3 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Generar Reconsumo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/50">
              <h3 className="font-medium mb-2 text-blue-800 dark:text-blue-300">
                Información de Reconsumo
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                El monto del reconsumo para este período es de{" "}
                <span className="font-bold">
                  {formatCurrency(reconsumptionAmount)}
                </span>
                . Selecciona un método de pago para continuar.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Método de pago */}
            <div className="space-y-3">
              <Label>Método de pago</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => onPaymentMethodChange(value as ReconsumptionPaymentMethod)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/20 transition-colors">
                  <RadioGroupItem value={ReconsumptionPaymentMethod.VOUCHER} id="voucher" />
                  <Label htmlFor="voucher" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Pago con comprobante</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/20 transition-colors">
                  <RadioGroupItem value={ReconsumptionPaymentMethod.POINTS} id="points" disabled={!hasEnoughPoints} />
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
                            Puedes usar tus puntos disponibles para realizar el reconsumo.
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
                            <span className="text-sm">Costo del reconsumo:</span>
                            <span className="text-sm font-medium">{reconsumptionAmount}</span>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </Label>
                </div>
              </RadioGroup>

              {/* Mostrar mensaje si no tiene suficientes puntos */}
              {paymentMethod === ReconsumptionPaymentMethod.POINTS && !hasEnoughPoints && (
                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No tienes suficientes puntos disponibles para este reconsumo.
                    Puntos disponibles: {points.availablePoints}, necesitas: {reconsumptionAmount}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Notas adicionales */}
            <div>
              <Label htmlFor="notes">Notas adicionales (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Instrucciones especiales para tu reconsumo..."
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="mt-1.5"
              />
            </div>

            {/* Mostrar sección de comprobantes solo si el método es VOUCHER */}
            {paymentMethod === ReconsumptionPaymentMethod.VOUCHER && (
              <>
                <PaymentSummary
                  payments={payments}
                  onDeletePayment={onDeletePayment}
                  onEditPayment={onEditPayment}
                />

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="font-medium">Total Pagado:</span>
                  <span
                    className={`font-bold ${totalPaidAmount === reconsumptionAmount
                        ? "text-green-600"
                        : "text-red-600"
                      }`}
                  >
                    {formatCurrency(totalPaidAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Monto Pendiente:</span>
                  <span
                    className={`font-bold ${remainingAmount === 0 ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {formatCurrency(remainingAmount)}
                  </span>
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onOpenPaymentModal}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Comprobante de Pago
                  </Button>
                </div>
              </>
            )}

            {/* Si el método es POINTS, mostrar resumen */}
            {paymentMethod === ReconsumptionPaymentMethod.POINTS && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Puntos disponibles:</span>
                  <span className="font-bold text-primary">
                    {isLoadingPoints ? <Skeleton className="h-4 w-16" /> : points.availablePoints}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Costo del reconsumo:</span>
                  <span className="font-bold">
                    {reconsumptionAmount} puntos
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Puntos restantes después del pago:</span>
                  <span className="font-bold text-green-600">
                    {isLoadingPoints ? <Skeleton className="h-4 w-16" /> : (points.availablePoints - reconsumptionAmount)}
                  </span>
                </div>
              </div>
            )}

            <Button
              type="button"
              className="w-full"
              disabled={!isPaymentComplete || isSubmitting}
              onClick={onSubmit}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : paymentMethod === ReconsumptionPaymentMethod.VOUCHER && remainingAmount > 0 ? (
                `Pendiente: ${formatCurrency(remainingAmount)}`
              ) : paymentMethod === ReconsumptionPaymentMethod.POINTS ? (
                "Pagar con puntos"
              ) : (
                "Generar Reconsumo"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}