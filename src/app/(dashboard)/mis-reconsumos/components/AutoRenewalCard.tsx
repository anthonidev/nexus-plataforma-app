"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { RefreshCw, Zap } from "lucide-react";
import { useState } from "react";

interface AutoRenewalCardProps {
  autoRenewal: boolean;
  onToggleAutoRenewal: (value: boolean) => Promise<void>;
}

export default function AutoRenewalCard({
  autoRenewal,
  onToggleAutoRenewal,
}: AutoRenewalCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localAutoRenewal, setLocalAutoRenewal] = useState(autoRenewal);

  const handleToggle = async (value: boolean) => {
    try {
      setIsUpdating(true);
      setLocalAutoRenewal(value);
      await onToggleAutoRenewal(value);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border-primary/20">
        <CardHeader className="pb-3 bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Reconsumo Automático
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-4 border">
              <p className="text-sm">
                Activa esta opción para realizar el reconsumo automáticamente en
                las fechas programadas. Esto permitirá mantener tu plan activo
                sin necesidad de pagos manuales.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-renewal" className="text-base">
                  Reconsumo Automático
                </Label>
                <p className="text-sm text-muted-foreground">
                  {localAutoRenewal
                    ? "Tu plan se renovará automáticamente"
                    : "Tu plan requiere renovación manual"}
                </p>
              </div>
              <div className="relative">
                {isUpdating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                  </div>
                )}
                <Switch
                  id="auto-renewal"
                  checked={localAutoRenewal}
                  onCheckedChange={handleToggle}
                  disabled={isUpdating}
                />
              </div>
            </div>

            <div className="space-y-2 border-t pt-4 mt-2">
              <h4 className="text-sm font-medium">
                Beneficios del reconsumo automático:
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Sin interrupciones en tu servicio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>Proceso simplificado sin gestiones manuales</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                  <span>
                    Mantenimiento de beneficios y rangos de forma continua
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
