"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LayoutGrid, List, PackagePlus, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductsFilters } from "../components/ProductsFilters";
import { ProductsMobileView } from "../components/ProductsMobileView";
import { ProductsTable } from "../components/ProductTable";
import { useProducts } from "../hooks/useProducts";

export default function ProductsPage() {
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"list" | "grid">(isMobile ? "grid" : "list");

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

    const handleAddProduct = () => {
        router.push("/admin/ecommerce/productos/registrar");
    };

    return (
        <div className="container max-w-7xl mx-auto p-6">
            <PageHeader
                title="Productos"
                subtitle="Gestiona los productos de la tienda"
                variant="gradient"
                icon={PackagePlus}
                actions={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-md border">
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                className="h-8 w-8 px-0"
                                aria-label="Vista lista"
                                onClick={() => setViewMode("list")}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                className="h-8 w-8 px-0"
                                aria-label="Vista cuadrícula"
                                onClick={() => setViewMode("grid")}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </Button>
                        </div>

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

                        <Button
                            onClick={handleAddProduct}
                            size="sm"
                            className="h-9"
                        >
                            <PackagePlus className="h-4 w-4 mr-2" />
                            Nuevo Producto
                        </Button>
                    </div>
                }
            />

            <Card className="mt-6">
                <CardContent className="p-4 md:p-6">
                    {showFilters && (
                        <ProductsFilters
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
                        <>
                            <div className="hidden md:block">
                                {viewMode === "list" ? (
                                    <ProductsTable
                                        products={products}
                                        isLoading={isLoading}

                                        meta={meta}
                                        onPageChange={handlePageChange}
                                        onPageSizeChange={(size) => updateFilters({ limit: size })}

                                    />
                                ) : (
                                    <ProductsMobileView
                                        products={products}
                                        isLoading={isLoading}

                                        meta={meta}
                                        onPageChange={handlePageChange}
                                        onPageSizeChange={(size) => updateFilters({ limit: size })}

                                    />
                                )}
                            </div>

                            <div className="md:hidden">
                                <ProductsMobileView
                                    products={products}
                                    isLoading={isLoading}

                                    meta={meta}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={(size) => updateFilters({ limit: size })}

                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}