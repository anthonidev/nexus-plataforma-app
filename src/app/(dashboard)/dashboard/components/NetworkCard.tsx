import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Network,
  Users,
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NetworkCardProps {
  network: {
    directReferrals: {
      totalCount: number;
      activeCount: number;
      leftCount: number;
      rightCount: number;
    };
    networkSize: number;
    leftLegCount: number;
    rightLegCount: number;
  };
}

export default function NetworkCard({ network }: NetworkCardProps) {
  // Calcular porcentaje de referidos activos
  const activePercentage =
    network.directReferrals.totalCount > 0
      ? Math.round(
          (network.directReferrals.activeCount /
            network.directReferrals.totalCount) *
            100
        )
      : 0;

  // Calcular balance entre piernas
  const leftPercentage =
    network.networkSize > 0
      ? Math.round((network.leftLegCount / network.networkSize) * 100)
      : 50;

  const rightPercentage =
    network.networkSize > 0
      ? Math.round((network.rightLegCount / network.networkSize) * 100)
      : 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Mi Red
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Métricas generales */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/10">
              <h3 className="text-lg font-medium mb-4">Resumen General</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/70 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Total red</span>
                  </div>
                  <p className="text-2xl font-bold">{network.networkSize}</p>
                  <p className="text-xs text-muted-foreground">
                    miembros totales
                  </p>
                </div>

                <div className="bg-background/70 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Directos</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {network.directReferrals.totalCount}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {network.directReferrals.activeCount} activos (
                    {activePercentage}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Distribución por piernas */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Distribución</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">
                        Pierna izquierda
                      </span>
                    </div>
                    <span>
                      {network.leftLegCount} ({leftPercentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${leftPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">
                        Pierna derecha
                      </span>
                    </div>
                    <span>
                      {network.rightLegCount} ({rightPercentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${rightPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas adicionales de referidos directos */}
          <div className="bg-muted/20 rounded-lg p-5 border">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Referidos Directos
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-xl font-bold">
                  {network.directReferrals.totalCount}
                </p>
              </div>

              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Activos</p>
                <p className="text-xl font-bold text-green-600">
                  {network.directReferrals.activeCount}
                </p>
              </div>

              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Izquierda</p>
                <p className="text-xl font-bold text-blue-600">
                  {network.directReferrals.leftCount}
                </p>
              </div>

              <div className="p-3 bg-background rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Derecha</p>
                <p className="text-xl font-bold text-green-600">
                  {network.directReferrals.rightCount}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 pt-2 pb-3">
          <Link href="/mi-equipo" className="w-full">
            <Button size="sm" className="w-full">
              Ver árbol de red
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
