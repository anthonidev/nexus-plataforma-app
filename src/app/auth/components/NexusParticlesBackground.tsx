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
        particle: "#0d9488", // verde teal
        links: "#065f46", // verde esmeralda oscuro
        hover: "#10b981", // verde esmeralda
      };
    }
    return {
      background: "#f8fafc",
      particle: "#0d9488", // verde teal
      links: "#a7f3d0", // verde esmeralda claro
      hover: "#059669", // verde esmeralda oscuro
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
          quantity: 4,
        },
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: colors.particle,
      },
      links: {
        color: colors.links,
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
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
