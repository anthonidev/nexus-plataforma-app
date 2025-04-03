import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PaymentDetailErrorProps {
  error: string | null;
}

export function PaymentDetailError({ error }: PaymentDetailErrorProps) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/mis-pagos" passHref>
          <Button variant="ghost" size="sm" className="-ml-3">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a pagos
          </Button>
        </Link>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto text-center">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
          Error al cargar los detalles del pago
        </h2>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error ||
            "No se pudo encontrar el pago solicitado o no tienes permisos para verlo."}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar nuevamente
          </Button>
          <Link href="/mis-pagos" passHref>
            <Button>Volver a pagos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
