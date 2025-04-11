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

  return (
    <div className="container py-8">
      <WeeklyVolumesHeader onRefresh={refreshVolumes} isLoading={isLoading} />

      <WeeklyVolumesSummary volumes={volumes} isLoading={isLoading} />

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
  );
}
