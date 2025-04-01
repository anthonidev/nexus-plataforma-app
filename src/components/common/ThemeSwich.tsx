"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex h-8 w-16 cursor-pointer items-center rounded-full p-1 transition-all duration-500"
    >
      <div className="absolute inset-0 rounded-full transition-all duration-500 bg-gray-300 dark:bg-gray-900">
        <div className="absolute inset-0 transition-opacity duration-500 dark:opacity-100 opacity-0">
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute inline-block h-[2px] w-[2px] bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white to-blue-50 shadow-lg dark:from-gray-900 dark:to-gray-800 transition-colors duration-500"
        animate={{
          x: isDark ? 32 : 0,
          rotate: isDark ? 360 : 0,
        }}
        transition={{
          x: { type: "spring", stiffness: 200, damping: 15 },
          rotate: { duration: 0.5 },
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.5,
          }}
        >
          {isDark ? (
            <Moon className="h-4 w-4 text-blue-400 transition-transform" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500 transition-transform" />
          )}
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-full bg-white"
          animate={{
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      {/* Se eliminó el efecto de shimmer horizontal aquí */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Efecto de hover simple sin animación de desplazamiento */}
        <div className="absolute inset-0 rounded-full bg-white/10" />
      </div>
    </div>
  );
};

export default ThemeSwitch;
