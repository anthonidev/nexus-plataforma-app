"use client";
import { useRouter } from "next/navigation";
import EmptyPlansMessage from "./components/EmptyPlansMessage";
import ErrorMessage from "./components/ErrorMessage";
import MembershipPlansList from "./components/MembershipPlansList";
import MembershipStatusCard from "./components/MembershipStatusCard";
import PageHeader from "./components/PageHeader";
import { useMembershipPlans } from "./hooks/useMembership";

export default function MembershipPlansPage() {
  const router = useRouter();

  const { plans, isLoading, error, refetch, userMembership } =
    useMembershipPlans({
      isActive: true,
    });

  const handleSelectPlan = (planId: number) => {
    router.push(`planes-de-membresia/detalle/${planId}`);
  };

  const shouldShowPlans = () => {
    if (!userMembership) return true;

    switch (userMembership.status) {
      case "PENDING":
        return false;
      case "ACTIVE":
      case "EXPIRED":
      case "INACTIVE":
      default:
        return true;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 sm:px-6">
      <PageHeader />

      {error && <ErrorMessage errorMessage={error} onRetry={refetch} />}

      {!isLoading && userMembership && (
        <MembershipStatusCard
          userMembership={userMembership}
          onSelectPlan={handleSelectPlan}
        />
      )}

      {shouldShowPlans() ? (
        <MembershipPlansList
          plans={plans}
          isLoading={isLoading}
          userMembershipStatus={userMembership?.status}
          onSelectPlan={handleSelectPlan}
        />
      ) : null}

      {plans.length === 0 &&
        !isLoading &&
        !error &&
        !userMembership?.status && <EmptyPlansMessage onRefresh={refetch} />}
    </div>
  );
}
