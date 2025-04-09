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

  // Ordena los rangos por puntos requeridos
  const sortedRanks = [...ranks]
    .filter((rank) => rank.isActive)
    .sort((a, b) => a.requiredPoints - b.requiredPoints);

  // Encuentra el rango actual del usuario
  const currentRank = userRank.currentRank;

  // Encuentra el siguiente rango al que puede ascender el usuario
  const nextRankIndex =
    sortedRanks.findIndex((rank) => rank.id === currentRank.id) + 1;
  const nextRank =
    nextRankIndex < sortedRanks.length ? sortedRanks[nextRankIndex] : null;

  // Si no hay siguiente rango (el usuario está en el rango más alto), no muestra el componente
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

  // Calcula el progreso hacia el siguiente rango
  const pointsProgress = Math.min(
    100,
    (currentRank.requiredPoints / nextRank.requiredPoints) * 100
  );

  // Calcula el progreso en el número de directos
  const directsProgress = Math.min(
    100,
    (currentRank.requiredDirects / nextRank.requiredDirects) * 100
  );

  // Calcula la diferencia de puntos y directos necesarios para el próximo rango
  const pointsNeeded = nextRank.requiredPoints - currentRank.requiredPoints;
  const directsNeeded = nextRank.requiredDirects - currentRank.requiredDirects;

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
                  <span className="text-sm font-medium">Puntos Requeridos</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentRank.requiredPoints.toLocaleString()} /{" "}
                  {nextRank.requiredPoints.toLocaleString()}
                </span>
              </div>
              <Progress value={pointsProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Necesitas {pointsNeeded.toLocaleString()} puntos más para el
                siguiente rango
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
                  {currentRank.requiredDirects} / {nextRank.requiredDirects}
                </span>
              </div>
              <Progress value={directsProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Necesitas {directsNeeded} directos más para el siguiente rango
              </p>
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
