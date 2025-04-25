"use client";

import { DateFormatDisplay } from "@/components/common/table/DateFormatDisplay";
import { StatusBadge } from "@/components/common/table/StatusBadge";
import { TablePagination } from "@/components/common/table/TablePagination";
import { TableSkeleton } from "@/components/common/table/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeeklyVolumeItem } from "@/types/points/volumen";
import { formatCurrency } from "@/utils/format-currency.utils";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowRight,
  BarChart3,
  ChartBarIcon,
  Eye,
  FilterIcon,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { VolumeDetailModal } from "./VolumeDetailModal";
import { DesktopTableView } from "./DesktopTableView";
import { WeeklyVolumesFilters } from "./WeeklyVolumesFilters";
import { MobileTableView } from "./MobileTableView";

export interface WeeklyVolumesFiltersState {
  status?: "PENDING" | "PROCESSED" | "CANCELLED";
  startDate?: string;
  endDate?: string;
}

interface WeeklyVolumesTableProps {
  volumes: WeeklyVolumeItem[];
  isLoading: boolean;
  error: string | null;
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  } | null;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRefresh?: () => Promise<void>;

  onStatusChange?: (status: "PENDING" | "PROCESSED" | "CANCELLED" | undefined) => void;
  onStartDateChange?: (date: string | undefined) => void;
  onEndDateChange?: (date: string | undefined) => void;
  onResetFilters?: () => void;
  filters?: WeeklyVolumesFiltersState;
}

export default function WeeklyVolumesTable({
  volumes,
  isLoading,
  error,
  meta,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onResetFilters,
  filters = {},
}: WeeklyVolumesTableProps) {
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<WeeklyVolumeItem | null>(null);

  const handleViewDetail = (volume: WeeklyVolumeItem) => {
    setSelectedVolume(volume);
  };

  const closeDetailModal = () => {
    setSelectedVolume(null);
  };

  const columns = useMemo<ColumnDef<WeeklyVolumeItem>[]>(
    () => [

      {
        accessorKey: "weekStartDate",
        header: "Semana",
        cell: ({ row }) => (
          <div>
            <DateFormatDisplay date={row.original.weekStartDate} />
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ArrowRight className="h-3 w-3" />
              <DateFormatDisplay date={row.original.weekEndDate} />
            </div>
          </div>
        ),
      },
      {
        accessorKey: "leftVolume",
        header: "Volumen Izq.",
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.leftVolume.toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "rightVolume",
        header: "Volumen Der.",
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.rightVolume.toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("status")} />
        ),
      },
      {
        accessorKey: "paidAmount",
        header: "Comisión",
        cell: ({ row }) => {
          const paidAmount = row.original.paidAmount;
          return paidAmount ? (
            <div className="font-semibold text-primary">
              {formatCurrency(paidAmount)}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        id: "actions",
        header: "Detalle",
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetail(row.original)}
              className="hover:bg-primary/10 hover:text-primary"
              title="Ver detalle"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver detalle</span>
            </Button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: volumes,
    columns,
    pageCount: meta?.totalPages || 0,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    onPaginationChange: (updater) => {
      const state =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize: itemsPerPage })
          : updater;
      if (state.pageIndex !== currentPage - 1) {
        onPageChange(state.pageIndex + 1);
      }
      if (state.pageSize !== itemsPerPage) {
        onPageSizeChange(state.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-red-500" />
              </div>
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error al cargar volúmenes
              </h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                size="sm"
                className="mt-4 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Reintentar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Historial de Volúmenes Semanales
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenFilters(!openFilters)}
              className="flex items-center gap-1"
            >
              <FilterIcon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{openFilters ? "Ocultar filtros" : "Filtros"}</span>
            </Button>

          </div>
        </div>
      </CardHeader>
      <CardContent>
        {openFilters && onResetFilters && (
          <WeeklyVolumesFilters
            status={filters.status}
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStatusChange={onStatusChange}
            onStartDateChange={onStartDateChange}
            onEndDateChange={onEndDateChange}
            onReset={onResetFilters}
            className="mb-6"
          />
        )}

        <div className="space-y-4">
          <div className="hidden md:block">
            <DesktopTableView table={table} columns={columns} />
          </div>

          <div className="md:hidden">
            <MobileTableView
              volumes={volumes}
              onViewDetail={handleViewDetail}
            />
          </div>

          {meta && (
            <TablePagination
              pagination={table.getState().pagination}
              previousPage={table.previousPage}
              nextPage={table.nextPage}
              pageIndex={currentPage - 1}
              pageCount={meta.totalPages}
              setPageSize={table.setPageSize}
              canNextPage={!table.getCanNextPage()}
              canPreviousPage={!table.getCanPreviousPage()}
              totalItems={meta.totalItems}
              setPageIndex={table.setPageIndex}
            />
          )}
        </div>

        {selectedVolume && (
          <VolumeDetailModal
            volume={selectedVolume}
            open={!!selectedVolume}
            onClose={closeDetailModal}
          />
        )}
      </CardContent>
    </Card>
  );
}