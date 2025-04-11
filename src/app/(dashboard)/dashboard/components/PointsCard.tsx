import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, ArrowDownToDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface PointsCardProps {
  points: {
    availablePoints: number;
    totalEarnedPoints: number;
    totalWithdrawnPoints: number;
  };
}

export default function PointsCard({ points }: PointsCardProps) {
  // Calcular porcentaje de puntos usados/retirados
  const totalPoints = points.totalEarnedPoints;
  const usedPercentage =
    totalPoints > 0
      ? Math.round((points.totalWithdrawnPoints / totalPoints) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="pb-2 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Mis Puntos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-primary mb-2">
            {points.availablePoints.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Puntos disponibles
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Ganados:</span>
              </div>
              <span className="font-medium">
                {points.totalEarnedPoints.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <ArrowDownToDot className="h-4 w-4 text-amber-500" />
                <span>Retirados:</span>
              </div>
              <span className="font-medium">
                {points.totalWithdrawnPoints.toLocaleString()}
              </span>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs">
                <span>Uso</span>
                <span>{usedPercentage}%</span>
              </div>
              <Progress value={usedPercentage} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 pt-2 pb-3">
          <div className="w-full flex justify-between gap-2">
            <Link href="/historial-puntos" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                Ver historial
              </Button>
            </Link>
            <Link href="/mis-retiros" className="flex-1">
              <Button size="sm" className="w-full">
                Solicitar retiro
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
