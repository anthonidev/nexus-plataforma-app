"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WithdrawalsInfo } from "@/types/withdrawals/withdrawals.type";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  Coins,
  DollarSign,
  WalletIcon,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface WithdrawalsSummaryCardProps {
  withdrawalsInfo: WithdrawalsInfo | null;
  isLoading: boolean;
  error: string | null;
}

export default function WithdrawalsSummaryCard({
  withdrawalsInfo,
  isLoading,
  error,
}: WithdrawalsSummaryCardProps) {
  if (isLoading) {
    return <WithdrawalsSummaryCardSkeleton />;
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 dark:text-red-300">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!withdrawalsInfo) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="p-4 rounded-lg border text-center">
            <p className="text-muted-foreground">
              No hay información de retiros disponible
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formato de los días de la semana
  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const enabledDays = withdrawalsInfo.config.enabledWeekDays
    .map((day) => weekDays[day - 1])
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-primary" />
            Resumen de Retiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Puntos Disponibles */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Puntos Disponibles</h3>
              </div>
              <p className="text-3xl font-bold text-primary mt-2">
                {withdrawalsInfo.availablePoints.toLocaleString()}
              </p>

              <div className="mt-2">
                <Badge
                  variant={
                    withdrawalsInfo.canWithdraw ? "default" : "destructive"
                  }
                >
                  {withdrawalsInfo.canWithdraw
                    ? "Disponible para retiros"
                    : "No disponible"}
                </Badge>
              </div>
            </div>

            {/* Información de Retiros */}
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Monto de Retiro</span>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Mínimo:</span>{" "}
                    <span className="font-medium">
                      {withdrawalsInfo.config.minimumAmount.toLocaleString()}
                    </span>
                  </p>
                  {withdrawalsInfo.config.maximumAmount && (
                    <p>
                      <span className="text-muted-foreground">Máximo:</span>{" "}
                      <span className="font-medium">
                        {/* {withdrawalsInfo.config.maximumAmount.toLocaleString()} */}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="font-medium">Horario</span>
                </div>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Hora inicio:</span>{" "}
                    <span className="font-medium">
                      {withdrawalsInfo.config.startHour}:00
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Hora fin:</span>{" "}
                    <span className="font-medium">
                      {withdrawalsInfo.config.endHour}:00
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Días Habilitados</span>
                </div>
                <p className="text-sm mt-2">{enabledDays}</p>
              </div>

              {withdrawalsInfo.missingInfo &&
                withdrawalsInfo.missingInfo.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-amber-700 dark:text-amber-400">
                        Información faltante
                      </span>
                    </div>
                    <ul className="text-sm space-y-1 mt-2 text-amber-700 dark:text-amber-400">
                      {withdrawalsInfo.missingInfo.map((info, index) => (
                        <li key={index}>{info.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>

          {!withdrawalsInfo.canWithdraw && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400">
                    No puedes realizar retiros en este momento
                  </h4>
                  <p className="text-sm text-red-600/90 dark:text-red-400/90 mt-1">
                    {withdrawalsInfo.reason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WithdrawalsSummaryCardSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl p-6 border">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-10 w-24 mt-2" />
            <Skeleton className="h-6 w-32 mt-2" />
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-36" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </div>
            <div className="rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
