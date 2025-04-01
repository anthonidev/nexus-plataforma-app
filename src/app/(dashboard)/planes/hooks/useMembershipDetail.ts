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

        // Validate files
        const paymentImages = formData.getAll("paymentImages") as File[];
        const payments = JSON.parse(formData.get("payments") as string);

        // Validate file count matches payment count
        if (paymentImages.length !== payments.length) {
          toast.error(
            "El número de imágenes debe coincidir con el número de pagos"
          );
          return;
        }

        // Validate file sizes
        if (paymentImages.some((file) => file.size > 5 * 1024 * 1024)) {
          toast.error("Las imágenes no deben superar 5MB cada una");
          return;
        }

        // Validate file types
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (paymentImages.some((file) => !validTypes.includes(file.type))) {
          toast.error("Solo se permiten imágenes JPG, JPEG o PNG");
          return;
        }

        const result = await subscribeToPlan(formData);

        if (result.success) {
          toast.success(result.message);
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
