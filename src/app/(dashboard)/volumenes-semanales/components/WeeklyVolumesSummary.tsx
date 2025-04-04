"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency.utils";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowDownRight,
  CircleDollarSign,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WeeklyVolumesSummaryProps {
  totalLeftVolume: number;
  totalRightVolume: number;
  totalPaid: number;
  pendingVolumes: number;
  isLoading: boolean;
}

export default function WeeklyVolumesSummary({
  totalLeftVolume,
  totalRightVolume,
  totalPaid,
  pendingVolumes,
  isLoading,
}: WeeklyVolumesSummaryProps) {
  if (isLoading) {
    return <WeeklyVolumesSummarySkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-3 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Resumen de Volúmenes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Métricas de volumen binario */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <ArrowDownLeft className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Lado Izquierdo</span>
                </div>
                <p className="text-2xl font-bold">
                  {totalLeftVolume.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Volumen total acumulado
                </p>
              </div>

              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <ArrowDownRight className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Lado Derecho</span>
                </div>
                <p className="text-2xl font-bold">
                  {totalRightVolume.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Volumen total acumulado
                </p>
              </div>
            </div>

            {/* Comisiones e información adicional */}
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <CircleDollarSign className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Comisiones Pagadas</span>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalPaid)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total de comisiones generadas
                </p>
              </div>

              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Volúmenes Pendientes</span>
                </div>
                <p className="text-2xl font-bold">{pendingVolumes}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pendientes de procesamiento
                </p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-muted/30 rounded-lg p-4 border">
              <h3 className="text-sm font-medium mb-2">
                Información de volúmenes
              </h3>
              <p className="text-xs text-muted-foreground">
                Los volúmenes binarios se calculan semanalmente y las comisiones
                se generan cuando se cumplen los requisitos establecidos en el
                plan de compensación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WeeklyVolumesSummarySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4 border">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-28 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-28 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-background rounded-lg p-4 border">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-28 mb-1" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="bg-background rounded-lg p-4 border">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>

        <div className="rounded-lg p-4 border">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </CardContent>
    </Card>
  );
}
