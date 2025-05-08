import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

interface OrderDetailErrorProps {
    error: string | null;
    onBack: () => void;
    onRetry: () => void;
}

export function OrderDetailError({ error, onBack, onRetry }: OrderDetailErrorProps) {
    return (
        <div className="container py-8">
            <div className="mb-6">
                <Button variant="ghost" size="sm" className="-ml-3" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver a pedidos
                </Button>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto text-center">
                <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">
                    Error al cargar los detalles del pedido
                </h2>
                <p className="text-red-600 dark:text-red-400 mb-4">
                    {error ||
                        "No se pudo encontrar el pedido solicitado o no tienes permisos para verlo."}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" onClick={onRetry}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Intentar nuevamente
                    </Button>
                    <Button onClick={onBack}>Volver a pedidos</Button>
                </div>
            </div>
        </div>
    );
}