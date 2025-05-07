"use client";

import { TablePagination } from "@/components/common/table/TablePagination";
import { Item } from "@/types/ecommerce/client/ecommerce.types";
import { formatCurrency } from "@/utils/format-currency.utils";
import { motion } from "framer-motion";
import { ShoppingBag, Package, Filter, Info } from "lucide-react";
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
            <div className="text-center p-8 border rounded-lg">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No hay productos</h3>
                <p className="text-muted-foreground mb-4">
                    No se encontraron productos que coincidan con los filtros aplicados.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            </div>

            {meta && (
                <div className="py-3 border-t mt-6">
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