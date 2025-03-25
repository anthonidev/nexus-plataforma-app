// src/app/(dashboard)/tree/components/controls/index.tsx
import { TreeNode } from "@/types/tree/tree.types";
import BreadcrumbPath from "./BreadcrumbPath";
import NavigationControls from "./NavigationControls";
import ZoomControls from "./ZoomControls";

interface TreeControlsProps {
  // Navigation props
  ancestors: TreeNode[] | undefined;
  currentNode: TreeNode | undefined;
  navigateToRoot: () => void;
  navigateToParent: () => void;
  navigateToNode: (id: string) => void;
  
  // Zoom props
  refreshTree: () => void;
  descendantDepth: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
}

export default function TreeControls({
  ancestors,
  currentNode,
  navigateToRoot,
  navigateToParent,
  navigateToNode,
  refreshTree,
  descendantDepth,
  handleZoomIn,
  handleZoomOut,
}: TreeControlsProps) {
  return (
    <>
      {/* Top control bars */}
      <div className="flex flex-wrap gap-4 justify-between mb-6">
        <NavigationControls
          ancestors={ancestors}
          navigateToRoot={navigateToRoot}
          navigateToParent={navigateToParent}
          navigateToNode={navigateToNode}
        />
        
        <ZoomControls
          refreshTree={refreshTree}
          zoomIn={handleZoomIn}
          zoomOut={handleZoomOut}
          canZoomIn={descendantDepth < 5}
          canZoomOut={descendantDepth > 1}
        />
      </div>
      
      {/* Breadcrumb component is exported but used in TreeNodeHierarchy component */}
    </>
  );
}

export { BreadcrumbPath, NavigationControls, ZoomControls };