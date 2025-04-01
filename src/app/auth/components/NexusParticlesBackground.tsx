"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine, IOptions, RecursivePartial } from "tsparticles-engine";

const NexusParticlesBackground = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const getThemeColors = () => {
    if (theme === "dark") {
      return {
        background: "#1a202c",
        particle: "#34d399", // Verde más brillante
        links: "#10b981", // Verde esmeralda más visible
        hover: "#6ee7b7", // Verde claro para hover
      };
    }
    return {
      background: "#f8fafc",
      particle: "#059669", // Verde más oscuro para modo claro
      links: "#10b981", // Verde esmeralda medio
      hover: "#34d399", // Verde claro para hover
    };
  };

  const colors = getThemeColors();

  const options: RecursivePartial<IOptions> = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 6, // Más partículas al hacer clic
        },
        repulse: {
          distance: 150, // Mayor distancia de repulsión
          duration: 0.6, // Mayor duración del efecto
        },
      },
    },
    particles: {
      color: {
        value: colors.particle,
      },
      links: {
        color: colors.links,
        distance: 170, // Mayor distancia entre enlaces
        enable: true,
        opacity: 0.7, // Mayor opacidad en los enlaces
        width: 1.5, // Enlaces más gruesos
      },
      collisions: {
        enable: true, // Habilitar colisiones para movimiento más realista
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1.2, // Ligeramente más rápido
        straight: false,
        attract: {
          // Añadir algo de atracción
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 100, // Más partículas
      },
      opacity: {
        value: 0.8, // Mayor opacidad
        random: true, // Opacidad aleatoria para más profundidad
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.4,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1.5, max: 4 }, // Partículas más grandes
        random: true, // Tamaños aleatorios
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.5,
          sync: false,
        },
      },
      twinkle: {
        // Efecto de destello
        particles: {
          enable: true,
          frequency: 0.05,
          opacity: 0.9,
        },
      },
    },
    detectRetina: true,
  };

  if (!mounted) return null;

  return (
    <Particles
      id="nexus-particles"
      init={particlesInit}
      options={options}
      className="absolute inset-0 z-0"
    />
  );
};

export default NexusParticlesBackground;
