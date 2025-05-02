"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package } from "lucide-react";
import { useProductDetail } from "../../../hooks/useProductDetail";
import { ProductSkeleton } from "../../../components/ProductSkeleton";
import { ProductErrorState } from "../../../components/ProductErrorState";
import { ProductBasicInfo } from "../../../components/ProductBasicInfo";
import { ProductImages } from "../../../components/ProductImages";
import { ProductBenefits } from "../../../components/ProductBenefits";
import { StockHistory } from "../../../components/StockHistory";


export default function ProductDetailPage() {
    const {
        product,
        stockHistory,
        stockHistoryMeta,
        isLoading,
        isSubmitting,
        error,
        categories,
        benefitsList,
        form,
        imageToDelete,

        // Funciones
        fetchProductDetails,
        updateProductDetails,
        updateImage,
        deleteImage,
        addBenefit,
        removeBenefit,
        handleStockPageChange,
        handleStockLimitChange,
        goBack
    } = useProductDetail();

    // Mostrar pantalla de carga
    if (isLoading) {
        return <ProductSkeleton />;
    }

    // Mostrar pantalla de error
    if (error || !product) {
        return (
            <ProductErrorState
                error={error || "No se encontró el producto"}
                onBack={goBack}
            />
        );
    }

    return (
        <div className="container max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-3"
                    onClick={goBack}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                </Button>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Package className="h-8 w-8 text-primary" />
                    {product.name}
                </h1>
                <p className="text-muted-foreground mt-2">
                    SKU: {product.sku} | Última actualización: {new Date(product.updatedAt).toLocaleString('es-ES')}
                </p>
            </div>

            <Tabs defaultValue="info" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="info">Información básica</TabsTrigger>
                    <TabsTrigger value="images">Imágenes</TabsTrigger>
                    <TabsTrigger value="benefits">Beneficios</TabsTrigger>
                    <TabsTrigger value="stock">Historial de stock</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Información del Producto
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProductBasicInfo
                                form={form}
                                categories={categories}
                                isSubmitting={isSubmitting}
                                onUpdate={updateProductDetails}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Imágenes del Producto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProductImages
                                images={product.images}
                                productId={product.id}
                                onDelete={deleteImage}
                                onUpdateImage={updateImage}
                                imageToDelete={imageToDelete}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="benefits" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Beneficios del Producto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProductBenefits
                                benefits={benefitsList}
                                onAdd={addBenefit}
                                onRemove={removeBenefit}
                                onUpdate={updateProductDetails}
                                isSubmitting={isSubmitting}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="stock" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historial de Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StockHistory
                                stockHistory={stockHistory}
                                meta={stockHistoryMeta}
                                onPageChange={handleStockPageChange}
                                onPageSizeChange={handleStockLimitChange}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}