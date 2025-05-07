"use server";
import { httpClient } from "@/lib/api/http-client";
import {
  ProductClientFilters,
  ProductDetailClientResponse,
  ProductsClientResponse,
} from "@/types/ecommerce/client/ecommerce.types";

export async function getDetailProductClient(id: number) {
  try {
    return await httpClient<ProductDetailClientResponse>(
      `/api/products/${id}/item/with-clients`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
}

export async function getProductsClient(
  filters?: ProductClientFilters
): Promise<ProductsClientResponse> {
  try {
    return await httpClient<ProductsClientResponse>(
      "/api/products/list/with-clients?isActive=true",
      {
        params: filters as Record<string, unknown>,
      }
    );
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}
