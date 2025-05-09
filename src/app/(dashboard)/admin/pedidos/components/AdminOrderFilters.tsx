import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { OrderAdminFilters } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { format } from "date-fns";
import { Calendar, FilterX, RotateCcw, Search } from "lucide-react";
import { useState } from "react";

interface AdminOrderFiltersProps {
    filters: OrderAdminFilters;
    onFilterChange: (filters: Partial<OrderAdminFilters>) => void;
    onResetFilters: () => void;
    className?: string;
}

export function AdminOrderFilters({
    filters,
    onFilterChange,
    onResetFilters,
    className,
}: AdminOrderFiltersProps) {
    const [startDate, setStartDate] = useState<Date | undefined>(
        filters.startDate ? new Date(filters.startDate) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filters.endDate ? new Date(filters.endDate) : undefined
    );

    // Estado para búsqueda por ID o email
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ search: searchTerm.trim() || undefined });
    };

    // Manejar cambios de fecha
    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date);
        if (date) {
            onFilterChange({ startDate: format(date, "yyyy-MM-dd") });
        } else {
            const newFilters = { ...filters };
            delete newFilters.startDate;
            onFilterChange(newFilters);
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date);
        if (date) {
            onFilterChange({ endDate: format(date, "yyyy-MM-dd") });
        } else {
            const newFilters = { ...filters };
            delete newFilters.endDate;
            onFilterChange(newFilters);
        }
    };

    // Check if any filter is active
    const hasActiveFilters =
        filters.search !== undefined ||
        filters.status !== undefined ||
        filters.startDate !== undefined ||
        filters.endDate !== undefined;

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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search by ID or email */}
                        <div className="space-y-2">
                            <form onSubmit={handleSearch} className="relative">
                                <Input
                                    placeholder="Buscar por ID o email..."
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

                        {/* Status filter */}
                        <div className="space-y-2">
                            <Select
                                value={filters.status?.toString() || "all"}
                                onValueChange={(value) =>
                                    onFilterChange({ status: value !== "all" ? (value as OrderAdminFilters["status"]) : undefined })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado del pedido" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                                    <SelectItem value="APROBADO">Aprobado</SelectItem>
                                    <SelectItem value="ENVIADO">Enviado</SelectItem>
                                    <SelectItem value="ENTREGADO">Entregado</SelectItem>
                                    <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Start date filter */}
                        <div className="space-y-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "dd/MM/yyyy") : "Fecha inicio"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={startDate}
                                        onSelect={handleStartDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* End date filter */}
                        <div className="space-y-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "dd/MM/yyyy") : "Fecha fin"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={endDate}
                                        onSelect={handleEndDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}