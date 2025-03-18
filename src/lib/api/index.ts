import { env } from "@/config/environment";
export const createApiUrl = (endpoint: string, params?: URLSearchParams) => {
  const baseUrl = `${env.apiUrl}${endpoint}`;
  return params?.toString() ? `${baseUrl}?${params}` : baseUrl;
};
