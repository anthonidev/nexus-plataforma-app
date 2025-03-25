// src/app/(dashboard)/tree/components/NodeDetail/NodeDetailPopup.tsx
import { Button } from "@/components/ui/button";
import { TreeNode } from "@/types/tree/tree.types";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import NodeActions from "./NodeActions";

interface NodeDetailPopupProps {
  node?: TreeNode;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export default function NodeDetailPopup({
  node,
  onClose,
  onNavigate,
}: NodeDetailPopupProps) {
  if (!node) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-4 right-4 bg-card border rounded-lg shadow-lg p-4 max-w-xs z-20"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{node.fullName || node.email}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Email:</span> {node.email}
        </div>
        <div>
          <span className="text-muted-foreground">Código:</span>{" "}
          {node.referralCode}
        </div>
        <div>
          <span className="text-muted-foreground">Posición:</span>{" "}
          {node.position}
        </div>
        <div>
          <span className="text-muted-foreground">Estado:</span>{" "}
          <span className={node.isActive ? "text-green-600" : "text-red-600"}>
            {node.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Nivel:</span> {node.depth}
        </div>
      </div>

      {/* Navigation buttons in popup */}
      <NodeActions node={node} onNavigate={onNavigate} onClose={onClose} />
    </motion.div>
  );
}