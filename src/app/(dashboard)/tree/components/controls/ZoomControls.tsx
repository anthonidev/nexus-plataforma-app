// src/app/(dashboard)/tree/components/controls/ZoomControls.tsx
import { Button } from "@/components/ui/button";
import { RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  refreshTree: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export default function ZoomControls({
  refreshTree,
  zoomIn,
  zoomOut,
  canZoomIn,
  canZoomOut,
}: ZoomControlsProps) {
  return (
    <div className="flex gap-2 z-10">
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
        onClick={zoomIn}
        disabled={!canZoomIn}
        title="Aumentar profundidad"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={zoomOut}
        disabled={!canZoomOut}
        title="Reducir profundidad"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
}