"use client";

import { DateFormatDisplay } from "@/components/common/table/DateFormatDisplay";
import { StatusBadge } from "@/components/common/table/StatusBadge";
import { TablePagination } from "@/components/common/table/TablePagination";
import { TableSkeleton } from "@/components/common/table/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PointTransactionItem } from "@/types/points/point";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Eye,
  FilterIcon,
  History,
  RefreshCw
} from "lucide-react";
import { useMemo, useState } from "react";

import { DesktopTableView } from "./DesktopTableView";
import { MobileTableView } from "./MobileTableView";
import { PointsTransactionsFilters } from "./PointsTransactionsFilters";
import { TransactionDetailModal } from "./TransactionDetailModal";

export interface PointsTransactionsFiltersState {
  status?: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED";
  type?: "WITHDRAWAL" | "BINARY_COMMISSION" | "DIRECT_BONUS";
  startDate?: string;
  endDate?: string;
}

interface PointsTransactionsTableProps {
  transactions: PointTransactionItem[];
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
  onRefresh: () => Promise<void>;

  onStatusChange?: (status: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED" | undefined) => void;
  onTypeChange?: (type: "WITHDRAWAL" | "BINARY_COMMISSION" | "DIRECT_BONUS" | undefined) => void;
  onStartDateChange?: (date: string | undefined) => void;
  onEndDateChange?: (date: string | undefined) => void;
  onResetFilters: () => void
  filters?: PointsTransactionsFiltersState;
}

export default function PointsTransactionsTable({
  transactions,
  isLoading,
  error,
  meta,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onStatusChange,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
  onResetFilters,
  filters = {},
}: PointsTransactionsTableProps) {
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PointTransactionItem | null>(null);

  const handleViewDetail = (transaction: PointTransactionItem) => {
    setSelectedTransaction(transaction);
  };

  const closeDetailModal = () => {
    setSelectedTransaction(null);
  };

  const columns = useMemo<ColumnDef<PointTransactionItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium text-sm">
            #{row.getValue("id")}
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          let label = type;
          let className = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

          switch (type) {
            case "WITHDRAWAL":
              label = "Retiro";
              className = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
              break;
            case "BINARY_COMMISSION":
              label = "Comisión Binaria";
              className = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
              break;
            case "DIRECT_BONUS":
              label = "Bono Directo";
              className = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
              break;
          }

          return (
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
                {label}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Cantidad",
        cell: ({ row }) => (
          <div className="font-semibold">
            {row.getValue<number>("amount").toLocaleString()}
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
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => (
          <DateFormatDisplay date={row.original.createdAt} />
        ),
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
    data: transactions,
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
                <History className="h-4 w-4 text-red-500" />
              </div>
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error al cargar transacciones
              </h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button
              onClick={() => onRefresh()}
              variant="outline"
              size="sm"
              className="mt-4 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Reintentar
            </Button>
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
            <History className="h-5 w-5 text-primary" />
            Historial de Transacciones
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRefresh()}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Actualizar</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {openFilters && (
          <PointsTransactionsFilters
            status={filters.status}
            type={filters.type}
            startDate={filters.startDate}
            endDate={filters.endDate}
            onStatusChange={onStatusChange}
            onTypeChange={onTypeChange}
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
              transactions={transactions}
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

        {selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            open={!!selectedTransaction}
            onClose={closeDetailModal}
          />
        )}
      </CardContent>
    </Card>
  );
}