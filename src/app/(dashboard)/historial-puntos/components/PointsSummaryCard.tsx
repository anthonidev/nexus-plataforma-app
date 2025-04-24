"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  BadgeDollarSign,
  History,
  Landmark,
} from "lucide-react";
import { UserPointsResponse } from "@/types/points/point";

interface PointsSummaryCardProps {
  points: UserPointsResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function PointsSummaryCard({
  points,
  isLoading,
  error,
}: PointsSummaryCardProps) {
  if (isLoading) {
    return <PointsSummaryCardSkeleton />;
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!points) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="p-4 rounded-lg border text-center">
            <p className="text-muted-foreground">
              No hay información de puntos disponible
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 overflow-hidden border-primary/10">
        <CardHeader >
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Resumen de Puntos

          </CardTitle>

        </CardHeader>
        <CardContent className="">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-6 border border-primary/15 shadow-sm">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>

              <div className="flex items-center gap-2 mb-2 relative z-10">
                <BadgeDollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Puntos Disponibles</h3>
              </div>
              <p className="text-3xl font-bold text-primary mt-2 relative z-10">
                {points.availablePoints.toLocaleString()}
              </p>
              {points.membershipPlan && (
                <p className="text-sm text-muted-foreground mt-1 relative z-10">
                  Plan: {points.membershipPlan.name}
                </p>
              )}
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800/50 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-emerald-500/10 rounded-full blur-lg"></div>

              <div className="flex items-center gap-2 mb-2 relative z-10">
                <History className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-medium text-emerald-800 dark:text-emerald-300">
                  Total Ganados
                </h3>
              </div>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 relative z-10">
                {points.totalEarnedPoints.toLocaleString()}
              </p>
              <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-1 relative z-10">
                Puntos acumulados históricamente
              </p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800/50 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-amber-500/10 rounded-full blur-lg"></div>

              <div className="flex items-center gap-2 mb-2 relative z-10">
                <Landmark className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-medium text-amber-800 dark:text-amber-300">
                  Total Retirados
                </h3>
              </div>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-2 relative z-10">
                {points.totalWithdrawnPoints.toLocaleString()}
              </p>
              <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-1 relative z-10">
                Puntos retirados o utilizados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PointsSummaryCardSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-10 w-24 mt-2" />
              <Skeleton className="h-4 w-40 mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}