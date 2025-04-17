import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TreeNode } from "@/types/tree/tree.types";
import {
  Activity,
  GitBranchPlus,
  Hash,
  Mail,
  ShieldCheck,
  User,
  Calendar,
  Package,
  Award,
} from "lucide-react";
import { format } from "date-fns";

interface NodeDetailSheetProps {
  node?: TreeNode;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export default function NodeDetailSheet({
  node,
  isOpen,
  onClose,
  onNavigate,
}: NodeDetailSheetProps) {
  if (!node) return null;

  const hasLeftChild = !!node.children?.left;
  const hasRightChild = !!node.children?.right;
  const hasChildren = hasLeftChild || hasRightChild;

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
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md border-l overflow-y-auto p-4 sm:p-6">
        <SheetHeader className="text-left pb-4 sm:pb-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/70 to-primary text-primary-foreground">
              <User size={20} />
            </div>
            <div>
              <SheetTitle className="text-lg sm:text-xl">
                {node.fullName || node.email.split("@")[0]}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-1">
                <Badge
                  variant={node.isActive ? "default" : "destructive"}
                  className="text-xs"
                >
                  {node.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <span>•</span>
                <span>Nivel {node.depth}</span>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4 sm:my-6" />

        {/* Detalles principales */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  Correo Electrónico
                </Label>
                <p className="font-medium text-sm sm:text-base break-all">
                  {node.email}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  Código de Referencia
                </Label>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-medium text-sm sm:text-base">
                    {node.referralCode}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 sm:h-8 rounded-full"
                    onClick={() => {
                      navigator.clipboard.writeText(node.referralCode);
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <GitBranchPlus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  Posición
                </Label>
                <p className="font-medium text-sm sm:text-base">
                  {node.position}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  Estado
                </Label>
                <div className="font-medium text-sm sm:text-base flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${node.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                  ></div>
                  {node.isActive ? "Usuario activo" : "Usuario inactivo"}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  Posición en la Red
                </Label>
                <p className="font-medium text-sm sm:text-base">
                  Nivel {node.depth} de profundidad
                </p>
              </div>
            </div>

            {/* Información de membresía si existe */}
            {hasMembership && (
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs sm:text-sm text-muted-foreground">
                    Membresía
                  </Label>
                  <div className="space-y-2">
                    <p className="font-medium text-sm sm:text-base">
                      {membershipPlan || "Plan no especificado"}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={membershipStatusMap[membershipStatus as keyof typeof membershipStatusMap]?.className || "bg-gray-100"}
                      >
                        {membershipStatusMap[membershipStatus as keyof typeof membershipStatusMap]?.label || membershipStatus}
                      </Badge>

                      {node.membership?.startDate && node.membership?.endDate && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(node.membership.startDate), "dd/MM/yyyy")} -
                          {format(new Date(node.membership.endDate), "dd/MM/yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información de rango si existe */}
            {hasRank && (
              <div className="flex gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs sm:text-sm text-muted-foreground">
                    Rango
                  </Label>
                  <div className="space-y-2">
                    <p className="font-medium text-sm sm:text-base">
                      {currentRank || "No especificado"}
                      {node.rank?.currentRank?.code && (
                        <span className="ml-2 text-xs text-muted-foreground font-mono">
                          ({node.rank.currentRank.code})
                        </span>
                      )}
                    </p>

                    {highestRank && currentRank !== highestRank && (
                      <div className="text-xs text-muted-foreground">
                        Mayor rango alcanzado: <span className="font-medium">{highestRank}</span>
                        {node.rank?.highestRank?.code && (
                          <span className="ml-1 font-mono">({node.rank.highestRank.code})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Acción principal */}
          <Separator className="my-4 sm:my-6" />
          <div>
            <Button
              className="w-full h-10 sm:h-12 text-sm sm:text-base"
              onClick={() => {
                onNavigate(node.id);
                onClose();
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <GitBranchPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Ver árbol de este usuario</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Navegación a hijos si existen */}
        {hasChildren && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Hijos directos:
            </p>
            <div className="flex flex-wrap gap-2">
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
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                  <span className="truncate max-w-[100px]">
                    {node.children?.left?.fullName ||
                      node.children?.left?.email.split("@")[0] ||
                      "Hijo Izq."}
                  </span>
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
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  <span className="truncate max-w-[100px]">
                    {node.children?.right?.fullName ||
                      node.children?.right?.email.split("@")[0] ||
                      "Hijo Der."}
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}