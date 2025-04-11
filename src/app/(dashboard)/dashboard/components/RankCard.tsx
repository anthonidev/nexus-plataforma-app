import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface RankCardProps {
  rank: {
    current: {
      id: number;
      name: string;
      code: string;
      requiredPoints: number;
      requiredDirects: number;
    };
    highest: {
      id: number;
      name: string;
      code: string;
      requiredPoints: number;
      requiredDirects: number;
    };
  };
}

export default function RankCard({ rank }: RankCardProps) {
  const currentRank = rank.current;
  const highestRank = rank.highest;
  const isAtHighestRank = currentRank.id === highestRank.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="pb-2 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Mi Rango
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xl font-bold">{currentRank.name}</h3>
            <Badge variant="outline" className="font-mono text-xs">
              {currentRank.code}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Puntos requeridos:</span>
                <span className="font-semibold ml-auto">
                  {currentRank.requiredPoints.toLocaleString()}
                </span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-4 w-4 text-primary" />
                <span>Directos requeridos:</span>
                <span className="font-semibold ml-auto">
                  {currentRank.requiredDirects}
                </span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            {!isAtHighestRank && (
              <div className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                <p className="font-medium text-blue-700 dark:text-blue-300">
                  Mayor rango alcanzado: {highestRank.name}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 pt-2 pb-3">
          <Link href="/rangos" className="w-full">
            <Button variant="outline" size="sm" className="w-full">
              Ver todos los rangos
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
