// src/app/(dashboard)/tree/components/TreeView.tsx
import { useState } from "react";
import { User } from "lucide-react";
import { findNodeById } from "../utils/tree-utils";
import { useUserTree } from "../hooks/useUserTree";
import TreeControls from "./controls";
import TreeNodeHierarchy from "./treenode/TreeNodeHierarchy";
import NodeDetailSheet from "./detail/NodeDetailSheet";
import ViewBox from "./ViewBox";

interface TreeViewProps {
  userId: string;
  initialDepth?: number;
}

export default function TreeView({ userId, initialDepth = 2 }: TreeViewProps) {
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

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Función para manejar la selección de un nodo (para mostrar detalles)
  const handleNodeSelect = (id: string) => {
    setSelectedNodeId(id);
  };
  
  // Función para manejar la navegación desde el sheet
  const handleSheetNavigate = (id: string) => {
    navigateToNode(id);
    setSelectedNodeId(id);
  };

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

  if (!nodeContext?.node) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <User className="h-16 w-16 text-muted mb-4" />
        <p className="text-muted-foreground">
          No hay datos disponibles para visualizar
        </p>
      </div>
    );
  }

  const selectedNode = selectedNodeId 
    ? findNodeById(nodeContext.node, selectedNodeId) 
    : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Controls section - fixed height */}
      <div className="mb-4">
        <TreeControls
          ancestors={nodeContext.ancestors}
          currentNode={nodeContext.node}
          navigateToRoot={navigateToRoot}
          navigateToParent={navigateToParent}
          navigateToNode={navigateToNode}
          refreshTree={refreshTree}
          descendantDepth={descendantDepth}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
        />
      </div>

      {/* Tree visualization container - flexible height with contained scroll */}
      <div className="flex-1 flex flex-col">
        <div className="border rounded-lg bg-muted/10 flex-1 relative overflow-hidden" style={{ minHeight: "600px", maxHeight: "calc(100vh - 250px)" }}>
          {/* ScrollArea for contained scrolling */}
          <div className="absolute inset-0 overflow-auto">
            <div className="p-4 min-w-full min-h-full flex items-start justify-center">
              <ViewBox>
                <TreeNodeHierarchy
                  node={nodeContext.node}
                  onNodeClick={handleNodeSelect}
                  onNodeHover={() => {}}
                  hoveredNodeId={null}
                  currentNodeId={nodeContext.node.id}
                  ancestors={nodeContext.ancestors}
                  isRoot={true}
                  navigateToNode={navigateToNode}
                  zoomLevel={descendantDepth}
                />
              </ViewBox>
            </div>
          </div>
        </div>
      </div>

      {/* Node detail sheet */}
      <NodeDetailSheet 
        node={selectedNode}
        isOpen={!!selectedNodeId}
        onClose={() => setSelectedNodeId(null)}
        onNavigate={handleSheetNavigate}
      />
    </div>
  );
}