"use client";

import { useCartStore } from "@/context/CartStore";
import { formatCurrency } from "@/utils/format-currency.utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Package, MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface CartProductListProps {
    onClearCart: () => void;
}

export function CartProductList({ onClearCart }: CartProductListProps) {
    const { items, totalAmount, updateQuantity, removeItem } = useCartStore();

    // Incrementar cantidad
    const handleIncrement = (itemId: number, currentQuantity: number) => {
        updateQuantity(itemId, currentQuantity + 1);
    };

    // Decrementar cantidad
    const handleDecrement = (itemId: number, currentQuantity: number) => {
        if (currentQuantity > 1) {
            updateQuantity(itemId, currentQuantity - 1);
        } else {
            removeItem(itemId);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Productos en el carrito
                </CardTitle>
            </CardHeader>

            <ScrollArea className="flex-1 h-[calc(100vh-400px)]">
                <CardContent>
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="flex items-center gap-4 py-4 border-b last:border-0"
                        >
                            {/* Imagen del producto */}
                            <div className="relative h-20 w-20 overflow-hidden rounded-md flex-shrink-0 border">
                                {item.image ? (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="bg-muted h-full w-full flex items-center justify-center">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Información del producto */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                <p className="text-primary font-semibold mt-1">
                                    {formatCurrency(item.price)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Subtotal: {formatCurrency(item.price * item.quantity)}
                                </p>
                            </div>

                            {/* Controles de cantidad */}
                            <div className="flex items-center border rounded-md">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-r-none"
                                    onClick={() => handleDecrement(item.id, item.quantity)}
                                >
                                    <MinusCircle className="h-4 w-4" />
                                </Button>
                                <div className="w-10 text-center font-medium">
                                    {item.quantity}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-l-none"
                                    onClick={() => handleIncrement(item.id, item.quantity)}
                                >
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Botón eliminar */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => removeItem(item.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    ))}
                </CardContent>
            </ScrollArea>

            <CardFooter className="flex justify-between pt-4 border-t mt-auto">
                <Button
                    variant="outline"
                    onClick={onClearCart}
                    className="group"
                >
                    <Trash2 className="h-4 w-4 mr-2 group-hover:text-destructive" />
                    <span className="group-hover:text-destructive">Vaciar carrito</span>
                </Button>
                <div className="text-right">
                    <p className="text-muted-foreground text-sm">Total ({items.length} productos)</p>
                    <p className="text-2xl font-bold text-primary">
                        {formatCurrency(totalAmount)}
                    </p>
                </div>
            </CardFooter>
        </Card>
    );
}