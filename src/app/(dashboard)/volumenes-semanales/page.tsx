"use client";

import WeeklyVolumesHeader from "./components/WeeklyVolumesHeader";
import WeeklyVolumesSummary from "./components/WeeklyVolumesSummary";
import WeeklyVolumesTable from "./components/WeeklyVolumesTable";
import { useWeeklyVolumes } from "./hooks/useWeeklyVolumes";

export default function WeeklyVolumesPage() {
  const {
    volumes,
    isLoading,
    error,
    meta,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    refreshVolumes,
  } = useWeeklyVolumes();

  // Calcular totales para el resumen
  const totalLeftVolume = volumes.reduce(
    (sum, item) => sum + item.leftVolume,
    0
  );
  const totalRightVolume = volumes.reduce(
    (sum, item) => sum + item.rightVolume,
    0
  );
  const totalPaid = volumes.reduce(
    (sum, item) => sum + (item.paidAmount || 0),
    0
  );
  const pendingVolumes = volumes.filter(
    (item) => item.status === "PENDING"
  ).length;

  return (
    <div className="container py-8">
      <WeeklyVolumesHeader onRefresh={refreshVolumes} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sección principal - Tabla de volúmenes */}
        <div className="lg:col-span-2">
          <WeeklyVolumesTable
            volumes={volumes}
            isLoading={isLoading}
            error={error}
            meta={meta}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handleItemsPerPageChange}
          />
        </div>

        {/* Sección lateral - Resumen y métricas */}
        <div>
          <WeeklyVolumesSummary
            totalLeftVolume={totalLeftVolume}
            totalRightVolume={totalRightVolume}
            totalPaid={totalPaid}
            pendingVolumes={pendingVolumes}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
