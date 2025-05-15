"use client";

import { useParams, useRouter } from "next/navigation";
import { useProductDetail } from "../../../hooks/useProductDetail";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { ShoppingBag, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { ProductDetailSkeleton } from "../../../components/ProductDetailSkeleton";
import { ProductDetailError } from "../../../components/ProductDetailError";
import { ProductImageGallery } from "../../../components/ProductImageGallery";
import { ProductDetailsCard } from "../../../components/ProductDetailsCard";
import { ProductAdditionalInfo } from "../../../components/ProductAdditionalInfo";
import { ImageViewer } from "../../../components/ImageViewer";

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const productId = Number(params.id);
    const router = useRouter();

    const {
        product,
        isLoading,
        error,
        selectedImage,
        isImageViewerOpen,
        quantity,
        isProductInCart,
        hasMembership,
        handleImageSelect,
        toggleImageViewer,
        goToNextImage,
        goToPrevImage,
        handleAddToCart,
        handleIncrement,
        handleDecrement,
        refresh,
    } = useProductDetail(productId);

    const handleBack = () => {
        router.push("/tienda/productos");
    };

    if (isLoading) {
        return <ProductDetailSkeleton />;
    }

    if (error || !product) {
        return <ProductDetailError error={error} onBack={handleBack} onRetry={refresh} />;
    }

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6">
            <PageHeader
                title={product.name}
                subtitle={`Categoría: ${product.category.name}`}
                variant="gradient"
                icon={ShoppingBag}
                backUrl="/tienda/productos"
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

            {/* Sección principal: Galería y detalles básicos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6"
            >
                {/* Imágenes del producto */}
                <div className="md:col-span-7">
                    <ProductImageGallery
                        product={product}
                        selectedImage={selectedImage}
                        handleImageSelect={handleImageSelect}
                        goToNextImage={goToNextImage}
                        goToPrevImage={goToPrevImage}
                        toggleImageViewer={toggleImageViewer}
                    />
                </div>

                {/* Detalles básicos del producto */}
                <div className="md:col-span-5">
                    <ProductDetailsCard
                        product={product}
                        hasMembership={hasMembership}
                        isProductInCart={isProductInCart}
                        quantity={quantity}
                        handleAddToCart={handleAddToCart}
                        handleIncrement={handleIncrement}
                        handleDecrement={handleDecrement}
                    />
                </div>
            </motion.div>

            {/* Sección adicional: Composición y beneficios (a ancho completo debajo) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <ProductAdditionalInfo product={product} />
            </motion.div>

            {/* Visor de imágenes ampliadas */}
            <ImageViewer
                isOpen={isImageViewerOpen}
                product={product}
                selectedImage={selectedImage}
                onClose={toggleImageViewer}
                goToNextImage={goToNextImage}
                goToPrevImage={goToPrevImage}
                handleImageSelect={handleImageSelect}
            />
        </div>
    );
}