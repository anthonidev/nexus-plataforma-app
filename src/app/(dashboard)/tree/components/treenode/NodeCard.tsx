// src/app/(dashboard)/tree/components/treenode/NodeCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { TreeNode } from "@/types/tree/tree.types";
import { cn } from "@/lib/utils";

interface NodeCardProps {
  node: TreeNode;
  onNodeClick: (id: string) => void;
  onNodeHover?: (id: string | null) => void;
  isHovered?: boolean;
  isCurrent: boolean;
  isRoot: boolean;
  depth: number;
  hasLeftChild: boolean;
  hasRightChild: boolean;
  showNavigationButtons?: boolean;
  zoomLevel?: number; // Nuevo prop para manejar el zoom
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
  zoomLevel = 2,
}: NodeCardProps) {
  // Calcular tamaño basado en el nivel de zoom
  const getCardSize = () => {
    // A mayor profundidad, tarjetas más pequeñas
    switch(zoomLevel) {
      case 1: return { width: 160, height: 176 };
      case 2: return { width: 144, height: 160 };
      case 3: return { width: 128, height: 144 };
      case 4: return { width: 112, height: 128 };
      case 5: return { width: 96, height: 112 };
      default: return { width: 144, height: 160 };
    }
  };

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
          "border-2 transition-all duration-200 cursor-pointer",
          isCurrent ? "border-primary bg-primary/5" : "hover:border-primary/50 hover:bg-muted/50",
          !node.isActive ? "opacity-70 border-muted" : ""
        )}
        onClick={() => onNodeClick(node.id)}
        style={{ 
          width: `${getCardSize().width}px`, 
          height: `${getCardSize().height}px`,
          minWidth: `${getCardSize().width}px`,
          maxWidth: `${getCardSize().width}px`
        }}
      >
        <CardContent className="p-2 flex flex-col items-center justify-between h-full">
          {/* User avatar/image */}
          <div
            className={cn(
              "h-10 w-10 rounded-full overflow-hidden flex items-center justify-center",
              "bg-gradient-to-br from-muted to-muted/50 text-foreground",
              isCurrent ? "ring-2 ring-primary ring-offset-1" : "",
              !node.isActive ? "opacity-70" : ""
            )}
          >
            <User className="h-5 w-5" />
          </div>

          <div className="text-center w-full">
            <p className={cn(
              "font-medium truncate max-w-full",
              zoomLevel > 3 ? "text-xs" : zoomLevel > 2 ? "text-sm" : "text-base"
            )}>
              {node.fullName || node.email.split("@")[0]}
            </p>
            {node.isActive && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className={cn(
                  "text-green-600",
                  zoomLevel > 3 ? "text-[10px]" : "text-xs"
                )}>
                  Activo
                </span>
              </div>
            )}
            {!node.isActive && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className={cn(
                  "text-red-600",
                  zoomLevel > 3 ? "text-[10px]" : "text-xs"
                )}>
                  Inactivo
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}