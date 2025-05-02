"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePagination } from "@/components/common/table/TablePagination";
import { formatCurrency } from "@/utils/format-currency.utils";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import {
    Archive,
    CheckCircle2,
    CircleOff,
    Eye,
    FileEdit,
    MoreVertical,
    Package,
    Pencil,
    Tags,
    Trash2,
    XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductAdmin } from "@/types/ecommerce/admin/ecommerce-admin.type";

interface ProductsMobileViewProps {
    products: ProductAdmin[];
    isLoading: boolean;

    meta: {
        totalItems: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    } | null;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;

}

export function ProductsMobileView({
    products,
    isLoading,

    meta,
    onPageChange,
    onPageSizeChange,

}: ProductsMobileViewProps) {
    const router = useRouter();

    const handleViewDetail = (productId: number) => {
        router.push(`/admin/ecommerce/productos/detalle/${productId}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "IN_STOCK":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        En stock
                    </Badge>
                );
            case "LOW_STOCK":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                        <CircleOff className="h-3 w-3 mr-1" />
                        Stock bajo
                    </Badge>
                );
            case "OUT_OF_STOCK":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Sin stock
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        {status}
                    </Badge>
                );
        }
    };

    if (products.length === 0 && !isLoading) {
        return (
            <div className="text-center p-8 border rounded-lg">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No hay productos</h3>
                <p className="text-muted-foreground mb-4">
                    No se encontraron productos que coincidan con los filtros aplicados.
                </p>
                <Button
                    variant="default"
                    onClick={() => router.push("/admin/ecommerce/productos/registrar")}
                >
                    <FileEdit className="h-4 w-4 mr-2" />
                    Registrar nuevo producto
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex items-center gap-3 p-3 bg-muted/20">
                                    <div className="w-12 h-12 rounded-md border overflow-hidden flex-shrink-0 relative">
                                        {product.mainImage ? (
                                            <Image
                                                src={product.mainImage}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                                <Package className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-base truncate">{product.name}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>SKU: {product.sku}</span>
                                            <span>•</span>
                                            <span>{format(new Date(product.createdAt), "dd/MM/yyyy", { locale: es })}</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="p-4 grid gap-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Categoría</p>
                                            <div className="flex items-center gap-1">
                                                <Tags className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span className="text-sm font-medium">{product.category.name}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Estado</p>
                                            <div className="flex flex-col gap-1">
                                                {getStatusBadge(product.status)}
                                                <Badge
                                                    variant={product.isActive ? "default" : "outline"}
                                                    className={`mt-1 text-xs ${product.isActive
                                                        ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400"
                                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
                                                        }`}
                                                >
                                                    {product.isActive ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Precio Socio</p>
                                            <p className="text-sm font-semibold">{formatCurrency(product.memberPrice)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Precio Público</p>
                                            <p className="text-sm">{formatCurrency(product.publicPrice)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Stock</p>
                                            <p className="text-sm font-semibold">{product.stock}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 border-t bg-muted/10">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => handleViewDetail(product.id)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver detalles
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {meta && (
                <div className="py-3">
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