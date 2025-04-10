"use client";

import MonthlyVolumesHeader from "../components/volumen/MonthlyVolumesHeader";
import MonthlyVolumesSummary from "../components/volumen/MonthlyVolumesSummary";
import MonthlyVolumesTable from "../components/volumen/MonthlyVolumesTable";
import { useMonthlyVolumes } from "../hooks/useMonthlyVolumes";

export default function MonthlyVolumesPage() {
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
  } = useMonthlyVolumes();

  const latestVolume = volumes.length > 0 ? volumes[0] : null;

  return (
    <div className="container py-8">
      <MonthlyVolumesHeader onRefresh={refreshVolumes} isLoading={isLoading} />

      <MonthlyVolumesSummary
        latestVolume={latestVolume}
        isLoading={isLoading}
      />

      <MonthlyVolumesTable
        volumes={volumes}
        isLoading={isLoading}
        error={error}
        meta={meta}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handleItemsPerPageChange}
        onRefresh={refreshVolumes}
      />
    </div>
  );
}
