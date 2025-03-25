// src/app/(dashboard)/tree/components/treenode/TreeNodeHierarchy.tsx
import { TreeNode } from "@/types/tree/tree.types";
import NodeCard from "./NodeCard";
import NodeConnectors from "./NodeConnectors";
import { BreadcrumbPath } from "../controls";

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
  zoomLevel?: number; // Nuevo prop para controlar el tamaño según el zoom
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
  // Determine if this node has children
  const hasLeftChild = !!node.children?.left;
  const hasRightChild = !!node.children?.right;
  const hasChildren = hasLeftChild || hasRightChild;
  const hasOnlyOneChild = (hasLeftChild && !hasRightChild) || (!hasLeftChild && hasRightChild);

  // Determine if node is current
  const isCurrent = currentNodeId === node.id;

  // Calcular el espacio entre nodos basado en el zoom
  const getSpacing = () => {
    // Ajustar espaciado según nivel de zoom - más niveles = menos espacio
    switch(zoomLevel) {
      case 1: return 64;
      case 2: return 48;
      case 3: return 32;
      case 4: return 24;
      case 5: return 16;
      default: return 48;
    }
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