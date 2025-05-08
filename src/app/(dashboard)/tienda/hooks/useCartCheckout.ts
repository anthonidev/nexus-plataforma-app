"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/context/CartStore";
import { PaymentImageModalType } from "../../planes-de-membresia/validations/suscription.zod";
import { createOrder } from "@/lib/actions/ecommerce/ecommerce-client.action";

// Agregar enum para los métodos de pago
export enum MethodPayment {
  VOUCHER = "VOUCHER",
  POINTS = "POINTS",
}

export function useCartCheckout() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [payments, setPayments] = useState<PaymentImageModalType[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<{
    index: number;
    payment: PaymentImageModalType;
  } | null>(null);
  // Nuevo estado para seleccionar el método de pago
  const [paymentMethod, setPaymentMethod] = useState<MethodPayment>(
    MethodPayment.VOUCHER
  );

  // Total pagado de los comprobantes añadidos
  const totalPaidAmount = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  // Monto pendiente por pagar
  const remainingAmount = Math.max(0, totalAmount - totalPaidAmount);

  // Verificar si el pago está completo dependiendo del método de pago
  const isPaymentComplete =
    paymentMethod === MethodPayment.POINTS ||
    (paymentMethod === MethodPayment.VOUCHER &&
      totalPaidAmount === totalAmount &&
      payments.length > 0);

  // Handlers para los pagos
  const handlePaymentModalOpen = useCallback(() => {
    setIsPaymentModalOpen(true);
  }, []);

  const handlePaymentModalClose = useCallback(() => {
    setIsPaymentModalOpen(false);
  }, []);

  const addPayment = useCallback(
    (payment: Omit<PaymentImageModalType, "fileIndex">) => {
      const updatedPayments: PaymentImageModalType[] = [
        ...payments,
        {
          ...payment,
          bankName: payment.bankName || "",
          fileIndex: payments.length,
        },
      ];
      setPayments(updatedPayments);
      setIsPaymentModalOpen(false);
    },
    [payments]
  );

  const deletePayment = useCallback(
    (index: number) => {
      const updatedPayments: PaymentImageModalType[] = payments
        .filter((_, i) => i !== index)
        .map((payment, newIndex) => ({
          ...payment,
          fileIndex: newIndex,
        }));
      setPayments(updatedPayments);
    },
    [payments]
  );

  const editPayment = useCallback(
    (
      index: number,
      updatedPayment: Omit<PaymentImageModalType, "fileIndex">
    ) => {
      const updatedPayments: PaymentImageModalType[] = [...payments];
      updatedPayments[index] = {
        ...updatedPayment,
        bankName: updatedPayment.bankName || "",
        fileIndex: index,
      };
      setPayments(updatedPayments);
    },
    [payments]
  );

  const handleEditPayment = useCallback(
    (index: number, payment: PaymentImageModalType) => {
      setEditingPayment({ index, payment });
    },
    []
  );

  const handleEditComplete = useCallback(
    (payment: Omit<PaymentImageModalType, "fileIndex">) => {
      if (editingPayment) {
        editPayment(editingPayment.index, payment);
        setEditingPayment(null);
      }
    },
    [editingPayment, editPayment]
  );

  // Manejar cambio en el método de pago
  const handlePaymentMethodChange = useCallback((method: MethodPayment) => {
    setPaymentMethod(method);
  }, []);

  // Validar antes de enviar la orden
  const validateOrder = useCallback(() => {
    if (items.length === 0) {
      toast.error("El carrito está vacío");
      return false;
    }

    if (paymentMethod === MethodPayment.VOUCHER) {
      if (payments.length === 0) {
        toast.error("Debe agregar al menos un comprobante de pago");
        return false;
      }

      if (Math.abs(totalPaidAmount - totalAmount) > 0.01) {
        toast.error(
          `El monto total pagado debe ser igual al valor del carrito`
        );
        return false;
      }
    }

    return true;
  }, [
    items.length,
    payments.length,
    totalPaidAmount,
    totalAmount,
    paymentMethod,
  ]);

  // Enviar la orden
  const handleSubmitOrder = useCallback(async () => {
    if (!validateOrder()) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Añadir datos básicos
      formData.append("totalAmount", totalAmount.toFixed(2));
      formData.append("methodPayment", paymentMethod);
      if (notes) formData.append("notes", notes);

      // Añadir items del carrito
      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      formData.append("items", JSON.stringify(orderItems));

      // Añadir pagos solo si el método es VOUCHER
      if (paymentMethod === MethodPayment.VOUCHER) {
        const paymentsData = payments.map((payment, index) => ({
          bankName: payment.bankName || "",
          transactionReference: payment.transactionReference,
          transactionDate: payment.transactionDate,
          amount: payment.amount,
          fileIndex: index,
        }));
        formData.append("payments", JSON.stringify(paymentsData));

        // Añadir imágenes de comprobantes
        payments.forEach((payment) => {
          formData.append("paymentImages", payment.file);
        });
      }

      // Realizar la petición al backend
      const result = await createOrder(formData);

      if (result.success) {
        toast.success("¡Orden creada con éxito!");
        clearCart(); // Vaciar el carrito después de crear la orden
        router.push("/tienda/pedidos"); // Redirigir a la página de órdenes
      } else {
        toast.error(result.message || "Error al procesar la orden");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al crear la orden";

      toast.error(errorMessage);
      console.error("Error creando orden:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateOrder,
    items,
    totalAmount,
    notes,
    payments,
    router,
    clearCart,
    paymentMethod,
  ]);

  return {
    items,
    totalAmount,
    isSubmitting,
    notes,
    setNotes,
    payments,
    isPaymentModalOpen,
    editingPayment,
    totalPaidAmount,
    remainingAmount,
    isPaymentComplete,
    paymentMethod,
    handlePaymentModalOpen,
    handlePaymentModalClose,
    addPayment,
    deletePayment,
    editPayment,
    handleEditPayment,
    handleEditComplete,
    handleSubmitOrder,
    handlePaymentMethodChange,
    setEditingPayment,
  };
}
