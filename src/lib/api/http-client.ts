import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { createApiUrl } from ".";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, unknown>;
  cache?: RequestCache;
  contentType?: string;
  skipJsonStringify?: boolean;
}

export async function httpClient<T>(
  endpoint: string,
  {
    method = "GET",
    body,
    params,
    cache = "no-store",
    contentType = "application/json",
    skipJsonStringify = false,
  }: FetchOptions = {}
): Promise<T> {
  // Intentar obtener la sesión, pero continuar incluso si no hay sesión
  const session = await getServerSession(authOptions);

  const queryParams = params
    ? new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      )
    : undefined;

  const url = createApiUrl(endpoint, queryParams);

  // Inicializar headers
  const headers: HeadersInit = {};

  // Agregar token de autorización solo si existe
  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`;
  }

  // Establecer Content-Type si no es FormData
  if (!(body instanceof FormData)) {
    headers["Content-Type"] = contentType;
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (skipJsonStringify || body instanceof FormData) {
      requestBody = body as BodyInit;
    } else {
      requestBody = JSON.stringify(body);
    }
  }

  const options: RequestInit = {
    method,
    headers,
    body: requestBody,
    cache,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.json();
      throw new Error(`${errorText.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}
