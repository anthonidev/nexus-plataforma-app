import { Button } from "@/components/ui/button";
import {
  Edit,
  Building,
  MapPin,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface BillingInfoCardProps {
  billingInfo: {
    address?: string;
    ubigeo?: {
      id: number;
      name: string;
      code: string;
      parentId?: number;
    } | null;
  } | null;
  onEdit: () => void;
}

export default function BillingInfoCard({
  billingInfo,
  onEdit,
}: BillingInfoCardProps) {
  const address = billingInfo?.address || "No especificada";
  const ubigeoName = billingInfo?.ubigeo?.name;
  const hasInfo = billingInfo && billingInfo.address;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"
    >
      <div className="flex flex-row justify-between items-start w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Building size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Facturación</h3>
            <p className="text-sm text-muted-foreground">
              {hasInfo ? "Información completa" : "Información pendiente"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex gap-2 items-center"
        >
          <Edit className="h-4 w-4" />
          <span>Editar</span>
        </Button>
      </div>

      {hasInfo ? (
        <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">
              Datos de facturación configurados
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Dirección de facturación:
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{address}</p>
                  {ubigeoName && (
                    <p className="text-sm text-muted-foreground">
                      {ubigeoName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex gap-2 items-start">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">
                  Información de facturación pendiente
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No has registrado información de facturación. Completa estos
                  datos para recibir facturas.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="mt-3 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400"
            >
              Agregar datos de facturación
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
