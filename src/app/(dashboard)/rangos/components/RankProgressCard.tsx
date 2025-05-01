"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rank, UserRank } from "@/types/ranks/rank.types";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, TrendingUp, Users } from "lucide-react";

interface RankProgressCardProps {
  ranks: Rank[];
  userRank: UserRank | null;
  isLoading: boolean;
}

export default function RankProgressCard({
  ranks,
  userRank,
  isLoading,
}: RankProgressCardProps) {
  if (isLoading) {
    return <RankProgressCardSkeleton />;
  }

  if (!userRank || ranks.length === 0) {
    return null;
  }

  const currentRank = userRank.currentRank;
  const nextRank = userRank.nextRank;
  const progress = userRank.progress;

  if (!nextRank) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progreso de Rango
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-6 text-center">
            <p className="text-lg font-medium text-primary mb-2">
              ¡Felicitaciones!
            </p>
            <p className="text-muted-foreground">
              Has alcanzado el rango más alto disponible:{" "}
              <strong>{currentRank.name}</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const volumeProgress = Math.min(
    100,
    (progress.currentVolume / progress.requiredVolume) * 100
  );

  const directsProgress = Math.min(
    100,
    (progress.totalDirects / progress.requiredDirects) * 100
  );

  const volumeNeeded = Math.max(0, progress.requiredVolume - progress.currentVolume);
  const directsNeeded = Math.max(0, progress.requiredDirects - progress.totalDirects);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="mb-6">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progreso hacia el siguiente rango
          </CardTitle>
        </CardHeader>
        <CardContent >
          <div className="flex items-center justify-between mb-6">
            <div className="bg-background rounded-lg p-3 border flex-1">
              <h3 className="text-sm font-medium mb-1">Rango Actual</h3>
              <p className="text-lg font-bold">{currentRank.name}</p>
            </div>

            <div className="px-2">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>

            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 flex-1">
              <h3 className="text-sm font-medium mb-1">Siguiente Rango</h3>
              <p className="text-lg font-bold text-primary">{nextRank.name}</p>
            </div>
          </div>
          <div className="md:col-span-8">
            <div className="bg-card rounded-xl  shadow-sm h-full">
              <div className="space-y-6">
                {/* Volumen requerido - Diseño mejorado */}
                <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-3 border border-primary/15">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">Volumen Requerido</span>
                    </div>
                    <div className="text-sm font-medium bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-primary/10">
                      {progress.currentVolume.toLocaleString()} / {progress.requiredVolume.toLocaleString()}
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex mb-2 justify-between text-xs">
                      <span className="text-muted-foreground">Progreso actual</span>
                      <span className="text-primary font-medium">{Math.round(volumeProgress)}%</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-primary/10">
                      <motion.div
                        className="flex bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${volumeProgress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-start">
                    {volumeProgress >= 100 ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-800/30 w-full">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">¡Requisito de volumen cumplido!</span>
                      </div>
                    ) : (
                      <div className="bg-muted/30 px-3 py-2 rounded-lg w-full">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-medium">Volumen faltante:</span>
                          <span className="text-lg font-bold text-primary">{volumeNeeded.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Puntos necesarios para alcanzar el próximo rango
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Directos requeridos - Diseño mejorado */}
                <div className="bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-900/10 rounded-xl p-3 border border-emerald-100/50 dark:border-emerald-800/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="font-medium text-emerald-800 dark:text-emerald-400">Directos Requeridos</span>
                    </div>
                    <div className="text-sm font-medium bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-100/50 dark:border-emerald-800/20">
                      {progress.totalDirects} / {progress.requiredDirects}
                    </div>
                  </div>

                  <div className="relative pt-1">
                    <div className="flex mb-2 justify-between text-xs">
                      <span className="text-muted-foreground">Progreso actual</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">{Math.round(directsProgress)}%</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-emerald-100/50 dark:bg-emerald-900/20">
                      <motion.div
                        className="flex bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${directsProgress}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-start">
                    {directsProgress >= 100 ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-800/30 w-full">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">¡Requisito de directos cumplido!</span>
                      </div>
                    ) : (
                      <div className="bg-muted/30 px-3 py-2 rounded-lg w-full">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-medium">Directos faltantes:</span>
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{directsNeeded}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Nuevos directos necesarios para el próximo rango
                        </p>
                      </div>
                    )}
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

function RankProgressCardSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-20 w-full rounded-lg mr-4" />
          <Skeleton className="h-6 w-6 rounded-full mx-2" />
          <Skeleton className="h-20 w-full rounded-lg ml-4" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}