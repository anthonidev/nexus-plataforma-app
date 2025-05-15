"use client";

import { TablePagination } from "@/components/common/table/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Item } from "@/types/withdrawals/finance-withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CircleDollarSign,
  CreditCard,
  Eye,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileWithdrawalsView } from "./MobileWithdrawalsView";
import { WithdrawalQuickViewModal } from "./WithdrawalQuickViewModal";

// Configuración de estados para badges
const statusConfig = {
  PENDING: {
    label: "Pendiente",
    variant:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  APPROVED: {
    label: "Aprobado",
    variant:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  REJECTED: {
    label: "Rechazado",
    variant: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

interface WithdrawalsTableProps {
  withdrawals: Item[];
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
  onRefresh: () => void;
}

export default function WithdrawalsTable({
  withdrawals,
  isLoading,
  error,
  meta,
  currentPage,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  onRefresh,
}: WithdrawalsTableProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Item | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (withdrawal: Item) => {
    setSelectedWithdrawal(withdrawal);
    setIsQuickViewOpen(true);
  };

  if (isLoading) {
    return <WithdrawalsTableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error al cargar retiros
              </h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="mt-2 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400"
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
        <CardTitle className="flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-primary" />
          Solicitudes de Retiro
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <MobileWithdrawalsView
            withdrawals={withdrawals}
            onQuickView={handleQuickView}
          />
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Fecha Revisión</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.length > 0 ? (
                  withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell className="font-medium">
                        #{withdrawal.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {withdrawal.user.personalInfo.firstName}{" "}
                            {withdrawal.user.personalInfo.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {withdrawal.user.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(withdrawal.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            statusConfig[withdrawal.status]?.variant ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {statusConfig[withdrawal.status]?.label ||
                            withdrawal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>
                            {format(new Date(withdrawal.createdAt), "dd/MM/yyyy")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {withdrawal.reviewedAt ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>
                              {format(
                                new Date(withdrawal.reviewedAt),
                                "dd/MM/yyyy"
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{withdrawal.bankName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickView(withdrawal)}
                            className="h-8 w-8 p-0"
                            title="Vista rápida"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {withdrawal.status === "PENDING" && (
                            <Link href={`/admin/retiros/detalle/${withdrawal.id}`}>
                              <Button
                                variant="default"
                                size="sm"
                                className="h-8"
                              >
                                Gestionar
                              </Button>
                            </Link>
                          )}

                          {withdrawal.status !== "PENDING" && (
                            <Link href={`/admin/retiros/detalle/${withdrawal.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                              >
                                Ver detalle
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No hay solicitudes de retiro registradas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {meta && meta.totalItems > 0 && (
          <div className="flex items-center justify-between space-x-2 mt-4">
            <TablePagination
              pagination={{
                pageIndex: currentPage - 1,
                pageSize: itemsPerPage,
              }}
              pageCount={meta.totalPages}
              pageIndex={currentPage - 1}
              totalItems={meta.totalItems}
              setPageIndex={(updatedPageIndex) => onPageChange(Number(updatedPageIndex) + 1)}
              setPageSize={() => onPageSizeChange}
              previousPage={() => onPageChange(currentPage - 1)}
              nextPage={() => onPageChange(currentPage + 1)}
              canPreviousPage={currentPage <= 1}
              canNextPage={currentPage >= meta.totalPages}
            />
          </div>
        )}
      </CardContent>

      {/* Modal de vista rápida */}
      {selectedWithdrawal && (
        <WithdrawalQuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          withdrawal={selectedWithdrawal}
        />
      )}
    </Card>
  );
}

function WithdrawalsTableSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-8" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-32" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t">
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between space-x-2 mt-4">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-9 w-[200px]" />
        </div>
      </CardContent>
    </Card>
  );
}