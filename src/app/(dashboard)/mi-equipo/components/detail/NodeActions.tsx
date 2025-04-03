// src/app/(dashboard)/tree/components/NodeDetail/NodeActions.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TreeNode } from "@/types/tree/tree.types";

interface NodeActionsProps {
  node: TreeNode;
  onNavigate: (id: string) => void;
  onClose: () => void;
}

export default function NodeActions({ node, onNavigate, onClose }: NodeActionsProps) {
  const hasLeftChild = !!node.children?.left;
  const hasRightChild = !!node.children?.right;
  
  if (!hasLeftChild && !hasRightChild) return null;
  
  return (
    <div className="mt-4 pt-3 border-t flex flex-wrap gap-2">
      {hasLeftChild && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => {
            onNavigate(node.children!.left!.id);
            onClose();
          }}
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Hijo Izq.</span>
        </Button>
      )}

      {hasRightChild && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => {
            onNavigate(node.children!.right!.id);
            onClose();
          }}
        >
          <span>Hijo Der.</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}