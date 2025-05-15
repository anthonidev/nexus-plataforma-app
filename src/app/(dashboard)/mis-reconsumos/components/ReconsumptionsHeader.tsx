"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { RefreshCw, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReconsumptionsHeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function ReconsumptionsHeader({
  onRefresh,
  isLoading = false,
}: ReconsumptionsHeaderProps) {
  return (
    <PageHeader
      title="Mis Reconsumos"
      subtitle="Administra tus reconsumos mensuales y configura la renovación automática"
      variant="gradient"
      icon={CalendarClock}
      actions={
        onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="mt-4 md:mt-0"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Actualizar</span>
          </Button>
        )
      }
    />
  );
}
