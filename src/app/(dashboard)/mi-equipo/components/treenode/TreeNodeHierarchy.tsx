import { TreeNode } from "@/types/tree/tree.types";
import NodeCard from "./NodeCard";
import NodeConnectors from "./NodeConnectors";
import { BreadcrumbPath } from "../controls";
import { useEffect, useState, useMemo } from "react";

interface TreeNodeHierarchyProps {
  node: TreeNode;
  onNodeClick: (id: string) => void;
  onNodeHover?: (id: string | null) => void;
  hoveredNodeId?: string | null;
  currentNodeId: string;
  ancestors?: TreeNode[];
  isRoot?: boolean;
  depth?: number;
  navigateToNode?: (id: string) => void;
  zoomLevel?: number;
  position?: "left" | "right" | "center";
  maxDepthToRender?: number;
}

export default function TreeNodeHierarchy({
  node,
  onNodeClick,
  onNodeHover,
  hoveredNodeId,
  currentNodeId,
  ancestors,
  isRoot = false,
  depth = 0,
  navigateToNode,
  zoomLevel = 2,
  position = "center",
  maxDepthToRender,
}: TreeNodeHierarchyProps) {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Determine if this node has children
  const hasLeftChild = !!node.children?.left;
  const hasRightChild = !!node.children?.right;
  const hasChildren = hasLeftChild || hasRightChild;
  const hasOnlyOneChild = (hasLeftChild && !hasRightChild) || (!hasLeftChild && hasRightChild);

  // Determine which child exists (if there's only one)
  const childPosition = hasLeftChild ? "left" : "right";

  // Determine if node is current
  const isCurrent = currentNodeId === node.id;

  // Determine if we should render children based on max depth
  const shouldRenderChildren =
    maxDepthToRender === undefined || depth < maxDepthToRender;

  // Actualizar el ancho de la ventana en cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determinar si estamos en un dispositivo móvil basado en el ancho de la ventana
  const isMobile = windowWidth < 768;

  // Calcular el espacio entre nodos basado en el zoom y el dispositivo
  const getSpacing = useMemo(() => {
    // Base spacing by zoom level
    const baseSpacing = {
      1: { desktop: 48, mobile: 34 },
      2: { desktop: 38, mobile: 27 },
      3: { desktop: 28, mobile: 20 },
      4: { desktop: 20, mobile: 14 },
      5: { desktop: 14, mobile: 10 },
    };

    return isMobile
      ? baseSpacing[zoomLevel as keyof typeof baseSpacing].mobile
      : baseSpacing[zoomLevel as keyof typeof baseSpacing].desktop;
  }, [zoomLevel, isMobile]);

  // Obtener clases para contenedor de nodo basadas en nivel y posición
  const getNodeContainerClasses = () => {
    if (isRoot) return "flex flex-col items-center max-w-full relative z-10";
    return "flex flex-col items-center max-w-full relative";
  };

  // Si la profundidad es demasiado grande y no es el nodo actual o ancestro,
  // renderizar una versión simplificada para mejorar el rendimiento
  if (depth > 3 && !isCurrent && !isRoot && !shouldRenderChildren) {
    return (
      <div className={getNodeContainerClasses()}>
        <NodeCard
          node={node}
          onNodeClick={onNodeClick}
          onNodeHover={onNodeHover}
          isHovered={hoveredNodeId === node.id}
          isCurrent={isCurrent}
          isRoot={isRoot}
          depth={depth}
          hasLeftChild={hasLeftChild}
          hasRightChild={hasRightChild}
          showNavigationButtons={false}
          zoomLevel={zoomLevel}
        />

        {hasChildren && (
          <div className="flex flex-col items-center mt-1">
            <div className="bg-muted w-6 h-6 rounded-full flex items-center justify-center text-xs text-muted-foreground">
              {(hasLeftChild ? 1 : 0) + (hasRightChild ? 1 : 0)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={getNodeContainerClasses()}>
      {/* Breadcrumb path indicator for root node only */}
      {isRoot && ancestors && ancestors.length > 0 && navigateToNode && (
        <div className="relative mb-2">
          <div className="relative">
            <BreadcrumbPath
              ancestors={ancestors}
              currentNode={node}
              navigateToNode={navigateToNode}
            />
          </div>
        </div>
      )}

      {/* Node card */}
      <NodeCard
        node={node}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
        isHovered={hoveredNodeId === node.id}
        isCurrent={isCurrent}
        isRoot={isRoot}
        depth={depth}
        hasLeftChild={hasLeftChild}
        hasRightChild={hasRightChild}
        showNavigationButtons={false}
        zoomLevel={zoomLevel}
      />

      {/* Tree branches and child nodes */}
      {hasChildren && shouldRenderChildren && (
        <div className="flex flex-col items-center w-full">
          {/* Conector adaptado al tipo de estructura */}
          <div className="w-full h-full">
            <NodeConnectors
              hasOnlyOneChild={hasOnlyOneChild}
              position={hasOnlyOneChild ? childPosition : "center"}
              zoomLevel={zoomLevel}
              isMobile={isMobile}
            />
          </div>

          {/* Estructura para mostrar los nodos hijos */}
          <div className="w-full flex justify-center items-start transition-all"
            style={{ gap: hasOnlyOneChild ? '0' : `${getSpacing}px` }}>
            {/* Caso de un solo hijo: posicionar a la izquierda o derecha según corresponda */}
            {hasOnlyOneChild ? (
              <div className={`w-full flex ${hasLeftChild ? 'justify-start' : 'justify-end'}`}>
                <div className="flex flex-col items-center">
                  {hasLeftChild && (
                    <TreeNodeHierarchy
                      node={node.children!.left!}
                      onNodeClick={onNodeClick}
                      onNodeHover={onNodeHover}
                      hoveredNodeId={hoveredNodeId}
                      currentNodeId={currentNodeId}
                      depth={depth + 1}
                      zoomLevel={zoomLevel}
                      position="left"
                      maxDepthToRender={maxDepthToRender}
                    />
                  )}
                  {hasRightChild && (
                    <TreeNodeHierarchy
                      node={node.children!.right!}
                      onNodeClick={onNodeClick}
                      onNodeHover={onNodeHover}
                      hoveredNodeId={hoveredNodeId}
                      currentNodeId={currentNodeId}
                      depth={depth + 1}
                      zoomLevel={zoomLevel}
                      position="right"
                      maxDepthToRender={maxDepthToRender}
                    />
                  )}
                </div>
              </div>
            ) : (
              /* Caso de dos hijos: mostrarlos lado a lado */
              <>
                {/* Left child */}
                {hasLeftChild && (
                  <div className="flex-1 flex justify-end">
                    <TreeNodeHierarchy
                      node={node.children!.left!}
                      onNodeClick={onNodeClick}
                      onNodeHover={onNodeHover}
                      hoveredNodeId={hoveredNodeId}
                      currentNodeId={currentNodeId}
                      depth={depth + 1}
                      zoomLevel={zoomLevel}
                      position="left"
                      maxDepthToRender={maxDepthToRender}
                    />
                  </div>
                )}

                {/* Right child */}
                {hasRightChild && (
                  <div className="flex-1 flex justify-start">
                    <TreeNodeHierarchy
                      node={node.children!.right!}
                      onNodeClick={onNodeClick}
                      onNodeHover={onNodeHover}
                      hoveredNodeId={hoveredNodeId}
                      currentNodeId={currentNodeId}
                      depth={depth + 1}
                      zoomLevel={zoomLevel}
                      position="right"
                      maxDepthToRender={maxDepthToRender}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Indicador de hijos no renderizados */}
      {hasChildren && !shouldRenderChildren && (
        <div className="mt-1 p-1 bg-muted/50 rounded-md text-xs text-muted-foreground">
          +{(hasLeftChild ? 1 : 0) + (hasRightChild ? 1 : 0)} más
        </div>
      )}
    </div>
  );
}