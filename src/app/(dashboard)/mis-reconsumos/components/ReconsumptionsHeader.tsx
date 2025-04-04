"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface ReconsumptionsHeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function ReconsumptionsHeader({
  onRefresh,
  isLoading = false,
}: ReconsumptionsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Reconsumos</h1>
          <p className="text-muted-foreground mt-1">
            Administra tus reconsumos mensuales y configura la renovación
            automática
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Actualizar</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
