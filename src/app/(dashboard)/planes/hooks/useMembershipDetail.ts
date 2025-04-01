"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getMembershipPlanById,
  subscribeToPlan,
} from "@/lib/actions/users/plans.action";
import { MembershipPlan } from "@/types/plan/plan.types";

export function useMembershipDetail(planId: number) {
  const router = useRouter();

  // Plan details state
  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscription states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch plan details
  const fetchPlanDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const planDetails = await getMembershipPlanById(planId);
      setPlan(planDetails);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al cargar los detalles del plan";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [planId]);

  // Subscribe to membership plan
  const handleSubscription = useCallback(
    async (formData: FormData) => {
      try {
        setIsSubmitting(true);

        // Validate files (optional but recommended)
        const paymentImages = formData.getAll("paymentImages") as File[];
        if (paymentImages.some((file) => file.size > 5 * 1024 * 1024)) {
          toast.error("Las imágenes no deben superar 5MB cada una");
          return;
        }

        const result = await subscribeToPlan(formData);

        if (result.success) {
          toast.success(result.message);
          // Redirect to plans page or dashboard
          router.push("/planes");
        } else {
          toast.error(result.message || "Error al procesar la suscripción");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Ocurrió un error al suscribirse al plan";

        toast.error(errorMessage);
        console.error("Subscription error:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  // Fetch plan details on component mount
  useEffect(() => {
    fetchPlanDetails();
  }, [fetchPlanDetails]);

  return {
    // Plan details
    plan,
    isLoading,
    error,

    // Subscription methods
    handleSubscription,
    isSubmitting,

    // Refresh method
    refetchPlan: fetchPlanDetails,
  };
}
