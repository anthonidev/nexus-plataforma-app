// src/app/(dashboard)/tree/components/detail/NodeDetailSheet.tsx
import { Button } from "@/components/ui/button";
import { TreeNode } from "@/types/tree/tree.types";
import { 
  ChevronRight, 
  Mail, 
  User, 
  Hash, 
  GitBranchPlus, 
  Activity,
  ShieldCheck
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
                {node.fullName || node.email.split('@')[0]}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-1">
                <Badge variant={node.isActive ? "default" : "destructive"} className="text-xs">
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
                <Label className="text-xs sm:text-sm text-muted-foreground">Correo Electrónico</Label>
                <p className="font-medium text-sm sm:text-base break-all">{node.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">Código de Referencia</Label>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-medium text-sm sm:text-base">{node.referralCode}</p>
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
                <Label className="text-xs sm:text-sm text-muted-foreground">Posición</Label>
                <p className="font-medium text-sm sm:text-base">{node.position}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">Estado</Label>
                <div className="font-medium text-sm sm:text-base flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${node.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                  {node.isActive ? "Usuario activo" : "Usuario inactivo"}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div className="space-y-1 flex-1">
                <Label className="text-xs sm:text-sm text-muted-foreground">Posición en la Red</Label>
                <p className="font-medium text-sm sm:text-base">Nivel {node.depth} de profundidad</p>
              </div>
            </div>
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
            <p className="text-sm text-muted-foreground mb-3">Hijos directos:</p>
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
                    {node.children?.left?.fullName || node.children?.left?.email.split('@')[0] || "Hijo Izq."}
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
                    {node.children?.right?.fullName || node.children?.right?.email.split('@')[0] || "Hijo Der."}
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