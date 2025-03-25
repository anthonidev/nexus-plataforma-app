// src/app/(dashboard)/tree/components/controls/BreadcrumbPath.tsx
import { TreeNode } from "@/types/tree/tree.types";
import React, { useEffect, useState } from "react";

interface BreadcrumbPathProps {
  ancestors: TreeNode[] | undefined;
  currentNode: TreeNode | undefined;
  navigateToNode: (id: string) => void;
}

export default function BreadcrumbPath({
  ancestors,
  currentNode,
  navigateToNode,
}: BreadcrumbPathProps) {
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

  if (!ancestors || ancestors.length === 0 || !currentNode) return null;

  // Solo mostrar los últimos ancestros para evitar que se haga demasiado ancho
  // En móvil mostrar solo el último, en desktop hasta 2
  const displayCount = isMobile ? 1 : 2;
  const displayedAncestors = ancestors.slice(-displayCount);
  const hasMoreAncestors = ancestors.length > displayedAncestors.length;

  return (
    <div className={`absolute top-[-30px] left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-xs ${isMobile ? 'text-[10px]' : 'text-xs'} bg-background/90 dark:bg-card px-2 py-1 rounded-full shadow-sm border max-w-[90%] overflow-hidden`}>
      {!isMobile && (
        <span className="text-muted-foreground font-medium shrink-0">Ruta:</span>
      )}
      
      {hasMoreAncestors && <span className="text-muted-foreground shrink-0">...</span>}
      
      {displayedAncestors.map((ancestor, index, arr) => (
        <React.Fragment key={ancestor.id}>
          <button
            className="hover:text-primary transition-colors truncate max-w-[60px] md:max-w-[80px]"
            onClick={() => navigateToNode(ancestor.id)}
          >
            {ancestor.fullName || ancestor.email.split("@")[0]}
          </button>
          {index < arr.length - 1 && <span className="text-muted-foreground mx-0.5 shrink-0">›</span>}
        </React.Fragment>
      ))}
      
      <span className="text-muted-foreground mx-0.5 shrink-0">›</span>
      
      <span className="text-primary font-medium truncate max-w-[60px] md:max-w-[80px]">
        {currentNode.fullName || currentNode.email.split("@")[0]}
      </span>
    </div>
  );
}