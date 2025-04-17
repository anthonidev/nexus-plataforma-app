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

  // Para un solo hijo, mostrar una línea en forma de L
  if (hasOnlyOneChild) {
    const lineHeight = getLineHeight();
    const lineWidth = getLineWidth() / 2; // Usar la mitad del ancho para un solo hijo

    return (
      <div className="flex flex-col items-center w-full relative">
        {/* Línea vertical desde el padre */}
        <div
          className={`${getLineColorClass()} absolute`}
          style={{
            height: `${lineHeight / 2}px`,
            width: '1px',
            top: '0',
            left: '50%'
          }}
        ></div>

        {/* Contenedor para la línea horizontal y la extensión vertical */}
        <div className="relative w-full h-full" style={{ height: `${lineHeight}px` }}>
          {/* Línea horizontal */}
          <div
            className={`${getLineColorClass()} absolute`}
            style={{
              width: position === "left" ? `${lineWidth}px` : position === "right" ? `${lineWidth}px` : '1px',
              height: '1px',
              top: `${lineHeight / 2}px`,
              left: position === "left" ? `calc(50% - ${lineWidth}px)` : position === "right" ? '50%' : '50%',
            }}
          ></div>

          {/* Línea vertical que baja hacia el hijo */}
          <div
            className={`${getLineColorClass()} absolute`}
            style={{
              width: '1px',
              height: `${lineHeight / 2}px`,
              top: `${lineHeight / 2}px`,
              left: position === "left" ? `calc(50% - ${lineWidth}px)` : position === "right" ? `calc(50% + ${lineWidth}px)` : '50%',
            }}
          ></div>
        </div>
      </div>
    );
  }

  // Para dos hijos, mostrar una línea en forma de T
  return (
    <div className="flex flex-col items-center relative w-full">
      {/* Vertical line from parent to horizontal connector */}
      <div
        className={`${getLineColorClass()} absolute`}
        style={{
          height: `${getLineHeight() / 2}px`,
          width: '1px',
          top: '0',
          left: '50%'
        }}
      ></div>

      {/* Container for horizontal and vertical extensions */}
      <div className="relative w-full" style={{ height: `${getLineHeight()}px` }}>
        {/* Horizontal line connecting children */}
        <div
          className={`${getLineColorClass()} absolute`}
          style={{
            width: `${getLineWidth()}px`,
            height: '1px',
            top: `${getLineHeight() / 2}px`,
            left: `calc(50% - ${getLineWidth() / 2}px)`
          }}
        ></div>

        {/* Left connector */}
        <div
          className={`${getLineColorClass()} absolute`}
          style={{
            width: '1px',
            height: `${getLineHeight() / 2}px`,
            top: `${getLineHeight() / 2}px`,
            left: `calc(50% - ${getLineWidth() / 2}px)`
          }}
        ></div>

        {/* Right connector */}
        <div
          className={`${getLineColorClass()} absolute`}
          style={{
            width: '1px',
            height: `${getLineHeight() / 2}px`,
            top: `${getLineHeight() / 2}px`,
            left: `calc(50% + ${getLineWidth() / 2}px)`
          }}
        ></div>
      </div>
    </div>
  );
}