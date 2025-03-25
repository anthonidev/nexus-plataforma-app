// src/app/(dashboard)/tree/components/TreeNode/TreeNodeHierarchy.tsx
import { TreeNode } from "@/types/tree/tree.types";
import NodeCard from "./NodeCard";
import NodeConnectors from "./NodeConnectors";
import { BreadcrumbPath } from "../controls";

interface TreeNodeHierarchyProps {
  node: TreeNode;
  onNodeClick: (id: string) => void;
  onNodeHover: (id: string | null) => void;
  hoveredNodeId: string | null;
  currentNodeId: string;
  ancestors?: TreeNode[];
  isRoot?: boolean;
  depth?: number;
  showNavigationButtons?: boolean;
  navigateToNode?: (id: string) => void;
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
}: TreeNodeHierarchyProps) {
  // Determine if this node has children
  const hasLeftChild = !!node.children?.left;
  const hasRightChild = !!node.children?.right;
  const hasChildren = hasLeftChild || hasRightChild;
  const hasOnlyOneChild = (hasLeftChild && !hasRightChild) || (!hasLeftChild && hasRightChild);

  // Determine if node is hovered or current
  const isHovered = hoveredNodeId === node.id;
  const isCurrent = currentNodeId === node.id;

  return (
    <div className="flex flex-col items-center">
      {/* Breadcrumb path indicator for root node only */}
      {isRoot && ancestors && ancestors.length > 0 && navigateToNode && (
        <div className="relative">
          <BreadcrumbPath
            ancestors={ancestors}
            currentNode={node}
            navigateToNode={navigateToNode}
          />
        </div>
      )}

      {/* Node card */}
      <NodeCard
        node={node}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        isHovered={isHovered}
        isCurrent={isCurrent}
        isRoot={isRoot}
        depth={depth}
        hasLeftChild={hasLeftChild}
        hasRightChild={hasRightChild}
        showNavigationButtons={showNavigationButtons}
      />

      {/* Tree branches and child nodes */}
      {hasChildren && (
        <>
          <NodeConnectors hasOnlyOneChild={hasOnlyOneChild} />

          {/* Children nodes */}
          <div
            className={`
              flex ${hasOnlyOneChild ? "flex-col" : "flex-row"} 
              justify-center items-start gap-4 md:gap-8 lg:gap-16
            `}
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
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}