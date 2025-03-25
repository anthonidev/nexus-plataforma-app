// src/app/(dashboard)/tree/components/controls/ZoomControls.tsx
import { Button } from "@/components/ui/button";
import { RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";

interface ZoomControlsProps {
  refreshTree: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  isMobile?: boolean;
}

export default function ZoomControls({
  refreshTree,
  zoomIn,
  zoomOut,
  canZoomIn,
  canZoomOut,
  isMobile = false
}: ZoomControlsProps) {
  // Detectar automáticamente dispositivos móviles si no se proporciona la prop
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (isMobile !== undefined) return;
    
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [isMobile]);

  // Determinar si usar el valor de isMobile proporcionado o el calculado
  const useSmallLayout = isMobile !== undefined ? isMobile : isSmallScreen;

  return (
    <div className={`flex gap-2 z-10 ${useSmallLayout ? 'w-full justify-end' : ''}`}>
      <Button
        variant="outline"
        size={useSmallLayout ? "sm" : "icon"}
        onClick={refreshTree}
        title="Actualizar"
        className={useSmallLayout ? "flex items-center gap-1" : ""}
      >
        <RefreshCw className="h-4 w-4" />
        {useSmallLayout && <span className="text-xs">Actualizar</span>}
      </Button>
      
      <Button
        variant="outline"
        size={useSmallLayout ? "sm" : "icon"}
        onClick={zoomIn}
        disabled={!canZoomIn}
        title="Aumentar profundidad"
        className={useSmallLayout ? "flex items-center gap-1" : ""}
      >
        <ZoomIn className="h-4 w-4" />
        {useSmallLayout && <span className="text-xs">Ampliar</span>}
      </Button>
      
      <Button
        variant="outline"
        size={useSmallLayout ? "sm" : "icon"}
        onClick={zoomOut}
        disabled={!canZoomOut}
        title="Reducir profundidad"
        className={useSmallLayout ? "flex items-center gap-1" : ""}
      >
        <ZoomOut className="h-4 w-4" />
        {useSmallLayout && <span className="text-xs">Reducir</span>}
      </Button>
    </div>
  );
}