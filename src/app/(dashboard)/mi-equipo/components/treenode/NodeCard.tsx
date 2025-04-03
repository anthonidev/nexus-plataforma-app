// src/app/(dashboard)/tree/components/treenode/NodeCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { TreeNode } from "@/types/tree/tree.types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  zoomLevel?: number;
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
  
  // Calcular tamaño basado en el nivel de zoom y si es móvil
  const getCardSize = () => {
    // Base sizes
    const sizes = {
      1: { width: 160, height: 176 },
      2: { width: 144, height: 160 },
      3: { width: 128, height: 144 },
      4: { width: 112, height: 128 },
      5: { width: 96, height: 112 }
    };
    
    // Si es móvil, reducir aún más el tamaño
    if (isMobile) {
      return {
        width: sizes[zoomLevel as keyof typeof sizes].width * 0.85,
        height: sizes[zoomLevel as keyof typeof sizes].height * 0.85
      };
    }
    
    return sizes[zoomLevel as keyof typeof sizes];
  };

  // Display label based on depth
  const depthLabel = 
    isRoot ? "USUARIO" :
    depth === 1 ? "HIJO" :
    depth === 2 ? "NIETO" :
    depth === 3 ? "BISNIETO" : "DESCENDIENTE";

  const { width, height } = getCardSize();

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
          width: `${width}px`, 
          height: `${height}px`,
          minWidth: `${width}px`,
          maxWidth: `${width}px`
        }}
      >
        <CardContent className="p-2 flex flex-col items-center justify-between h-full">
          {/* User avatar/image */}
          <div
            className={cn(
              "rounded-full overflow-hidden flex items-center justify-center",
              "bg-gradient-to-br from-muted to-muted/50 text-foreground",
              isCurrent ? "ring-2 ring-primary ring-offset-1" : "",
              !node.isActive ? "opacity-70" : "",
              isMobile ? "h-8 w-8" : "h-10 w-10"
            )}
          >
            <User className={cn(isMobile ? "h-4 w-4" : "h-5 w-5")} />
          </div>

          <div className="text-center w-full">
            <p className={cn(
              "font-medium truncate max-w-full",
              isMobile ? "text-xs" : 
              zoomLevel > 3 ? "text-xs" : 
              zoomLevel > 2 ? "text-sm" : 
              "text-base"
            )}>
              {node.fullName || node.email.split("@")[0]}
            </p>
            {node.isActive && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className={cn(
                  "text-green-600",
                  isMobile ? "text-[10px]" : 
                  zoomLevel > 3 ? "text-[10px]" : 
                  "text-xs"
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
                  isMobile ? "text-[10px]" : 
                  zoomLevel > 3 ? "text-[10px]" : 
                  "text-xs"
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