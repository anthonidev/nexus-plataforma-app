// src/app/(dashboard)/tree/components/TreeView.tsx
import { useState } from "react";
import { User } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { findNodeById } from "../utils/tree-utils";
import { useUserTree } from "../hooks/useUserTree";
import TreeControls from "./controls";
import TreeNodeHierarchy from "./treenode/TreeNodeHierarchy";
import NodeDetailPopup from "./detail/NodeDetailPopup";

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

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

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
      <div className="border rounded-lg bg-muted/10 p-8 overflow-auto min-h-[600px] max-h-[800px] flex items-start justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <TreeNodeHierarchy

              node={nodeContext.node}
              onNodeClick={navigateToNode}
              onNodeHover={setHoveredNode}
              hoveredNodeId={hoveredNode}
              currentNodeId={nodeContext.node.id}
              ancestors={nodeContext.ancestors}
              isRoot={true}
              navigateToNode={navigateToNode}
            />
          </div>
        </div>
      </div>

      {/* Node detail popup */}
      <AnimatePresence>
        {hoveredNode && (
          <NodeDetailPopup
            node={findNodeById(nodeContext.node, hoveredNode)}
            onClose={() => setHoveredNode(null)}
            onNavigate={navigateToNode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}