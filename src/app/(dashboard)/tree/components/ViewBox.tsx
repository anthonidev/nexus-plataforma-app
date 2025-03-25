"use client";
import React, { useState, useRef, useEffect } from 'react';

interface ViewBoxProps {
  children: React.ReactNode;
  initialZoom?: number;
  className?: string;
}

export default function ViewBox({ children, initialZoom = 1, className = "" }: ViewBoxProps) {
  const [scale, setScale] = useState(initialZoom);
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
      
      // Si el contenido es más ancho que el contenedor, reducir la escala
      if (contentWidth > containerWidth) {
        const newScale = containerWidth / (contentWidth + 40); // 40px de padding
        setScale(Math.min(1, newScale));
      } else {
        setScale(1);
      }
    };
    
    fitContentToContainer();
    
    // Observar cambios en el tamaño
    const resizeObserver = new ResizeObserver(fitContentToContainer);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden h-full w-full flex items-center justify-center ${className}`}
    >
      <div 
        ref={contentRef}
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: 'center top',
          transition: 'transform 0.3s ease'
        }}
        className="flex justify-center"
      >
        {children}
      </div>
    </div>
  );
}