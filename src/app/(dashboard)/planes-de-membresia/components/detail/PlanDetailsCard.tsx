import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MembershipPlan } from "@/types/plan/plan.types";
import {
  ArrowUpRight,
  Award,
  DollarSign,
  FileText,
  Package,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface PlanDetailsCardProps {
  plan: MembershipPlan;
  isUpgrade: boolean;
  planPrice: number;
  userMembership?: any;
}

export function PlanDetailsCard({
  plan,
  isUpgrade,
  planPrice,
  userMembership,
}: PlanDetailsCardProps) {
  const { data: session } = useSession();
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary" />
          {isUpgrade ? "Actualización a " : "Detalles del Plan "} {plan.name}
          {isUpgrade && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300 text-xs rounded-full">
              Actualización
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-primary" />
          <div>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: "PEN",
              }).format(planPrice)}
            </p>
            <p className="text-sm text-muted-foreground">
              {isUpgrade ? "Costo de actualización" : "Precio total del plan"}
            </p>

            {isUpgrade && (
              <div className="mt-2 text-sm flex items-center gap-1">
                <span className="line-through text-muted-foreground">
                  {new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(parseFloat(plan.price))}
                </span>
                <span className="text-green-600 font-medium">
                  (Ahorro de{" "}
                  {new Intl.NumberFormat("es-PE", {
                    style: "currency",
                    currency: "PEN",
                  }).format(parseFloat(plan.price) - planPrice)}
                  )
                </span>
              </div>
            )}
          </div>
        </div>

        {isUpgrade && userMembership?.plan && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
              Actualizando desde:
            </h3>
            <div className="flex items-center justify-between">
              <span>{userMembership.plan.name}</span>
              <ArrowUpRight className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        )}

        <div>
          <h3 className="flex items-center gap-2 mb-2 font-semibold">
            <Package className="h-5 w-5 text-primary" />
            Productos Incluidos
          </h3>
          <ul className="space-y-1 text-sm">
            {plan.products.map((product, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                {product}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center gap-2 mb-2 font-semibold">
            <Award className="h-5 w-5 text-primary" />
            Beneficios
          </h3>
          <ul className="space-y-1 text-sm">
            {plan.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="font-medium text-gray-800 dark:text-gray-300 mb-2">
            Detalles del Usuario
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm">Correo:</span>
            <span>{session?.user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Nombre:</span>
            <span>{session?.user?.firstName + " " + session?.user?.lastName}</span>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
