"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart2, Users, Award, TrendingUp, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { WeeklyVolumeItem } from "@/types/points/volumen";
import { format } from "@/utils/date.utils";
import { formatCurrency } from "@/utils/format-currency.utils";

interface WeeklyVolumesSummaryProps {
  volumes: WeeklyVolumeItem[];
  isLoading: boolean;
}

export default function WeeklyVolumesSummary({
  volumes,
  isLoading,
}: WeeklyVolumesSummaryProps) {
  if (isLoading) {
    return <WeeklyVolumesSummarySkeleton />;
  }

  // Buscar el último volumen que tenga estado "PROCESSED"
  const lastProcessedVolume = volumes.find((vol) => vol.status === "PROCESSED");

  // Si no hay volumen procesado, no mostrar nada
  if (!lastProcessedVolume) {
    return null;
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
            Último Volumen Procesado (
            {format(lastProcessedVolume.weekStartDate, "dd/MM/yyyy")} -{" "}
            {format(lastProcessedVolume.weekEndDate, "dd/MM/yyyy")})
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
                {(
                  lastProcessedVolume.leftVolume +
                  lastProcessedVolume.rightVolume
                ).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(
                    lastProcessedVolume.weekStartDate,
                    "dd/MM/yyyy"
                  )} - {format(lastProcessedVolume.weekEndDate, "dd/MM/yyyy")}
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
                    {lastProcessedVolume.leftVolume.toLocaleString()}
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
                    {lastProcessedVolume.rightVolume.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de comisión */}
            <div className="space-y-4">
              <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-5 border h-full flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-4 text-center flex items-center justify-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Comisión Generada</span>
                </h3>
                <div className="text-center">
                  {lastProcessedVolume.paidAmount ? (
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(lastProcessedVolume.paidAmount)}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No se generaron comisiones
                    </p>
                  )}

                  {lastProcessedVolume.membershipPlan && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Plan: {lastProcessedVolume.membershipPlan.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WeeklyVolumesSummarySkeleton() {
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
            </div>
          </div>

          <div>
            <div className="rounded-lg p-5 border h-full">
              <Skeleton className="h-6 w-40 mx-auto mb-4" />
              <Skeleton className="h-8 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
