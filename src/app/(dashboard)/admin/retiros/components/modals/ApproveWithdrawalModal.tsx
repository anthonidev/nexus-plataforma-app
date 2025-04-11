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
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Item } from "@/types/withdrawals/finance-withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { CheckCircle2, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ApproveWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => Promise<void>;
  withdrawal: Item;
  approveData: {
    codeOperation: string;
    banckNameApproval: string;
    dateOperation: string;
    numberTicket: string;
  };
  setApproveData: (
    data: Partial<ApproveWithdrawalModalProps["approveData"]>
  ) => void;
  isSubmitting: boolean;
}

export default function ApproveWithdrawalModal({
  isOpen,
  onClose,
  onApprove,
  withdrawal,
  approveData,
  setApproveData,
  isSubmitting,
}: ApproveWithdrawalModalProps) {
  const isFormValid =
    approveData.codeOperation.trim() !== "" &&
    approveData.banckNameApproval.trim() !== "" &&
    approveData.dateOperation !== "" &&
    approveData.numberTicket.trim() !== "";

  // Manejo de la fecha
  const selectedDate = approveData.dateOperation
    ? new Date(approveData.dateOperation)
    : new Date();

  const onDateSelect = (date: Date | undefined) => {
    if (date) {
      setApproveData({ dateOperation: date.toISOString().split("T")[0] });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Aprobar Solicitud de Retiro
          </DialogTitle>
          <DialogDescription>
            Complete la información requerida para aprobar esta solicitud de
            retiro.
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codeOperation">Código de operación</Label>
              <Input
                id="codeOperation"
                value={approveData.codeOperation}
                onChange={(e) =>
                  setApproveData({ codeOperation: e.target.value })
                }
                placeholder="Ingrese el código de operación"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banckNameApproval">Nombre del banco</Label>
              <Input
                id="banckNameApproval"
                value={approveData.banckNameApproval}
                onChange={(e) =>
                  setApproveData({ banckNameApproval: e.target.value })
                }
                placeholder="Ingrese el nombre del banco"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOperation">Fecha de operación</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Seleccione una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberTicket">Número de ticket/recibo</Label>
              <Input
                id="numberTicket"
                value={approveData.numberTicket}
                onChange={(e) =>
                  setApproveData({ numberTicket: e.target.value })
                }
                placeholder="Ingrese el número de ticket"
                disabled={isSubmitting}
              />
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
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Aprobar Retiro"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
