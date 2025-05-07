"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
        <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md">
            <div className="relative aspect-square overflow-hidden">
                {product.mainImage ? (
                    <Image
                        src={product.mainImage}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}

                <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/90 text-white font-medium">
                        {product.category.name}
                    </Badge>
                </div>
            </div>

            <CardContent className="flex-grow px-4">
                <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                    {product.name}
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-primary">
                        {formatCurrency(effectivePrice)}
                    </span>
                    {/* Mostrar precio público tachado si el usuario tiene membresía */}
                    {hasMembership && (
                        <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(product.publicPrice)}
                        </span>
                    )}
                </div>

            </CardContent>

            <CardFooter className=" flex flex-col gap-2">
                <Link href={`/tienda/productos/${product.id}`} className="w-full">
                    <Button variant="outline" className="w-full" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                    </Button>
                </Link>

                {isInCart(product.id) ? (
                    <div className="flex items-center justify-between border rounded-md">
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
                        className="w-full"
                        size="sm"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Añadir al carrito
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}