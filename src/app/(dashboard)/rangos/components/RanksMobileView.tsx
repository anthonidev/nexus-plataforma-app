"use client";

import { Rank, UserRank } from "@/types/ranks/rank.types";
import RankCard from "./RankCard";

interface RanksMobileViewProps {
    ranks: Rank[];
    userRank: UserRank | null;
}

export default function RanksMobileView({ ranks, userRank }: RanksMobileViewProps) {
    const sortedRanks = [...ranks].sort(
        (a, b) => a.requiredPoints - b.requiredPoints
    );

    const currentRankId = userRank?.currentRank?.id;
    const highestRankId = userRank?.highestRank?.id;
    const nextRankId = userRank?.nextRank?.id;

    const isHigherRank = (rankIndex: number): boolean => {
        if (!userRank || !currentRankId) return false;
        const currentRankIndex = sortedRanks.findIndex(r => r.id === currentRankId);
        return rankIndex > currentRankIndex;
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 text-sm border border-blue-100 dark:border-blue-800/20 mb-3">
                <p className="text-blue-700 dark:text-blue-400">
                    Estos son los rangos disponibles. Tu rango actual se muestra destacado y puedes ver tu progreso hacia los siguientes rangos.
                </p>
            </div>
            <div
                className={`
                grid grid-cols-1 gap-4 
                sm:grid-cols-2
                md:grid-cols-3
                xl:grid-cols-4
              
                `}
            >

                {sortedRanks.map((rank, index) => {
                    const isCurrentRank = rank.id === currentRankId;
                    const isHighestRank = rank.id === highestRankId && !isCurrentRank;
                    const isNextRank = rank.id === nextRankId;
                    const isAchieved = userRank && currentRankId &&
                        sortedRanks.findIndex(r => r.id === rank.id) <=
                        sortedRanks.findIndex(r => r.id === currentRankId);

                    return (
                        <RankCard
                            key={rank.id}
                            rank={rank}
                            index={index}
                            isCurrentRank={isCurrentRank}
                            isHighestRank={isHighestRank}
                            isNextRank={isNextRank}
                            isAchieved={!!isAchieved}
                            isHigherRank={isHigherRank(index)}
                            userRank={userRank}
                        />
                    );
                })}
            </div>
        </div>
    );
}