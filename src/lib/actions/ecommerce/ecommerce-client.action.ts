"use server";
import { MethodPayment } from "@/app/(dashboard)/tienda/hooks/useCartCheckout";
import { httpClient } from "@/lib/api/http-client";
import {
  OrderDetailClientResponse,
  OrdersClientResponse,
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
    const methodPayment = formData.get("methodPayment") as MethodPayment;

    // Validar los datos según el método de pago
    if (methodPayment === MethodPayment.VOUCHER) {
      const paymentsString = formData.get("payments") as string;
      const payments = JSON.parse(paymentsString);
      const paymentImages = formData.getAll("paymentImages") as File[];

      if (!Array.isArray(payments) || payments.length === 0) {
        throw new Error("Debe proporcionar al menos un pago");
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
    }

    // Validar items del carrito
    const itemsString = formData.get("items") as string;
    const items = JSON.parse(itemsString);

    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Debe proporcionar al menos un producto");
    }

    // Realizar la petición al backend
    const response = await httpClient<OrderResponse>("/api/orders/create", {
      method: "POST",
      body: formData,
      contentType: "multipart/form-data",
      skipJsonStringify: true,
    });

    revalidatePath("/tienda/pedidos");
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
export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export async function getMyOrdersClient(
  filters?: OrderFilters
): Promise<OrdersClientResponse> {
  try {
    return await httpClient<OrdersClientResponse>(
      "/api/orders/list/with-clients",
      {
        method: "GET",
        params: filters as Record<string, unknown>,
      }
    );
  } catch (error) {
    console.error("Error al obtener las órdenes del cliente:", error);
    throw error;
  }
}

export async function getOrderDetailClient(
  id: number
): Promise<OrderDetailClientResponse> {
  try {
    return await httpClient<OrderDetailClientResponse>(
      `/api/orders/${id}/item/with-clients`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error al obtener el detalle de la orden:", error);
    throw error;
  }
}
