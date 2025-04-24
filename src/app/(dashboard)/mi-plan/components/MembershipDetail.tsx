"use client";

import { StatusBadge } from "@/components/common/table/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MembershipDetailResponse } from "@/types/plan/membership";
import { format } from "@/utils/date.utils";
import { formatCurrency } from "@/utils/format-currency.utils";
import {
  AlertTriangle,
  Banknote,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  TrendingUp
} from "lucide-react";
import { useRouter } from "next/navigation";
import MembershipDetailSkeleton from "./skeleton/MembershipDetailSkeleton";

interface Props {
  membership: MembershipDetailResponse | null;
  isLoading: boolean;
  error: string | null;
}


export default function MembershipDetail({
  membership,
  isLoading,
  error,
}: Props) {
  const { push } = useRouter();
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

  return (
    <Card className="mb-6 shadow-sm overflow-hidden border-primary/10">
      <CardContent className="pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-32 bg-primary/5 rotate-45 -mb-10 -mr-10 rounded-full blur-xl"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="space-y-1">
                  <StatusBadge status={status} />

                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    {membership.membership.plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">Plan de membresía </p>

                </div>
                <div className="text-2xl font-bold text-primary flex items-baseline gap-1">
                  {formatCurrency(membership.membership.plan.price)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 relative z-10">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Periodo de Vigencia</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fecha de inicio</p>
                      <p className="text-sm font-semibold bg-primary/5 rounded-md px-2 py-1 inline-block">
                        {format(membership.membership.startDate, "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Fecha de fin</p>
                      <p className="text-sm font-semibold bg-primary/5 rounded-md px-2 py-1 inline-block">
                        {format(membership.membership.endDate, "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Próximo Reconsumo</span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 mr-2">
                        <CalendarClock className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {format(membership.membership.nextReconsumptionDate, "dd/MM/yyyy")}
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información secundaria del plan */}
          <div className="space-y-4">
            <div className="bg-background rounded-xl p-5 border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shadow-sm">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Detalles de Comisiones</h3>
                  <p className="text-xs text-muted-foreground">Beneficios de tu plan</p>
                </div>
              </div>

              <div className="space-y-3 mt-3 divide-y divide-dashed divide-primary/10">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    Porcentaje de comisión binaria
                  </span>
                  <span className="font-medium text-primary">
                    {membership.membership.plan.commissionPercentage}%
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <DollarSign className="h-3.5 w-3.5 text-primary" />
                    Cheque de consumo
                  </span>
                  <span className="font-medium text-primary">
                    ${membership.membership.plan.checkAmount}
                  </span>
                </div>


              </div>
            </div>

            {/* Estado de reconsumo */}
            <div
              className={`rounded-xl p-5 border shadow-sm ${membership.canReconsume
                ? "bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-900/20 dark:to-green-900/10 border-green-200 dark:border-green-800/50"
                : "bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800/50"
                }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${membership.canReconsume
                  ? "bg-green-100 dark:bg-green-800/30"
                  : "bg-amber-100 dark:bg-amber-800/30"
                  }`}>
                  {membership.canReconsume ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div>
                  <h3 className={`font-medium ${membership.canReconsume
                    ? "text-green-700 dark:text-green-400"
                    : "text-amber-700 dark:text-amber-400"
                    }`}>
                    {membership.canReconsume
                      ? "Elegible para reconsumo"
                      : "No elegible para reconsumo"}
                  </h3>
                  <p className="text-sm mt-0.5">
                    {membership.pendingReconsumption
                      ? "Tiene un reconsumo pendiente de pago"
                      : membership.canReconsume
                        ? "Puede generar un nuevo reconsumo"
                        : "No cumple con los requisitos para generar un reconsumo"}
                  </p>
                </div>
              </div>

              {membership.canReconsume && !membership.pendingReconsumption && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => push("/mis-reconsumos")}
                  className="w-full mt-2 bg-white dark:bg-green-900/20 border-green-200 dark:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-900/30 text-green-700 dark:text-green-400"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Generar reconsumo
                </Button>
              )}

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


