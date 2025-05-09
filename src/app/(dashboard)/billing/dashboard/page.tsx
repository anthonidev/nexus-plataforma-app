"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Landmark } from "lucide-react";
import { UserRankChart } from "./components/UserRankChart";
import { UserStateChart } from "./components/UserStateChart";
import { MembershipTrendsChart } from "./components/MembershipTrendsChart";
import { MembershipPlanRadialChart } from "./components/MembershipPlanRadialChart";
import { OrdersLineChart } from "./components/OrdersLineChart";
import { PaymentsStackedBarChart } from "./components/PaymentsStackedBarChart";
import { UserCreationBarChart } from "./components/UserCreationBarChart";

export default function BillingDashboardPage() {
    return (
        <div className="container py-8">
            <PageHeader
                title="Panel de Facturación"
                subtitle="Estadísticas y reportes del área de facturación"
                variant="gradient"
                icon={Landmark}
            />

            {/* Row 1: Top charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* UserRankChart takes 2 columns on larger screens */}
                <div className="md:col-span-2">
                    <UserRankChart />
                </div>

                {/* UserStateChart takes 1 column */}
                <div>
                    <UserStateChart />
                </div>
            </div>

            {/* Row 2: Middle charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* MembershipPlanRadialChart */}
                <div>
                    <MembershipPlanRadialChart />
                </div>

                {/* MembershipTrendsChart takes 2 columns */}
                <div className="md:col-span-2">
                    <MembershipTrendsChart />
                </div>
            </div>

            {/* Row 3: Bottom charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* OrdersLineChart */}
                <div>
                    <OrdersLineChart />
                </div>

                {/* PaymentsStackedBarChart */}
                <div>
                    <PaymentsStackedBarChart />
                </div>
            </div>

            {/* Row 4: User Creation chart */}
            <div className="mt-6">
                <UserCreationBarChart />
            </div>
        </div>
    );
}