// src/app/(dashboard)/tree/components/treenode/NodeConnectors.tsx

interface NodeConnectorsProps {
  hasOnlyOneChild: boolean;
  zoomLevel?: number;
  isMobile?: boolean;
}

export default function NodeConnectors({ 
  hasOnlyOneChild,
  zoomLevel = 2,
  isMobile = false
}: NodeConnectorsProps) {
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
    if (isMobile) {
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
    if (isMobile) {
      return baseWidth[zoomLevel as keyof typeof baseWidth] * 0.7;
    }
    
    return baseWidth[zoomLevel as keyof typeof baseWidth];
  };

  return (
    <div className="flex flex-col items-center">
      {/* Vertical line from parent to children - single straight line */}
      <div 
        className="bg-gray-300 dark:bg-gray-600" 
        style={{ height: `${getLineHeight()}px`, width: '1px' }}
      ></div>

      {/* Horizontal line connecting children */}
      <div className="flex items-center justify-center w-full">
        <div
          className="relative bg-gray-300 dark:bg-gray-600"
          style={{ 
            width: hasOnlyOneChild ? '0px' : `${getLineWidth()}px`,
            height: '1px'
          }}
        >
          {/* Only show vertical connectors if there are two children */}
          {!hasOnlyOneChild && (
            <>
              <div 
                className="absolute bg-gray-300 dark:bg-gray-600" 
                style={{ 
                  left: '0', 
                  top: '0', 
                  width: '1px', 
                  height: `${getLineHeight()}px` 
                }}
              ></div>
              <div 
                className="absolute bg-gray-300 dark:bg-gray-600" 
                style={{ 
                  right: '0', 
                  top: '0', 
                  width: '1px', 
                  height: `${getLineHeight()}px` 
                }}
              ></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}