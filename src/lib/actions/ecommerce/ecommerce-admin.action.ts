"use server";
import { httpClient } from "@/lib/api/http-client";
import { ResponseCategories } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { revalidatePath } from "next/cache";

export async function getCategoriesEcommerce(): Promise<ResponseCategories> {
  try {
    return await httpClient<ResponseCategories>("/api/ecommerce/categories", {
      method: "GET",
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
}

export async function createProduct(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const images = formData.getAll("productImages") as File[];
    if (!images || images.length === 0) {
      throw new Error("Debe proporcionar al menos una imagen para el producto");
    }

    const categoryId = formData.get("categoryId");
    if (!categoryId || isNaN(Number(categoryId)) || Number(categoryId) <= 0) {
      throw new Error("Debe seleccionar una categoría válida");
    }

    const memberPrice = parseFloat(formData.get("memberPrice") as string);
    const publicPrice = parseFloat(formData.get("publicPrice") as string);

    if (isNaN(memberPrice) || memberPrice < 0) {
      throw new Error(
        "El precio de socio debe ser un número válido no negativo"
      );
    }

    if (isNaN(publicPrice) || publicPrice < 0) {
      throw new Error(
        "El precio público debe ser un número válido no negativo"
      );
    }

    const benefitsData = formData.get("benefits") as string;
    if (benefitsData) {
      try {
        JSON.parse(benefitsData);
      } catch (error) {
        throw new Error("El formato de los beneficios es inválido");
      }
    }

    console.log("Enviando datos del producto:", Object.fromEntries(formData));

    const response = await httpClient<{
      success: boolean;
      message: string;
    }>("/api/ecommerce/products", {
      method: "POST",
      body: formData,
      contentType: "multipart/form-data",
      skipJsonStringify: true,
    });

    console.log("Respuesta del servidor:", response);

    revalidatePath("/admin/ecommerce/productos");

    return response;
  } catch (error) {
    console.error("Error al crear el producto:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al registrar el producto. Inténtelo nuevamente.",
    };
  }
}
