"use server";
import {
  StockUpdateFormType,
  UpdateProductFormType,
} from "@/app/(dashboard)/admin/ecommerce/hooks/useProductDetail";
import { httpClient } from "@/lib/api/http-client";
import {
  DetailOrderAdminResponse,
  DetailProductAdminResponse,
  ListOrdersAdminResponse,
  ProductAdminFilters,
  ProductsAdminResponse,
  ResponseCategories,
  StockProductResponse,
} from "@/types/ecommerce/admin/ecommerce-admin.type";
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
export async function getProducts(
  filters?: ProductAdminFilters
): Promise<ProductsAdminResponse> {
  try {
    return await httpClient<ProductsAdminResponse>("/api/products", {
      params: filters as Record<string, unknown>,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}

export async function getDetailProduct(id: number) {
  try {
    return await httpClient<DetailProductAdminResponse>(`/api/products/${id}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
}

export async function getListStockHistory(
  id: number,
  page: number = 1,
  limit: number = 10
) {
  try {
    return await httpClient<StockProductResponse>(
      `/api/products/${id}/stock-history`,
      {
        method: "GET",
        params: { page, limit },
      }
    );
  } catch (error) {
    console.error("Error al obtener el historial de stock:", error);
    throw error;
  }
}

export async function updateProduct(
  id: number,
  data: UpdateProductFormType
): Promise<{ success: boolean; message: string }> {
  try {
    const categoryId = data.categoryId;
    if (!categoryId || isNaN(Number(categoryId)) || Number(categoryId) <= 0) {
      throw new Error("Debe seleccionar una categoría válida");
    }

    if (isNaN(data.memberPrice) || data.memberPrice < 0) {
      throw new Error(
        "El precio de socio debe ser un número válido no negativo"
      );
    }

    if (isNaN(data.publicPrice) || data.publicPrice < 0) {
      throw new Error(
        "El precio público debe ser un número válido no negativo"
      );
    }

    const response = await httpClient<{
      success: boolean;
      message: string;
    }>(`/api/ecommerce/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      contentType: "application/json",
      skipJsonStringify: true,
    });

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

export async function updateImageProduct(
  productId: number,
  imageId: number,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await httpClient<{
      success: boolean;
      message: string;
    }>(`/api/ecommerce/products/${productId}/images/${imageId}`, {
      method: "PATCH",
      body: formData,
      skipJsonStringify: true,
    });

    return response;
  } catch (error) {
    console.error("Error al actualizar la imagen del producto:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar la imagen del producto. Inténtelo nuevamente.",
    };
  }
}
export async function addImageProduct(
  productId: number,
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await httpClient<{
      success: boolean;
      message: string;
    }>(`/api/ecommerce/products/${productId}/images`, {
      method: "POST",
      body: formData,
      skipJsonStringify: true,
    });

    return response;
  } catch (error) {
    console.error("Error al agregar la imagen del producto:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al agregar la imagen del producto. Inténtelo nuevamente.",
    };
  }
}

export async function deleteImageProduct(
  productId: number,
  imageId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await httpClient<{
      success: boolean;
      message: string;
    }>(`/api/ecommerce/products/${productId}/images/${imageId}`, {
      method: "DELETE",
    });

    return response;
  } catch (error) {
    console.error("Error al eliminar la imagen del producto:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al eliminar la imagen del producto. Inténtelo nuevamente.",
    };
  }
}

export async function addStockProduct(
  productId: number,
  data: StockUpdateFormType
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await httpClient<{
      success: boolean;
      message: string;
    }>(`/api/ecommerce/products/${productId}/stock-history`, {
      method: "POST",
      body: JSON.stringify(data),
      contentType: "application/json",
      skipJsonStringify: true,
    });

    return response;
  } catch (error) {
    console.error("Error al agregar stock al producto:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al agregar stock al producto. Inténtelo nuevamente.",
    };
  }
}

export async function listOrdersAdmin(
  filters?: ProductAdminFilters
): Promise<ListOrdersAdminResponse> {
  try {
    return await httpClient<ListOrdersAdminResponse>("/api/orders/list", {
      params: filters as Record<string, unknown>,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}

export async function getOrderDetail(
  id: number
): Promise<DetailOrderAdminResponse> {
  try {
    return await httpClient<DetailOrderAdminResponse>(
      `/api/orders/${id}/item`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  id: number,
  status: "ENVIADO" | "ENTREGADO"
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await httpClient<{
      success: boolean;
      message: string;
    }>(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      contentType: "application/json",
      skipJsonStringify: true,
    });

    return response;
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Error al actualizar el estado del pedido. Inténtelo nuevamente.",
    };
  }
}
