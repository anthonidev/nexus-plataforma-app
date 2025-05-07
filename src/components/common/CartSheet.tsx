"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/utils/format-currency.utils";
import { MinusCircle, PlusCircle, ShoppingBag, ShoppingCart, Trash2, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CartItem, useCartStore } from "@/context/CartStore";
import { useRouter } from "next/navigation";

interface CartSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
    const { items, itemCount, totalAmount, removeItem, updateQuantity, clearCart } = useCartStore();
    const router = useRouter();

    const handleCheckout = () => {
        onOpenChange(false);
        router.push('/tienda/carrito');
    };

    const handleClearCart = () => {
        clearCart();
        toast.info("Carrito vaciado");
    };

    const handleIncrement = (item: CartItem) => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = (item: CartItem) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        } else {
            removeItem(item.id);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col w-full sm:max-w-md border-l border-primary/20 shadow-lg bg-card">
                <SheetHeader className="pb-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                        Carrito de Compras
                    </SheetTitle>
                    <SheetDescription className="text-sm">
                        {itemCount === 0
                            ? "Tu carrito está vacío"
                            : `${itemCount} ${itemCount === 1 ? "producto" : "productos"} en tu carrito`}
                    </SheetDescription>
                </SheetHeader>

                {itemCount === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 py-12">
                        <div className="bg-primary/10 p-6 rounded-full mb-4">
                            <ShoppingBag className="h-12 w-12 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
                        <p className="text-muted-foreground text-center mb-6 max-w-xs">
                            Agrega productos para poder realizar tu compra
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-primary/20 hover:border-primary/50"
                        >
                            Explorar productos
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 px-1 my-4">
                            <AnimatePresence initial={false}>
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex py-4 border-b border-border relative group hover:bg-primary/5 rounded-lg px-3 mb-2 transition-all duration-200">
                                            {/* Imagen del producto */}
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-primary/10">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover h-full w-full"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-muted flex items-center justify-center">
                                                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Información del producto */}
                                            <div className="ml-3 flex-1 mr-20"> {/* Añadido margen derecho para dejar espacio a controles */}
                                                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-sm font-bold text-primary">
                                                        {formatCurrency(item.price)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center mt-0.5">
                                                    <span className="text-xs text-muted-foreground">
                                                        Subtotal: {formatCurrency(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Botón eliminar */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="absolute right-2 top-2 h-6 w-6 bg-destructive/90 hover:bg-destructive rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>

                                            {/* Controles de cantidad */}
                                            <div className="absolute bottom-4 right-3 flex items-center border rounded-md shadow-sm border-primary/20">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-r-none hover:bg-primary/10"
                                                    onClick={() => handleDecrement(item)}
                                                >
                                                    <MinusCircle className="h-3.5 w-3.5" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-l-none hover:bg-primary/10"
                                                    onClick={() => handleIncrement(item)}
                                                >
                                                    <PlusCircle className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </ScrollArea>

                        <div className="border-t border-border bg-muted/20 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-xl text-primary">{formatCurrency(totalAmount)}</span>
                            </div>
                        </div>

                        <SheetFooter className="flex-col gap-2 sm:flex-col border-t border-border">
                            <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary/90">
                                Ir a Pagar <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleClearCart}
                                className="w-full border-primary/20 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Vaciar carrito
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}