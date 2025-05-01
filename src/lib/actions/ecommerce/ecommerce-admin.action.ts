"use server";
import { httpClient } from "@/lib/api/http-client";
import { ResponseCategories } from "@/types/ecommerce/admin/ecommerce-admin.type";

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
