"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package } from "lucide-react";
import { ProductBasicInfo } from "../../../components/ProductBasicInfo";
import { ProductBenefits } from "../../../components/ProductBenefits";
import { ProductErrorState } from "../../../components/ProductErrorState";
import { ProductImages } from "../../../components/ProductImages";
import { ProductSkeleton } from "../../../components/ProductSkeleton";
import { StockHistory } from "../../../components/StockHistory";
import { ImageUploadModal } from "../../../components/modal/ImageUploadModal";
import { StockUpdateModal } from "../../../components/modal/StockUpdateModal";
import { useProductDetail } from "../../../hooks/useProductDetail";

export default function ProductDetailPage() {
    const {
        product,
        stockHistory,
        stockHistoryMeta,
        isLoading,
        isSubmitting,
        isAddingStock,
        isAddingImage,
        error,
        categories,
        benefitsList,
        form,
        stockForm,
        imageToDelete,
        showStockModal,
        showImageModal,

        updateProductDetails,
        handleStockUpdate,
        handleAddImage,
        updateImage,
        deleteImage,
        addBenefit,
        removeBenefit,
        handleStockPageChange,
        handleStockLimitChange,
        setShowStockModal,
        setShowImageModal,
        goBack
    } = useProductDetail();

    if (isLoading) {
        return <ProductSkeleton />;
    }

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

            <PageHeader
                title={product.name}
                subtitle={` SKU: ${product.sku} | Última actualización: ${new Date(product.updatedAt).toLocaleString('es-ES')}`}
                variant="gradient"
                icon={Package}
                backUrl="/admin/ecommerce/productos"

            />

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
                                onAddImage={() => setShowImageModal(true)}
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
                                onUpdateStock={() => setShowStockModal(true)}
                                currentStock={product.stock}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <StockUpdateModal
                isOpen={showStockModal}
                onClose={() => setShowStockModal(false)}
                onSubmit={handleStockUpdate}
                form={stockForm}
                isSubmitting={isAddingStock}
                currentStock={product.stock}
            />

            <ImageUploadModal
                isOpen={showImageModal}
                onClose={() => setShowImageModal(false)}
                onUpload={handleAddImage}
                isSubmitting={isAddingImage}
                currentImagesCount={product.images.length}
            />
        </div>
    );
}