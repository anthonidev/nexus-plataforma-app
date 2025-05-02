"use client";

import {
  createProduct,
  getCategoriesEcommerce,
} from "@/lib/actions/ecommerce/ecommerce-admin.action";
import { Category } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ProductFormSchema,
  ProductFormType,
  ProductImageType,
} from "../validations/product.zod";

export function useProductRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [images, setImages] = useState<ProductImageType[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredProductName, setRegisteredProductName] = useState("");

  const form = useForm<ProductFormType>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      memberPrice: 0,
      publicPrice: 0,
      stock: 0,
      benefits: [],
      categoryId: 0,
      isActive: true,
      images: [],
    },
  });

  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const response = await getCategoriesEcommerce();
      if (response.success) {
        setCategories(response.categories.filter((cat) => cat.isActive));
      }
    } catch (error) {
      toast.error("Error al cargar las categorías");
      console.error(error);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addImage = (imageFile: File) => {
    if (images.length >= 5) {
      toast.error("Máximo 5 imágenes permitidas");
      return;
    }

    const newImage: ProductImageType = { file: imageFile };
    const updatedImages = [...images, newImage];
    setImages(updatedImages);
    form.setValue("images", updatedImages);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    form.setValue("images", updatedImages);
  };

  const addBenefit = () => {
    const currentBenefits = form.getValues("benefits") || [];
    form.setValue("benefits", [...currentBenefits, { benefit: "" }]);
  };

  const removeBenefit = (index: number) => {
    const currentBenefits = form.getValues("benefits") || [];
    const updatedBenefits = currentBenefits.filter((_, i) => i !== index);
    form.setValue("benefits", updatedBenefits);
  };

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      memberPrice: 0,
      publicPrice: 0,
      stock: 0,
      benefits: [],
      categoryId: 0,
      isActive: true,
      images: [],
    });
    setImages([]);
    setShowSuccessModal(false);
  };

  const onSubmit = async (data: ProductFormType) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("memberPrice", data.memberPrice.toString());
      formData.append("publicPrice", data.publicPrice.toString());

      if (data.stock !== undefined && data.stock !== null) {
        formData.append("stock", data.stock.toString());
      }

      if (data.benefits && data.benefits.length > 0) {
        const benefitsArray = data.benefits.map((b) => b.benefit);
        formData.append("benefits", JSON.stringify(benefitsArray));
      }

      formData.append("categoryId", data.categoryId.toString());
      formData.append("isActive", data.isActive ? "true" : "false");

      data.images.forEach((image) => {
        formData.append("productImages", image.file);
      });

      const response = await createProduct(formData);

      if (response.success) {
        setRegisteredProductName(data.name);
        setShowSuccessModal(true);
      } else {
        toast.error(response.message || "Error al registrar el producto");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al registrar el producto";
      console.error("ERROR ", errorMessage);
      toast.error(errorMessage);
      console.error("Error al registrar producto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleNewProduct = () => {
    resetForm();
  };

  return {
    form,
    categories,
    loadingCategories,
    images,
    isLoading,
    showSuccessModal,
    registeredProductName,
    addImage,
    removeImage,
    addBenefit,
    removeBenefit,
    closeSuccessModal,
    handleNewProduct,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
