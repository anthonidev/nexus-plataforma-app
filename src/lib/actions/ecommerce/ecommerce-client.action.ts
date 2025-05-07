"use server";
import { httpClient } from "@/lib/api/http-client";
import {
  ProductClientFilters,
  ProductDetailClientResponse,
  ProductsClientResponse,
} from "@/types/ecommerce/client/ecommerce.types";
import { revalidatePath } from "next/cache";

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
      "/api/products/list/with-clients",
      {
        params: filters as Record<string, unknown>,
      }
    );
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
}
interface OrderResponse {
  success: boolean;
  message: string;
  orderId?: number;
}

export async function createOrder(formData: FormData): Promise<OrderResponse> {
  try {
    const paymentsString = formData.get("payments") as string;
    const itemsString = formData.get("items") as string;
    const payments = JSON.parse(paymentsString);
    const items = JSON.parse(itemsString);
    const paymentImages = formData.getAll("paymentImages") as File[];

    if (!Array.isArray(payments) || payments.length === 0) {
      throw new Error("Debe proporcionar al menos un pago");
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Debe proporcionar al menos un producto");
    }

    if (paymentImages.length !== payments.length) {
      throw new Error(
        "El número de imágenes debe coincidir con el número de pagos"
      );
    }

    const totalAmount = parseFloat(formData.get("totalAmount") as string);
    const paymentTotal = payments.reduce(
      (sum: number, payment: any) => sum + payment.amount,
      0
    );

    if (Math.abs(totalAmount - paymentTotal) > 0.01) {
      throw new Error(
        `La suma de los pagos (${paymentTotal}) debe ser igual al monto total (${totalAmount})`
      );
    }

    const response = await httpClient<OrderResponse>("/api/orders/create", {
      method: "POST",
      body: formData,
      contentType: "multipart/form-data",
      skipJsonStringify: true,
    });

    revalidatePath("/mis-ordenes");
    revalidatePath("/tienda/carrito");

    return response;
  } catch (error) {
    console.error("Error al crear la orden:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "No se pudo procesar la orden. Inténtelo nuevamente.",
    };
  }
}
