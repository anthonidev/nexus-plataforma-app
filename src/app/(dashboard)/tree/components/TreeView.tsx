// src/app/(dashboard)/tree/components/TreeView.tsx
import { useState } from "react";
import { User } from "lucide-react";
import { findNodeById } from "../utils/tree-utils";
import { useUserTree } from "../hooks/useUserTree";
import TreeControls from "./controls";
import TreeNodeHierarchy from "./treenode/TreeNodeHierarchy";
import NodeDetailSheet from "./detail/NodeDetailSheet";

interface TreeViewProps {
  userId: string;
  initialDepth?: number;
}

export default function TreeView({ userId, initialDepth = 3 }: TreeViewProps) {
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
    <div className="relative">
      {/* Controls section */}
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

      {/* Tree visualization */}
      <div className="border rounded-lg bg-muted/10 p-4 overflow-auto min-h-[600px] max-h-[800px] flex items-center justify-center">
        <div className="flex flex-col items-center scale-95 transform-gpu origin-top py-14">
          <div className="relative">
            <TreeNodeHierarchy
              node={nodeContext.node}
              onNodeClick={handleNodeSelect}
              onNodeHover={() => {}} // Ya no necesitamos hover para mostrar detalles
              hoveredNodeId={null}
              currentNodeId={nodeContext.node.id}
              ancestors={nodeContext.ancestors}
              isRoot={true}
              navigateToNode={navigateToNode}
            />
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