import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, ArrowDown, UsersRound } from "lucide-react";
import { format } from "@/utils/date.utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface MonthlyVolumeCardProps {
  monthlyVolume: {
    leftVolume: number;
    rightVolume: number;
    totalVolume: number;
    leftDirects: number;
    rightDirects: number;
    totalDirects: number;
    monthStartDate: Date;
    monthEndDate: Date;
  };
}

export default function MonthlyVolumeCard({
  monthlyVolume,
}: MonthlyVolumeCardProps) {
  // Calcular diferencia entre volúmenes
  const volumeDifference = Math.abs(
    monthlyVolume.leftVolume - monthlyVolume.rightVolume
  );
  const maxVolume = Math.max(
    monthlyVolume.leftVolume,
    monthlyVolume.rightVolume
  );
  const minVolume = Math.min(
    monthlyVolume.leftVolume,
    monthlyVolume.rightVolume
  );

  const balancePercentage =
    maxVolume > 0 ? Math.round((minVolume / maxVolume) * 100) : 100;

  // Determinar el nivel de balance para el color
  const getBalanceColor = () => {
    if (balancePercentage >= 80)
      return "text-green-600 bg-green-100 dark:bg-green-900/20";
    if (balancePercentage >= 50)
      return "text-amber-600 bg-amber-100 dark:bg-amber-900/20";
    return "text-red-600 bg-red-100 dark:bg-red-900/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              <span>Volumen Mensual</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {format(monthlyVolume.monthStartDate, "MMMM yyyy")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Volumen total</h3>
                <div className="text-2xl font-bold">
                  {monthlyVolume.totalVolume.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  puntos acumulados este mes
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                    Lado izquierdo
                  </div>
                  <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                    {monthlyVolume.leftVolume.toLocaleString()}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
                    Lado derecho
                  </div>
                  <div className="text-xl font-bold text-green-700 dark:text-green-300">
                    {monthlyVolume.rightVolume.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UsersRound className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Directos: {monthlyVolume.totalDirects}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-2 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Izquierda
                  </div>
                  <div className="font-medium">
                    {monthlyVolume.leftDirects} directos
                  </div>
                </div>

                <div className="p-2 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">
                    Derecha
                  </div>
                  <div className="font-medium">
                    {monthlyVolume.rightDirects} directos
                  </div>
                </div>
              </div>

              <div className={`p-2 rounded-lg text-sm ${getBalanceColor()}`}>
                <div className="font-medium">Balance: {balancePercentage}%</div>
                <div className="text-xs mt-1">
                  Diferencia: {volumeDifference.toLocaleString()} puntos
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 pt-2 pb-3">
          <Link href="/rangos/volumen-mensual" className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              Ver historial de volúmenes
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
