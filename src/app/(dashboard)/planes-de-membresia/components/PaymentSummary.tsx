import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, FileImage } from "lucide-react";
import { PaymentImageModal } from "./PaymentImageModal";
import { format } from "date-fns";
import { PaymentImageModalType } from "../validations/suscription.zod";

interface PaymentSummaryProps {
  payments: PaymentImageModalType[];
  onDeletePayment: (index: number) => void;
  onEditPayment: (index: number, payment: PaymentImageModalType) => void;
}

export function PaymentSummary({
  payments,
  onDeletePayment,
  onEditPayment,
}: PaymentSummaryProps) {
  const [editingPayment, setEditingPayment] = useState<{
    index: number;
    payment: PaymentImageModalType;
  } | null>(null);

  const handleEditPayment = (payment: PaymentImageModalType) => {
    if (editingPayment !== null) {
      onEditPayment(editingPayment.index, payment);
      setEditingPayment(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Resumen de Pagos</h2>
      {payments.length === 0 ? (
        <p className="text-muted-foreground">
          No se han agregado comprobantes de pago
        </p>
      ) : (
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <FileImage className="text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    {payment.bankName || "Comprobante de Pago"}
                  </p>
                  <div className="text-sm text-muted-foreground space-x-2">
                    <span>Ref: {payment.transactionReference}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(payment.transactionDate), "PP")}
                    </span>
                    <span>•</span>
                    <span>
                      {new Intl.NumberFormat("es-PE", {
                        style: "currency",
                        currency: "PEN",
                      }).format(payment.amount)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEditingPayment({ index, payment })}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDeletePayment(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para editar pago */}
      {editingPayment && (
        <PaymentImageModal
          isOpen={!!editingPayment}
          onClose={() => setEditingPayment(null)}
          onSubmit={() => handleEditPayment}
          initialData={editingPayment.payment}
        />
      )}
    </div>
  );
}
