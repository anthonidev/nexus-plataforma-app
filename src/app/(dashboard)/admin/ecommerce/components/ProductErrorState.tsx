import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Package, RefreshCw } from "lucide-react";

interface ProductErrorStateProps {
    error: string;
    onBack: () => void;
}

export function ProductErrorState({ error, onBack }: ProductErrorStateProps) {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="container max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4 -ml-3"
                    onClick={onBack}
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                </Button>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-destructive/5 max-w-xl mx-auto">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                <h2 className="text-xl font-semibold text-destructive mb-2">
                    Error al cargar el producto
                </h2>

                <p className="text-muted-foreground mb-6">{error}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver a productos
                    </Button>

                    <Button onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Intentar nuevamente
                    </Button>
                </div>
            </div>
        </div>
    );
}