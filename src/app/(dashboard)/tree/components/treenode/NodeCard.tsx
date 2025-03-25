// src/app/(dashboard)/tree/components/treenode/NodeCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, User, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { TreeNode } from "@/types/tree/tree.types";
import { cn } from "@/lib/utils";

interface NodeCardProps {
  node: TreeNode;
  onNodeClick: (id: string) => void;
  onNodeHover?: (id: string | null) => void; // Opcional ya que no lo utilizaremos
  isHovered?: boolean; // Opcional ya que no lo utilizaremos
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
        className={cn(
          "border-2 transition-all duration-200 cursor-pointer w-40 h-44",
          isCurrent ? "border-primary bg-primary/5" : "hover:border-primary/50 hover:bg-muted/50",
          !node.isActive ? "opacity-70 border-muted" : ""
        )}
        onClick={() => onNodeClick(node.id)}
      >
        <CardContent className="p-4 flex flex-col items-center justify-between h-full">
          

          {/* User avatar/image */}
          <div
            className={cn(
              "h-12 w-12 rounded-full overflow-hidden flex items-center justify-center",
              "bg-gradient-to-br from-muted to-muted/50 text-foreground",
              isCurrent ? "ring-2 ring-primary ring-offset-2" : "",
              !node.isActive ? "opacity-70" : ""
            )}
          >
            <User className="h-6 w-6" />
          </div>

          <div className="text-center w-full">
            <p className="font-medium truncate max-w-full">
              {node.fullName || node.email.split("@")[0]}
            </p>
            {node.isActive && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-green-600">Activo</span>
              </div>
            )}
            {!node.isActive && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs text-red-600">Inactivo</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}