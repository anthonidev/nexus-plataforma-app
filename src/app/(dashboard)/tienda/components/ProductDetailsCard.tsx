import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format-currency.utils";
import { Product } from "@/types/ecommerce/client/ecommerce.types";
import { Card, CardContent } from "@/components/ui/card";
import { MinusCircle, PlusCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProductDetailsCardProps {
    product: Product;
    hasMembership: boolean;
    isProductInCart: boolean;
    quantity: number;
    handleAddToCart: () => void;
    handleIncrement: () => void;
    handleDecrement: () => void;
}

export function ProductDetailsCard({
    product,
    hasMembership,
    isProductInCart,
    quantity,
    handleAddToCart,
    handleIncrement,
    handleDecrement,
}: ProductDetailsCardProps) {
    const effectivePrice = hasMembership ? product.memberPrice : product.publicPrice;

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary">{product.category.name}</Badge>
                    {hasMembership && (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40">
                            Precio de socio
                        </Badge>
                    )}
                </div>

                {/* Nombre y SKU */}
                <div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
                </div>

                {/* Precio */}
                <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                            {formatCurrency(effectivePrice)}
                        </span>
                        {hasMembership && product.publicPrice > product.memberPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                                {formatCurrency(product.publicPrice)}
                            </span>
                        )}
                    </div>
                    {hasMembership && product.publicPrice > product.memberPrice && (
                        <span className="text-sm text-green-600 dark:text-green-400 mt-1 block">
                            {Math.round(((product.publicPrice - product.memberPrice) / product.publicPrice) * 100)}% de descuento con membresía
                        </span>
                    )}
                </div>

                <Separator />

                {/* Acciones de compra */}
                <div className="space-y-4">
                    {isProductInCart ? (
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-3 flex items-center border rounded-md">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 rounded-r-none flex-1"
                                    onClick={handleDecrement}
                                >
                                    <MinusCircle className="h-5 w-5" />
                                </Button>
                                <div className="flex-1 text-center font-bold text-xl">
                                    {quantity}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-12 rounded-l-none flex-1"
                                    onClick={handleIncrement}
                                >
                                    <PlusCircle className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            className="w-full h-12 text-lg"
                            size="lg"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Agregar al carrito
                        </Button>
                    )}
                </div>

                <Separator />

                {/* Descripción */}
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Descripción</h3>
                    <p className="text-muted-foreground">{product.description}</p>
                </div>
            </CardContent>
        </Card>
    );
}