"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { BarChart3 } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { WeeklyVolumeDetailCard } from "../../components/WeeklyVolumeDetailCard";
import { WeeklyVolumePaymentsTable } from "../../components/WeeklyVolumePaymentsTable";
import { useWeeklyVolumeDetail } from "../../hooks/useWeeklyVolumeDetail";


export default function WeeklyVolumeDetailPage() {

    const params = useParams<{ id: string }>();
    const volumeId = Number(params.id);

    if (isNaN(volumeId)) {
        notFound();
    }
    const {
        volume,
        isLoading,
        error,
        paymentsPage,
        paymentsPageSize,
        handlePageChange,
        handlePageSizeChange,
        refreshVolume
    } = useWeeklyVolumeDetail({ volumeId });

    return (
        <div className="container py-8">
            <PageHeader
                title="Detalle de Volumen Semanal"
                subtitle="Información detallada del volumen semanal y sus comisiones asociadas"
                variant="gradient"
                icon={BarChart3}
                backUrl="/volumenes-semanales"
            />

            <div className="space-y-8 mt-6">
                <WeeklyVolumeDetailCard
                    volume={volume}
                    isLoading={isLoading}
                    error={error}
                    onRefresh={refreshVolume}
                />

                <WeeklyVolumePaymentsTable
                    volume={volume}
                    isLoading={isLoading}
                    error={error}
                    currentPage={paymentsPage}
                    pageSize={paymentsPageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    onRefresh={refreshVolume}
                />
            </div>
        </div>
    );
}