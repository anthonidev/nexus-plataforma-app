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
import { FinanceWithdrawalDetailResponse } from "@/types/withdrawals/finance-withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ApproveWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  withdrawal: FinanceWithdrawalDetailResponse;
  isSubmitting: boolean;
}

export function ApproveWithdrawalModal({
  isOpen,
  onClose,
  onApprove,
  withdrawal,
  isSubmitting,
}: ApproveWithdrawalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Confirmar Aprobación de Retiro
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas aprobar este retiro? Esta acción generará el pago automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800/50 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">ID de Retiro:</span>
              <span className="font-mono">#{withdrawal.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Monto:</span>
              <span className="font-semibold text-green-700 dark:text-green-400">
                {formatCurrency(withdrawal.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Usuario:</span>
              <span>{withdrawal.user.email}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              Al aprobar este retiro, se realizará un pago bancario automáticamente a la cuenta del usuario con los siguientes detalles:
            </p>
            <div className="bg-muted/30 p-3 rounded-lg border">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Banco:</span>
                <span className="font-medium">{withdrawal.bankName}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Cuenta:</span>
                <span className="font-mono">{withdrawal.accountNumber}</span>
              </div>
              {withdrawal.cci && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CCI:</span>
                  <span className="font-mono">{withdrawal.cci}</span>
                </div>
              )}
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
              "Confirmar Aprobación"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}