"use client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useClientDashboard } from "../hooks/useClientDashboard";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardError from "./DashboardError";
import UserSummaryCard from "./UserSummaryCard";
import MembershipCard from "./MembershipCard";
import PointsCard from "./PointsCard";
import RankCard from "./RankCard";
import WeeklyVolumeCard from "./WeeklyVolumeCard";
import MonthlyVolumeCard from "./MonthlyVolumeCard";
import NetworkCard from "./NetworkCard";

export default function Dashboard() {
  const { dashboard, isLoading, error, refreshDashboard } =
    useClientDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !dashboard) {
    return <DashboardError error={error} onRetry={refreshDashboard} />;
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido, {dashboard.user.name || dashboard.user.email}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshDashboard}
          className="mt-4 md:mt-0"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>Actualizar</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
        <UserSummaryCard user={dashboard.user} />
        {dashboard.membership && (<MembershipCard membership={dashboard.membership} />)}
        {dashboard.points && (
          <PointsCard points={dashboard.points} />
        )}
        {dashboard.rank && <RankCard rank={dashboard.rank} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {dashboard.weeklyVolume && (
          <WeeklyVolumeCard weeklyVolume={dashboard.weeklyVolume} />
        )}
        {dashboard.monthlyVolume && (
          <MonthlyVolumeCard monthlyVolume={dashboard.monthlyVolume} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <NetworkCard network={dashboard.network} />
      </div>
    </div>
  );
}
