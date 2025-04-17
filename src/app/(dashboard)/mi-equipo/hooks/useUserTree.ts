import {
  getNodeWithContext,
  getUserTree,
} from "@/lib/actions/users/tree.action";
import { NodeContext, TreeNode } from "@/types/tree/tree.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useUserTree(userId: string, initialDepth: number = 2) {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [treeLoading, setTreeLoading] = useState<boolean>(true);
  const [treeError, setTreeError] = useState<string | null>(null);
  const [treeMetadata, setTreeMetadata] = useState<any>(null);

  const [currentNodeId, setCurrentNodeId] = useState<string>(userId);
  const [nodeContext, setNodeContext] = useState<NodeContext | null>(null);
  const [nodeLoading, setNodeLoading] = useState<boolean>(true);
  const [nodeError, setNodeError] = useState<string | null>(null);
  const [nodeMetadata, setNodeMetadata] = useState<any>(null);

  const [descendantDepth, setDescendantDepth] = useState<number>(initialDepth);
  const [ancestorDepth, setAncestorDepth] = useState<number>(3);

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

  useEffect(() => {
    fetchUserTree();
  }, [fetchUserTree]);

  useEffect(() => {
    fetchNodeContext(currentNodeId);
  }, [currentNodeId, fetchNodeContext]);

  const navigateToNode = useCallback((nodeId: string) => {
    setCurrentNodeId(nodeId);
  }, []);

  const navigateToParent = useCallback(() => {
    if (nodeContext?.ancestors && nodeContext.ancestors.length > 0) {
      const parentId = nodeContext.ancestors[0].id;
      setCurrentNodeId(parentId);
    } else {
      toast.info("Este nodo no tiene un padre para navegar");
    }
  }, [nodeContext]);

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

  const navigateToRoot = useCallback(() => {
    setCurrentNodeId(userId);
  }, [userId]);

  const changeTreeDepth = useCallback(
    (newDepth: number) => {
      setDescendantDepth(newDepth);
      if (currentNodeId) {
        fetchNodeContext(currentNodeId, newDepth, ancestorDepth);
      }
      fetchUserTree(newDepth);
    },
    [currentNodeId, userId, ancestorDepth, fetchNodeContext, fetchUserTree]
  );

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
