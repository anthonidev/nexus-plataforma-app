"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getMembershipPlanById,
  subscribeToPlan,
  upgradeToPlan,
} from "@/lib/actions/users/plans.action";
import { MembershipPlan } from "@/types/plan/plan.types";

export function useMembershipDetail(planId: number) {
  const router = useRouter();

  const [plan, setPlan] = useState<MembershipPlan | null>(null);
  const [userMembership, setUserMembership] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPlanDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMembershipPlanById(planId);
      setPlan(response.plan);
      setUserMembership(response.userMembership);
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

  const handleSubscription = useCallback(
    async (formData: FormData) => {
      try {
        setIsSubmitting(true);

        const paymentImages = formData.getAll("paymentImages") as File[];
        const payments = JSON.parse(formData.get("payments") as string);

        if (paymentImages.length !== payments.length) {
          toast.error(
            "El número de imágenes debe coincidir con el número de pagos"
          );
          return;
        }

        if (paymentImages.some((file) => file.size > 5 * 1024 * 1024)) {
          toast.error("Las imágenes no deben superar 5MB cada una");
          return;
        }

        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (paymentImages.some((file) => !validTypes.includes(file.type))) {
          toast.error("Solo se permiten imágenes JPG, JPEG o PNG");
          return;
        }

        let result;
        if (plan?.isUpgrade) {
          result = await upgradeToPlan(formData);
        } else {
          result = await subscribeToPlan(formData);
        }

        if (result.success) {
          toast.success(result.message);
          router.push("/planes");
        } else {
          toast.error(result.message || "Error al procesar la solicitud");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : plan?.isUpgrade
            ? "Ocurrió un error al actualizar el plan"
            : "Ocurrió un error al suscribirse al plan";

        toast.error(errorMessage);
        console.error(
          plan?.isUpgrade ? "Upgrade error:" : "Subscription error:",
          err
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, plan]
  );

  useEffect(() => {
    fetchPlanDetails();
  }, [fetchPlanDetails]);

  return {
    plan,
    userMembership,
    isLoading,
    error,

    handleSubscription,
    isSubmitting,

    refetchPlan: fetchPlanDetails,
  };
}
