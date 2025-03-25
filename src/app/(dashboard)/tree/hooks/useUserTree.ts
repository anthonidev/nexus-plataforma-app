import {
  getNodeWithContext,
  getUserTree,
} from "@/lib/actions/users/tree.action";
import { NodeContext, TreeNode } from "@/types/tree/tree.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Hook personalizado para manejar la navegación y visualización del árbol de usuario
 * @param userId ID del usuario logueado o punto de inicio para visualizar el árbol (obligatorio)
 * @param initialDepth Profundidad inicial del árbol (por defecto: 3)
 */
export function useUserTree(userId: string, initialDepth: number = 3) {
  // Estados para el árbol completo
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [treeLoading, setTreeLoading] = useState<boolean>(true);
  const [treeError, setTreeError] = useState<string | null>(null);
  const [treeMetadata, setTreeMetadata] = useState<any>(null);

  // Estados para el nodo actual y su contexto
  const [currentNodeId, setCurrentNodeId] = useState<string>(userId);
  const [nodeContext, setNodeContext] = useState<NodeContext | null>(null);
  const [nodeLoading, setNodeLoading] = useState<boolean>(true);
  const [nodeError, setNodeError] = useState<string | null>(null);
  const [nodeMetadata, setNodeMetadata] = useState<any>(null);

  // Configuración de profundidad
  const [descendantDepth, setDescendantDepth] = useState<number>(initialDepth);
  const [ancestorDepth, setAncestorDepth] = useState<number>(3);

  /**
   * Función para cargar el árbol completo desde el usuario raíz
   */
  const fetchUserTree = useCallback(
    async (depth: number = descendantDepth) => {
      try {
        setTreeError(null);
        setTreeLoading(true);
        const response = await getUserTree(userId, depth);
        console.log("Árbol de usuarios cargado:", response);
        setTreeData(response.tree);
        setTreeMetadata(response.metadata);
      } catch (err) {
        console.error("Error al cargar el árbol de usuarios:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar el árbol de usuarios";
        setTreeError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setTreeLoading(false);
      }
    },
    [userId, descendantDepth]
  );

  /**
   * Función para cargar un nodo específico con su contexto
   */
  const fetchNodeContext = useCallback(
    async (
      nodeId: string = currentNodeId,
      descDepth: number = descendantDepth,
      ancDepth: number = ancestorDepth
    ) => {
      try {
        setNodeError(null);
        setNodeLoading(true);
        const response = await getNodeWithContext(nodeId, descDepth, ancDepth);
        setNodeContext(response);
        setNodeMetadata(response.metadata);
        // Actualizar el ID del nodo actual
        setCurrentNodeId(nodeId);
      } catch (err) {
        console.error(`Error al cargar el contexto del nodo ${nodeId}:`, err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar el contexto del nodo";
        setNodeError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setNodeLoading(false);
      }
    },
    [currentNodeId, userId, descendantDepth, ancestorDepth]
  );

  // Cargar el árbol inicial cuando se monta el componente
  useEffect(() => {
    fetchUserTree();
  }, [fetchUserTree]);

  // Cargar el contexto del nodo cuando cambia el nodo actual
  useEffect(() => {
    fetchNodeContext(currentNodeId);
  }, [currentNodeId, fetchNodeContext]);

  /**
   * Navegar a un nodo específico
   */
  const navigateToNode = useCallback((nodeId: string) => {
    setCurrentNodeId(nodeId);
  }, []);

  /**
   * Navegar al padre del nodo actual
   */
  const navigateToParent = useCallback(() => {
    if (nodeContext?.ancestors && nodeContext.ancestors.length > 0) {
      // El primer ancestro es el padre inmediato
      const parentId = nodeContext.ancestors[0].id;
      setCurrentNodeId(parentId);
    } else {
      toast.info("Este nodo no tiene un padre para navegar");
    }
  }, [nodeContext]);

  /**
   * Navegar a un hijo específico (izquierdo o derecho)
   */
  const navigateToChild = useCallback(
    (position: "left" | "right") => {
      if (nodeContext?.node?.children?.[position]) {
        const childId = nodeContext.node.children[position]?.id;
        if (childId) {
          setCurrentNodeId(childId);
        }
      } else {
        toast.info(
          `No hay un hijo ${
            position === "left" ? "izquierdo" : "derecho"
          } para navegar`
        );
      }
    },
    [nodeContext]
  );

  /**
   * Navegar a un hermano (izquierdo o derecho)
   */
  const navigateToSibling = useCallback(
    (position: "left" | "right") => {
      if (nodeContext?.siblings?.[position]) {
        const siblingId = nodeContext.siblings[position]?.id;
        if (siblingId) {
          setCurrentNodeId(siblingId);
        }
      } else {
        toast.info(
          `No hay un hermano ${
            position === "left" ? "izquierdo" : "derecho"
          } para navegar`
        );
      }
    },
    [nodeContext]
  );

  /**
   * Navegar al nodo raíz del árbol
   */
  const navigateToRoot = useCallback(() => {
    setCurrentNodeId(userId);
  }, [userId]);

  /**
   * Cambiar la profundidad de visualización del árbol
   */
  const changeTreeDepth = useCallback(
    (newDepth: number) => {
      setDescendantDepth(newDepth);
      // Si hay un nodo actual, actualizar su visualización con la nueva profundidad
      if (currentNodeId) {
        fetchNodeContext(currentNodeId, newDepth, ancestorDepth);
      }
      // También actualizar el árbol completo
      fetchUserTree(newDepth);
    },
    [currentNodeId, userId, ancestorDepth, fetchNodeContext, fetchUserTree]
  );

  /**
   * Actualizar la visualización con los valores actuales
   */
  const refreshTree = useCallback(() => {
    fetchUserTree();
    if (currentNodeId) {
      fetchNodeContext(currentNodeId);
    }
  }, [fetchUserTree, fetchNodeContext, currentNodeId]);

  return {
    // Datos del árbol completo
    treeData,
    treeLoading,
    treeError,
    treeMetadata,

    // Datos del nodo actual
    currentNodeId,
    nodeContext,
    nodeLoading,
    nodeError,
    nodeMetadata,

    // Funciones de navegación
    navigateToNode,
    navigateToParent,
    navigateToChild,
    navigateToSibling,
    navigateToRoot,

    // Funciones de actualización
    fetchUserTree,
    fetchNodeContext,
    refreshTree,

    // Configuración de visualización
    descendantDepth,
    ancestorDepth,
    setAncestorDepth,
    changeTreeDepth,
  };
}
