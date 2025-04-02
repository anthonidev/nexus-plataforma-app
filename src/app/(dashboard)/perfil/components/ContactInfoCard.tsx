import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface ContactInfoCardProps {
  contactInfo: {
    phone?: string;
    address?: string;
    postalCode?: string;
    ubigeo?: {
      id: number;
      name: string;
      code: string;
      parentId?: number;
    } | null;
  } | null;
  onEdit: () => void;
}

export default function ContactInfoCard({
  contactInfo,
  onEdit,
}: ContactInfoCardProps) {
  const phoneNumber = contactInfo?.phone || "No especificado";
  const address = contactInfo?.address || "No especificada";
  const postalCode = contactInfo?.postalCode;
  const ubigeoName = contactInfo?.ubigeo?.name;

  const hasAddress = address !== "No especificada" || ubigeoName;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative"
    >
      <div className="flex flex-row justify-between items-start w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Phone size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Contacto</h3>
            <p className="text-sm text-muted-foreground">{phoneNumber}</p>
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

      {hasAddress ? (
        <div className="mt-2 space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-medium">{address}</p>
              {ubigeoName && (
                <p className="text-xs text-muted-foreground">{ubigeoName}</p>
              )}
              {postalCode && (
                <Badge variant="outline" className="text-xs font-normal">
                  CP: {postalCode}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground italic">
            Dirección no especificada
          </p>
        </div>
      )}
    </motion.div>
  );
}
