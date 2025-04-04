"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface WeeklyVolumesHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export default function WeeklyVolumesHeader({
  onRefresh,
  isLoading,
}: WeeklyVolumesHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Volúmenes Semanales
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualiza tu historial de volúmenes binarios y comisiones generadas
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
