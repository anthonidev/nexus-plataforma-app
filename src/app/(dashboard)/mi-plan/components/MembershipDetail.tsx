"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MembershipDetailResponse } from "@/types/plan/membership";
import { format } from "@/utils/date.utils";
import { formatCurrency } from "@/utils/format-currency.utils";
import {
  AlertTriangle,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
} from "lucide-react";

interface MembershipDetailProps {
  membership: MembershipDetailResponse | null;
  isLoading: boolean;
  error: string | null;
}

// Mapeo de estados a colores y estilos
const statusConfig = {
  PENDING: {
    label: "Pendiente",
    badge:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    icon: <Clock className="h-4 w-4" />,
  },
  ACTIVE: {
    label: "Activa",
    badge:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  INACTIVE: {
    label: "Inactiva",
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    icon: <XCircle className="h-4 w-4" />,
  },
  EXPIRED: {
    label: "Expirada",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
};

export default function MembershipDetail({
  membership,
  isLoading,
  error,
}: MembershipDetailProps) {
  if (isLoading) {
    return <MembershipDetailSkeleton />;
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!membership) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="p-4 rounded-lg border text-center">
            <p className="text-muted-foreground">
              No tiene una membresía activa actualmente
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = membership.membership.status;
  const statusInfo =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.INACTIVE;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Mi Plan
          </span>
          <Badge
            className={`px-2 py-1 flex items-center gap-1 ${statusInfo.badge}`}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información principal del plan */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">
                  {membership.membership.plan.name}
                </h3>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(membership.membership.plan.price)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium">Vigencia</span>
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Inicio:</span>{" "}
                    {format(membership.membership.startDate, "dd/MM/yyyy")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Fin:</span>{" "}
                    {format(membership.membership.endDate, "dd/MM/yyyy")}
                  </p>
                </div>

                <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium">
                      Próxima reconsumo
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    {format(
                      membership.membership.nextReconsumptionDate,
                      "dd/MM/yyyy"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {membership.pendingReconsumption
                      ? "Tiene un reconsumo pendiente"
                      : "Sin reconsumos pendientes"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información secundaria del plan */}
          <div className="space-y-4">
            <div className="bg-background rounded-xl p-5 border">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Comisiones</h3>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Porcentaje:
                  </span>
                  <span className="font-medium">
                    {membership.membership.plan.commissionPercentage}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Check amount:
                  </span>
                  <span className="font-medium">
                    ${membership.membership.plan.checkAmount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Puntos binarios:
                  </span>
                  <span className="font-medium">
                    {membership.membership.plan.binaryPoints}
                  </span>
                </div>
              </div>
            </div>

            {/* Estado de reconsumo */}
            <div
              className={`rounded-xl p-4 border ${
                membership.canReconsume
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50"
                  : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {membership.canReconsume ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span className="font-medium">
                  {membership.canReconsume
                    ? "Elegible para reconsumo"
                    : "No elegible para reconsumo"}
                </span>
              </div>
              <p className="text-sm">
                {membership.pendingReconsumption
                  ? "Tiene un reconsumo pendiente de pago"
                  : membership.canReconsume
                  ? "Puede generar un nuevo reconsumo"
                  : "No cumple con los requisitos para generar un reconsumo"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MembershipDetailSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-7 w-32" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-lg p-3 border">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>

                <div className="rounded-lg p-3 border">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl p-5 border">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>

              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4 border">
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-48" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
