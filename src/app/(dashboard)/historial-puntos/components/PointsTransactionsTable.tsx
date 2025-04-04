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
import { PointTransactionItem } from "@/types/points/point";
import { format } from "date-fns";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  History,
  RefreshCw,
} from "lucide-react";

// Configuración de tipos de transacciones para colores y etiquetas
const typeConfig = {
  WITHDRAWAL: {
    label: "Retiro",
    variant:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  BINARY_COMMISSION: {
    label: "Comisión Binaria",
    variant:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  DIRECT_BONUS: {
    label: "Bono Directo",
    variant: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
};

// Configuración de estados para colores y etiquetas
const statusConfig = {
  PENDING: {
    label: "Pendiente",
    variant:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  COMPLETED: {
    label: "Completado",
    variant:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  CANCELLED: {
    label: "Cancelado",
    variant: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
  FAILED: {
    label: "Fallido",
    variant: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

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
  onRefresh: () => void;
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
}: PointsTransactionsTableProps) {
  if (isLoading) {
    return <PointsTransactionsTableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error al cargar transacciones
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Historial de Transacciones
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Actualizar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      #{transaction.id}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          typeConfig[
                            transaction.type as keyof typeof typeConfig
                          ]?.variant || "bg-gray-100 text-gray-800"
                        }
                      >
                        {typeConfig[transaction.type as keyof typeof typeConfig]
                          ?.label || transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusConfig[
                            transaction.status as keyof typeof statusConfig
                          ]?.variant || "bg-gray-100 text-gray-800"
                        }
                      >
                        {statusConfig[
                          transaction.status as keyof typeof statusConfig
                        ]?.label || transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(transaction.createdAt), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      {transaction.membershipPlan?.name || "—"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay transacciones registradas
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

function PointsTransactionsTableSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-24" />
        </div>
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
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
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
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
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
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-8 w-48" />
        </div>
      </CardContent>
    </Card>
  );
}
