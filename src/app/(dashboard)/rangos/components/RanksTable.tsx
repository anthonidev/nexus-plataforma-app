"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rank, UserRank } from "@/types/ranks/rank.types";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Trophy } from "lucide-react";
import RanksLegend from "./RanksLegend";
import RanksMobileView from "./RanksMobileView";
import { RanksMobileSkeleton } from "./RanksTableDesktopSkeleton";

interface RanksTableProps {
  ranks: Rank[];
  userRank: UserRank | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function RanksTable({
  ranks,
  userRank,
  isLoading,
  error,
  onRefresh,
}: RanksTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3 bg-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Tabla de Rangos Disponibles
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span className="hidden md:inline">Cargando...</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">


          <div className="">
            <RanksMobileSkeleton />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-medium text-red-800 dark:text-red-300">
                  Error al cargar rangos
                </h3>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                className="mt-2 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader className=" ">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Rangos Disponibles
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Actualizar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:px-6">


          <div className="px-3 ">
            <RanksMobileView ranks={ranks} userRank={userRank} />
            <RanksLegend />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}