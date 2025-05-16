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
import { PaymentResponse } from "@/types/payment/payment-detail.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface UpdatePaymentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updateData: {
        codeOperation: string;
        numberTicket: string;
    }) => Promise<unknown>;
    payment: PaymentResponse | null;
    isSubmitting: boolean;
}

export function UpdatePaymentDetailsModal({
    isOpen,
    onClose,
    onUpdate,
    payment,
    isSubmitting,
}: UpdatePaymentDetailsModalProps) {
    const [codeOperation, setCodeOperation] = useState("");
    const [numberTicket, setNumberTicket] = useState("");

    useEffect(() => {
        if (isOpen && payment) {
            setCodeOperation(payment.codeOperation || "");
            setNumberTicket(payment.numberTicket || "");
        }
    }, [isOpen, payment]);

    if (!payment) return null;

    const handleUpdate = () => {
        onUpdate({
            codeOperation,
            numberTicket,
        });
    };

    const isFormValid =
        codeOperation.trim() !== "" && numberTicket.trim() !== "";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5 text-blue-500" />
                        Actualizar Información de Pago
                    </DialogTitle>
                    <DialogDescription>
                        Modifique la información del pago aprobado.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/50 mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">ID de Pago:</span>
                            <span className="font-mono">#{payment.id}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium">Monto:</span>
                            <span className="font-semibold text-blue-700 dark:text-blue-400">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleUpdate}
                        disabled={isSubmitting || !isFormValid}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            "Actualizar Información"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}