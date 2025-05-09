"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ClipboardList, RefreshCw } from "lucide-react";
import { useState } from "react";
import { TableSkeleton } from "@/components/common/table/TableSkeleton";
import { useAdminOrders } from "./hooks/useAdminOrders";
import { AdminOrderFilters } from "./components/AdminOrderFilters";
import { AdminOrdersMobileView } from "./components/AdminOrdersMobileView";
import { AdminOrdersTable } from "./components/AdminOrdersTable";

export default function OrdersAdminPage() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [showFilters, setShowFilters] = useState(true);

    const {
        orders,
        isLoading,
        error,
        meta,
        filters,
        updateFilters,
        handlePageChange,
        handleItemsPerPageChange,
        refresh,
    } = useAdminOrders();

    return (
        <div className="container max-w-7xl mx-auto p-6">
            <PageHeader
                title="Gestión de Pedidos"
                subtitle="Administra los pedidos de los clientes"
                variant="gradient"
                icon={ClipboardList}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="h-9"
                        >
                            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={refresh}
                            disabled={isLoading}
                            className="h-9 w-9"
                            title="Actualizar"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                            />
                        </Button>
                    </div>
                }
            />

            <Card className="mt-6">
                <CardContent className="p-4 md:p-6">
                    {showFilters && (
                        <AdminOrderFilters
                            filters={filters}
                            onFilterChange={updateFilters}
                            onResetFilters={() => updateFilters({ page: 1, limit: 10 })}
                            className="mb-6"
                        />
                    )}

                    {isLoading ? (
                        <TableSkeleton />
                    ) : isMobile ? (
                        <AdminOrdersMobileView
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
                        <AdminOrdersTable
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
                </CardContent>
            </Card>
        </div>
    );
}