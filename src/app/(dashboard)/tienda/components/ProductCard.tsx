"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/context/CartStore";
import { Item } from "@/types/ecommerce/client/ecommerce.types";
import { formatCurrency } from "@/utils/format-currency.utils";
import { Eye, MinusCircle, Package, PlusCircle, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface ProductCardProps {
    product: Item;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem, isInCart, updateQuantity, getItemQuantity } = useCartStore();
    const { data: session } = useSession();
    const quantity = getItemQuantity(product.id);

    const hasMembership = session?.user?.membership?.hasMembership === true;
    const effectivePrice = hasMembership ? product.memberPrice : product.publicPrice;

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.name,
            price: effectivePrice,
            image: product.mainImage,
            quantity: 1
        });
        toast.success(`${product.name} añadido al carrito`);
    };

    const handleIncrement = () => {
        updateQuantity(product.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1);
        } else {
            updateQuantity(product.id, 0);
        }
    };

    return (
        <div className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md rounded-md">
            {/* Imagen sin bordes y hasta el tope */}
            <div className="relative aspect-square overflow-hidden">
                {product.mainImage ? (
                    <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}

                <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-white font-medium shadow-sm">
                        {product.category.name}
                    </Badge>
                </div>
            </div>

            {/* Contenido del producto */}
            <div className="flex-grow p-4 bg-card rounded-b-md border border-t-0 border-border/50">
                <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                    {product.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-primary">
                        {formatCurrency(effectivePrice)}
                    </span>
                    {hasMembership && (
                        <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.publicPrice)}
                        </span>
                    )}
                </div>

                {/* Botones */}
                <div className="grid grid-cols-2 gap-2">
                    <Link href={`/tienda/productos/detalle/${product.id}`} className="w-full">
                        <Button variant="outline" className="w-full h-9">
                            <Eye className="h-4 w-4 mr-2" />
                            Detalles
                        </Button>
                    </Link>

                    {isInCart(product.id) ? (
                        <div className="flex items-center justify-between w-full border rounded-md">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-r-none"
                                onClick={handleDecrement}
                            >
                                <MinusCircle className="h-4 w-4" />
                            </Button>
                            <span className="flex-grow text-center font-medium">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-l-none"
                                onClick={handleIncrement}
                            >
                                <PlusCircle className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            className="w-full h-9"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.stock === 0 ? "Agotado" : "Agregar"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}