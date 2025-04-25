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
    FilterX,
    RotateCcw,
    XCircle,
} from "lucide-react";
import { useState } from "react";

interface WeeklyVolumesFiltersProps {
    status: "PENDING" | "PROCESSED" | "CANCELLED" | undefined;
    startDate: string | undefined;
    endDate: string | undefined;
    onStatusChange?: (
        status: "PENDING" | "PROCESSED" | "CANCELLED" | undefined
    ) => void;
    onStartDateChange?: (date: string | undefined) => void;
    onEndDateChange?: (date: string | undefined) => void;
    onReset: () => void;
    className?: string;
}

export function WeeklyVolumesFilters({
    status,
    startDate,
    endDate,
    onStatusChange,
    onStartDateChange,
    onEndDateChange,
    onReset,
    className,
}: WeeklyVolumesFiltersProps) {
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
    const clearFilter = (filter: 'status' | 'date') => {
        switch (filter) {
            case 'status':
                if (onStatusChange) onStatusChange(undefined);
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
            case 'PROCESSED':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'CANCELLED':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    // Verificar si algún filtro está activo
    const isAnyFilterActive = status !== undefined ||
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
                                            : (value as "PENDING" | "PROCESSED" | "CANCELLED")
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
                                                        status === 'PROCESSED' ? 'Procesado' :
                                                            status === 'CANCELLED' ? 'Cancelado' : 'Todos'}
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
                                    <SelectItem value="PROCESSED" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            Procesado
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="CANCELLED" className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            Cancelado
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Segunda fila - Filtro de fechas */}
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