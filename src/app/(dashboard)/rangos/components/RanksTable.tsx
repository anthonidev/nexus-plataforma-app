"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Rank, UserRank } from "@/types/ranks/rank.types";
import {
  AlertCircle,
  Award,
  CheckCircle,
  RefreshCw,
  Trophy,
} from "lucide-react";

interface RanksTableProps {
  ranks: Rank[];
  userRank: UserRank | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function RanksTable({
  ranks,
  userRank,
  isLoading,
  error,
  onRefresh,
}: RanksTableProps) {
  if (isLoading) {
    return <RanksTableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-red-800 dark:text-red-300">
                Error al cargar rangos
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

  // Ordena los rangos por puntos requeridos (de menor a mayor)
  const sortedRanks = [...ranks].sort(
    (a, b) => a.requiredPoints - b.requiredPoints
  );

  // Obtiene el ID del rango actual del usuario (si existe)
  const currentRankId = userRank?.currentRank?.id;
  const highestRankId = userRank?.highestRank?.id;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Tabla de Rangos Disponibles
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
                <TableHead>Rango</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Puntos Requeridos</TableHead>
                <TableHead>Directos Requeridos</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRanks.length > 0 ? (
                sortedRanks.map((rank) => {
                  const isCurrentRank = rank.id === currentRankId;
                  const isHighestRank = rank.id === highestRankId;
                  const isAchieved =
                    userRank &&
                    rank.requiredPoints <= userRank.currentRank.requiredPoints;

                  return (
                    <TableRow
                      key={rank.id}
                      className={isCurrentRank ? "bg-primary/5" : ""}
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        {isCurrentRank && (
                          <Award className="h-4 w-4 text-primary" />
                        )}
                        {rank.name}
                      </TableCell>
                      <TableCell className="font-mono">{rank.code}</TableCell>
                      <TableCell>
                        {rank.requiredPoints.toLocaleString()}
                      </TableCell>
                      <TableCell>{rank.requiredDirects}</TableCell>
                      <TableCell>
                        {isCurrentRank ? (
                          <Badge className="bg-primary text-primary-foreground">
                            Actual
                          </Badge>
                        ) : isHighestRank && !isCurrentRank ? (
                          <Badge className="bg-amber-500 text-white">
                            Mayor alcanzado
                          </Badge>
                        ) : isAchieved ? (
                          <Badge className="bg-green-500 text-white flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Conseguido</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pendiente</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay rangos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function RanksTableSkeleton() {
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
                  <Skeleton className="h-4 w-20" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-16" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
