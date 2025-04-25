"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import CurrentRankCard from "./components/CurrentRankCard";
import RankProgressCard from "./components/RankProgressCard";
import RanksTable from "./components/RanksTable";
import { useRanks } from "./hooks/useRanks";

export default function RanksPage() {
  const { ranks, userRank, isLoading, error, refreshRanks } = useRanks();

  return (
    <div className="container py-8">
      <PageHeader
        title="Mis Rangos"
        subtitle="Visualiza tu progreso y los rangos disponibles en el sistema"
        variant="gradient"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={refreshRanks}
            disabled={isLoading}
            className="mt-4 md:mt-0"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Actualizar</span>
          </Button>
        }
      />
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
