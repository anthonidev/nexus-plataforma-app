"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Product } from "@/types/ecommerce/client/ecommerce.types";

interface ImageViewerProps {
    isOpen: boolean;
    product: Product;
    selectedImage: number;
    onClose: () => void;
    goToNextImage: () => void;
    goToPrevImage: () => void;
    handleImageSelect: (index: number) => void;
}

export function ImageViewer({
    isOpen,
    product,
    selectedImage,
    onClose,
    goToNextImage,
    goToPrevImage,
    handleImageSelect,
}: ImageViewerProps) {
    if (!product.images || product.images.length === 0) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                        onClick={onClose}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto">
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={product.images[selectedImage]?.url || ""}
                                alt={product.name}
                                fill
                                className="object-contain"
                            />
                        </motion.div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full h-12 w-12 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrevImage();
                            }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full h-12 w-12 text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNextImage();
                            }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                        <div className="flex gap-2 px-4 py-2 bg-black/50 rounded-full">
                            {product.images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${selectedImage === index ? "bg-white" : "bg-white/40"
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleImageSelect(index);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}