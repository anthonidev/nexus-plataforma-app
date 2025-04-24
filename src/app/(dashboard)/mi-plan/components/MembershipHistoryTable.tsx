"use client";

import { DateFormatDisplay } from "@/components/common/table/DateFormatDisplay";
import { TablePagination } from "@/components/common/table/TablePagination";
import { TableSkeleton } from "@/components/common/table/TableSkeleton";
import { Button } from "@/components/ui/button";
import { MembershipHistoryItem } from "@/types/plan/membership";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Info
} from "lucide-react";
import { useMemo, useState } from "react";
import ActionBadge from "./ActionBadge";
import { DesktopTableView } from "./DesktopTableView";
import MobileTableView from "./MobileTableView";
import DetailHistory from "./modal/DetailHistory";


interface Props {
  historyItems: MembershipHistoryItem[];
  isLoading: boolean;
  error: string | null
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  totalItems: number;
}

export function MembershipHistoryTable({
  historyItems,
  isLoading,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems,
  error,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<MembershipHistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item: MembershipHistoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  const columns = useMemo<ColumnDef<MembershipHistoryItem>[]>(
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
        accessorKey: "action",
        header: "Acción",
        cell: ({ row }) => (
          <ActionBadge action={row.getValue("action")} />
        ),
      },
      {
        accessorKey: "notes",
        header: "Notas",
        cell: ({ row }) => {
          const notes = row.original.notes;
          return (
            <div className="text-sm max-w-xs truncate">
              {notes || "Sin notas"}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => (
          <DateFormatDisplay date={row.original.createdAt} />
        ),
      },
      {
        id: "details",
        header: "Detalles",
        cell: ({ row }) => {
          return row.original.changes ? (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 hover:text-primary"
              title="Ver detalles"
              onClick={() => openModal(row.original)}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">Ver detalles</span>
            </Button>
          ) : null;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: historyItems,
    columns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const state =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      if (state.pageIndex !== pageIndex) {
        onPageChange(state.pageIndex + 1);
      }
      if (state.pageSize !== pageSize) {
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


  return (
    <div className="space-y-4">
      <div className="hidden md:block">
        <DesktopTableView table={table} columns={columns} />
      </div>

      <div className="md:hidden">
        <MobileTableView historyItems={historyItems}
          openModal={openModal}
        />
      </div>
      {isModalOpen && selectedItem && (<DetailHistory
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        selectedItem={selectedItem}
      />
      )}


      <TablePagination
        pagination={table.getState().pagination}
        previousPage={table.previousPage}
        nextPage={table.nextPage}
        pageIndex={pageIndex}
        pageCount={pageCount}
        setPageSize={table.setPageSize}
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        totalItems={totalItems}
        setPageIndex={table.setPageIndex}
      />
    </div>
  );
}