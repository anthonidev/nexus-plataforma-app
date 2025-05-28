import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "@/utils/date.utils";
import { motion } from "framer-motion";

interface MembershipCardProps {
  membership: {
    id: number;
    plan: {
      id: number;
      name: string;
      price: number;
      binaryPoints: number;
    };
    startDate: Date;
    endDate: Date;
    nextReconsumptionDate: Date;
    autoRenewal: boolean;
  };
}

export default function MembershipCard({ membership }: MembershipCardProps) {
  console.log("MembershipCard", membership);
  // Calcular días restantes
  // {format(new Date(membership.membership.nextReconsumptionDate).toISOString().split("T")[0], "dd/MM/yyyy")}
  const endDate = new Date(membership.endDate)
  const today = new Date();
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  console.log("Días restantes:", daysRemaining);

  // Estado de la membresía basado en días restantes
  const getStatusColor = () => {
    if (daysRemaining <= 0)
      return "text-red-500 bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800";
    if (daysRemaining <= 7)
      return "text-amber-500 bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800";
    return "text-green-500 bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="pb-2 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Mi Membresía
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{membership.plan.name}</h3>
              <Badge variant="outline" className="font-medium">
                {formatCurrency(membership.plan.price)}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Vence:</span>
              <span className="font-medium">
                {format(membership.endDate, "dd/MM/yyyy")}
              </span>
            </div>

            <div
              className={`text-sm p-2 rounded border flex items-center gap-2 ${getStatusColor()}`}
            >
              {daysRemaining < 0 ? (
                <span>Membresía vencida</span>
              ) : (
                <span>
                  {daysRemaining === 0 ? 1 : daysRemaining} {daysRemaining === 1 ? "día" : "días"}{" "}
                  restantes
                </span>
              )}
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground">Próximo reconsumo:</span>
              <div className="font-medium">
                {format(membership.nextReconsumptionDate, "dd/MM/yyyy")}
              </div>
              <div className="mt-1">
                <Badge
                  variant={membership.autoRenewal ? "default" : "outline"}
                  className="text-xs"
                >
                  {membership.autoRenewal
                    ? "Renovación automática activada"
                    : "Renovación manual"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
