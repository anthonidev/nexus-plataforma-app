"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { ClipboardList, RefreshCw, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import { AdminOrderDetailContent } from "../../components/AdminOrderDetailContent";
export default function OrderDetailPage() {
    const params = useParams<{ id: string }>();
    const orderId = Number(params.id);

    const router = useRouter();

    const {
        orderDetail,
        isLoading,
        isUpdating,
        error,
        refresh,
        updateStatus
    } = useOrderDetail(orderId);

    const handleBack = () => {
        router.push("/admin/pedidos");
    };

    if (isLoading) {
        return (
            <div className="container max-w-7xl mx-auto p-6">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" className="-ml-3">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                    </Button>
                </div>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    if (error || !orderDetail) {
        return (
            <div className="container max-w-7xl mx-auto p-6">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" className="-ml-3" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                    </Button>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto text-center">
                    <ClipboardList className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
                        Error al cargar los detalles del pedido
                    </h2>
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        {error || "No se pudo encontrar el pedido solicitado o no tienes permisos para verlo."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Button variant="outline" onClick={refresh}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Intentar nuevamente
                        </Button>
                        <Button onClick={handleBack}>
                            Volver a pedidos
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-7xl mx-auto p-6">
            <PageHeader
                title={`Pedido #${orderId}`}
                subtitle={`Detalles y administración del pedido`}
                variant="gradient"
                icon={ClipboardList}
                backUrl="/admin/pedidos"
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refresh}
                        disabled={isLoading || isUpdating}
                        className="mt-4 md:mt-0"
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${isLoading || isUpdating ? "animate-spin" : ""}`}
                        />
                        <span>Actualizar</span>
                    </Button>
                }
            />

            <AdminOrderDetailContent
                orderDetail={orderDetail}
                isUpdating={isUpdating}
                onUpdateStatus={updateStatus}
            />
        </div>
    );
}