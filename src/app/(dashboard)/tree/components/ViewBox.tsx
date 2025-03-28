"use client";
import { useState, useEffect } from 'react';
import { Plus, Minus, XCircle } from 'lucide-react';

interface ViewBoxProps {
  children: React.ReactNode;
  initialZoom?: number;
  className?: string;
}

export default function ViewBox({ children, initialZoom = 1, className = "" }: ViewBoxProps) {
  // Estado para controlar el zoom y posición
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Estado para controlar el arrastre
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Limites de zoom
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 2;
  const ZOOM_STEP = 0.1;
  
  // Función para aumentar el zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };
  
  // Función para reducir el zoom
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };
  
  // Función para resetear la vista
  const handleReset = () => {
    setZoom(initialZoom);
    setPosition({ x: 0, y: 0 });
  };
  
  // Eventos de ratón para arrastrar (mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Eventos táctiles para arrastrar (touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Evento de rueda para zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.01;
    setZoom(prev => {
      const newZoom = prev + delta;
      return Math.max(MIN_ZOOM, Math.min(newZoom, MAX_ZOOM));
    });
  };
  
  // Efecto para limpiar los eventos cuando el componente se desmonta
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);
  
  return (
    <div 
      className={`relative overflow-hidden h-full w-full ${className}`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Contenido con transformación */}
      <div 
        className="flex justify-center items-center w-full h-full"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.2s ease',
        }}
      >
        {children}
      </div>
      
      {/* Controles de zoom */}
      <div className="absolute bottom-3 right-3 flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm border z-50">
        <button 
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
          title="Acercar"
        >
          <Plus size={16} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
          title="Alejar"
        >
          <Minus size={16} />
        </button>
        <button 
          onClick={handleReset}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted transition-colors"
          title="Restablecer vista"
        >
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
}