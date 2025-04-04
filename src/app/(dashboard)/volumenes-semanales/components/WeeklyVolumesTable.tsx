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
import { WeeklyVolumeItem } from "@/types/points/volumen";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  RefreshCw,
} from "lucide-react";

// Configuración de estados para badges
const statusConfig = {
  PENDING: {
    label: "Pendiente",
    variant:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  },
  PROCESSED: {
    label: "Procesado",
    variant:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  CANCELLED: {
    label: "Cancelado",
    variant: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  },
};

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
}: WeeklyVolumesTableProps) {
  if (isLoading) {
    return <WeeklyVolumesTableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error al cargar volúmenes
              </h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Historial de Volúmenes Semanales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semana</TableHead>
                <TableHead>Volumen Izq.</TableHead>
                <TableHead>Volumen Der.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Comisión</TableHead>
                <TableHead>Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volumes.length > 0 ? (
                volumes.map((volume) => (
                  <TableRow key={volume.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {format(new Date(volume.weekStartDate), "dd/MM/yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          {format(new Date(volume.weekEndDate), "dd/MM/yyyy")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{volume.leftVolume.toLocaleString()}</TableCell>
                    <TableCell>{volume.rightVolume.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusConfig[volume.status]?.variant ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {statusConfig[volume.status]?.label || volume.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {volume.paidAmount ? (
                        <div className="flex items-center gap-1 text-primary">
                          <CircleDollarSign className="h-4 w-4" />
                          {formatCurrency(volume.paidAmount)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {volume.membershipPlan ? (
                        volume.membershipPlan.name
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay volúmenes semanales registrados
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

function WeeklyVolumesTableSkeleton() {
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
                  <Skeleton className="h-4 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-24" />
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
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
