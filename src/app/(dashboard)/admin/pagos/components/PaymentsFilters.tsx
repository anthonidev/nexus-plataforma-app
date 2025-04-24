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
import { PaymentConfigListItem } from "@/types/payment/payment.type";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  FilterX,
  RotateCcw,
  SortAsc,
  SortDesc,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface PaymentsFiltersProps {
  status: "PENDING" | "APPROVED" | "REJECTED" | undefined;
  paymentConfigId: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  order: "ASC" | "DESC";
  search: string | undefined;
  paymentConfigs: PaymentConfigListItem[];
  onStatusChange: (
    status: "PENDING" | "APPROVED" | "REJECTED" | undefined
  ) => void;
  onPaymentConfigChange: (id: number | undefined) => void;
  onStartDateChange: (date: string | undefined) => void;
  onEndDateChange: (date: string | undefined) => void;
  onOrderChange: (order: "ASC" | "DESC") => void;
  onSearchChange: (search: string | undefined) => void;
  onReset: () => void;
  className?: string;
}

export function PaymentsFilters({
  status,
  paymentConfigId,
  startDate,
  endDate,
  order,
  search,
  paymentConfigs,
  onStatusChange,
  onPaymentConfigChange,
  onStartDateChange,
  onEndDateChange,
  onOrderChange,
  onSearchChange,
  onReset,
  className,
}: PaymentsFiltersProps) {
  const [calendarStartDate, setCalendarStartDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );

  const [calendarEndDate, setCalendarEndDate] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined
  );

  const [searchTerm, setSearchTerm] = useState<string>(search || "");

  // Función para manejar cambio de fecha inicial
  const handleStartDateSelect = (date: Date | undefined) => {
    setCalendarStartDate(date);
    onStartDateChange(date?.toISOString());
  };

  // Función para manejar cambio de fecha final
  const handleEndDateSelect = (date: Date | undefined) => {
    setCalendarEndDate(date);
    onEndDateChange(date?.toISOString());
  };

  // Función para manejar la búsqueda
  const handleSearch = () => {
    onSearchChange(searchTerm.trim() ? searchTerm : undefined);
  };

  // Función para limpiar un filtro específico
  const clearFilter = (filter: 'status' | 'type' | 'date' | 'order' | 'search') => {
    switch (filter) {
      case 'status':
        onStatusChange(undefined);
        break;
      case 'type':
        onPaymentConfigChange(undefined);
        break;
      case 'date':
        onStartDateChange(undefined);
        onEndDateChange(undefined);
        setCalendarStartDate(undefined);
        setCalendarEndDate(undefined);
        break;
      case 'order':
        onOrderChange('DESC');
        break;
      case 'search':
        setSearchTerm("");
        onSearchChange(undefined);
        break;
    }
  };

  const getStatusIcon = (statusValue: string | undefined) => {
    switch (statusValue) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'APPROVED':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Verificar si algún filtro está activo
  const isAnyFilterActive = status !== undefined ||
    paymentConfigId !== undefined ||
    startDate !== undefined ||
    endDate !== undefined ||
    search !== undefined ||
    order !== 'DESC';

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

          {/* Búsqueda */}
          <div className="space-y-2 max-w-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Búsqueda</label>
              {search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter('search')}
                  className="h-5 w-5 p-0 rounded-full"
                >
                  <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar por email o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 text-sm"
              />
              <Button size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Primera fila de filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl">
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
                  onStatusChange(
                    value === "all"
                      ? undefined
                      : (value as "PENDING" | "APPROVED" | "REJECTED")
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
                            status === 'APPROVED' ? 'Aprobado' :
                              status === 'REJECTED' ? 'Rechazado' : 'Todos'}
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
                  <SelectItem value="APPROVED" className="text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      Aprobado
                    </div>
                  </SelectItem>
                  <SelectItem value="REJECTED" className="text-sm">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Rechazado
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por tipo de pago */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Tipo de pago</label>
                {paymentConfigId && (
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
                value={paymentConfigId?.toString() || "all"}
                onValueChange={(value) =>
                  onPaymentConfigChange(value === "all" ? undefined : parseInt(value))
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Todos los tipos">
                    {paymentConfigId ? (
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5" />
                        {paymentConfigs.find(config => config.id === paymentConfigId)?.name || "Tipo seleccionado"}
                      </div>
                    ) : (
                      "Todos los tipos"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-sm">Todos los tipos</SelectItem>
                  {paymentConfigs.map((config) => (
                    <SelectItem key={config.id} value={config.id.toString()} className="text-sm">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5" />
                        {config.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por orden */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Ordenar por fecha</label>
                {order !== 'DESC' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearFilter('order')}
                    className="h-5 w-5 p-0 rounded-full"
                  >
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                )}
              </div>
              <Select
                value={order}
                onValueChange={(value) => onOrderChange(value as "ASC" | "DESC")}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {order === "DESC" ? (
                        <>
                          <SortDesc className="h-3.5 w-3.5" />
                          <span>Más reciente primero</span>
                        </>
                      ) : (
                        <>
                          <SortAsc className="h-3.5 w-3.5" />
                          <span>Más antiguo primero</span>
                        </>
                      )}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESC" className="text-sm">
                    <div className="flex items-center gap-2">
                      <SortDesc className="h-3.5 w-3.5" />
                      Más reciente primero
                    </div>
                  </SelectItem>
                  <SelectItem value="ASC" className="text-sm">
                    <div className="flex items-center gap-2">
                      <SortAsc className="h-3.5 w-3.5" />
                      Más antiguo primero
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Segunda fila - Filtro de fechas */}
          <div className="pt-2">
            <div className="space-y-2 max-w-xs">
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
              <div className="grid grid-cols-2 gap-2">
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