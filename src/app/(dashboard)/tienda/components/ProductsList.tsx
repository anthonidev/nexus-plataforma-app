"use client";

import { TablePagination } from "@/components/common/table/TablePagination";
import { Item } from "@/types/ecommerce/client/ecommerce.types";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Package, Info } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductsListProps {
    products: Item[];
    meta: {
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    } | null;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export function ProductsList({
    products,
    meta,
    onPageChange,
    onPageSizeChange,
}: ProductsListProps) {
    if (products.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center p-12 border rounded-lg bg-muted/10"
            >
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Package className="h-10 w-10 text-primary/70" />
                </div>
                <h3 className="text-xl font-medium mb-2">No hay productos disponibles</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    No se encontraron productos que coincidan con los filtros aplicados. Intenta con otras opciones de búsqueda.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
                <AnimatePresence>
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="py-4 border-t mt-6">
                    <TablePagination
                        pagination={{
                            pageIndex: meta.currentPage - 1,
                            pageSize: meta.itemsPerPage,
                        }}
                        pageCount={meta.totalPages}
                        pageIndex={meta.currentPage - 1}
                        canNextPage={meta.currentPage >= meta.totalPages}
                        canPreviousPage={meta.currentPage <= 1}
                        setPageIndex={(idx) => onPageChange(Number(idx) + 1)}
                        setPageSize={() => onPageSizeChange}
                        previousPage={() => onPageChange(Math.max(1, meta.currentPage - 1))}
                        nextPage={() => onPageChange(Math.min(meta.totalPages, meta.currentPage + 1))}
                        totalItems={meta.totalItems}
                    />
                </div>
            )}
        </div>
    );
}