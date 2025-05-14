import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WithdrawalsInfo } from "@/types/withdrawals/withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { Banknote, CircleDollarSign, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  withdrawalsInfo: WithdrawalsInfo | null;
  withdrawalAmount: number;
  setWithdrawalAmount: (amount: number) => void;
  isSubmitting: boolean;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
  onSubmit,
  withdrawalsInfo,
  withdrawalAmount,
  setWithdrawalAmount,
  isSubmitting,
}: WithdrawalModalProps) {
  const [error, setError] = useState<string | null>(null);

  // Verificar si el monto está dentro de los límites válidos
  const validateAmount = (amount: number) => {
    if (!withdrawalsInfo) return "No hay información disponible";

    if (amount < withdrawalsInfo.config.minimumAmount) {
      return `El monto mínimo de retiro es ${withdrawalsInfo.config.minimumAmount}`;
    }

    if (
      withdrawalsInfo.config.maximumAmount &&
      amount > withdrawalsInfo.config.maximumAmount
    ) {
      return `El monto máximo de retiro es ${withdrawalsInfo.config.maximumAmount}`;
    }

    if (amount > withdrawalsInfo.availablePoints) {
      return `No tienes suficientes puntos. Máximo: ${withdrawalsInfo.availablePoints}`;
    }

    return null;
  };

  // Actualizar validación cuando cambia el monto
  useEffect(() => {
    setError(validateAmount(withdrawalAmount));
  }, [withdrawalAmount, withdrawalsInfo]);

  // Manejar cambio de monto
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalAmount(0);
    } else {
      setWithdrawalAmount(amount);
    }
  };

  // Manejar envío del formulario
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Solicitar Retiro
          </DialogTitle>
          <DialogDescription>
            Ingresa el monto que deseas retirar a tu cuenta bancaria registrada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto a retirar</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                S/
              </span>
              <Input
                id="amount"
                type="number"
                min={withdrawalsInfo?.config.minimumAmount || 0}
                max={
                  withdrawalsInfo?.config.maximumAmount ||
                  withdrawalsInfo?.availablePoints ||
                  0
                }
                value={withdrawalAmount}
                onChange={handleAmountChange}
                className="pl-8"
                disabled={isSubmitting}
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {withdrawalsInfo && (
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <div className="flex justify-between">
                <span>Puntos disponibles:</span>
                <span className="font-medium">
                  {withdrawalsInfo.availablePoints.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Monto mínimo:</span>
                <span className="font-medium">
                  {formatCurrency(withdrawalsInfo.config.minimumAmount)}
                </span>
              </div>
              {withdrawalsInfo.config.maximumAmount && (
                <div className="flex justify-between">
                  <span>Monto máximo:</span>
                  <span className="font-medium">
                    {formatCurrency(withdrawalsInfo.config.maximumAmount)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Información bancaria */}
          <div className="border rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-primary" />
              Cuenta de destino
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Banco:</span>{" "}
                <span className="font-medium">
                  {withdrawalsInfo?.backName || "-"}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">N° Cuenta:</span>{" "}
                <span className="font-mono">
                  {withdrawalsInfo?.accountNumber || "-"}
                </span>
              </p>
              {withdrawalsInfo?.cci && (
                <p>
                  <span className="text-muted-foreground">CCI:</span>{" "}
                  <span className="font-mono">{withdrawalsInfo.cci}</span>
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                !!error || isSubmitting || !withdrawalsInfo?.canWithdraw
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Solicitar Retiro"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
