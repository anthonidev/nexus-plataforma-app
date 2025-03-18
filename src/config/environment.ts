if (!process.env.API_BACKENDL_URL) {
  throw new Error(
    "API_BACKENDL_URL no está definida en las variables de entorno"
  );
}
export const env = {
  apiUrl: process.env.API_BACKENDL_URL,
} as const;
