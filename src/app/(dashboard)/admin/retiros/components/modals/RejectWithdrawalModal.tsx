"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Item } from "@/types/withdrawals/finance-withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { Loader2, XCircle } from "lucide-react";

interface RejectWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => Promise<void>;
  withdrawal: Item;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  isSubmitting: boolean;
}

export default function RejectWithdrawalModal({
  isOpen,
  onClose,
  onReject,
  withdrawal,
  rejectionReason,
  setRejectionReason,
  isSubmitting,
}: RejectWithdrawalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Confirmar Rechazo de Retiro
          </DialogTitle>
          <DialogDescription>
            Por favor, ingrese el motivo por el cual está rechazando esta
            solicitud de retiro.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">ID de Retiro:</span>
              <span className="font-mono">#{withdrawal.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Monto:</span>
              <span className="font-semibold text-red-700 dark:text-red-400">
                {formatCurrency(withdrawal.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Usuario:</span>
              <span>{withdrawal.user.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejectionReason" className="text-sm font-medium">
              Motivo de rechazo <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ingrese el motivo por el cual está rechazando esta solicitud de retiro"
              className="min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
            {rejectionReason.trim() === "" && (
              <p className="text-xs text-red-500 mt-1">
                El motivo de rechazo es obligatorio
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={isSubmitting || rejectionReason.trim() === ""}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Rechazar Retiro"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
