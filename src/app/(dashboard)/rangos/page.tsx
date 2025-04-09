"use client";

import { useRanks } from "./hooks/useRanks";
import RanksHeader from "./components/RanksHeader";
import CurrentRankCard from "./components/CurrentRankCard";
import RankProgressCard from "./components/RankProgressCard";
import RanksTable from "./components/RanksTable";

export default function RanksPage() {
  const { ranks, userRank, isLoading, error, refreshRanks } = useRanks();

  return (
    <div className="container py-8">
      <RanksHeader onRefresh={refreshRanks} isLoading={isLoading} />

      <CurrentRankCard
        userRank={userRank}
        isLoading={isLoading}
        error={error}
      />

      <RankProgressCard
        ranks={ranks}
        userRank={userRank}
        isLoading={isLoading}
      />

      <RanksTable
        ranks={ranks}
        userRank={userRank}
        isLoading={isLoading}
        error={error}
        onRefresh={refreshRanks}
      />
    </div>
  );
}
