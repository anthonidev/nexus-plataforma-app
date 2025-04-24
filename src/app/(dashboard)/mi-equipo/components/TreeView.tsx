import { TreeNode } from "@/types/tree/tree.types";
import { calculateHorizontalSpacing } from "@/utils/size";
import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
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
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { useUserTree } from "../hooks/useUserTree";
import TreeControls from "./controls";
import CustomNode from "./detail/CustomNode";
import NodeDetailSheet from "./detail/NodeDetailSheet";

interface Props {
  userId: string;
  initialDepth?: number;
}

export default function TreeViewFlow({ userId, initialDepth = 2 }: Props) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const {
    nodeContext,
    nodeLoading,
    refreshTree,
    navigateToNode,
    navigateToParent,
    navigateToRoot,
    descendantDepth,
    changeTreeDepth,
    nodeMetadata,
  } = useUserTree(userId, initialDepth);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

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

      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      const initials = tree.fullName
        ? `${tree.fullName.split(" ")[0][0]}${tree.fullName.split(" ").length > 1 ? tree.fullName.split(" ")[1][0] : ""
        }`
        : tree.email.substring(0, 2).toUpperCase();

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
        onClick: () => setSelectedNodeId(tree.id),
        draggable: false
      };

      newNodes.push(node);

      if (parentId) {
        newEdges.push({
          id: `${parentId}-${tree.id}`,
          source: parentId,
          target: tree.id,
          type: ConnectionLineType.SmoothStep,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
          },
          style: { strokeWidth: 2.5 },
          animated: node.data.isCurrent,
          label: tree.position === "LEFT" ? "IZQ" : "DER",
        });
      }


      const horizontalSpacing = calculateHorizontalSpacing(level, nodeMetadata?.descendantDepth || 2);

      const verticalSpacing = 220;

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
    [nodeMetadata]
  );

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

  const nodeTypes = {
    custom: CustomNode,
  };

  return (
    <div className="flex flex-col h-full">
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

      <div
        style={{
          width: '100%',
          height: 'calc(100vh - 317px)',
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
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            colorMode={isDarkMode ? "dark" : "light"}
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls
              position="bottom-right"
              style={{ background: "none" }}
              showInteractive={false}
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