"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Home,
  ArrowUp,
  Users,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserTree } from "./hooks/useUserTree";
import { TreeNode } from "@/types/tree/tree.types";

export default function Tree() {
  const { data: session, status } = useSession();

  if (status === "loading") return <TreeLoading />;
  if (status === "unauthenticated") return <div>Debes iniciar sesión</div>;

  // Asegurarse de que el usuario tenga un ID
  if (!session?.user?.id) {
    return <div>No se pudo obtener la información del usuario</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Árbol de Red</h1>
        <p className="text-muted-foreground">
          Gestiona la estructura de tu red de usuarios
        </p>
      </div>

      <HierarchicalTreeView userId={session.user.id} />
    </div>
  );
}

function TreeLoading() {
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-1/4 mb-2" />
        <Skeleton className="h-5 w-2/4" />
      </div>
      <div className="h-[600px] relative">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}

function HierarchicalTreeView({ userId }: { userId: string }) {
  const {
    nodeContext,
    nodeLoading,
    refreshTree,
    navigateToNode,
    navigateToParent,
    navigateToRoot,
    descendantDepth,
    changeTreeDepth,
  } = useUserTree(userId, 3);

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleZoomIn = () => {
    if (descendantDepth < 5) {
      changeTreeDepth(descendantDepth + 1);
    }
  };

  const handleZoomOut = () => {
    if (descendantDepth > 1) {
      changeTreeDepth(descendantDepth - 1);
    }
  };

  if (nodeLoading) {
    return <TreeLoading />;
  }

  return (
    <div className="relative">
      {/* Navigation Controls */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
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
          disabled={
            !nodeContext?.ancestors || nodeContext.ancestors.length === 0
          }
          title="Subir al nodo padre"
        >
          <ArrowUp className="h-4 w-4" />
          <span>Subir</span>
        </Button>

        {/* Ancestor breadcrumb navigation */}
        {nodeContext?.ancestors && nodeContext.ancestors.length > 0 && (
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
                {nodeContext.ancestors.map((ancestor) => (
                  <DropdownMenuItem
                    key={ancestor.id}
                    onClick={() => navigateToNode(ancestor.id)}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{ancestor.fullName || ancestor.email}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Zoom and Refresh Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={refreshTree}
          title="Actualizar"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={descendantDepth >= 5}
          title="Mostrar más niveles"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={descendantDepth <= 1}
          title="Mostrar menos niveles"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Tree visualization */}
      <div className="border rounded-lg bg-muted/10 p-8 overflow-auto min-h-[600px] max-h-[800px] flex items-start justify-center">
        <div className="flex flex-col items-center">
          {nodeContext?.node ? (
            <div className="relative">
              {/* Breadcrumb path indicator */}
              {nodeContext.ancestors && nodeContext.ancestors.length > 0 && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-full shadow-sm border">
                  <span className="font-medium">Ruta:</span>
                  {nodeContext.ancestors
                    .slice(0, 3)
                    .map((ancestor, index, arr) => (
                      <React.Fragment key={ancestor.id}>
                        <button
                          className="hover:text-foreground transition-colors truncate max-w-[80px]"
                          onClick={() => navigateToNode(ancestor.id)}
                        >
                          {ancestor.fullName || ancestor.email.split("@")[0]}
                        </button>
                        {index < arr.length - 1 && <span>›</span>}
                      </React.Fragment>
                    ))}
                  {nodeContext.ancestors.length > 3 && <span>...</span>}
                  <span>›</span>
                  <span className="font-medium">
                    {nodeContext.node.fullName ||
                      nodeContext.node.email.split("@")[0]}
                  </span>
                </div>
              )}

              <TreeNodeHierarchy
                node={nodeContext.node}
                onNodeClick={navigateToNode}
                onNodeHover={setHoveredNode}
                hoveredNodeId={hoveredNode}
                currentNodeId={nodeContext.node.id}
                isRoot={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <User className="h-16 w-16 text-muted mb-4" />
              <p className="text-muted-foreground">
                No hay datos disponibles para visualizar
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Node detail popup */}
      {hoveredNode && (
        <NodeDetailPopup
          node={findNodeById(nodeContext?.node, hoveredNode)}
          onClose={() => setHoveredNode(null)}
          onNavigate={navigateToNode}
        />
      )}
    </div>
  );
}

function TreeNodeHierarchy({
  node,
  onNodeClick,
  onNodeHover,
  hoveredNodeId,
  currentNodeId,
  isRoot = false,
  depth = 0,
  showNavigationButtons = true,
}: {
  node: TreeNode;
  onNodeClick: (id: string) => void;
  onNodeHover: (id: string | null) => void;
  hoveredNodeId: string | null;
  currentNodeId: string;
  isRoot?: boolean;
  depth?: number;
  showNavigationButtons?: boolean;
}) {
  // Determine if this node has children to show
  const hasChildren = node.children?.left || node.children?.right;
  const hasOnlyOneChild =
    (node.children?.left && !node.children?.right) ||
    (!node.children?.left && node.children?.right);

  // Calculate classes based on node properties
  const isHovered = hoveredNodeId === node.id;
  const isCurrent = currentNodeId === node.id;

  return (
    <div className="flex flex-col items-center">
      {/* Node representation */}
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
                {isRoot
                  ? "USUARIO"
                  : depth === 1
                  ? "HIJO"
                  : depth === 2
                  ? "NIETO"
                  : depth === 3
                  ? "BISNIETO"
                  : "DESCENDIENTE"}
              </p>

              {/* Child navigation buttons */}
              {showNavigationButtons && hasChildren && (
                <div className="flex justify-center mt-2 gap-1">
                  {node.children?.left && (
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

                  {node.children?.right && (
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

      {/* Tree branch for children */}
      {hasChildren && (
        <>
          {/* Vertical line from parent to children */}
          <div className="h-8 w-px bg-border"></div>

          {/* Horizontal line connecting children */}
          <div
            className={`relative ${
              hasOnlyOneChild ? "w-0" : "w-[400px] sm:w-[500px] md:w-[700px]"
            } h-px bg-border`}
          >
            {/* Only show horizontal connectors if there are two children */}
            {!hasOnlyOneChild && (
              <>
                <div className="absolute left-0 top-0 h-4 w-px bg-border"></div>
                <div className="absolute right-0 top-0 h-4 w-px bg-border"></div>
              </>
            )}
          </div>

          {/* Children nodes */}
          <div
            className={`
            flex ${hasOnlyOneChild ? "flex-col" : "flex-row"} 
            justify-center items-start gap-4 md:gap-8 lg:gap-16
          `}
          >
            {node.children?.left && (
              <div className="flex flex-col items-center">
                <TreeNodeHierarchy
                  node={node.children.left}
                  onNodeClick={onNodeClick}
                  onNodeHover={onNodeHover}
                  hoveredNodeId={hoveredNodeId}
                  currentNodeId={currentNodeId}
                  depth={depth + 1}
                />
              </div>
            )}

            {node.children?.right && (
              <div className="flex flex-col items-center">
                <TreeNodeHierarchy
                  node={node.children.right}
                  onNodeClick={onNodeClick}
                  onNodeHover={onNodeHover}
                  hoveredNodeId={hoveredNodeId}
                  currentNodeId={currentNodeId}
                  depth={depth + 1}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function NodeDetailPopup({
  node,
  onClose,
  onNavigate,
}: {
  node?: TreeNode;
  onClose: () => void;
  onNavigate: (id: string) => void;
}) {
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
      <div className="mt-4 pt-3 border-t flex flex-wrap gap-2">
        {node.children?.left && (
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

        {node.children?.right && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              onNavigate(node.children!.right!.id);
              onClose();
            }}
          >
            <ArrowRight className="h-3 w-3" />
            <span>Hijo Der.</span>
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Utility function to find a node by ID in the tree
function findNodeById(rootNode?: TreeNode, id?: string): TreeNode | undefined {
  if (!rootNode || !id) return undefined;

  if (rootNode.id === id) return rootNode;

  // Check left child
  if (rootNode.children?.left) {
    const foundInLeft = findNodeById(rootNode.children.left, id);
    if (foundInLeft) return foundInLeft;
  }

  // Check right child
  if (rootNode.children?.right) {
    const foundInRight = findNodeById(rootNode.children.right, id);
    if (foundInRight) return foundInRight;
  }

  return undefined;
}
