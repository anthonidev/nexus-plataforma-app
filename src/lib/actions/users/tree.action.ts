"use server";

import { httpClient } from "@/lib/api/http-client";
import {
  GetNodeWithContextResponse,
  GetUserTreeResponse,
} from "@/types/tree/tree.types";

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
