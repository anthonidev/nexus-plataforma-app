"use client";

import { PageHeader } from "@/components/common/PageHeader";
import WeeklyVolumesTable from "./components/WeeklyVolumesTable";
import { useWeeklyVolumes } from "./hooks/useWeeklyVolumes";
import { Button } from "@/components/ui/button";
import { ChartNoAxesCombined, RefreshCw } from "lucide-react";

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
      <PageHeader
        title="Volúmenes Semanales"
        subtitle="Visualiza tu historial de volúmenes binarios y comisiones generadas"
        variant="gradient"
        icon={ChartNoAxesCombined}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={refreshVolumes}
            disabled={isLoading}
            className="mt-4 md:mt-0"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Actualizar</span>
          </Button>
        }
      />

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
