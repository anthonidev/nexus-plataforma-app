"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/ecommerce/client/ecommerce.types";
import { Separator } from "@/components/ui/separator";

interface ProductAdditionalInfoProps {
    product: Product;
}

export function ProductAdditionalInfo({ product }: ProductAdditionalInfoProps) {
    // No mostrar nada si no hay composición ni beneficios
    if (!product.composition && (!product.benefits || product.benefits.length === 0)) {
        return null;
    }

    // Función para procesar los beneficios
    const processBenefits = (benefit: string) => {
        if (benefit.includes(":")) {
            const [title, description] = benefit.split(":");
            return (
                <div className="mb-4">
                    <h4 className="font-semibold text-primary">{title.trim()}</h4>
                    <p className="text-muted-foreground">{description.trim()}</p>
                </div>
            );
        }
        return <p className="text-muted-foreground mb-4">{benefit}</p>;
    };

    // Procesar la composición (separar por comas)
    const processComposition = (composition: string) => {
        return composition.split(",").map((item, index) => (
            <span
                key={index}
                className="inline-flex items-center py-1 px-3 mr-2 mb-2 rounded-full bg-muted/50 text-sm"
            >
                {item.trim()}
            </span>
        ));
    };

    return (
        <Card className="mt-8">
            <CardContent className="p-6 md:p-8 space-y-8">
                {/* Composición a todo el ancho (si existe) */}
                {product.composition && (
                    <div className="space-y-4 w-full">
                        <h3 className="text-xl font-medium flex items-center gap-2">
                            <span className="inline-block w-6 h-6 rounded-full bg-primary/10 flex-shrink-0"></span>
                            Composición
                        </h3>
                        <div className="flex flex-wrap">Hu
                            {processComposition(product.composition)}
                        </div>
                    </div>
                )}

                {/* Separador entre composición y beneficios (si ambos existen) */}
                {product.composition && product.benefits && product.benefits.length > 0 && (
                    <Separator />
                )}

                {/* Benefits en columnas (si existe) */}
                {product.benefits && product.benefits.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium flex items-center gap-2">
                            <span className="inline-block w-6 h-6 rounded-full bg-primary/10 flex-shrink-0"></span>
                            Beneficios
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {product.benefits.map((benefit, index) => (
                                <div key={index} className="border-b border-muted/50 pb-2">
                                    {processBenefits(benefit)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}