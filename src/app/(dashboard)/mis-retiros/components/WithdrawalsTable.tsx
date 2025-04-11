"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  RefreshCw,
} from "lucide-react";

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
  withdrawals: {
    id: number;
    amount: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: Date;
    reviewedAt?: Date;
    rejectionReason?: string;
    bankName: string;
    accountNumber: string;
    cci?: string;
    reviewedBy?: {
      id: string;
      email: string;
    };
  }[];
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
          <Calendar className="h-5 w-5 text-primary" />
          Historial de Retiros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Fecha Revisión</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Cuenta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.length > 0 ? (
                withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-medium">
                      #{withdrawal.id}
                    </TableCell>
                    <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
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
                      <span className="font-mono text-xs">
                        {withdrawal.accountNumber}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay retiros registrados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {meta && meta.totalItems > 0 && (
          <div className="flex items-center justify-between space-x-2 mt-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Mostrando
                <Select
                  value={`${itemsPerPage}`}
                  onValueChange={(value) => {
                    onPageSizeChange(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px] mx-1">
                    <SelectValue placeholder={itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                de {meta.totalItems} registros
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!meta || currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {currentPage} de {meta?.totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!meta || currentPage >= meta.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-8" />
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
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
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
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 mt-4">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-9 w-[200px]" />
        </div>
      </CardContent>
    </Card>
  );
}
