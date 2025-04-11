import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  error: string | null;
  onRetry: () => void;
}

export default function DashboardError({
  error,
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className="container py-8">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-4 mb-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
          Error al cargar el dashboard
        </h2>
        <p className="text-red-600/80 dark:text-red-400/80 max-w-md mb-6">
          {error ||
            "No se pudieron cargar los datos del dashboard. Por favor, inténtelo de nuevo."}
        </p>
        <Button onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Reintentar</span>
        </Button>
      </div>
    </div>
  );
}
