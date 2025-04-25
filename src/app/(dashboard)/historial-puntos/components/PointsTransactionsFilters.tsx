"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    CalendarIcon,
    CheckCircle2,
    Clock,
    CreditCard,
    FilterX,
    RotateCcw,
    XCircle,
} from "lucide-react";
import { useState } from "react";

interface PointsTransactionsFiltersProps {
    status: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED" | undefined;
    type: "WITHDRAWAL" | "BINARY_COMMISSION" | "DIRECT_BONUS" | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    onStatusChange?: (
        status: "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED" | undefined
    ) => void;
    onTypeChange?: (
        type: "WITHDRAWAL" | "BINARY_COMMISSION" | "DIRECT_BONUS" | undefined
    ) => void;
    onStartDateChange?: (date: string | undefined) => void;
    onEndDateChange?: (date: string | undefined) => void;
    onReset: () => void;
    className?: string;
}

export function PointsTransactionsFilters({
    status,
    type,
    startDate,
    endDate,
    onStatusChange,
    onTypeChange,
    onStartDateChange,
    onEndDateChange,
    onReset,
    className,
}: PointsTransactionsFiltersProps) {
    const [calendarStartDate, setCalendarStartDate] = useState<Date | undefined>(
        startDate ? new Date(startDate) : undefined
    );

    const [calendarEndDate, setCalendarEndDate] = useState<Date | undefined>(
        endDate ? new Date(endDate) : undefined
    );

    // Función para manejar cambio de fecha inicial
    const handleStartDateSelect = (date: Date | undefined) => {
        setCalendarStartDate(date);
        if (onStartDateChange) {
            onStartDateChange(date?.toISOString());
        }
    };

    // Función para manejar cambio de fecha final
    const handleEndDateSelect = (date: Date | undefined) => {
        setCalendarEndDate(date);
        if (onEndDateChange) {
            onEndDateChange(date?.toISOString());
        }
    };

    // Función para limpiar un filtro específico
    const clearFilter = (filter: 'status' | 'type' | 'date') => {
        switch (filter) {
            case 'status':
                if (onStatusChange) onStatusChange(undefined);
                break;
            case 'type':
                if (onTypeChange) onTypeChange(undefined);
                break;
            case 'date':
                if (onStartDateChange) onStartDateChange(undefined);
                if (onEndDateChange) onEndDateChange(undefined);
                setCalendarStartDate(undefined);
                setCalendarEndDate(undefined);
                break;
        }
    };

    const getStatusIcon = (statusValue: string | undefined) => {
        switch (statusValue) {
            case 'PENDING':
                return <Clock className="h-4 w-4 text-amber-500" />;
            case 'COMPLETED':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'CANCELLED':
            case 'FAILED':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    const getTypeIcon = (typeValue: string | undefined) => {
        switch (typeValue) {
            case 'WITHDRAWAL':
                return <CreditCard className="h-4 w-4 text-amber-500" />;
            case 'BINARY_COMMISSION':
            case 'DIRECT_BONUS':
                return <CreditCard className="h-4 w-4 text-green-500" />;
            default:
                return null;
        }
    };

    // Verificar si algún filtro está activo
    const isAnyFilterActive = status !== undefined ||
        type !== undefined ||
        startDate !== undefined ||
        endDate !== undefined;

    return (
        <div className={cn("space-y-4", className)}>
            <div className="bg-card rounded-lg shadow-sm border p-4">
                <div className="flex flex-col space-y-4">
                    {/* Header - Título y botón de reinicio */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                            <FilterX className="h-4 w-4 text-muted-foreground" />
                            Filtros
                        </h3>
                        {isAnyFilterActive && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onReset}
                                className="h-8 px-2 text-xs"
                            >
                                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                                Restablecer filtros
                            </Button>
                        )}
                    </div>

                    {/* Primera fila de filtros */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Filtro por estado */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-muted-foreground">Estado</label>
                                {status && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => clearFilter('status')}
                                        className="h-5 w-5 p-0 rounded-full"
                                    >
                                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                )}
                            </div>
                            <Select
                                value={status || "all"}
                                onValueChange={(value) =>
                                    onStatusChange?.(
                                        value === "all"
                                            ? undefined
                                            : (value as "PENDING" | "COMPLETED" | "CANCELLED" | "FAILED")
                                    )
                                }
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Todos los estados">
                                        {status ? (
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(status)}
                                                <span>
                                                    {status === 'PENDING' ? 'Pendiente' :
                                                        status === 'COMPLETED' ? 'Completado' :
                                                            status === 'CANCELLED' ? 'Cancelado' :
                                                                status === 'FAILED' ? 'Fallido' : 'Todos'}
                                                </span>
                                            </div>
                                        ) : (
                                            "Todos los estados"
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="text-sm">Todos los estados</SelectItem>
                                    <SelectItem value="PENDING" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-amber-500" />
                                            Pendiente
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="COMPLETED" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            Completado
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="CANCELLED" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            Cancelado
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="FAILED" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            Fallido
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por tipo de transacción */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-muted-foreground">Tipo de transacción</label>
                                {type && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => clearFilter('type')}
                                        className="h-5 w-5 p-0 rounded-full"
                                    >
                                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                )}
                            </div>
                            <Select
                                value={type || "all"}
                                onValueChange={(value) =>
                                    onTypeChange?.(
                                        value === "all"
                                            ? undefined
                                            : (value as "WITHDRAWAL" | "BINARY_COMMISSION" | "DIRECT_BONUS")
                                    )
                                }
                            >
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Todos los tipos">
                                        {type ? (
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(type)}
                                                <span>
                                                    {type === 'WITHDRAWAL' ? 'Retiro' :
                                                        type === 'BINARY_COMMISSION' ? 'Comisión Binaria' :
                                                            type === 'DIRECT_BONUS' ? 'Bono Directo' : 'Todos'}
                                                </span>
                                            </div>
                                        ) : (
                                            "Todos los tipos"
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="text-sm">Todos los tipos</SelectItem>
                                    <SelectItem value="WITHDRAWAL" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-amber-500" />
                                            Retiro
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="BINARY_COMMISSION" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-green-500" />
                                            Comisión Binaria
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="DIRECT_BONUS" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-blue-500" />
                                            Bono Directo
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Segunda fila - Filtro de fechas */}
                    <div className="pt-2">
                        <div className="space-y-2">
                            <div className="flex items-start justify-between">
                                <label className="text-xs font-medium text-muted-foreground">Rango de fechas</label>
                                {(startDate || endDate) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => clearFilter('date')}
                                        className="h-5 w-5 p-0 rounded-full"
                                    >
                                        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                "h-9 justify-start text-xs font-normal",
                                                !calendarStartDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                                            {calendarStartDate ? (
                                                format(calendarStartDate, "dd/MM/yyyy")
                                            ) : (
                                                <span>Desde</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={calendarStartDate}
                                            onSelect={handleStartDateSelect}
                                            initialFocus
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                "h-9 justify-start text-xs font-normal",
                                                !calendarEndDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                                            {calendarEndDate ? (
                                                format(calendarEndDate, "dd/MM/yyyy")
                                            ) : (
                                                <span>Hasta</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={calendarEndDate}
                                            onSelect={handleEndDateSelect}
                                            initialFocus
                                            locale={es}
                                            disabled={(date) =>
                                                calendarStartDate ? date < calendarStartDate : false
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}