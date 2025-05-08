"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { ShoppingBag, RefreshCw } from "lucide-react";
import { useOrders } from "../hooks/useOrders";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { OrdersTable } from "../components/OrdersTable";
import { OrdersMobileView } from "../components/OrdersMobileView";

export default function OrdersPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const {
        orders,
        isLoading,
        error,
        meta,
        filters,
        handlePageChange,
        handleItemsPerPageChange,
        refresh,
    } = useOrders();

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
            <PageHeader
                title="Mis Pedidos"
                subtitle="Historial de todas tus compras realizadas"
                variant="gradient"
                icon={ShoppingBag}
                backUrl="/tienda/productos"
                actions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refresh}
                        disabled={isLoading}
                        className="mt-4 md:mt-0"
                    >
                        <RefreshCw
                            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                        />
                        <span>Actualizar</span>
                    </Button>
                }
            />

            {isMobile ? (
                <OrdersMobileView
                    orders={orders}
                    isLoading={isLoading}
                    error={error}
                    meta={meta}
                    currentPage={filters.page || 1}
                    itemsPerPage={filters.limit || 10}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handleItemsPerPageChange}
                    onRefresh={refresh}
                />
            ) : (
                <OrdersTable
                    orders={orders}
                    isLoading={isLoading}
                    error={error}
                    meta={meta}
                    currentPage={filters.page || 1}
                    itemsPerPage={filters.limit || 10}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handleItemsPerPageChange}
                    onRefresh={refresh}
                />
            )}
        </div>
    );
}