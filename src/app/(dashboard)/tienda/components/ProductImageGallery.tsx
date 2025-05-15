"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/ecommerce/client/ecommerce.types";

interface ProductImageGalleryProps {
    product: Product;
    selectedImage: number;
    handleImageSelect: (index: number) => void;
    goToNextImage: () => void;
    goToPrevImage: () => void;
    toggleImageViewer: () => void;
}

export function ProductImageGallery({
    product,
    selectedImage,
    handleImageSelect,
    goToNextImage,
    goToPrevImage,
    toggleImageViewer,
}: ProductImageGalleryProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* Miniaturas - vertical en el lado izquierdo */}
            {product.images && product.images.length > 1 && (
                <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0 md:pr-2">
                    {product.images.map((image, index) => (
                        <motion.div
                            key={image.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${selectedImage === index
                                ? "ring-2 ring-primary ring-offset-2 shadow-lg  outline-1 outline-primary/50"
                                : "border border-gray-200 opacity-70 hover:opacity-100 hover:shadow-md hover:border-primary/30"
                                }`}
                            onClick={() => handleImageSelect(index)}
                        >
                            <Image
                                src={image.url}
                                alt={`${product.name} - imagen ${index + 1}`}
                                fill
                                className={`object-cover transition-transform duration-300 ${selectedImage === index ? "scale-105" : "scale-100"
                                    }`}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Imagen principal */}
            <div className="order-1 md:order-2 flex-1 relative">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    {product.images && product.images.length > 0 ? (
                        <div className="relative w-full h-full cursor-pointer" onClick={toggleImageViewer}>
                            <Image
                                src={product.images[selectedImage]?.url || ""}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Package className="h-24 w-24 text-muted-foreground" />
                        </div>
                    )}

                    {/* Botones de navegación mejorados */}
                    {product.images && product.images.length > 1 && (
                        <>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-white shadow-lg rounded-full h-10 w-10 opacity-80 hover:opacity-100 transition-all border border-gray-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrevImage();
                                }}
                            >
                                <ChevronLeft className="h-5 w-5 text-primary" />
                            </Button>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-white shadow-lg rounded-full h-10 w-10 opacity-80 hover:opacity-100 transition-all border border-gray-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNextImage();
                                }}
                            >
                                <ChevronRight className="h-5 w-5 text-primary" />
                            </Button>
                        </>
                    )}
                </div>

                {/* Indicador "Haz clic para ampliar" */}
                {product.images && product.images.length > 0 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="mr-1">Ampliar</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 21H3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 3L14 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}