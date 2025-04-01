"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Award,
  DollarSign,
  FileText,
  Package,
  Plus,
} from "lucide-react";
import { PaymentImageModal } from "../../components/PaymentImageModal";
import { PaymentSummary } from "../../components/PaymentSummary";
import { useMembershipDetail } from "../../hooks/useMembershipDetail";
import {
  PaymentImageModalType,
  SubscriptionSchema,
  SubscriptionType,
} from "../../validations/suscription.zod";

export default function MembershipPlanDetailPage() {
  const params = useParams<{ id: string }>();
  const planId = Number(params.id);

  // Validate plan ID
  if (isNaN(planId)) {
    notFound();
  }

  // Use custom hook for plan details and subscription
  const { plan, isLoading, error, handleSubscription, isSubmitting } =
    useMembershipDetail(planId);

  // State for payment modal and payment list
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [payments, setPayments] = useState<PaymentImageModalType[]>([]);

  // Calculate total paid amount
  const totalPaidAmount = useMemo(() => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  // Form handling
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionType>({
    resolver: zodResolver(SubscriptionSchema),
    defaultValues: {
      planId: planId,
      totalAmount: plan?.price ? parseFloat(plan.price) : 0,
      payments: [],
    },
  });

  // Payment handling functions
  const addPayment = (payment: Omit<PaymentImageModalType, "fileIndex">) => {
    const updatedPayments: PaymentImageModalType[] = [
      ...payments,
      {
        ...payment,
        bankName: payment.bankName || "",
        fileIndex: payments.length,
      },
    ];
    setPayments(updatedPayments);
    setValue("payments", updatedPayments);
    setIsPaymentModalOpen(false);
  };

  const deletePayment = (index: number) => {
    const updatedPayments: PaymentImageModalType[] = payments
      .filter((_, i) => i !== index)
      .map((payment, newIndex) => ({
        ...payment,
        fileIndex: newIndex,
      }));
    setPayments(updatedPayments);
    setValue("payments", updatedPayments);
  };

  const editPayment = (
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
    setValue("payments", updatedPayments);
  };

  // Submit handler
  const onSubmit = (data: SubscriptionType) => {
    // Ensure total amount is set correctly
    const planPrice = plan ? parseFloat(plan.price) : 0;

    // Convert form data to FormData for file upload
    const formData = new FormData();

    // Prepare payments with file references
    const paymentsData = payments.map((payment, index) => ({
      bankName: payment.bankName || "",
      transactionReference: payment.transactionReference,
      transactionDate: payment.transactionDate,
      amount: payment.amount,
      fileIndex: index,
    }));

    // Append basic details
    formData.append("planId", data.planId.toString());
    formData.append("totalAmount", planPrice.toString());
    if (data.notes) formData.append("notes", data.notes);

    // Append payments as a JSON string
    formData.append("payments", JSON.stringify(paymentsData));

    // Append payment images
    payments.forEach((payment) => {
      formData.append(`paymentImages`, payment.file);
    });

    // Call subscription handler
    handleSubscription(formData);
  };
  useEffect(() => {
    if (plan) {
      const planPrice = parseFloat(plan.price);
      setValue("totalAmount", planPrice);
    }
  }, [plan, setValue]);
  // Loading state
  if (isLoading) {
    return <div>Cargando detalles del plan...</div>;
  }

  // Error state
  if (error || !plan) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-center">
          <AlertCircle className="mr-2 text-red-500" />
          <p className="text-red-700">{error || "Plan no encontrado"}</p>
        </div>
      </div>
    );
  }
  const planPrice = parseFloat(plan.price);
  return (
    <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Plan Details */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            Detalles del Plan {plan.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pricing */}
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("es-PE", {
                  style: "currency",
                  currency: "PEN",
                }).format(parseFloat(plan.price))}
              </p>
              <p className="text-sm text-muted-foreground">
                Precio total del plan
              </p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="flex items-center gap-2 mb-2 font-semibold">
              <Package className="h-5 w-5 text-primary" />
              Productos Incluidos
            </h3>
            <ul className="space-y-1 text-sm">
              {plan.products.map((product, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                  {product}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="flex items-center gap-2 mb-2 font-semibold">
              <Award className="h-5 w-5 text-primary" />
              Beneficios
            </h3>
            <ul className="space-y-1 text-sm">
              {plan.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Form */}
      <Card>
        <CardHeader>
          <CardTitle>Suscripción al Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
              console.error("Form Errors:", errors);
            })}
            className="space-y-6"
          >
            {/* Payment Summary */}
            <PaymentSummary
              payments={payments}
              onDeletePayment={deletePayment}
              onEditPayment={editPayment}
            />

            {/* Total Paid Amount */}
            <div className="flex justify-between items-center border-t pt-4">
              <span className="font-medium">Total Pagado:</span>
              <span
                className={`font-bold ${
                  totalPaidAmount === planPrice
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {new Intl.NumberFormat("es-PE", {
                  style: "currency",
                  currency: "PEN",
                }).format(totalPaidAmount)}
              </span>
            </div>

            {/* Remaining Amount */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Monto Pendiente:</span>
              <span
                className={`font-bold ${
                  totalPaidAmount === planPrice
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {new Intl.NumberFormat("es-PE", {
                  style: "currency",
                  currency: "PEN",
                }).format(Math.max(0, planPrice - totalPaidAmount))}
              </span>
            </div>

            {/* Add Payment Button */}
            <div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Comprobante de Pago
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                payments.length === 0 ||
                isSubmitting ||
                totalPaidAmount !== planPrice
              }
            >
              {totalPaidAmount < planPrice
                ? `Pendiente: ${new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(planPrice - totalPaidAmount)}`
                : isSubmitting
                ? "Procesando..."
                : "Suscribirse al Plan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Image Modal */}
      <PaymentImageModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={addPayment}
        initialData={{
          bankName: "",
          transactionReference: "",
          transactionDate: new Date().toISOString().split("T")[0],
          amount: plan.price ? parseFloat(plan.price) : 0,
          file: undefined,
        }}
      />
    </div>
  );
}
