// src/app/(dashboard)/tree/components/controls/BreadcrumbPath.tsx
import { TreeNode } from "@/types/tree/tree.types";
import React from "react";

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
  if (!ancestors || ancestors.length === 0 || !currentNode) return null;

  // Solo mostrar los últimos 2 ancestros para evitar que se haga demasiado ancho
  const displayedAncestors = ancestors.slice(-2);
  const hasMoreAncestors = ancestors.length > displayedAncestors.length;

  return (
    <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-xs bg-background/90 dark:bg-card px-3 py-1.5 rounded-full shadow-sm border">
      <span className="text-muted-foreground font-medium">Ruta:</span>
      
      {hasMoreAncestors && <span className="text-muted-foreground">...</span>}
      
      {displayedAncestors.map((ancestor, index, arr) => (
        <React.Fragment key={ancestor.id}>
          <button
            className="hover:text-primary transition-colors truncate max-w-[100px]"
            onClick={() => navigateToNode(ancestor.id)}
          >
            {ancestor.fullName || ancestor.email.split("@")[0]}
          </button>
          {index < arr.length - 1 && <span className="text-muted-foreground mx-0.5">›</span>}
        </React.Fragment>
      ))}
      
      <span className="text-muted-foreground mx-0.5">›</span>
      
      <span className="text-primary font-medium truncate max-w-[100px]">
        {currentNode.fullName || currentNode.email.split("@")[0]}
      </span>
    </div>
  );
}