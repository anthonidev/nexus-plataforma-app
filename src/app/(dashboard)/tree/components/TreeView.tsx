// src/app/(dashboard)/tree/components/TreeView.tsx
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { findNodeById } from "../utils/tree-utils";
import { useUserTree } from "../hooks/useUserTree";
import TreeControls from "./controls";
import TreeNodeHierarchy from "./treenode/TreeNodeHierarchy";
import NodeDetailSheet from "./detail/NodeDetailSheet";
import ViewBox from "./ViewBox";

interface TreeViewProps {
  userId: string;
  initialDepth?: number;
}

export default function TreeView({ userId, initialDepth = 2 }: TreeViewProps) {
  const {
    nodeContext,
    nodeLoading,
    refreshTree,
    navigateToNode,
    navigateToParent,
    navigateToRoot,
    descendantDepth,
    changeTreeDepth,
  } = useUserTree(userId, initialDepth);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Función para manejar la selección de un nodo (para mostrar detalles)
  const handleNodeSelect = (id: string) => {
    setSelectedNodeId(id);
  };
  
  // Función para manejar el hover sobre un nodo
  const handleNodeHover = (id: string | null) => {
    setHoveredNodeId(id);
  };
  
  // Función para manejar la navegación desde el sheet
  const handleSheetNavigate = (id: string) => {
    navigateToNode(id);
    setSelectedNodeId(id);
  };

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

  // Determinar si estamos en mobile para ajustes responsive
  const isMobile = windowWidth < 768;

  if (!nodeContext?.node) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <User className="h-16 w-16 text-muted mb-4" />
        <p className="text-muted-foreground">
          No hay datos disponibles para visualizar
        </p>
      </div>
    );
  }

  const selectedNode = selectedNodeId 
    ? findNodeById(nodeContext.node, selectedNodeId) 
    : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Controls section - fixed height */}
      <div className="mb-4">
        <TreeControls
          ancestors={nodeContext.ancestors}
          currentNode={nodeContext.node}
          navigateToRoot={navigateToRoot}
          navigateToParent={navigateToParent}
          navigateToNode={navigateToNode}
          refreshTree={refreshTree}
          descendantDepth={descendantDepth}
          handleZoomIn={handleZoomIn}
          handleZoomOut={handleZoomOut}
        />
      </div>

      {/* Tree visualization container */}
      <div className="flex-1 flex flex-col">
        <div 
          className="border rounded-lg bg-muted/10 flex-1 relative overflow-hidden" 
          style={{ 
            minHeight: isMobile ? "450px" : "600px", 
            maxHeight: isMobile ? "calc(100vh - 200px)" : "calc(100vh - 250px)"
          }}
        >
          {nodeLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando árbol...</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 overflow-hidden">
              <ViewBox 
                initialZoom={isMobile ? 0.75 : 0.9}
                className="w-full h-full"
              >
                <div className="pt-8 px-4">
                  <TreeNodeHierarchy
                    node={nodeContext.node}
                    onNodeClick={handleNodeSelect}
                    onNodeHover={handleNodeHover}
                    hoveredNodeId={hoveredNodeId}
                    currentNodeId={nodeContext.node.id}
                    ancestors={nodeContext.ancestors}
                    isRoot={true}
                    navigateToNode={navigateToNode}
                    zoomLevel={descendantDepth}
                    maxDepthToRender={descendantDepth + 1} // Limitar renderizado para evitar expansión excesiva
                  />
                </div>
              </ViewBox>
            </div>
          )}
        </div>
      </div>

      {/* Node detail sheet */}
      <NodeDetailSheet 
        node={selectedNode}
        isOpen={!!selectedNodeId}
        onClose={() => setSelectedNodeId(null)}
        onNavigate={handleSheetNavigate}
      />
    </div>
  );
}