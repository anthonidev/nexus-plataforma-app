import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ResponseApprovePayment,
  ResponseRejectPayment,
} from "@/types/payment/payment-detail.type";
import { format } from "date-fns";
import { CheckCircle2, ListChecks, XCircle } from "lucide-react";

interface PaymentResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  approveResponse: ResponseApprovePayment | null;
  rejectResponse: ResponseRejectPayment | null;
  onViewAllPayments: () => void;
}

export function PaymentResponseModal({
  isOpen,
  onClose,
  approveResponse,
  rejectResponse,
  onViewAllPayments,
}: PaymentResponseModalProps) {
  const response = approveResponse || rejectResponse;

  if (!response) return null;

  const isApproved = !!approveResponse;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApproved ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Pago Aprobado Exitosamente
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                Pago Rechazado Exitosamente
              </>
            )}
          </DialogTitle>
          <DialogDescription>{response.message}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div
            className={`p-4 rounded-lg border ${
              isApproved
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50"
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ID de Pago:</span>
                <span className="font-mono">#{response.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Procesado por:</span>
                <span>{response.reviewedBy.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Fecha:</span>
                <span>
                  {format(new Date(response.timestamp), "dd/MM/yyyy HH:mm:ss")}
                </span>
              </div>

              {!isApproved && rejectResponse && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-sm font-medium mb-1">Motivo de rechazo:</p>
                  <p className="text-sm bg-red-100/50 dark:bg-red-900/30 p-2 rounded">
                    {rejectResponse.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="default"
            onClick={onViewAllPayments}
            className="flex items-center gap-2"
          >
            <ListChecks className="h-4 w-4" />
            Ver todos los pagos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
