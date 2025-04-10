"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface MonthlyVolumesHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export default function MonthlyVolumesHeader({
  onRefresh,
  isLoading,
}: MonthlyVolumesHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volumen Mensual</h1>
          <p className="text-muted-foreground mt-1">
            Visualiza tu historial de volúmenes y puntos mensuales
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="mt-4 md:mt-0"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          <span>Actualizar</span>
        </Button>
      </div>
    </motion.div>
  );
}
