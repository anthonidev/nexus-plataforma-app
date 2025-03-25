// src/app/(dashboard)/tree/components/TreeControls/BreadcrumbPath.tsx
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

  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-3 py-1.5 rounded-full shadow-sm border">
      <span className="font-medium">Ruta:</span>
      
      {ancestors.slice(0, 3).map((ancestor, index, arr) => (
        <React.Fragment key={ancestor.id}>
          <button
            className="hover:text-foreground transition-colors truncate max-w-[80px]"
            onClick={() => navigateToNode(ancestor.id)}
          >
            {ancestor.fullName || ancestor.email.split("@")[0]}
          </button>
          {index < arr.length - 1 && <span>›</span>}
        </React.Fragment>
      ))}
      
      {ancestors.length > 3 && <span>...</span>}
      <span>›</span>
      
      <span className="font-medium">
        {currentNode.fullName || currentNode.email.split("@")[0]}
      </span>
    </div>
  );
}