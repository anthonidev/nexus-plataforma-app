import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "@/utils/date.utils";
import { motion } from "framer-motion";

interface WeeklyVolumeCardProps {
  weeklyVolume: {
    leftVolume: number;
    rightVolume: number;
    total: number;
    weekStartDate: Date;
    weekEndDate: Date;
  };
}

export default function WeeklyVolumeCard({
  weeklyVolume,
}: WeeklyVolumeCardProps) {
  // Calcular el volumen mayor (izquierdo o derecho)
  const higherVolume = Math.max(
    weeklyVolume.leftVolume,
    weeklyVolume.rightVolume
  );
  const totalWidth = 100;

  // Calcular el ancho de las barras basado en los volúmenes relativos
  const getBarWidth = (volume: number) => {
    if (higherVolume === 0) return 0;
    return Math.max((volume / higherVolume) * totalWidth, 5); // Mínimo 5% para visibilidad
  };

  const leftBarWidth = getBarWidth(weeklyVolume.leftVolume);
  const rightBarWidth = getBarWidth(weeklyVolume.rightVolume);

  // Determinar el lado con mayor volumen
  const highestSide =
    weeklyVolume.leftVolume > weeklyVolume.rightVolume
      ? "izquierdo"
      : weeklyVolume.rightVolume > weeklyVolume.leftVolume
      ? "derecho"
      : "iguales";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Volumen Semanal</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {format(weeklyVolume.weekStartDate, "dd/MM")} -{" "}
              {format(weeklyVolume.weekEndDate, "dd/MM/yyyy")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Volumen izquierdo */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-medium">Volumen Izquierdo</h3>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-lg font-bold">
                  {weeklyVolume.leftVolume.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">puntos</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${leftBarWidth}%` }}
                />
              </div>
            </div>

            {/* Volumen derecho */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 justify-end">
                <h3 className="text-sm font-medium">Volumen Derecho</h3>
                <ArrowRight className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-lg font-bold">
                  {weeklyVolume.rightVolume.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">puntos</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${rightBarWidth}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Volumen total de la semana
              </p>
              <p className="text-2xl font-bold">
                {weeklyVolume.total.toLocaleString()}
              </p>
            </div>

            {highestSide !== "iguales" && (
              <Badge
                className={
                  highestSide === "izquierdo"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }
              >
                Mayor volumen: lado {highestSide}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
