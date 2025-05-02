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
import { Category, ProductAdminFilters } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { cn } from "@/lib/utils";
import { FilterX, RotateCcw, Search } from "lucide-react";
import { useState } from "react";

interface ProductsFiltersProps {
    filters: ProductAdminFilters;
    categories: Category[];
    onFilterChange: (filters: Partial<ProductAdminFilters>) => void;
    onResetFilters: () => void;
    className?: string;
}

export function ProductsFilters({
    filters,
    categories,
    onFilterChange,
    onResetFilters,
    className,
}: ProductsFiltersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.name || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ name: searchTerm.trim() || undefined });
    };

    // Check if any filter is active
    const hasActiveFilters =
        filters.name !== undefined ||
        filters.categoryId !== undefined ||
        filters.isActive !== undefined;

    return (
        <div className={cn("space-y-4", className)}>
            <div className="bg-card rounded-lg shadow-sm border p-4">
                <div className="flex flex-col space-y-4">
                    {/* Header - Title and reset button */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                            <FilterX className="h-4 w-4 text-muted-foreground" />
                            Filtros
                        </h3>
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onResetFilters}
                                className="h-8 px-2 text-xs"
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Restablecer filtros
                            </Button>
                        )}
                    </div>

                    {/* Filters grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        {/* Active status */}
                        <div className="space-y-2">
                            <Select
                                value={
                                    filters.isActive === undefined
                                        ? "all"
                                        : filters.isActive === true
                                            ? "true"
                                            : "false"
                                }
                                onValueChange={(value) => {
                                    let isActive: boolean | undefined = undefined;
                                    if (value === "true") isActive = true;
                                    if (value === "false") isActive = false;
                                    onFilterChange({ isActive });
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="true">Activos</SelectItem>
                                    <SelectItem value="false">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}