"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getDetailProductClient } from "@/lib/actions/ecommerce/ecommerce-client.action";
import {
  Product,
  ProductDetailClientResponse,
} from "@/types/ecommerce/client/ecommerce.types";
import { useCartStore } from "@/context/CartStore";
import { useSession } from "next-auth/react";

export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState<boolean>(false);

  const { data: session } = useSession();
  const { addItem, isInCart, updateQuantity, getItemQuantity } = useCartStore();

  const hasMembership = session?.user?.membership?.hasMembership === true;

  const fetchProductDetail = useCallback(async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getDetailProductClient(productId);

      if (response.success && response.product) {
        setProduct(response.product);
        // Si hay imágenes, seleccionar la principal por defecto
        if (response.product.images && response.product.images.length > 0) {
          const mainImageIndex = response.product.images.findIndex(
            (img) => img.isMain
          );
          setSelectedImage(mainImageIndex !== -1 ? mainImageIndex : 0);
        }
      } else {
        setError("Error al cargar los detalles del producto");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Error al cargar los detalles del producto`;

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  // Manejar selección de imágenes
  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };

  // Manejar apertura/cierre del visor de imágenes
  const toggleImageViewer = () => {
    setIsImageViewerOpen(!isImageViewerOpen);
  };

  // Navegación entre imágenes
  const goToNextImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const goToPrevImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Funciones para el carrito
  const handleAddToCart = () => {
    if (!product) return;

    const effectivePrice = hasMembership
      ? product.memberPrice
      : product.publicPrice;

    addItem({
      id: product.id,
      name: product.name,
      price: effectivePrice,
      image: product.images[0]?.url || "",
      quantity: 1,
    });

    toast.success(`${product.name} añadido al carrito`);
  };

  const quantity = product ? getItemQuantity(product.id) : 0;
  const isProductInCart = product ? isInCart(product.id) : false;

  const handleIncrement = () => {
    if (!product) return;
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (!product) return;
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      updateQuantity(product.id, 0);
    }
  };

  return {
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
    refresh: fetchProductDetail,
  };
}
