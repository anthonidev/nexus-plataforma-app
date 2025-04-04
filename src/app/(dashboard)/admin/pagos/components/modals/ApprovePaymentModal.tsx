import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PaymentResponse } from "@/types/payment/payment-detail.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ApprovePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => Promise<unknown>;
  payment: PaymentResponse | null;
  isSubmitting: boolean;
}

export function ApprovePaymentModal({
  isOpen,
  onClose,
  onApprove,
  payment,
  isSubmitting,
}: ApprovePaymentModalProps) {
  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Confirmar Aprobación de Pago
          </DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea aprobar este pago?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800/50">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">ID de Pago:</span>
              <span className="font-mono">#{payment.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Monto:</span>
              <span className="font-semibold text-green-700 dark:text-green-400">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Usuario:</span>
              <span>{payment.user.email}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Aprobar Pago"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
