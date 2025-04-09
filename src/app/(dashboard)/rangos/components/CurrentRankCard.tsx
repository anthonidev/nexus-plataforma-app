"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Rank, UserRank } from "@/types/ranks/rank.types";
import { motion } from "framer-motion";
import { Award, Crown, Medal, ArrowUp, Star } from "lucide-react";

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
  const isAtHighestRank = currentRank.id === highestRank.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 overflow-hidden">
        <CardHeader className="pb-3 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Mi Rango Actual
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Rango Actual */}
            <div className="md:col-span-2 flex flex-col justify-between">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10 mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground">
                      Rango Actual
                    </h3>
                    <h2 className="text-2xl font-bold">{currentRank.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Plan: {userRank.membershipPlan.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Requisitos</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Puntos:</span>{" "}
                      <span className="font-medium">
                        {currentRank.requiredPoints}
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Directos:</span>{" "}
                      <span className="font-medium">
                        {currentRank.requiredDirects}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Medal className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Historial</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">
                        Mayor rango alcanzado:
                      </span>{" "}
                      <span className="font-medium">{highestRank.name}</span>
                    </p>
                    {!isAtHighestRank && (
                      <p className="text-amber-600 flex items-center gap-1">
                        <ArrowUp className="h-3 w-3" />
                        <span>Puedes subir de rango</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles del Rango */}
            <div className="space-y-4">
              <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-6 border h-full flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-4 text-center">
                  Beneficios
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-center">
                    Disfruta de los beneficios exclusivos de tu rango actual.
                  </p>
                  <p className="text-center text-primary font-medium">
                    {currentRank.code}
                  </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl p-6 border">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg p-4 border">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="rounded-lg p-4 border">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-lg p-6 border h-full">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-5 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
