"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Rank, UserRank } from "@/types/ranks/rank.types";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users } from "lucide-react";

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

  // Calcula el progreso hacia el siguiente rango para volumen
  const volumeProgress = Math.min(
    100,
    (progress.currentVolume / progress.requiredVolume) * 100
  );

  // Calcula el progreso en el número de directos
  const directsProgress = Math.min(
    100,
    (progress.totalDirects / progress.requiredDirects) * 100
  );

  // Calcula la diferencia de puntos y directos necesarios para el próximo rango
  const volumeNeeded = Math.max(0, progress.requiredVolume - progress.currentVolume);
  const directsNeeded = Math.max(0, progress.requiredDirects - progress.totalDirects);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="mb-6">
        <CardHeader className="pb-3 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progreso hacia el siguiente rango
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
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

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Volumen Requerido</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {progress.currentVolume.toLocaleString()} /{" "}
                  {progress.requiredVolume.toLocaleString()}
                </span>
              </div>
              <Progress value={volumeProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {volumeProgress >= 100 ? (
                  <span className="text-green-600 font-medium">¡Requisito cumplido!</span>
                ) : (
                  `Necesitas ${volumeNeeded.toLocaleString()} puntos más para el siguiente rango`
                )}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">
                    Directos Requeridos
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {progress.totalDirects} / {progress.requiredDirects}
                </span>
              </div>
              <Progress value={directsProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {directsProgress >= 100 ? (
                  <span className="text-green-600 font-medium">¡Requisito cumplido!</span>
                ) : (
                  `Necesitas ${directsNeeded} directos más para el siguiente rango`
                )}
              </p>
              <div className="flex justify-between mt-2 text-xs">
                <div>
                  <span className="text-blue-500 font-medium">Izquierda:</span>{" "}
                  <span>{progress.leftLegDirects} directos</span>
                </div>
                <div>
                  <span className="text-emerald-500 font-medium">Derecha:</span>{" "}
                  <span>{progress.rightLegDirects} directos</span>
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