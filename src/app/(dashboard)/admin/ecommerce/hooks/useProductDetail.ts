"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  getDetailProduct,
  getListStockHistory,
  updateProduct,
  deleteImageProduct,
  updateImageProduct,
  getCategoriesEcommerce,
} from "@/lib/actions/ecommerce/ecommerce-admin.action";
import {
  Category,
  ProductDetailAdmin,
  ImageProduct,
} from "@/types/ecommerce/admin/ecommerce-admin.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Definir schema de Zod para la actualización
const UpdateProductSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del producto es requerido")
    .max(200, "El nombre no puede tener más de 200 caracteres")
    .transform((val) => val.trim()),

  description: z
    .string()
    .min(1, "La descripción del producto es requerida")
    .transform((val) => val.trim()),

  memberPrice: z
    .number()
    .min(0, "El precio de socio no puede ser negativo")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El precio debe tener máximo 2 decimales",
    }),

  publicPrice: z
    .number()
    .min(0, "El precio público no puede ser negativo")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El precio debe tener máximo 2 decimales",
    }),

  benefits: z.array(z.string()).optional(),
  categoryId: z.number().min(1, "Debe seleccionar una categoría"),
  isActive: z.boolean().default(true),
});

// Interfaz para el stock history
interface StockHistoryItem {
  id: number;
  actionType: string;
  previousQuantity: number;
  newQuantity: number;
  quantityChanged: number;
  notes: string;
  createdAt: Date;
  updatedBy: {
    id: string;
    email: string;
  };
}

interface StockHistoryMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export type UpdateProductFormType = z.infer<typeof UpdateProductSchema>;

export function useProductDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = parseInt(params.id);

  // Estados
  const [product, setProduct] = useState<ProductDetailAdmin | null>(null);
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([]);
  const [stockHistoryMeta, setStockHistoryMeta] =
    useState<StockHistoryMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [benefitsList, setBenefitsList] = useState<string[]>([]);
  const [stockPage, setStockPage] = useState(1);
  const [stockLimit, setStockLimit] = useState(10);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  // Form para edición del producto
  const form = useForm<UpdateProductFormType>({
    resolver: zodResolver(UpdateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      memberPrice: 0,
      publicPrice: 0,
      benefits: [],
      categoryId: 0,
      isActive: true,
    },
  });

  // Cargar categorías
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategoriesEcommerce();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  }, []);

  // Cargar detalles del producto
  const fetchProductDetails = useCallback(async () => {
    if (isNaN(productId)) {
      setError("ID de producto inválido");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getDetailProduct(productId);

      if (response.success && response.product) {
        setProduct(response.product);

        // Preparar datos para el formulario
        form.reset({
          name: response.product.name,
          description: response.product.description,
          memberPrice: response.product.memberPrice,
          publicPrice: response.product.publicPrice,
          benefits: response.product.benefits || [],
          categoryId: response.product.category.id,
          isActive: response.product.isActive,
        });

        setBenefitsList(response.product.benefits || []);
      } else {
        setError("No se pudo cargar el producto");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar el producto";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [productId, form]);

  // Cargar historial de stock
  const fetchStockHistory = useCallback(async () => {
    if (isNaN(productId)) return;

    try {
      const response = await getListStockHistory(
        productId,
        stockPage,
        stockLimit
      );
      if (response.success) {
        setStockHistory(response.items);
        setStockHistoryMeta(response.meta);
      }
    } catch (err) {
      console.error("Error al cargar historial de stock:", err);
    }
  }, [productId, stockPage, stockLimit]);

  // Actualizar el producto
  const updateProductDetails = async (data: UpdateProductFormType) => {
    if (isNaN(productId)) return;

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Añadir los campos del formulario al FormData
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("memberPrice", data.memberPrice.toString());
      formData.append("publicPrice", data.publicPrice.toString());
      formData.append("categoryId", data.categoryId.toString());
      formData.append("isActive", data.isActive ? "true" : "false");

      // Añadir beneficios como array JSON
      if (data.benefits && data.benefits.length > 0) {
        formData.append("benefits", JSON.stringify(data.benefits));
      }

      const response = await updateProduct(productId, formData);

      if (response.success) {
        toast.success("Producto actualizado correctamente");
        await fetchProductDetails(); // Recargar los datos
      } else {
        toast.error(response.message || "Error al actualizar el producto");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar el producto";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Actualizar imagen
  const updateImage = async (
    imageId: number,
    isMain: boolean,
    order: number
  ) => {
    if (isNaN(productId)) return;

    try {
      const formData = new FormData();
      formData.append("isMain", isMain.toString());
      formData.append("order", order.toString());

      const response = await updateImageProduct(productId, imageId, formData);

      if (response.success) {
        toast.success("Imagen actualizada correctamente");
        await fetchProductDetails(); // Recargar los datos
      } else {
        toast.error(response.message || "Error al actualizar la imagen");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar la imagen";
      toast.error(errorMessage);
    }
  };

  // Eliminar imagen
  const deleteImage = async (imageId: number) => {
    if (isNaN(productId)) return;

    try {
      setImageToDelete(imageId);
      const response = await deleteImageProduct(productId, imageId);

      if (response.success) {
        toast.success("Imagen eliminada correctamente");
        await fetchProductDetails(); // Recargar los datos
      } else {
        toast.error(response.message || "Error al eliminar la imagen");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar la imagen";
      toast.error(errorMessage);
    } finally {
      setImageToDelete(null);
    }
  };

  // Manejo de beneficios
  const addBenefit = (benefit: string) => {
    if (!benefit.trim()) return;

    const updatedBenefits = [...benefitsList, benefit];
    setBenefitsList(updatedBenefits);
    form.setValue("benefits", updatedBenefits);
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = benefitsList.filter((_, i) => i !== index);
    setBenefitsList(updatedBenefits);
    form.setValue("benefits", updatedBenefits);
  };

  // Manejo de paginación para historial de stock
  const handleStockPageChange = (page: number) => {
    setStockPage(page);
  };

  const handleStockLimitChange = (limit: number) => {
    setStockLimit(limit);
    setStockPage(1);
  };

  // Efectos para cargar datos
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  useEffect(() => {
    fetchStockHistory();
  }, [fetchStockHistory]);

  // Devolver todos los estados y funciones necesarias
  return {
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
    updateProductDetails: form.handleSubmit(updateProductDetails),
    updateImage,
    deleteImage,
    addBenefit,
    removeBenefit,
    handleStockPageChange,
    handleStockLimitChange,
    goBack: () => router.back(),
  };
}
