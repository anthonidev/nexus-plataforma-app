"use client";

import { DateFormatDisplay } from "@/components/common/table/DateFormatDisplay";
import { StatusBadge } from "@/components/common/table/StatusBadge";
import { TablePagination } from "@/components/common/table/TablePagination";
import { TableSkeleton } from "@/components/common/table/TableSkeleton";
import { Button } from "@/components/ui/button";
import { PaymentListItem } from "@/types/payment/payment.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DesktopTableView } from "./table/DesktopTableView";
import { MobileTableView } from "./table/MobileTableView";

interface PaymentsTableProps {
  payments: PaymentListItem[];
  isLoading: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  totalItems: number;
}

export function PaymentsTable({
  payments,
  isLoading,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems
}: PaymentsTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<PaymentListItem>[]>(
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
        accessorKey: "amount",
        header: "Monto",
        cell: ({ row }) => (
          <div className="font-semibold">
            {formatCurrency(row.getValue("amount"))}
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
        accessorKey: "user",
        header: "Usuario",
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user.personalInfo.firstName} {user.personalInfo.lastName}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {user.email}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                DNI: {user.personalInfo.documentNumber || "No disponible"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "paymentConfig.name",
        header: "Tipo",
        cell: ({ row }) => {
          const paymentConfig = row.original.paymentConfig;
          return (
            <div className="text-sm">
              {paymentConfig?.name || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Creado",
        cell: ({ row }) => (
          <DateFormatDisplay date={row.original.createdAt} />
        ),
      },
      {
        accessorKey: "reviewedAt",
        header: "Revisado",
        cell: ({ row }) => (
          row.original.reviewedAt ?
            <DateFormatDisplay date={row.original.reviewedAt} /> :
            <span className="text-xs text-muted-foreground">Pendiente</span>
        ),
      },
      {
        accessorKey: "Detalle",
        header: "Detalles",

        cell: ({ row }) => {
          const { codeOperation, numberTicket } = row.original;
          return (
            <div className="text-sm">
              <div>
                <strong>Código:</strong> {codeOperation || "N/A"}
              </div>
              <div>
                <strong>Ticket:</strong> {numberTicket || "N/A"}
              </div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(`/admin/pagos/detalle/${row.original.id}`)
              }
              className="hover:bg-primary/10 hover:text-primary"
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver detalles</span>
            </Button>
          );
        },
      },
    ],
    [router]
  );

  const table = useReactTable({
    data: payments,
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
        <MobileTableView payments={payments} />
      </div>

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