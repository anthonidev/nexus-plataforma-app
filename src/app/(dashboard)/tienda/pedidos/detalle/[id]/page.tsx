"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrderDetailContent } from "../../../components/OrderDetailContent";
import { OrderDetailError } from "../../../components/OrderDetailError";
import { OrderDetailSkeleton } from "../../../components/OrderDetailSkeleton";
import { useOrderDetail } from "../../../hooks/useOrderDetail";



export default function OrderDetailPage() {
    const params = useParams<{ id: string }>();
    const orderId = Number(params.id);

    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");

    const { orderDetail, isLoading, error, refresh } = useOrderDetail(orderId);

    const handleBack = () => {
        router.push("/tienda/pedidos");
    };

    if (isLoading) {
        return <OrderDetailSkeleton />;
    }

    if (error || !orderDetail) {
        return <OrderDetailError error={error} onBack={handleBack} onRetry={refresh} />;
    }

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
            <PageHeader
                title={`Pedido #${orderId}`}
                subtitle={`Detalles completos de tu pedido`}
                variant="gradient"
                icon={ShoppingBag}
                backUrl="/tienda/pedidos"
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refresh}
                        className="mt-4 md:mt-0"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        <span>Actualizar</span>
                    </Button>
                }
            />

            <OrderDetailContent
                orderDetail={orderDetail}
                isMobile={isMobile}
            />
        </div>
    );
}