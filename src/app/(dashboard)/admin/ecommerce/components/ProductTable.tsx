"use client";

import { TablePagination } from "@/components/common/table/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ProductAdmin } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import {
    Archive,
    CheckCircle2,
    CircleOff,
    Eye,
    FileEdit,
    Image as ImageIcon,
    Tags,
    XCircle
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductsTableProps {
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

export function ProductsTable({
    products,
    isLoading,

    meta,
    onPageChange,
    onPageSizeChange,

}: ProductsTableProps) {
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

    const columns: ColumnDef<ProductAdmin>[] = [
        {
            accessorKey: "mainImage",
            header: "",
            cell: ({ row }) => (
                <div className="w-12 h-12 rounded-md border overflow-hidden relative">
                    {row.original.mainImage ? (
                        <Image
                            src={row.original.mainImage}
                            alt={row.original.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Producto",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.name}</span>
                    <span className="text-xs text-muted-foreground">
                        SKU: {row.original.sku}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "category.name",
            header: "Categoría",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Tags className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{row.original.category.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "memberPrice",
            header: "Precio Socio",
            cell: ({ row }) => (
                <span className="font-medium">
                    {formatCurrency(row.original.memberPrice)}
                </span>
            ),
        },
        {
            accessorKey: "publicPrice",
            header: "Precio Público",
            cell: ({ row }) => (
                <span>
                    {formatCurrency(row.original.publicPrice)}
                </span>
            ),
        },
        {
            accessorKey: "stock",
            header: "Stock",
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.stock}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => getStatusBadge(row.original.status),
        },
        {
            accessorKey: "isActive",
            header: "Activo",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.isActive ? "default" : "outline"}
                    className={row.original.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
                    }
                >
                    {row.original.isActive ? "Activo" : "Inactivo"}
                </Badge>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Fecha",
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt);
                return (
                    <span className="text-sm">
                        {format(date, "dd/MM/yyyy", { locale: es })}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(product.id)}>
                        <Eye className="h-4 w-4 " />
                    </Button>
                );
            },
        },
    ];

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (products.length === 0 && !isLoading) {
        return (
            <div className="text-center p-8 border rounded-lg">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <Archive className="h-8 w-8 text-muted-foreground" />
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
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <motion.tr
                                key={row.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </motion.tr>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {meta && (
                <div className="p-3 border-t">
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