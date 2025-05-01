"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useMonthlyVolumes } from "../hooks/useMonthlyVolumes";
import MonthlyVolumesTable from "../components/volumen/MonthlyVolumesTable";

export default function MonthlyVolumesPage() {
  const {
    volumes,
    isLoading,
    error,
    meta,
    currentPage,
    itemsPerPage,
    filters,
    handlePageChange,
    handleItemsPerPageChange,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    resetFilters,
    refreshVolumes,
  } = useMonthlyVolumes();


  return (
    <div className="container py-8">
      <PageHeader
        title="Volumen Mensual"
        subtitle="Visualiza tu historial de volúmenes y puntos mensuales"
        variant="gradient"
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

        filters={filters}
        onStatusChange={handleStatusChange}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onResetFilters={resetFilters}
      />
    </div>
  );
}