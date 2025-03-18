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
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("No autorizado");
  const queryParams = params
    ? new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      )
    : undefined;
  const url = createApiUrl(endpoint, queryParams);
  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`,
  };
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
      throw new Error(` ${errorText.message || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
}
