"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentListItem } from "@/types/payment/payment.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface PaymentsTableProps {
  payments: PaymentListItem[];
  isLoading: boolean;
  pageCount: number;
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function PaymentsTable({
  payments,
  isLoading,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaymentsTableProps) {
  const router = useRouter();

  const statusMap = {
    PENDING: { label: "Pendiente", variant: "warning" as const },
    APPROVED: { label: "Aprobado", variant: "success" as const },
    REJECTED: { label: "Rechazado", variant: "destructive" as const },
  };

  const columns = useMemo<ColumnDef<PaymentListItem>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <span>#{row.getValue("id")}</span>,
      },
      {
        accessorKey: "amount",
        header: "Monto",
        cell: ({ row }) => formatCurrency(row.getValue("amount")),
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
          const status = row.getValue("status") as keyof typeof statusMap;
          const { label, variant } = statusMap[status] || {
            label: status,
            variant: "default" as const,
          };
          //   return <Badge variant={variant}>{label}</Badge>;
          return <Badge variant={"default"}>{label}</Badge>;
        },
      },
      {
        accessorKey: "paymentConfig.name",
        header: "Tipo",
        cell: ({ row }) => {
          const paymentConfig = row.original.paymentConfig;
          return paymentConfig?.name || "N/A";
        },
      },
      {
        accessorKey: "createdAt",
        header: "Fecha",
        cell: ({ row }) => {
          const date = row.original.createdAt;
          return date ? format(new Date(date), "dd/MM/yyyy HH:mm") : "N/A";
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                router.push(`/mis-pagos/detalle/${row.original.id}`)
              }
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
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
    return <PaymentsTableSkeleton columns={columns.length} />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No se encontraron pagos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Mostrando
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] mx-1">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            de {table.getFilteredRowModel().rows.length} registros
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentsTableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-9 w-[200px]" />
      </div>
    </div>
  );
}
