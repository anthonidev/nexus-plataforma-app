"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CheckCircle, ListChecks, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNewProduct: () => void;
    productName: string;
}

export function SuccessModal({
    isOpen,
    onClose,
    onNewProduct,
    productName,
}: SuccessModalProps) {
    const router = useRouter();

    const goToProductList = () => {
        router.push("/admin/ecommerce/productos");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-center text-center mb-2">
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="mb-4"
                            >
                                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                                </div>
                            </motion.div>
                            <motion.span
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl"
                            >
                                ¡Producto Registrado Exitosamente!
                            </motion.span>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        El producto <span className="font-semibold">{productName}</span> ha sido creado
                        correctamente y ya está disponible en el catálogo.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
                    <Button
                        variant="outline"
                        onClick={onNewProduct}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Crear otro producto</span>
                    </Button>
                    <Button
                        onClick={goToProductList}
                        className="flex items-center gap-2"
                    >
                        <ListChecks className="h-4 w-4" />
                        <span>Ver lista de productos</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}