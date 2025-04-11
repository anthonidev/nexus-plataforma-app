"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart2, Users, Award, TrendingUp, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Item } from "@/types/ranks/rank.types";
import { format } from "@/utils/date.utils";

interface MonthlyVolumesSummaryProps {
  latestVolume: Item | null;
  isLoading: boolean;
}

export default function MonthlyVolumesSummary({
  latestVolume,
  isLoading,
}: MonthlyVolumesSummaryProps) {
  if (isLoading) {
    return <MonthlyVolumesSummarySkeleton />;
  }

  // Si no hay datos, mostrar un mensaje
  if (!latestVolume) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Resumen de Volúmenes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            No hay datos de volúmenes mensuales disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 mb-6"
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-3 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Volumen Actual ({format(latestVolume.monthStartDate, "MMMM yyyy")})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Volumen Total */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Volumen Total</h3>
              </div>
              <p className="text-3xl font-bold text-primary mt-2">
                {latestVolume.totalVolume.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(latestVolume.monthStartDate, "dd/MM/yyyy")} -{" "}
                  {format(latestVolume.monthEndDate, "dd/MM/yyyy")}
                </span>
              </p>
            </div>

            {/* Volúmenes por Lado */}
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <span className="text-xs font-medium">L</span>
                  </div>
                  <span className="font-medium">Lado Izquierdo</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">Volumen:</p>
                  <p className="text-lg font-bold">
                    {latestVolume.leftVolume.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground">Directos:</p>
                  <p className="text-md font-medium">
                    {latestVolume.leftDirects}
                  </p>
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <span className="text-xs font-medium">R</span>
                  </div>
                  <span className="font-medium">Lado Derecho</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">Volumen:</p>
                  <p className="text-lg font-bold">
                    {latestVolume.rightVolume.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground">Directos:</p>
                  <p className="text-md font-medium">
                    {latestVolume.rightDirects}
                  </p>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-5 border h-full flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-4 text-center flex items-center justify-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Información de Volúmenes</span>
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-center">
                    Los volúmenes mensuales te permiten alcanzar nuevos rangos y
                    aumentar tus beneficios.
                  </p>
                  <div className="bg-background/60 dark:bg-background/30 rounded-lg p-3 text-xs text-muted-foreground">
                    <p>
                      Mantén y aumenta tu volumen mensual para mejorar tu
                      posición en la red y alcanzar rangos superiores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MonthlyVolumesSummarySkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl p-6 border">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-9 w-36 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex justify-between items-center mt-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>

            <div className="rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex justify-between items-center mt-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-8" />
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg p-5 border h-full">
              <Skeleton className="h-6 w-40 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <div className="rounded-lg p-3 mt-3">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
