"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { PiggyBank } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { TransactionDetailCard } from "../../components/TransactionDetailCard";
import { TransactionPaymentsTable } from "../../components/TransactionPaymentsTable";
import { useTransactionDetail } from "../../hooks/useTransactionDetail";

export default function TransactionDetailPage() {
    const params = useParams<{ id: string }>();
    const transactionId = Number(params.id);

    if (isNaN(transactionId)) {
        notFound();
    }

    const {
        transaction,
        isLoading,
        error,
        paymentsPage,
        paymentsPageSize,
        handlePageChange,
        handlePageSizeChange,
        refreshTransaction
    } = useTransactionDetail({ transactionId });

    return (
        <div className="container py-8">
            <PageHeader
                title="Detalle de Transacción"
                subtitle="Información detallada de la transacción y sus pagos asociados"
                variant="gradient"
                icon={PiggyBank}
                backUrl="/historial-puntos"
            />

            <div className="space-y-8 mt-6">
                <TransactionDetailCard
                    transaction={transaction}
                    isLoading={isLoading}
                    error={error}
                    onRefresh={refreshTransaction}
                />

                <TransactionPaymentsTable
                    transaction={transaction}
                    isLoading={isLoading}
                    error={error}
                    currentPage={paymentsPage}
                    pageSize={paymentsPageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    onRefresh={refreshTransaction}
                />
            </div>
        </div>
    );
}