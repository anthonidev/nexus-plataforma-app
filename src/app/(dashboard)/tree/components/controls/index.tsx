// src/app/(dashboard)/tree/components/controls/index.tsx
import { TreeNode } from "@/types/tree/tree.types";
import BreadcrumbPath from "./BreadcrumbPath";
import NavigationControls from "./NavigationControls";
import ZoomControls from "./ZoomControls";
import { useEffect, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <>
      {/* Top control bars - responsive layout */}
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-wrap'} gap-4 ${isMobile ? 'items-start' : 'justify-between'} mb-6`}>
        <NavigationControls
          ancestors={ancestors}
          navigateToRoot={navigateToRoot}
          navigateToParent={navigateToParent}
          navigateToNode={navigateToNode}
          isMobile={isMobile}
        />
        
        <ZoomControls
          refreshTree={refreshTree}
          zoomIn={handleZoomIn}
          zoomOut={handleZoomOut}
          canZoomIn={descendantDepth < 5}
          canZoomOut={descendantDepth > 1}
        />
      </div>
    </>
  );
}

export { BreadcrumbPath, NavigationControls, ZoomControls };