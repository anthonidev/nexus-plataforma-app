// src/app/(dashboard)/tree/components/treenode/NodeConnectors.tsx
import { useEffect, useState } from "react";

interface NodeConnectorsProps {
  hasOnlyOneChild: boolean;
  position?: "left" | "right" | "center";
  zoomLevel?: number;
  isMobile?: boolean;
}

export default function NodeConnectors({ 
  hasOnlyOneChild,
  position = "center",
  zoomLevel = 2,
  isMobile = false
}: NodeConnectorsProps) {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Actualizar el ancho de la ventana en cambios de tamaño
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determinar si estamos en un dispositivo móvil basado en el ancho de la ventana
  const isSmallScreen = windowWidth < 768;
  const effectiveMobile = isMobile || isSmallScreen;

  // Calcular alturas y anchuras de los conectores basado en el zoom y dispositivo
  const getLineHeight = () => {
    const baseHeight = {
      1: 64,
      2: 56,
      3: 48,
      4: 40,
      5: 32
    };
    
    // Reducir altura para móviles
    if (effectiveMobile) {
      return baseHeight[zoomLevel as keyof typeof baseHeight] * 0.8;
    }
    
    return baseHeight[zoomLevel as keyof typeof baseHeight];
  };

  const getLineWidth = () => {
    const baseWidth = {
      1: 240,
      2: 200,
      3: 160,
      4: 120,
      5: 100
    };
    
    // Reducir anchura para móviles
    if (effectiveMobile) {
      return baseWidth[zoomLevel as keyof typeof baseWidth] * 0.7;
    }
    
    return baseWidth[zoomLevel as keyof typeof baseWidth];
  };

  // Determinar las clases de color basadas en la posición
  const getLineColorClass = () => {
    return "bg-gray-300 dark:bg-gray-600";
  };

  // Para un solo hijo, mostrar una línea recta vertical
  if (hasOnlyOneChild) {
    return (
      <div className="flex flex-col items-center relative">
        <div 
          className={`${getLineColorClass()} transition-all duration-300`} 
          style={{ 
            height: `${getLineHeight()}px`, 
            width: '1px'
          }}
        ></div>
      </div>
    );
  }

  // Para dos hijos, mostrar una línea en forma de T
  return (
    <div className="flex flex-col items-center relative">
      {/* Vertical line from parent to children */}
      <div 
        className={`${getLineColorClass()} transition-all duration-300`} 
        style={{ 
          height: `${getLineHeight() / 2}px`, 
          width: '1px'
        }}
      ></div>

      {/* Horizontal line connecting children */}
      <div className="flex items-center justify-center w-full relative">
        <div
          className={`${getLineColorClass()} transition-all duration-300`}
          style={{ 
            width: `${getLineWidth()}px`,
            height: '1px'
          }}
        >
          {/* Left connector */}
          <div 
            className={`absolute ${getLineColorClass()} transition-all duration-300`} 
            style={{ 
              left: '0', 
              top: '0', 
              width: '1px', 
              height: `${getLineHeight() / 2}px` 
            }}
          ></div>
          
          {/* Right connector */}
          <div 
            className={`absolute ${getLineColorClass()} transition-all duration-300`} 
            style={{ 
              right: '0', 
              top: '0', 
              width: '1px', 
              height: `${getLineHeight() / 2}px` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}