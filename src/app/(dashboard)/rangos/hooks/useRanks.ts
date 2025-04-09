"use client";

import { getRanks } from "@/lib/actions/ranks/ranks.action";
import { Rank, UserRank } from "@/types/ranks/rank.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseRanksReturn {
  ranks: Rank[];
  userRank: UserRank | null;
  isLoading: boolean;
  error: string | null;
  refreshRanks: () => Promise<void>;
}

export function useRanks(): UseRanksReturn {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRanks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getRanks();

      setRanks(response.ranks);
      setUserRank(response.userRank);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar los rangos";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanks();
  }, [fetchRanks]);

  return {
    ranks,
    userRank,
    isLoading,
    error,
    refreshRanks: fetchRanks,
  };
}
