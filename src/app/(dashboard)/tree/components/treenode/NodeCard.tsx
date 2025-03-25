// src/app/(dashboard)/tree/components/TreeNode/NodeCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";
import { TreeNode } from "@/types/tree/tree.types";

interface NodeCardProps {
  node: TreeNode;
  onNodeClick: (id: string) => void;
  onNodeHover: (id: string | null) => void;
  isHovered: boolean;
  isCurrent: boolean;
  isRoot: boolean;
  depth: number;
  hasLeftChild: boolean;
  hasRightChild: boolean;
  showNavigationButtons?: boolean;
}

export default function NodeCard({
  node,
  onNodeClick,
  onNodeHover,
  isHovered,
  isCurrent,
  isRoot,
  depth,
  hasLeftChild,
  hasRightChild,
  showNavigationButtons = true,
}: NodeCardProps) {
  // Display label based on depth
  const depthLabel = 
    isRoot ? "USUARIO" :
    depth === 1 ? "HIJO" :
    depth === 2 ? "NIETO" :
    depth === 3 ? "BISNIETO" : "DESCENDIENTE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: depth * 0.1 }}
      className="mb-2"
    >
      <Card
        className={`
          border-2 transition-all duration-200 cursor-pointer
          ${isHovered ? "shadow-lg scale-105" : ""}
          ${isCurrent ? "border-primary bg-primary/5" : "hover:bg-muted/50"}
          ${!node.isActive ? "opacity-70" : ""}
        `}
        onClick={() => onNodeClick(node.id)}
        onMouseEnter={() => onNodeHover(node.id)}
        onMouseLeave={() => onNodeHover(null)}
      >
        <CardContent className="p-4 flex flex-col items-center gap-2">
          {/* User avatar/image */}
          <div
            className={`
              h-16 w-16 rounded-full overflow-hidden flex items-center justify-center
              bg-gradient-to-br from-muted to-muted/50 text-foreground
              ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}
            `}
          >
            <User className="h-8 w-8" />
          </div>

          <div className="text-center">
            <p className="font-medium truncate max-w-[140px]">
              {node.fullName || node.email.split("@")[0]}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {depthLabel}
            </p>

            {/* Child navigation buttons */}
            {showNavigationButtons && (hasLeftChild || hasRightChild) && (
              <div className="flex justify-center mt-2 gap-1">
                {hasLeftChild && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-muted/50 hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeClick(node.children!.left!.id);
                    }}
                    title="Ir al hijo izquierdo"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                )}

                {hasRightChild && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-muted/50 hover:bg-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNodeClick(node.children!.right!.id);
                    }}
                    title="Ir al hijo derecho"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}