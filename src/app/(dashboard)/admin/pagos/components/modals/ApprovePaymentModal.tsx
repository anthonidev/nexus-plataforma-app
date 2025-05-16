"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PaymentResponse } from "@/types/payment/payment-detail.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ApprovePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (approvalData: {
    codeOperation: string;
    banckName: string;
    dateOperation: string;
    numberTicket: string;
  }) => Promise<unknown>;
  payment: PaymentResponse | null;
  isSubmitting: boolean;
}

const BANK_OPTIONS = ["BCP", "INTERBANK", "BBVA", "OTRO"];

export function ApprovePaymentModal({
  isOpen,
  onClose,
  onApprove,
  payment,
  isSubmitting,
}: ApprovePaymentModalProps) {
  const [codeOperation, setCodeOperation] = useState("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [customBankName, setCustomBankName] = useState<string>("");
  const [dateOperation, setDateOperation] = useState<Date | undefined>(
    new Date()
  );
  const [numberTicket, setNumberTicket] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCodeOperation("");
      setSelectedBank("");
      setCustomBankName("");
      setDateOperation(new Date());
      setNumberTicket("");
    }
  }, [isOpen]);

  if (!payment) return null;

  const handleApprove = () => {
    const formattedDate = dateOperation
      ? format(dateOperation, "yyyy-MM-dd")
      : "";

    const bankName = selectedBank === "OTRO" ? customBankName : selectedBank;

    onApprove({
      codeOperation,
      banckName: bankName,
      dateOperation: formattedDate,
      numberTicket,
    });
  };

  const isFormValid =
    codeOperation.trim() !== "" &&
    (selectedBank !== "" && (selectedBank !== "OTRO" || customBankName.trim() !== "")) &&
    dateOperation !== undefined &&
    numberTicket.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Confirmar Aprobación de Pago
          </DialogTitle>
          <DialogDescription>
            Complete la información requerida para aprobar este pago.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800/50 mb-4">
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

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codeOperation">Código de operación</Label>
              <Input
                id="codeOperation"
                value={codeOperation}
                onChange={(e) => setCodeOperation(e.target.value)}
                placeholder="Ingrese el código de operación"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankSelect">Banco</Label>
              <Select
                value={selectedBank}
                onValueChange={setSelectedBank}
                disabled={isSubmitting}
              >
                <SelectTrigger id="bankSelect" className="w-full">
                  <SelectValue placeholder="Seleccione un banco" />
                </SelectTrigger>
                <SelectContent>
                  {BANK_OPTIONS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedBank === "OTRO" && (
                <div className="mt-2">
                  <Input
                    value={customBankName}
                    onChange={(e) => setCustomBankName(e.target.value)}
                    placeholder="Ingrese el nombre del banco"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOperation">Fecha de operación</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateOperation && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOperation ? (
                      format(dateOperation, "PPP")
                    ) : (
                      <span>Seleccione una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateOperation}
                    onSelect={setDateOperation}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberTicket">Número de boleta</Label>
              <Input
                id="numberTicket"
                value={numberTicket}
                onChange={(e) => setNumberTicket(e.target.value)}
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
            onClick={handleApprove}
            disabled={isSubmitting || !isFormValid}
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