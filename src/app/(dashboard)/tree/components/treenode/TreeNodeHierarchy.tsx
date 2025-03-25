// src/app/(dashboard)/tree/components/treenode/TreeNodeHierarchy.tsx
import { TreeNode } from "@/types/tree/tree.types";
import NodeCard from "./NodeCard";
import NodeConnectors from "./NodeConnectors";
import { BreadcrumbPath } from "../controls";
import { useEffect, useState } from "react";

interface TreeNodeHierarchyProps {
  node: TreeNode;
  onNodeClick: (id: string) => void;
  onNodeHover?: (id: string | null) => void;
  hoveredNodeId?: string | null;
  currentNodeId: string;
  ancestors?: TreeNode[];
  isRoot?: boolean;
  depth?: number;
  showNavigationButtons?: boolean;
  navigateToNode?: (id: string) => void;
  zoomLevel?: number;
}

export default function TreeNodeHierarchy({
  node,
  onNodeClick,
  onNodeHover,
  hoveredNodeId,
  currentNodeId,
  ancestors,
  isRoot = false,
  depth = 0,
  showNavigationButtons = true,
  navigateToNode,
  zoomLevel = 2,
}: TreeNodeHierarchyProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Determine if this node has children
  const hasLeftChild = !!node.children?.left;
  const hasRightChild = !!node.children?.right;
  const hasChildren = hasLeftChild || hasRightChild;
  const hasOnlyOneChild = (hasLeftChild && !hasRightChild) || (!hasLeftChild && hasRightChild);

  // Determine if node is current
  const isCurrent = currentNodeId === node.id;

  // Detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Calcular el espacio entre nodos basado en el zoom y el dispositivo
  const getSpacing = () => {
    // Base spacing by zoom level
    const baseSpacing = {
      1: 64,
      2: 48,
      3: 32,
      4: 24,
      5: 16
    };
    
    // Reducir espacio para móviles
    if (isMobile) {
      return baseSpacing[zoomLevel as keyof typeof baseSpacing] * 0.7;
    }
    
    return baseSpacing[zoomLevel as keyof typeof baseSpacing];
  };

  return (
    <div className="flex flex-col items-center max-w-full">
      {/* Breadcrumb path indicator for root node only */}
      {isRoot && ancestors && ancestors.length > 0 && navigateToNode && (
        <div className="relative mb-2">
          <div className="relative">
            <BreadcrumbPath
              ancestors={ancestors}
              currentNode={node}
              navigateToNode={navigateToNode}
            />
          </div>
        </div>
      )}

      {/* Node card */}
      <NodeCard
        node={node}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        isHovered={hoveredNodeId === node.id}
        isCurrent={isCurrent}
        isRoot={isRoot}
        depth={depth}
        hasLeftChild={hasLeftChild}
        hasRightChild={hasRightChild}
        showNavigationButtons={false}
        zoomLevel={zoomLevel}
      />

      {/* Tree branches and child nodes */}
      {hasChildren && (
        <div className="flex flex-col items-center w-full">
          <NodeConnectors 
            hasOnlyOneChild={hasOnlyOneChild} 
            zoomLevel={zoomLevel}
            isMobile={isMobile}
          />

          {/* Children nodes */}
          <div
            className="flex justify-center items-start w-full"
            style={{ 
              flexDirection: hasOnlyOneChild ? 'column' : 'row',
              gap: `${getSpacing()}px`
            }}
          >
            {/* Left child */}
            {hasLeftChild && (
              <div className="flex flex-col items-center">
                <TreeNodeHierarchy
                  node={node.children!.left!}
                  onNodeClick={onNodeClick}
                  onNodeHover={onNodeHover}
                  hoveredNodeId={hoveredNodeId}
                  currentNodeId={currentNodeId}
                  depth={depth + 1}
                  zoomLevel={zoomLevel}
                />
              </div>
            )}

            {/* Right child */}
            {hasRightChild && (
              <div className="flex flex-col items-center">
                <TreeNodeHierarchy
                  node={node.children!.right!}
                  onNodeClick={onNodeClick}
                  onNodeHover={onNodeHover}
                  hoveredNodeId={hoveredNodeId}
                  currentNodeId={currentNodeId}
                  depth={depth + 1}
                  zoomLevel={zoomLevel}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}