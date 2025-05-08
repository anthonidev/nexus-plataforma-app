"use client";

import { useCartStore } from "@/context/CartStore";
import { PageHeader } from "@/components/common/PageHeader";
import { ShoppingCart } from "lucide-react";
import { PaymentImageModal } from "../../planes-de-membresia/components/PaymentImageModal";
import { useCartCheckout, MethodPayment } from "../hooks/useCartCheckout";
import { CartEmptyState } from "../components/CartEmptyState";
import { CartProductList } from "../components/CartProductList";
import { CheckoutSummary } from "../components/CheckoutSummary";

export default function CartPage() {
    const { items, clearCart } = useCartStore();
    const {
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
        handleEditPayment,
        handleEditComplete,
        handleSubmitOrder,
        handlePaymentMethodChange,
        setEditingPayment,
    } = useCartCheckout();

    // Renderizar página vacía si no hay items
    if (items.length === 0) {
        return (
            <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
                <PageHeader
                    title="Carrito de Compra"
                    subtitle="Aquí podrás finalizar tu compra"
                    variant="gradient"
                    icon={ShoppingCart}
                    backUrl="/tienda/productos"
                />

                <CartEmptyState />
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
            <PageHeader
                title="Carrito de Compra"
                subtitle="Completa tu pedido con los siguientes pasos"
                variant="gradient"
                icon={ShoppingCart}
                backUrl="/tienda/productos"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Productos en el carrito */}
                <div className="lg:col-span-2">
                    <CartProductList onClearCart={clearCart} />
                </div>

                {/* Sección de Pago */}
                <div className="lg:col-span-1">
                    <CheckoutSummary
                        totalAmount={totalAmount}
                        totalPaidAmount={totalPaidAmount}
                        remainingAmount={remainingAmount}
                        isPaymentComplete={isPaymentComplete}
                        isSubmitting={isSubmitting}
                        payments={payments}
                        notes={notes}
                        paymentMethod={paymentMethod}
                        onNotesChange={setNotes}
                        onAddPayment={handlePaymentModalOpen}
                        onDeletePayment={deletePayment}
                        onEditPayment={handleEditPayment}
                        onSubmitOrder={handleSubmitOrder}
                        onPaymentMethodChange={handlePaymentMethodChange}
                    />
                </div>
            </div>

            {/* Modal para añadir comprobante - solo si el método es VOUCHER */}
            {paymentMethod === MethodPayment.VOUCHER && (
                <PaymentImageModal
                    isOpen={isPaymentModalOpen}
                    onClose={handlePaymentModalClose}
                    onSubmit={addPayment}
                    initialData={{
                        bankName: "",
                        transactionReference: "",
                        transactionDate: new Date().toISOString().split("T")[0],
                        amount: remainingAmount > 0 ? remainingAmount : totalAmount,
                        file: undefined,
                    }}
                />
            )}

            {/* Modal para editar comprobante */}
            {editingPayment && paymentMethod === MethodPayment.VOUCHER && (
                <PaymentImageModal
                    isOpen={!!editingPayment}
                    onClose={() => setEditingPayment(null)}
                    onSubmit={handleEditComplete}
                    initialData={editingPayment.payment}
                />
            )}
        </div>
    );
}