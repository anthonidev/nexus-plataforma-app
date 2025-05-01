"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Rank, UserRank } from "@/types/ranks/rank.types";
import { motion } from "framer-motion";
import { ArrowUp, Award, CheckCircle, Star, TrendingUp, Users } from "lucide-react";

interface RankCardProps {
    rank: Rank;
    index: number;
    isCurrentRank: boolean;
    isHighestRank: boolean;
    isNextRank: boolean;
    isAchieved: boolean;
    isHigherRank: boolean;
    userRank: UserRank | null;
}

export default function RankCard({
    rank,
    index,
    isCurrentRank,
    isHighestRank,
    isNextRank,
    isAchieved,
    isHigherRank,
    userRank,
}: RankCardProps) {
    // Calcular porcentajes
    const progress = userRank?.progress;

    // Calcular progreso hacia los rangos superiores, limitado a 100%
    const showProgress = isHigherRank && progress;

    const volumeProgress = showProgress
        ? Math.min(100, (progress.currentVolume / rank.requiredPoints) * 100)
        : 0;

    const directsProgress = showProgress
        ? Math.min(100, (progress.totalDirects / rank.requiredDirects) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.3,
                delay: 0.05 * index,
                ease: "easeOut"
            }}
            className={`
        rounded-lg border shadow-sm mb-3
        ${isCurrentRank ? "bg-primary/10 border-primary/20" : ""}
        ${isNextRank && !isCurrentRank ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/20" : ""}
        ${!isCurrentRank && !isNextRank ? "bg-card" : ""}
      `}
        >
            <div className="p-4">
                {/* Cabecera con título y estado */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center 
                ${isCurrentRank
                                    ? "bg-primary/20 text-primary"
                                    : isNextRank
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                        : isAchieved
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                            : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {isCurrentRank ? (
                                <Award className="h-5 w-5" />
                            ) : isNextRank ? (
                                <ArrowUp className="h-5 w-5" />
                            ) : isAchieved ? (
                                <CheckCircle className="h-5 w-5" />
                            ) : (
                                <Star className="h-5 w-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-base">{rank.name}</h3>
                            {isCurrentRank && (
                                <span className="text-xs text-primary">Rango actual</span>
                            )}
                            {isNextRank && !isCurrentRank && (
                                <span className="text-xs text-blue-600 dark:text-blue-400">Siguiente rango</span>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        {isCurrentRank ? (
                            <Badge className="bg-primary text-primary-foreground font-medium px-3 py-1">
                                Actual
                            </Badge>
                        ) : isNextRank ? (
                            <Badge className="bg-blue-500 text-white font-medium px-3 py-1">
                                Siguiente
                            </Badge>
                        ) : isHighestRank ? (
                            <Badge className="bg-amber-500 text-white font-medium px-3 py-1">
                                Mayor alcanzado
                            </Badge>
                        ) : isAchieved ? (
                            <Badge className="bg-green-500 text-white flex items-center gap-1.5 font-medium px-3 py-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Conseguido</span>
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="font-medium px-3 py-1">
                                Pendiente
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Código */}
                <div className="mb-3">
                    <span className="text-xs text-muted-foreground">Código:</span>
                    <span className="font-mono bg-muted/50 text-muted-foreground px-2 py-1 rounded text-sm ml-2">
                        {rank.code}
                    </span>
                </div>

                {/* Requisitos */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                    {/* Puntos */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Puntos</span>
                        </div>
                        <p className="text-base font-semibold">{rank.requiredPoints.toLocaleString()}</p>

                        {/* Progress bar para puntos en rangos superiores */}
                        {showProgress && (
                            <div className="w-full mt-1">
                                <Progress
                                    value={volumeProgress}
                                    className="h-2 w-full"
                                />
                                <span className="text-xs text-muted-foreground mt-1 block">
                                    {progress.currentVolume.toLocaleString()} / {rank.requiredPoints.toLocaleString()} ({Math.round(volumeProgress)}%)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Directos */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-medium">Directos</span>
                        </div>
                        <p className="text-base font-semibold">{rank.requiredDirects}</p>

                        {/* Progress bar para directos en rangos superiores */}
                        {showProgress && (
                            <div className="w-full mt-1">
                                <Progress
                                    value={directsProgress}
                                    className="h-2 w-full"
                                />
                                <span className="text-xs text-muted-foreground mt-1 block">
                                    {progress.totalDirects} / {rank.requiredDirects} ({Math.round(directsProgress)}%)
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}