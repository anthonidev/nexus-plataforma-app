// src/app/(dashboard)/tree/components/TreeControls/NavigationControls.tsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TreeNode } from "@/types/tree/tree.types";
import { ArrowUp, ChevronDown, Home, Users } from "lucide-react";

interface NavigationControlsProps {
  ancestors: TreeNode[] | undefined;
  navigateToRoot: () => void;
  navigateToParent: () => void;
  navigateToNode: (id: string) => void;
}

export default function NavigationControls({
  ancestors,
  navigateToRoot,
  navigateToParent,
  navigateToNode,
}: NavigationControlsProps) {
  const hasAncestors = ancestors && ancestors.length > 0;

  return (
    <div className="flex gap-2 z-10">
      <Button
        variant="outline"
        size="sm"
        onClick={navigateToRoot}
        className="flex items-center gap-1"
        title="Ir a la raíz"
      >
        <Home className="h-4 w-4" />
        <span>Raíz</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={navigateToParent}
        className="flex items-center gap-1"
        disabled={!hasAncestors}
        title="Subir al nodo padre"
      >
        <ArrowUp className="h-4 w-4" />
        <span>Subir</span>
      </Button>

      {/* Ancestor breadcrumb navigation */}
      {hasAncestors && (
        <div className="relative ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Users className="h-4 w-4" />
                <span>Ancestros</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Ancestros</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ancestors.map((ancestor) => (
                <DropdownMenuItem
                  key={ancestor.id}
                  onClick={() => navigateToNode(ancestor.id)}
                  className="cursor-pointer"
                >
                  <span>{ancestor.fullName || ancestor.email}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}