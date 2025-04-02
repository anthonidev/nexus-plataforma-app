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
            <h3 className="font-medium text-lg">Información de contacto</h3>
            <p className="text-sm text-muted-foreground">
              Datos de comunicación y ubicación
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Columna izquierda */}
        <div className="space-y-4">
          <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Teléfono
            </h4>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Número de contacto
                </p>
                <p className="font-medium">{phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          {hasAddress ? (
            <div className="bg-secondary/30 dark:bg-secondary/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Dirección
                </h4>
                {postalCode && (
                  <Badge variant="outline" className="text-xs">
                    CP: {postalCode}
                  </Badge>
                )}
              </div>

              <div className="space-y-1 mt-2">
                <p className="font-medium">{address}</p>
                {ubigeoName && (
                  <p className="text-sm text-muted-foreground">{ubigeoName}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <MapPin className="h-4 w-4" />
                Dirección no especificada
              </h4>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                No has registrado una dirección todavía.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                onClick={onEdit}
              >
                Agregar dirección
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
