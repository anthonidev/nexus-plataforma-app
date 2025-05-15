"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { ProductClientFilters } from "@/types/ecommerce/client/ecommerce.types";
import { cn } from "@/lib/utils";
import { FilterX, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProductFiltersProps {
    filters: ProductClientFilters;
    categories: Category[];
    onFilterChange: (filters: Partial<ProductClientFilters>) => void;
    onResetFilters: () => void;
    className?: string;
}

export function ProductFilters({
    filters,
    categories,
    onFilterChange,
    onResetFilters,
    className,
}: ProductFiltersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.name || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ name: searchTerm.trim() || undefined });
    };

    // Check if any filter is active
    const hasActiveFilters =
        filters.name !== undefined ||
        filters.categoryId !== undefined;

    return (
        <motion.div
            className={cn("space-y-4", className)}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-card rounded-lg shadow-sm border p-5">
                <div className="flex flex-col space-y-4">
                    {/* Header - Title and reset button */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-primary" />
                            Filtrar productos
                        </h3>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onResetFilters}
                                className="h-8 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Limpiar filtros
                            </Button>
                        )}
                    </div>

                    {/* Filters grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name search */}
                        <div className="space-y-2">
                            <form onSubmit={handleSearch} className="relative">
                                <Input
                                    placeholder="Buscar por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pr-10"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-0 top-0 h-full aspect-square"
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>

                        {/* Category filter */}
                        <div className="space-y-2">
                            <Select
                                value={filters.categoryId?.toString() || "all"}
                                onValueChange={(value) =>
                                    onFilterChange({ categoryId: value !== "all" ? parseInt(value) : undefined })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las categorías</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Applied filters indicators */}
                    {hasActiveFilters && (
                        <div className="pt-3 flex flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground">Filtros aplicados:</span>
                            {filters.name && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
                                    Búsqueda: {filters.name}
                                    <button
                                        onClick={() => onFilterChange({ name: undefined })}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filters.categoryId && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
                                    Categoría: {categories.find(c => c.id === filters.categoryId)?.name}
                                    <button
                                        onClick={() => onFilterChange({ categoryId: undefined })}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}