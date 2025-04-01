"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  {
    ssr: false,
  }
);

export default function GlobeLogin() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const primaryColor = isDark ? "#86efac" : "#4ade80";
  const secondaryColor = isDark ? "#bbf7d0" : "#22c55e";
  const accentColor = isDark ? "#a7f3d0" : "#16a34a";
  const highlightColor = isDark ? "#fde68a" : "#eab308";
  const redColor = isDark ? "#fca5a1" : "#ef4444";

  const colors = [
    primaryColor,
    secondaryColor,
    accentColor,
    highlightColor,
    isDark ? "#99f6e4" : "#14b8a6",
    isDark ? "#d9f99d" : "#65a30d",
  ];

  const globeConfig = {
    pointSize: 10,

    globeColor: isDark ? "#193548" : "#164e63",

    showAtmosphere: true,
    atmosphereColor: isDark ? "#4ade80" : "#10b981",

    emissive: isDark ? "#0f766e" : "#0d9488",
    emissiveIntensity: 0.1,
    shininess: 0.3,

    polygonColor: isDark
      ? "rgba(180, 240, 200, 0.8)"
      : "rgba(120, 230, 160, 0.8)",

    ambientLight: isDark ? "#cbd5e1" : "#f8fafc",

    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: isDark ? "#a7f3d0" : "#10b981",

    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,

    initialPosition: { lat: 15, lng: -30 },

    autoRotate: true,
    autoRotateSpeed: 0.2,
  };

  const nexusArcs = [
    {
      order: 1,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.28,
      color: redColor,
    },
    {
      order: 1,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 19.4326,
      endLng: -99.1332,
      arcAlt: 0.25,
      color: redColor,
    },
    {
      order: 1,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.32,
      color: redColor,
    },
    {
      order: 1,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: -23.5505,
      endLng: -46.6333,
      arcAlt: 0.22,
      color: redColor,
    },
    {
      order: 2,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 40.4168,
      endLng: -3.7038,
      arcAlt: 0.4,
      color: redColor,
    },
    {
      order: 2,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 51.5074,
      endLng: -0.1278,
      arcAlt: 0.42,
      color: redColor,
    },
    {
      order: 2,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 48.8566,
      endLng: 2.3522,
      arcAlt: 0.44,
      color: redColor,
    },
    {
      order: 3,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.5,
      color: redColor,
    },
    {
      order: 3,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.48,
      color: redColor,
    },
    {
      order: 3,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 28.7041,
      endLng: 77.1025,
      arcAlt: 0.46,
      color: redColor,
    },
    {
      order: 4,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.45,
      color: redColor,
    },
    {
      order: 4,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 9.082,
      endLng: 8.6753,
      arcAlt: 0.43,
      color: redColor,
    },
    {
      order: 5,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: -34.6037,
      endLng: -58.3816,
      arcAlt: 0.18,
      color: redColor,
    },
    {
      order: 5,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: -33.4489,
      endLng: -70.6693,
      arcAlt: 0.15,
      color: redColor,
    },
    {
      order: 5,
      startLat: -12.0464,
      startLng: -77.0428,
      endLat: 10.4806,
      endLng: -74.0833,
      arcAlt: 0.16,
      color: redColor,
    },
    {
      order: 6,
      startLat: 19.4326,
      startLng: -99.1332,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.25,
      color: colors[0],
    },
    {
      order: 6,
      startLat: 40.4168,
      startLng: -3.7038,
      endLat: 51.5074,
      endLng: -0.1278,
      arcAlt: 0.15,
      color: colors[1],
    },
    {
      order: 6,
      startLat: 35.6762,
      startLng: 139.6503,
      endLat: 31.2304,
      endLng: 121.4737,
      arcAlt: 0.18,
      color: colors[2],
    },
    {
      order: 7,
      startLat: 40.7128,
      startLng: -74.006,
      endLat: 51.5074,
      endLng: -0.1278,
      arcAlt: 0.35,
      color: colors[3],
    },
    {
      order: 7,
      startLat: 31.2304,
      startLng: 121.4737,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.4,
      color: colors[4],
    },
    {
      order: 7,
      startLat: 40.4168,
      startLng: -3.7038,
      endLat: 33.9716,
      endLng: -7.5717,
      arcAlt: 0.15,
      color: colors[5],
    },
  ];
  return (
    <div className="relative w-[700px] h-[500px] flex ">
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-300/30 dark:bg-emerald-500/20 blur-3xl"
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="w-full h-full relative z-10">
        <World data={nexusArcs} globeConfig={globeConfig} />
      </div>
    </div>
  );
}
