// src/app/(dashboard)/planes/detalle/components/SubscriptionFormCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { PaymentSummary } from "../../components/PaymentSummary";
import { PaymentImageModalType } from "../../validations/suscription.zod";

interface SubscriptionFormCardProps {
  isUpgrade: boolean;
  planPrice: number;
  totalPaidAmount: number;
  remainingAmount: number;
  isSubmitting: boolean;
  isPaymentComplete: boolean;
  payments: PaymentImageModalType[];
  onOpenPaymentModal: () => void;
  onDeletePayment: (index: number) => void;
  onEditPayment: (index: number, payment: PaymentImageModalType) => void;
  onSubmit: () => void;
}

export function SubscriptionFormCard({
  isUpgrade,
  planPrice,
  totalPaidAmount,
  remainingAmount,
  isSubmitting,
  isPaymentComplete,
  payments,
  onOpenPaymentModal,
  onDeletePayment,
  onEditPayment,
  onSubmit,
}: SubscriptionFormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isUpgrade ? "Actualización de Plan" : "Suscripción al Plan"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Summary */}
          <PaymentSummary
            payments={payments}
            onDeletePayment={onDeletePayment}
            onEditPayment={onEditPayment}
          />

          {/* Total Paid Amount */}
          <div className="flex justify-between items-center border-t pt-4">
            <span className="font-medium">Total Pagado:</span>
            <span
              className={`font-bold ${
                totalPaidAmount === planPrice
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
              }).format(totalPaidAmount)}
            </span>
          </div>

          {/* Remaining Amount */}
          <div className="flex justify-between items-center">
            <span className="font-medium">Monto Pendiente:</span>
            <span
              className={`font-bold ${
                remainingAmount === 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
              }).format(remainingAmount)}
            </span>
          </div>

          {/* Add Payment Button */}
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

          {/* Submit Button */}
          <Button
            type="button"
            className={`w-full ${
              isUpgrade ? "bg-blue-600 hover:bg-blue-700" : ""
            }`}
            disabled={!isPaymentComplete || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : remainingAmount > 0 ? (
              `Pendiente: ${new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
              }).format(remainingAmount)}`
            ) : isUpgrade ? (
              "Actualizar Plan"
            ) : (
              "Suscribirse al Plan"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
