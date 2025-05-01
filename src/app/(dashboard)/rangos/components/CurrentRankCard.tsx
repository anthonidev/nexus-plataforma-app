"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRank } from "@/types/ranks/rank.types";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpCircle, Award, ChevronRight, ChevronsLeft, ChevronsRight, Crown, Medal, Sparkles, Star, Target, TrendingUp, Users } from "lucide-react";

interface CurrentRankCardProps {
  userRank: UserRank | null;
  isLoading: boolean;
  error: string | null;
}

export default function CurrentRankCard({
  userRank,
  isLoading,
  error,
}: CurrentRankCardProps) {
  if (isLoading) {
    return <CurrentRankCardSkeleton />;
  }

  if (error || !userRank) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="p-4 rounded-lg border text-center">
            <p className="text-muted-foreground">
              {error || "No hay información de rango disponible"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentRank = userRank.currentRank;
  const highestRank = userRank.highestRank;
  const nextRank = userRank.nextRank;
  const isAtHighestRank = currentRank.id === highestRank.id;
  const progress = userRank.progress;


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 overflow-hidden">
        <CardHeader >
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Mi Rango Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Columna izquierda - Rango Actual */}
            <div className="md:col-span-4">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20 shadow-sm h-full flex flex-col gap-5">
                {/* Rango Actual - Diseño mejorado */}
                <div className="flex items-center gap-5 bg-white/50 dark:bg-gray-800/30 rounded-xl p-4 transition-all hover:shadow-md">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary flex items-center justify-center shadow-lg">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Rango Actual
                    </h3>
                    <h2 className="text-2xl font-bold text-primary">{currentRank.name}</h2>
                    <p className="text-sm text-primary/80 flex items-center gap-1.5 mt-1">
                      <Star className="h-4 w-4 fill-primary/20 text-primary" />
                      <span className="font-medium">{currentRank.code}</span>
                    </p>
                  </div>
                </div>

                {/* Mayor rango alcanzado - Diseño mejorado */}
                <div className="bg-gradient-to-r from-amber-50/80 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl p-5 border border-amber-200/50 dark:border-amber-700/30 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center shadow-md">
                      <Medal className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        Mayor Rango Alcanzado
                      </h3>
                      <p className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                        {highestRank.name}
                      </p>
                    </div>
                  </div>
                  {isAtHighestRank ? (
                    <div className="flex items-center gap-2 mt-2 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg p-3">
                      <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        ¡Enhorabuena! Estás en tu rango más alto alcanzado.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-2 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg p-3">
                      <ArrowUpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Lograste este rango anteriormente. ¡Sigue avanzando!
                      </p>
                    </div>
                  )}
                </div>

                {/* Siguiente rango - Diseño mejorado */}
                {nextRank && (
                  <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-5 border border-blue-200/50 dark:border-blue-700/30 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center shadow-md">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-base font-medium text-blue-700 dark:text-blue-400">Próximo objetivo</span>
                      </div>
                      <span className="text-base font-bold flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        {nextRank.name} <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-3 flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Complete los requisitos para ascender al siguiente nivel
                      </p>
                    </div>
                  </div>
                )}

                {/* Información sobre progreso - Diseño mejorado */}
                <div className="mt-auto bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-primary">Progreso de rangos</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    El avance de rango se consigue cumpliendo los requisitos de volumen y directos.
                    <span className="block mt-1 font-medium text-primary/80">Continúa expandiendo tu red para alcanzar niveles superiores.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Columna central - Progreso */}
            <div className="md:col-span-8">
              <div className="bg-card rounded-xl p-6 border shadow-sm h-full">
                <div className="space-y-6">
                  {/* Información de Volumen */}
                  <div className="space-y-4">
                    {/* Header con título */}
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Métricas de Volumen</h3>
                    </div>

                    {/* Panel de Volumen Total - Destacado */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-xl border border-primary/15 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium text-primary text-lg">Volumen Total</span>
                              <p className="text-sm text-muted-foreground">
                                Puntos acumulados en toda tu red
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-primary">
                            {progress.currentVolume.toLocaleString()}
                          </span>
                          <p className="text-xs text-primary/70 mt-1">puntos totales</p>
                        </div>
                      </div>
                    </div>

                    {/* Paneles de Volumen por Rama - En 2 columnas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Volumen Izquierda */}
                      <div className="bg-blue-50/70 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/20 hover:shadow-md transition-shadow relative overflow-hidden group">
                        {/* Elemento decorativo */}
                        <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl transform group-hover:scale-125 transition-transform"></div>

                        <div className="flex items-start gap-3 relative z-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <ChevronsLeft />
                          </div>


                          <div className="flex-1">
                            <span className="font-medium text-blue-700 dark:text-blue-400  xl:text-lg">Rama Izquierda</span>
                            <div className="flex items-baseline justify-between mt-1">
                              <p className="text-sm hidden xl:block text-muted-foreground">
                                Volumen acumulado izquierdo
                              </p>
                              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {progress.leftVolume.toLocaleString()}
                              </span>
                            </div>

                            {/* Porcentaje del total */}
                            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-end">
                              <span className="font-medium text-blue-600/80 dark:text-blue-400/80">
                                {progress.currentVolume > 0
                                  ? `${Math.round((progress.leftVolume / progress.currentVolume) * 100)}% del total`
                                  : "0% del total"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Volumen Derecha */}
                      <div className="bg-emerald-50/70 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/20 hover:shadow-md transition-shadow relative overflow-hidden group">
                        {/* Elemento decorativo */}
                        <div className="absolute -left-10 -top-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl transform group-hover:scale-125 transition-transform"></div>

                        <div className="flex items-start gap-3 relative z-10">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                            <ChevronsRight />
                          </div>

                          <div className="flex-1">
                            <span className="font-medium text-emerald-700 dark:text-emerald-400  xl:text-lg">Rama Derecha</span>
                            <div className="flex items-baseline justify-between mt-1">
                              <p className="text-sm text-muted-foreground hidden xl:block">
                                Volumen acumulado derecho
                              </p>
                              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {progress.rightVolume.toLocaleString()}
                              </span>
                            </div>

                            {/* Porcentaje del total */}
                            <div className="mt-2 text-xs text-muted-foreground flex items-center justify-end">
                              <span className="font-medium text-emerald-600/80 dark:text-emerald-400/80">
                                {progress.currentVolume > 0
                                  ? `${Math.round((progress.rightVolume / progress.currentVolume) * 100)}% del total`
                                  : "0% del total"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de Directos */}
                  <div className="bg-emerald-50/30 dark:bg-emerald-900/5 p-4 rounded-xl border border-emerald-100/50 dark:border-emerald-800/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <Users className="h-5 w-5 text-emerald-500" />
                          <span className="font-medium text-emerald-700 dark:text-emerald-400">Total de Directos</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Personas referidas directamente
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {progress.totalDirects}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">personas</p>
                      </div>
                    </div>
                  </div>

                  {/* Distribución de directos */}
                  <div className="border-t pt-5">
                    <div className="flex items-center gap-1.5 mb-4">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-base font-medium">Distribución de directos</span>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800/20">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                            <span className="text-blue-700 dark:text-blue-300 font-bold text-xl">
                              {progress.leftLegDirects}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                            Rama Izquierda
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {progress.totalDirects > 0
                              ? `${Math.round((progress.leftLegDirects / progress.totalDirects) * 100)}% del total`
                              : "0% del total"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800/20">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                            <span className="text-emerald-700 dark:text-emerald-300 font-bold text-xl">
                              {progress.rightLegDirects}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                            Rama Derecha
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {progress.totalDirects > 0
                              ? `${Math.round((progress.rightLegDirects / progress.totalDirects) * 100)}% del total`
                              : "0% del total"}
                          </span>
                        </div>
                      </div>
                    </div>
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

function CurrentRankCardSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <div className="rounded-xl p-6 border h-full">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              <Skeleton className="h-20 w-full mt-6" />

              <div className="mt-auto pt-4">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="rounded-xl p-6 border h-full">
              <Skeleton className="h-6 w-48 mb-6" />

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-2 w-full rounded-full mb-5" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-2 w-full rounded-full mb-5" />
                </div>

                <div>
                  <Skeleton className="h-5 w-36 mb-3" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}