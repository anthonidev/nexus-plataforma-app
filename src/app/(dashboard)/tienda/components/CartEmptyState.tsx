"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CartEmptyState() {
    return (
        <motion.div
            className="flex flex-col items-center justify-center py-12 px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-muted/20 p-8 rounded-xl mb-6 text-center max-w-md">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Tu carrito está vacío</h2>
                <p className="text-muted-foreground mb-6">
                    No hay productos en tu carrito. Explora nuestra tienda para encontrar productos interesantes.
                </p>
                <Link href="/tienda/productos">
                    <Button>Ver productos</Button>
                </Link>
            </div>
        </motion.div>
    );
}