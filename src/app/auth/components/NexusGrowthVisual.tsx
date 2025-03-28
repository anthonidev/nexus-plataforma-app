"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  TrendingUp,
  BarChart4,
  LineChart,
  DollarSign,
  Users,
  Network,
  Award,
  Sparkles,
} from "lucide-react";

/**
 * NexusGrowthVisual - Visualización que simboliza crecimiento, finanzas y conexiones
 * Una alternativa al globo que representa mejor los valores centrales de Nexus
 */
const NexusGrowthVisual = ({ size = 300 }) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  // Inicializar la visualización
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  // Colores según el tema
  const colors = {
    primary: isDark ? "rgb(20, 184, 166)" : "rgb(13, 148, 136)",
    secondary: isDark ? "rgb(16, 185, 129)" : "rgb(5, 150, 105)",
    accent: isDark ? "rgb(139, 92, 246)" : "rgb(124, 58, 237)",
    highlight: isDark ? "rgb(251, 191, 36)" : "rgb(245, 158, 11)",
    subtle: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: isDark ? "rgb(229, 231, 235)" : "rgb(31, 41, 55)",
    background: isDark ? "rgb(30, 41, 59)" : "rgb(243, 244, 246)",
    glow: isDark ? "rgba(56, 189, 248, 0.15)" : "rgba(6, 182, 212, 0.1)",
  };

  // Definición de los datos de crecimiento (para el gráfico)
  const growthData = [
    { month: "Ene", value: 20 },
    { month: "Feb", value: 30 },
    { month: "Mar", value: 25 },
    { month: "Abr", value: 40 },
    { month: "May", value: 45 },
    { month: "Jun", value: 55 },
    { month: "Jul", value: 65 },
    { month: "Ago", value: 60 },
    { month: "Sep", value: 70 },
    { month: "Oct", value: 85 },
    { month: "Nov", value: 90 },
    { month: "Dic", value: 100 },
  ];

  // Secciones del hexágono que representan áreas de negocio
  const hexagonSections = [
    {
      name: "Inversiones",
      icon: <TrendingUp size={22} />,
      color: colors.primary,
    },
    {
      name: "Crecimiento",
      icon: <LineChart size={22} />,
      color: colors.secondary,
    },
    {
      name: "Finanzas",
      icon: <DollarSign size={22} />,
      color: colors.highlight,
    },
    { name: "Red", icon: <Network size={22} />, color: colors.accent },
    { name: "Comunidad", icon: <Users size={22} />, color: colors.primary },
    { name: "Premios", icon: <Award size={22} />, color: colors.secondary },
  ];

  // Generar conexiones entre secciones
  const generateConnections = () => {
    const connections = [];
    for (let i = 0; i < hexagonSections.length; i++) {
      // Conectar con 2 secciones no adyacentes para crear una red
      const connectTo1 = (i + 2) % hexagonSections.length;
      const connectTo2 = (i + 3) % hexagonSections.length;

      connections.push({
        from: i,
        to: connectTo1,
        opacity: 0.5 + Math.random() * 0.3,
        animationDuration: 3 + Math.random() * 2,
      });

      connections.push({
        from: i,
        to: connectTo2,
        opacity: 0.3 + Math.random() * 0.3,
        animationDuration: 4 + Math.random() * 2,
      });
    }
    return connections;
  };

  const connections = generateConnections();

  // Cálculo de coordenadas en el hexágono
  const getHexagonPoint = (
    index: number,
    radius: number,
    offset = { x: 0, y: 0 }
  ) => {
    const angleStep = (2 * Math.PI) / hexagonSections.length;
    const angle = index * angleStep - Math.PI / 2; // Comenzando desde arriba

    return {
      x: offset.x + radius * Math.cos(angle),
      y: offset.y + radius * Math.sin(angle),
    };
  };

  // Generar partículas de "valor" que suben por el gráfico
  const valueParticles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: 4 + Math.random() * 6,
    startX: 15 + Math.random() * 70, // Posición horizontal aleatoria
    startY: 85 - Math.random() * 20, // Comienza cerca de la base
    opacity: 0.5 + Math.random() * 0.5,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
    color:
      Math.random() > 0.7
        ? colors.highlight
        : Math.random() > 0.4
        ? colors.primary
        : colors.secondary,
  }));

  // Calcular el centro del hexágono
  const center = { x: size / 2, y: size / 2 };

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible"
      style={{ width: size, height: size }}
    >
      {/* Fondo con gradiente */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.background}, ${colors.background} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.8 : 0 }}
        transition={{ duration: 1 }}
      />

      {/* Efecto de resplandor central */}
      <motion.div
        className="absolute rounded-full blur-2xl"
        style={{
          width: size * 0.5,
          height: size * 0.5,
          left: size * 0.25,
          top: size * 0.25,
          background: colors.glow,
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Estructura hexagonal con secciones interactivas */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 0.8,
          rotate: 0,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Hexágono central */}
        <motion.div
          className="absolute"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            boxShadow: `0 0 20px 0 ${colors.primary}40`,
          }}
          animate={{
            boxShadow: [
              `0 0 20px 0 ${colors.primary}40`,
              `0 0 30px 5px ${colors.primary}60`,
              `0 0 20px 0 ${colors.primary}40`,
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Logo de Nexus en el centro */}
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
        </motion.div>

        {/* Secciones hexagonales */}
        {hexagonSections.map((section, index) => {
          const point = getHexagonPoint(index, size * 0.35, center);
          const isHovered = hoveredSection === index;

          return (
            <React.Fragment key={`section-${index}`}>
              {/* Conexiones entre secciones (líneas) */}
              {connections
                .filter((conn) => conn.from === index)
                .map((conn, connIndex) => {
                  const startPoint = getHexagonPoint(
                    conn.from,
                    size * 0.35,
                    center
                  );
                  const endPoint = getHexagonPoint(
                    conn.to,
                    size * 0.35,
                    center
                  );

                  // Calcular la longitud y el ángulo para la línea
                  const dx = endPoint.x - startPoint.x;
                  const dy = endPoint.y - startPoint.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                  return (
                    <motion.div
                      key={`conn-${index}-${connIndex}`}
                      className="absolute origin-left"
                      style={{
                        height: 2,
                        left: startPoint.x,
                        top: startPoint.y,
                        width: length,
                        rotate: angle,
                        opacity: conn.opacity,
                        background: `linear-gradient(to right, ${
                          section.color
                        }80, ${hexagonSections[conn.to].color}80)`,
                        transformOrigin: "left center",
                        zIndex: 1,
                      }}
                      animate={{
                        opacity: [
                          conn.opacity * 0.5,
                          conn.opacity,
                          conn.opacity * 0.5,
                        ],
                        height: [2, 3, 2],
                      }}
                      transition={{
                        duration: conn.animationDuration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}

              {/* Nodo de sección */}
              <motion.div
                className="absolute flex items-center justify-center cursor-pointer"
                style={{
                  width: size * 0.15,
                  height: size * 0.15,
                  left: point.x - size * 0.075,
                  top: point.y - size * 0.075,
                  borderRadius: "50%",
                  background: section.color,
                  boxShadow: `0 0 10px 0 ${section.color}80`,
                  zIndex: 2,
                }}
                whileHover={{
                  scale: 1.15,
                  boxShadow: `0 0 20px 5px ${section.color}80`,
                }}
                animate={{
                  scale: isHovered ? 1.15 : 1,
                  boxShadow: isHovered
                    ? `0 0 20px 5px ${section.color}80`
                    : `0 0 10px 0 ${section.color}80`,
                }}
                transition={{
                  duration: 0.3,
                  scale: { type: "spring", stiffness: 300, damping: 15 },
                }}
                onMouseEnter={() => setHoveredSection(index)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className="text-white">{section.icon}</div>

                {/* Etiqueta de nombre */}
                <motion.div
                  className="absolute whitespace-nowrap font-medium text-sm"
                  style={{
                    top: "120%",
                    color: colors.text,
                  }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : -5,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {section.name}
                </motion.div>

                {/* Pulso de actividad */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px solid ${section.color}`,
                  }}
                  animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </React.Fragment>
          );
        })}
      </motion.div>

      {/* Gráfico de crecimiento en la base */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: size * 0.3,
          opacity: 0.8,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isLoaded ? 0.8 : 0,
          y: isLoaded ? 0 : 20,
        }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* Línea de base */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "2px",
            background: colors.subtle,
            opacity: 0.5,
          }}
        />

        {/* Barras de gráfico */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {growthData.map((item, index) => {
            const barHeight = (item.value / 100) * (size * 0.28);

            return (
              <motion.div
                key={`bar-${index}`}
                className="flex-1 mx-0.5"
                style={{
                  height: barHeight,
                  background: `linear-gradient(to top, ${colors.primary}70, ${colors.secondary}70)`,
                  transform: "scaleY(0)",
                  transformOrigin: "bottom",
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isLoaded ? 1 : 0 }}
                transition={{
                  duration: 1,
                  delay: 0.7 + index * 0.05,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </div>

        {/* Línea de tendencia */}
        <motion.svg
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: size * 0.3,
            width: "100%",
          }}
          viewBox={`0 0 ${growthData.length} 100`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.highlight} />
            </linearGradient>
          </defs>

          {/* Línea principal */}
          <motion.path
            d={`M 0 ${100 - growthData[0].value} ${growthData
              .map((item, index) => `L ${index} ${100 - item.value}`)
              .join(" ")}`}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset="500"
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 2, delay: 1.2, ease: "easeOut" }}
          />

          {/* Puntos en cada valor */}
          {growthData.map((item, index) => (
            <motion.circle
              key={`point-${index}`}
              cx={index}
              cy={100 - item.value}
              r="0"
              fill={
                index === growthData.length - 1
                  ? colors.highlight
                  : colors.primary
              }
              animate={{ r: index === growthData.length - 1 ? 1.5 : 1 }}
              transition={{
                duration: 0.5,
                delay: 1.2 + index * 0.1,
              }}
            />
          ))}
        </motion.svg>

        {/* Partículas de "valor" que suben */}
        {valueParticles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.startX}%`,
              bottom: `${particle.startY}%`,
              background: particle.color,
              opacity: 0,
            }}
            animate={{
              opacity: [0, particle.opacity, 0],
              y: [0, -size * 0.4, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              scale: [0.8, 1.2, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default NexusGrowthVisual;
