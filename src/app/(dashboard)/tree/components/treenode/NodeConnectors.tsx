// src/app/(dashboard)/tree/components/treenode/NodeConnectors.tsx

interface NodeConnectorsProps {
  hasOnlyOneChild: boolean;
  zoomLevel?: number; // Nuevo prop para ajustar conectores según zoom
}

export default function NodeConnectors({ 
  hasOnlyOneChild,
  zoomLevel = 2
}: NodeConnectorsProps) {
  // Calcular alturas y anchuras de los conectores basado en el zoom
  const getLineHeight = () => {
    switch(zoomLevel) {
      case 1: return 64;
      case 2: return 56;
      case 3: return 48;
      case 4: return 40;
      case 5: return 32;
      default: return 56;
    }
  };

  const getLineWidth = () => {
    switch(zoomLevel) {
      case 1: return 240;
      case 2: return 200;
      case 3: return 160;
      case 4: return 120;
      case 5: return 100;
      default: return 200;
    }
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