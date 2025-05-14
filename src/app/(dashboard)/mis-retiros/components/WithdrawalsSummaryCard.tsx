"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WithdrawalsInfo } from "@/types/withdrawals/withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  Clock3,
  Coins,
  DollarSign,
  Info,
  WalletIcon,
  Zap
} from "lucide-react";

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

  const weekDays = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="overflow-hidden">
        <CardHeader className=" ">
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-primary" />
            Resumen de Retiros
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x">
            <div className="md:col-span-5 p-5 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-primary" />
                      Puntos Disponibles
                    </h3>
                    <div className="mt-3 mb-2">
                      <div className="text-3xl font-bold text-primary">
                        {formatCurrency(withdrawalsInfo.availablePoints)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Badge
                      variant={withdrawalsInfo.canWithdraw ? "default" : "destructive"}
                      className="flex items-center gap-1 px-2.5 py-1.5"
                    >
                      {withdrawalsInfo.canWithdraw ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Disponible para retiros</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3.5 w-3.5" />
                          <span>No disponible</span>
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                {withdrawalsInfo.accountNumber && (
                  <div className="mt-5 bg-muted/30 rounded-lg p-3 border">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Cuenta para retiros</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-medium">{withdrawalsInfo.backName}</span>
                    </div>
                    <div className="mt-1 pl-6">
                      <span className="text-xs font-mono text-muted-foreground">
                        {withdrawalsInfo.accountNumber}
                      </span>
                      {withdrawalsInfo.cci && (
                        <div className="mt-1">
                          <span className="text-xs">CCI: </span>
                          <span className="text-xs font-mono">{withdrawalsInfo.cci}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {!withdrawalsInfo.canWithdraw && withdrawalsInfo.reason && (
                  <div className="mt-3 flex gap-2 items-start text-xs text-amber-700 dark:text-amber-400">
                    <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-500" />
                    <p>{withdrawalsInfo.reason}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-7 p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Monto de retiro */}
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-medium">Monto de Retiro</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Mínimo:</span>
                      <Badge variant="outline" className="font-medium bg-primary/5">
                        {formatCurrency(withdrawalsInfo.config.minimumAmount)}
                      </Badge>
                    </div>

                    {withdrawalsInfo.config.maximumAmount && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Máximo:</span>
                        <Badge variant="outline" className="font-medium bg-primary/5">
                          {formatCurrency(withdrawalsInfo.config.maximumAmount)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock3 className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-medium">Horario Permitido</h3>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Inicio:</span>
                      <span className="font-medium">{withdrawalsInfo.config.startHour}:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Fin:</span>
                      <span className="font-medium">{withdrawalsInfo.config.endHour}:00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="h-4 w-4 text-green-500" />
                    <h3 className="text-sm font-medium">Días Habilitados</h3>
                  </div>

                  <div className="text-sm space-y-1">
                    {withdrawalsInfo.config.enabledWeekDays.map((dayNumber) => (
                      <Badge
                        key={dayNumber}
                        variant="outline"
                        className="mr-1 mb-1 bg-green-50 text-green-700 border-green-200 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800/40"
                      >
                        {weekDays[dayNumber]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {withdrawalsInfo.missingInfo && withdrawalsInfo.missingInfo.length > 0 && (
                <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800/50">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <span className="font-medium text-amber-700 dark:text-amber-400 text-sm">
                        Información necesaria para retiros
                      </span>
                      <ul className="text-sm space-y-1 mt-2 text-amber-700 dark:text-amber-400">
                        {withdrawalsInfo.missingInfo.map((info, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-xs">•</span>
                            <span>{info.message}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                      >
                        <Zap className="mr-1 h-3.5 w-3.5" />
                        Completar información
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!withdrawalsInfo.canWithdraw && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800/50">
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
      <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 border-b">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-40 mt-3" />
              </div>
              <Skeleton className="h-7 w-32" />
            </div>

            <Skeleton className="h-24 w-full mt-4" />
          </div>

          <div className="md:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>

            <Skeleton className="h-24 w-full mt-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}