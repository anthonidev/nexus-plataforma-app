import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TreeNode } from "@/types/tree/tree.types";
import { ChevronDown, Award, Calendar, Package, User } from "lucide-react";
import { motion } from "framer-motion";
import NodeActions from "./NodeActions";
import { format } from "date-fns";

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

  // Información de membresía
  const hasMembership = node.membership && node.membership.status;
  const membershipStatus = node.membership?.status;
  const membershipPlan = node.membership?.plan?.name;

  // Información de rango
  const hasRank = node.rank && node.rank.currentRank;
  const currentRank = node.rank?.currentRank?.name;
  const highestRank = node.rank?.highestRank?.name;

  // Mapeo de estados para badges
  const membershipStatusMap = {
    ACTIVE: {
      label: "Activa",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    },
    PENDING: {
      label: "Pendiente",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    },
    INACTIVE: {
      label: "Inactiva",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    },
    EXPIRED: {
      label: "Expirada",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    }
  };

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

        {/* Información de membresía si existe */}
        {hasMembership && (
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center gap-1 mb-1 font-medium">
              <Package className="h-3.5 w-3.5 text-primary" />
              <span>Membresía</span>
            </div>
            <div>
              <span className="text-muted-foreground">Plan:</span>{" "}
              {membershipPlan || "N/A"}
            </div>
            <div>
              <span className="text-muted-foreground">Estado:</span>{" "}
              <Badge className={membershipStatusMap[membershipStatus as keyof typeof membershipStatusMap]?.className || "bg-gray-100"}>
                {membershipStatusMap[membershipStatus as keyof typeof membershipStatusMap]?.label || membershipStatus}
              </Badge>
            </div>
            {node.membership?.startDate && node.membership?.endDate && (
              <div className="text-xs text-muted-foreground mt-1">
                <span>{format(new Date(node.membership.startDate), "dd/MM/yyyy")}</span> -
                <span>{format(new Date(node.membership.endDate), "dd/MM/yyyy")}</span>
              </div>
            )}
          </div>
        )}

        {/* Información de rango si existe */}
        {hasRank && (
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center gap-1 mb-1 font-medium">
              <Award className="h-3.5 w-3.5 text-primary" />
              <span>Rango</span>
            </div>
            <div>
              <span className="text-muted-foreground">Actual:</span>{" "}
              {currentRank || "N/A"}
            </div>
            {highestRank && currentRank !== highestRank && (
              <div>
                <span className="text-muted-foreground">Mayor alcanzado:</span>{" "}
                {highestRank}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation buttons in popup */}
      <NodeActions node={node} onNavigate={onNavigate} onClose={onClose} />
    </motion.div>
  );
}