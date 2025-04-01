import * as z from "zod";

export const PaymentDetailSchema = z.object({
  bankName: z.string().optional(),
  transactionReference: z
    .string()
    .min(3, "La referencia de transacción es requerida")
    .max(50, "La referencia es demasiado larga"),
  transactionDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    },
    { message: "Fecha de transacción inválida" }
  ),
  amount: z
    .number()
    .min(0.01, "El monto debe ser mayor a 0")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El monto debe tener máximo 2 decimales",
    }),
  fileIndex: z.number(),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "La imagen no debe superar 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: "Solo se permiten imágenes JPG, JPEG o PNG" }
    ),
});
export const PaymentImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "La imagen no debe superar 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: "Solo se permiten imágenes JPG, JPEG o PNG" }
    ),
});

export const SubscriptionSchema = z.object({
  planId: z.number().min(1, "ID de plan inválido"),
  totalAmount: z
    .number()
    .min(0.01, "Monto total inválido")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El monto debe tener máximo 2 decimales",
    }),
  notes: z.string().optional(),
  payments: z
    .array(PaymentDetailSchema)
    .min(1, "Debe haber al menos un pago")
    .refine(
      (payments) => {
        const totalPayments = payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        return totalPayments > 0;
      },
      { message: "La suma de pagos debe ser mayor a 0" }
    ),
});

// Tipo para el modal de imagen de pago
export type PaymentImageModalType = {
  bankName?: string;
  transactionReference: string;
  transactionDate: string;
  amount: number;
  file: File;
  fileIndex: number;
};
export const PaymentImageModalSchema = z.object({
  bankName: z.string().optional(),
  transactionReference: z
    .string()
    .min(3, "La referencia de transacción es requerida")
    .max(50, "La referencia es demasiado larga"),
  transactionDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    },
    { message: "Fecha de transacción inválida" }
  ),
  amount: z
    .number()
    .min(0.01, "El monto debe ser mayor a 0")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El monto debe tener máximo 2 decimales",
    }),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "La imagen no debe superar 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      { message: "Solo se permiten imágenes JPG, JPEG o PNG" }
    ),
});

export type PaymentDetailType = z.infer<typeof PaymentDetailSchema>;
export type PaymentImageType = z.infer<typeof PaymentImageSchema>;
export type SubscriptionType = z.infer<typeof SubscriptionSchema>;
// export type PaymentImageModalType = z.infer<typeof PaymentImageModalSchema>;
