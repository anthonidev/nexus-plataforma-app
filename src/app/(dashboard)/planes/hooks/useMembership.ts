"use client";

import { getMembershipPlans } from "@/lib/actions/users/plans.action";
import { MembershipPlan } from "@/types/plan/plan.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseMembershipPlansOptions {
  isActive?: boolean;
  autoFetch?: boolean;
}

interface UseMembershipPlansReturn {
  plans: MembershipPlan[];
  isLoading: boolean;
  error: string | null;

  userMembership: {
    hasMembership: boolean;
    status?: "PENDING" | "ACTIVE" | "EXPIRED" | "INACTIVE";
    plan?: {
      id: number;
      name: string;
      price: string;
    };
    nextReconsumptionDate?: string;
    endDate?: string;
    message?: string;
  };

  refetch: (options?: { isActive?: boolean }) => Promise<void>;
}

export function useMembershipPlans(
  options: UseMembershipPlansOptions = {}
): UseMembershipPlansReturn {
  const { isActive, autoFetch = true } = options;

  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const [userMembership, setUserMembership] = useState<
    UseMembershipPlansReturn["userMembership"]
  >({
    hasMembership: false,
  });

  const fetchPlans = useCallback(
    async (fetchOptions?: { isActive?: boolean }) => {
      try {
        setIsLoading(true);
        setError(null);

        const activeFilter =
          fetchOptions?.isActive !== undefined
            ? fetchOptions.isActive
            : isActive;

        const response = await getMembershipPlans(activeFilter);

        if (response.plans) {
          setPlans(response.plans);
        } else {
          setPlans([]);
        }

        if (response.userMembership) {
          setUserMembership(response.userMembership);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al cargar los planes de membresía";

        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Error al cargar los planes de membresía:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [isActive]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPlans();
    }
  }, [autoFetch, fetchPlans]);

  return {
    plans,
    isLoading,
    error,
    userMembership,
    refetch: fetchPlans,
  };
}
