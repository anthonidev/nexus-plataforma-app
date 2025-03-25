"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  GetNodeWithContextResponse,
  GetUserTreeResponse,
} from "@/types/tree/tree.types";

/**
 * Obtiene el árbol de usuarios a partir de un ID de usuario raíz
 * @param userId ID del usuario raíz
 * @param depth Profundidad máxima del árbol (default: 3)
 * @returns Estructura del árbol y metadatos
 */
export async function getUserTree(
  userId: string,
  depth: number = 3
): Promise<GetUserTreeResponse> {
  try {
    return await httpClient<GetUserTreeResponse>(`/api/users/tree/${userId}`, {
      params: { depth },
    });
  } catch (error) {
    console.error(`Error al obtener árbol de usuario ${userId}:`, error);
    throw error;
  }
}

/**
 * Obtiene un nodo específico con sus ancestros y descendientes
 * @param nodeId ID del nodo a consultar
 * @param descendantDepth Profundidad máxima para descendientes (default: 3)
 * @param ancestorDepth Profundidad máxima para ancestros (default: 3)
 * @returns Contexto completo del nodo
 */
export async function getNodeWithContext(
  nodeId: string,
  descendantDepth: number = 3,
  ancestorDepth: number = 3
): Promise<GetNodeWithContextResponse> {
  try {
    return await httpClient<GetNodeWithContextResponse>(
      `/api/users/tree/node/${nodeId}`,
      {
        params: {
          descendantDepth,
          ancestorDepth,
        },
      }
    );
  } catch (error) {
    console.error(`Error al obtener contexto del nodo ${nodeId}:`, error);
    throw error;
  }
}
