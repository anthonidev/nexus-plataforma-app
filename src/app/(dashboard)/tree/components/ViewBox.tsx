"use client";
import React, { useState, useRef, useEffect } from 'react';

interface ViewBoxProps {
  children: React.ReactNode;
  initialZoom?: number;
  className?: string;
}

export default function ViewBox({ children, initialZoom = 1, className = "" }: ViewBoxProps) {
  const [scale, setScale] = useState(initialZoom);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Ajustar escala basada en el contenido y el contenedor
  useEffect(() => {
    const fitContentToContainer = () => {
      if (!containerRef.current || !contentRef.current) return;
      
      const container = containerRef.current;
      const content = contentRef.current;
      
      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;
      
      // Este factor asegura un pequeño margen a los lados
      const safetyFactor = 0.9;
      
      // Si el contenido es más ancho que el contenedor, SIEMPRE reducimos la escala
      // para prevenir scroll horizontal
      if (contentWidth > containerWidth * safetyFactor) {
        // Calcular escala para que todo el contenido sea visible sin scroll horizontal
        const newScale = (containerWidth * safetyFactor) / contentWidth;
        setScale(newScale);
      } else if (scale !== initialZoom) {
        // Solo restauramos al initialZoom si hemos cambiado antes
        setScale(initialZoom);
      }
      
      // Reiniciar la posición cuando cambia el contenido
      setPosition({ x: 0, y: 0 });
    };
    
    fitContentToContainer();
    
    // Observar cambios en el tamaño
    const resizeObserver = new ResizeObserver(fitContentToContainer);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    
    // También observamos cambios después de un pequeño retraso
    // para capturar actualizaciones posteriores a la renderización
    const timeout = setTimeout(fitContentToContainer, 300);
    
    // Limpiar al desmontar
    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeout);
    };
  }, [children, initialZoom, scale]);

  // Manejar eventos de arrastrar (panning)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Manejo de eventos táctiles para dispositivos móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartPos({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault(); // Prevenir scroll
    
    setPosition({
      x: e.touches[0].clientX - startPos.x,
      y: e.touches[0].clientY - startPos.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Controlar zoom con rueda del mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    // Ajustar escala basado en dirección de la rueda
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.2, scale + delta), 2); // Limitar zoom entre 0.2x y 2x
    
    // Verificar que el nuevo nivel de zoom no cause desbordamiento horizontal
    if (contentRef.current && containerRef.current) {
      const container = containerRef.current;
      const content = contentRef.current;
      
      const containerWidth = container.clientWidth;
      const contentWidthAfterZoom = (content.scrollWidth / scale) * newScale;
      
      // Si el contenido sería más ancho que el contenedor después del zoom,
      // calcular un nivel de zoom que ajuste perfectamente
      if (contentWidthAfterZoom > containerWidth * 0.95) {
        const constrainedScale = (containerWidth * 0.95) / (content.scrollWidth / scale);
        // Solo aplicar esta restricción si intentamos hacer zoom in
        if (delta > 0) {
          setScale(Math.min(newScale, constrainedScale));
          return;
        }
      }
    }
    
    setScale(newScale);
  };

  // Método para centrar el contenido
  const resetView = () => {
    setPosition({ x: 0, y: 0 });
    setScale(initialZoom);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden h-full w-full flex items-center justify-center ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div 
        ref={contentRef}
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          maxWidth: '100%' // Asegurar que el contenido nunca sea más ancho que el contenedor
        }}
        className="flex justify-center"
      >
        {children}
      </div>
      
      {/* Mini-controles de navegación - opcional */}
      <div className="absolute bottom-2 right-2 flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm border z-50">
        <button 
          onClick={() => {
            if (contentRef.current && containerRef.current) {
              const container = containerRef.current;
              const content = contentRef.current;
              const containerWidth = container.clientWidth;
              const contentWidthAfterZoom = (content.scrollWidth / scale) * (scale + 0.1);
              
              // Evitar zoom si causaría desbordamiento horizontal
              if (contentWidthAfterZoom <= containerWidth * 0.95) {
                setScale(Math.min(scale + 0.1, 2));
              }
            }
          }}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-xs"
          title="Acercar"
        >
          +
        </button>
        <button 
          onClick={() => setScale(Math.max(scale - 0.1, 0.2))}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-xs"
          title="Alejar"
        >
          -
        </button>
        <button 
          onClick={resetView}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-xs"
          title="Centrar"
        >
          ⊕
        </button>
      </div>
    </div>
  );
}