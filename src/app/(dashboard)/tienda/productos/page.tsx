"use client";

import { CartSheet } from "@/components/common/CartSheet";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, RefreshCw, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { ProductFilters } from "../components/ProductFilters";
import { ProductsList } from "../components/ProductsList";
import { useProducts } from "../hooks/useProducts";



export default function TiendaPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const {
        products,
        categories,
        isLoading,
        error,
        meta,
        filters,
        updateFilters,
        handlePageChange,
        resetFilters,
        refresh,
    } = useProducts();



    return (
        <div className="container max-w-7xl mx-auto p-6">
            <PageHeader
                title="Tienda"
                subtitle="Explora nuestra selección de productos"
                variant="gradient"
                icon={ShoppingBag}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="h-9"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            {showFilters ? "Ocultar filtros" : "Filtros"}
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
                        <ProductFilters
                            filters={filters}
                            categories={categories}
                            onFilterChange={updateFilters}
                            onResetFilters={resetFilters}
                            className="mb-6"
                        />
                    )}

                    {isLoading ? (
                        <div className="text-center p-8">
                            <div className="mx-auto w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4"></div>
                            <p className="text-muted-foreground">Cargando productos...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 bg-destructive/10 rounded-lg border border-destructive/30">
                            <p className="text-destructive font-medium mb-2">Error al cargar productos</p>
                            <p className="text-destructive/80 text-sm mb-4">{error}</p>
                            <Button variant="outline" onClick={refresh}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reintentar
                            </Button>
                        </div>
                    ) : (
                        <ProductsList
                            products={products}
                            meta={meta}
                            onPageChange={handlePageChange}
                            onPageSizeChange={(size) => updateFilters({ limit: size })}
                        />
                    )}
                </CardContent>
            </Card>

            <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
        </div>
    );
}