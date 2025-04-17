import { Button } from "@/components/ui/button";
import {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MarkerType,
  Node,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import { useUserTree } from "../hooks/useUserTree";
import NodeDetailSheet from "./detail/NodeDetailSheet";
import TreeControls from "./controls";
import { TreeNode } from "@/types/tree/tree.types";

// Componente personalizado para los nodos
const CustomNode = ({ data }: {
  data: {
    label: string;
    initials: string;
    email: string;
    referralCode: string;
    position: string;
    isActive: boolean;
    isCurrent: boolean;
    depth: number;
    membership?: {
      plan?: { name: string };
      status?: string;
    };
    rank?: string;
  };
}) => {
  return (
    <div
      className={`p-3 rounded-lg border-2 text-center shadow-sm max-w-[180px] w-full ${data.isCurrent
        ? "border-primary bg-primary/5"
        : "border-border hover:border-primary/50 hover:bg-muted/50"
        } ${!data.isActive ? "opacity-70" : ""}`}
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={`rounded-full overflow-hidden flex items-center justify-center h-10 w-10 bg-gradient-to-br from-muted to-muted/50 ${data.isCurrent ? "ring-2 ring-primary ring-offset-1" : ""
            }`}
        >
          <div className="text-xl font-medium">{data.initials}</div>
        </div>

        <div className="space-y-1">
          <p className="font-medium truncate">{data.label}</p>
          <div className="flex items-center justify-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${data.isActive ? "bg-green-500" : "bg-red-500"
                }`}
            ></div>
            <span
              className={`text-xs ${data.isActive ? "text-green-600" : "text-red-600"
                }`}
            >
              {data.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>

          {data.membership && (
            <div className="mt-1">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${data.membership.status === "ACTIVE"
                  ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  : data.membership.status === "PENDING"
                    ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                    : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                  }`}
              >
                {data.membership.plan?.name || data.membership.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  userId: string;
  initialDepth?: number;
}

export default function TreeViewFlow({ userId, initialDepth = 2 }: Props) {
  const {
    nodeContext,
    nodeLoading,
    refreshTree,
    navigateToNode,
    navigateToParent,
    navigateToRoot,
    descendantDepth,
    changeTreeDepth,
  } = useUserTree(userId, initialDepth);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // Función para transformar el árbol en nodos y aristas para React Flow
  const transformTreeToFlowNodes = useCallback(
    (
      tree: TreeNode | null,
      currentNodeId: string,
      isRoot = true,
      parentId: string | null = null,
      position = { x: 0, y: 0 },
      level = 0
    ): { nodes: Node[]; edges: Edge[] } => {
      if (!tree) return { nodes: [], edges: [] };

      const newNodes = [];
      const newEdges = [];

      // Calcular iniciales para avatar
      const initials = tree.fullName
        ? `${tree.fullName.split(" ")[0][0]}${tree.fullName.split(" ").length > 1 ? tree.fullName.split(" ")[1][0] : ""
        }`
        : tree.email.substring(0, 2).toUpperCase();

      // Crear nodo
      const node = {
        id: tree.id,
        type: "custom",
        position,
        data: {
          label: tree.fullName || tree.email.split("@")[0],
          initials,
          email: tree.email,
          referralCode: tree.referralCode,
          position: tree.position,
          isActive: tree.isActive,
          isCurrent: tree.id === currentNodeId,
          depth: tree.depth,
          membership: tree.membership,
          rank: tree.rank,
          onNodeClick: () => setSelectedNodeId(tree.id),
        },
        // Añadir evento onClick directamente al nodo
        onClick: () => setSelectedNodeId(tree.id)
      };

      newNodes.push(node);

      // Crear arista desde el padre
      if (parentId) {
        newEdges.push({
          id: `${parentId}-${tree.id}`,
          source: parentId,
          target: tree.id,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.Arrow,
            width: 15,
            height: 15,
          },
          style: { stroke: "#999" },
          animated: node.data.isCurrent,
        });
      }

      // Espaciado horizontal entre nodos - aumentar para mejorar visualización
      const horizontalSpacing = 200;

      // Espaciado vertical entre niveles - aumentar para mejorar visualización
      const verticalSpacing = 150;

      // Procesar hijo izquierdo
      if (tree.children?.left) {
        const leftChildPosition = {
          x: position.x - horizontalSpacing,
          y: position.y + verticalSpacing,
        };

        const leftResult = transformTreeToFlowNodes(
          tree.children.left,
          currentNodeId,
          false,
          tree.id,
          leftChildPosition,
          level + 1
        );

        newNodes.push(...leftResult.nodes);
        newEdges.push(...leftResult.edges);
      }

      // Procesar hijo derecho
      if (tree.children?.right) {
        const rightChildPosition = {
          x: position.x + horizontalSpacing,
          y: position.y + verticalSpacing,
        };

        const rightResult = transformTreeToFlowNodes(
          tree.children.right,
          currentNodeId,
          false,
          tree.id,
          rightChildPosition,
          level + 1
        );

        newNodes.push(...rightResult.nodes);
        newEdges.push(...rightResult.edges);
      }

      return { nodes: newNodes, edges: newEdges };
    },
    []
  );

  // Actualizar nodos y aristas cuando cambia el contexto del nodo
  useEffect(() => {
    if (nodeContext?.node) {
      const { nodes: newNodes, edges: newEdges } = transformTreeToFlowNodes(
        nodeContext.node,
        nodeContext.node.id,
        true,
        null,
        { x: 0, y: 0 }
      );

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [nodeContext, transformTreeToFlowNodes, setNodes, setEdges]);

  // Buscar el nodo seleccionado
  useEffect(() => {
    if (selectedNodeId && nodeContext?.node) {
      const findNodeRecursively = (node: TreeNode, id: string): TreeNode | null => {
        if (node.id === id) return node;

        if (node.children?.left) {
          const found = findNodeRecursively(node.children.left, id);
          if (found) return found;
        }

        if (node.children?.right) {
          const found = findNodeRecursively(node.children.right, id);
          if (found) return found;
        }

        return null;
      };

      const found = findNodeRecursively(nodeContext.node, selectedNodeId);
      setSelectedNode(found);
    } else {
      setSelectedNode(null);
    }
  }, [selectedNodeId, nodeContext]);

  // Manejar zoom in/out
  const handleZoomIn = () => {
    if (descendantDepth < 5) {
      changeTreeDepth(descendantDepth + 1);
    }
  };

  const handleZoomOut = () => {
    if (descendantDepth > 1) {
      changeTreeDepth(descendantDepth - 1);
    }
  };

  // Configurar el nodo personalizado
  const nodeTypes = {
    custom: CustomNode,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controles de navegación */}
      <TreeControls
        ancestors={nodeContext?.ancestors}
        currentNode={nodeContext?.node}
        navigateToRoot={navigateToRoot}
        navigateToParent={navigateToParent}
        navigateToNode={navigateToNode}
        refreshTree={refreshTree}
        descendantDepth={descendantDepth}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />


      {/* Contenedor de ReactFlow */}
      <div
        // className="border rounded-lg bg-muted/10 flex-1 relative"
        style={{
          width: '100%',
          height: '70vh'
        }}
      >
        {nodeLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-muted-foreground">Cargando árbol...</p>
            </div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            attributionPosition="bottom-left"

            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            connectionLineStyle={{ stroke: "#999" }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls
              position="bottom-right"
              style={{ background: "none" }}
            />

            <Panel position="top-left" className="bg-background/90 p-2 rounded-md shadow-md border m-2">
              <p className="text-xs text-muted-foreground">Nivel de profundidad: {descendantDepth}</p>
            </Panel>
          </ReactFlow>
        )}
      </div>

      {
        selectedNode && (
          <NodeDetailSheet
            node={selectedNode}
            isOpen={!!selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onNavigate={(id) => {
              navigateToNode(id);
              setSelectedNodeId(null);
            }}
          />
        )
      }

    </div>
  );
}