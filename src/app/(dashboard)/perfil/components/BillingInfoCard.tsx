import { Button } from "@/components/ui/button";
import { Edit, Building, MapPin } from "lucide-react";
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
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      {hasInfo ? (
        <div className="mt-2 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium">{address}</p>
              {ubigeoName && (
                <p className="text-xs text-muted-foreground">{ubigeoName}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 p-2 rounded-md">
            No has registrado información de facturación. Completa estos datos
            para recibir facturas.
          </div>
        </div>
      )}
    </motion.div>
  );
}
