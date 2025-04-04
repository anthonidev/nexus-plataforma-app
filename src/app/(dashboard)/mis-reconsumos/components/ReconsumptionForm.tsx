"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency.utils";
import { motion } from "framer-motion";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import { PaymentSummary } from "../../planes-de-membresia/components/PaymentSummary";
import { PaymentImageModalType } from "../../planes-de-membresia/validations/suscription.zod";

interface ReconsumptionFormProps {
  payments: PaymentImageModalType[];
  totalPaidAmount: number;
  remainingAmount: number;
  reconsumptionAmount: number;
  isPaymentComplete: boolean;
  isSubmitting: boolean;
  onOpenPaymentModal: () => void;
  onDeletePayment: (index: number) => void;
  onEditPayment: (index: number, payment: PaymentImageModalType) => void;
  onSubmit: () => void;
}

export default function ReconsumptionForm({
  payments,
  totalPaidAmount,
  remainingAmount,
  reconsumptionAmount,
  isPaymentComplete,
  isSubmitting,
  onOpenPaymentModal,
  onDeletePayment,
  onEditPayment,
  onSubmit,
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
                . Completa los datos del pago para continuar.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <PaymentSummary
              payments={payments}
              onDeletePayment={onDeletePayment}
              onEditPayment={onEditPayment}
            />

            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-medium">Total Pagado:</span>
              <span
                className={`font-bold ${
                  totalPaidAmount === reconsumptionAmount
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
                className={`font-bold ${
                  remainingAmount === 0 ? "text-green-600" : "text-red-600"
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
              ) : remainingAmount > 0 ? (
                `Pendiente: ${formatCurrency(remainingAmount)}`
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
