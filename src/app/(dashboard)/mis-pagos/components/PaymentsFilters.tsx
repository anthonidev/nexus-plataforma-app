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
import { PaymentConfigListUserItem } from "@/types/payment/payment-user.type";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface PaymentsFiltersProps {
  status: "PENDING" | "APPROVED" | "REJECTED" | undefined;
  paymentConfigId: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  order: "ASC" | "DESC";
  paymentConfigs: PaymentConfigListUserItem[];
  onStatusChange: (
    status: "PENDING" | "APPROVED" | "REJECTED" | undefined
  ) => void;
  onPaymentConfigChange: (id: number | undefined) => void;
  onStartDateChange: (date: string | undefined) => void;
  onEndDateChange: (date: string | undefined) => void;
  onOrderChange: (order: "ASC" | "DESC") => void;
  onReset: () => void;
  className?: string;
}

export function PaymentsFilters({
  status,
  paymentConfigId,
  startDate,
  endDate,
  order,
  paymentConfigs,
  onStatusChange,
  onPaymentConfigChange,
  onStartDateChange,
  onEndDateChange,
  onOrderChange,
  onReset,
  className,
}: PaymentsFiltersProps) {
  const [calendarStartDate, setCalendarStartDate] = useState<Date | undefined>(
    startDate ? new Date(startDate) : undefined
  );

  const [calendarEndDate, setCalendarEndDate] = useState<Date | undefined>(
    endDate ? new Date(endDate) : undefined
  );

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

  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro por estado */}
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
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="APPROVED">Aprobado</SelectItem>
            <SelectItem value="REJECTED">Rechazado</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por tipo de pago */}
        <Select
          value={paymentConfigId?.toString() || "all"}
          onValueChange={(value) =>
            onPaymentConfigChange(value === "all" ? undefined : parseInt(value))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            {paymentConfigs.map((config) => (
              <SelectItem key={config.id} value={config.id.toString()}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por orden */}
        <Select
          value={order}
          onValueChange={(value) => onOrderChange(value as "ASC" | "DESC")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DESC">Más reciente primero</SelectItem>
            <SelectItem value="ASC">Más antiguo primero</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Filtro de fecha inicial */}
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !calendarStartDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {calendarStartDate ? (
                  format(calendarStartDate, "PPP")
                ) : (
                  <span>Fecha inicial</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={calendarStartDate}
                onSelect={handleStartDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Filtro de fecha final */}
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !calendarEndDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {calendarEndDate ? (
                  format(calendarEndDate, "PPP")
                ) : (
                  <span>Fecha final</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={calendarEndDate}
                onSelect={handleEndDateSelect}
                initialFocus
                disabled={(date) =>
                  calendarStartDate ? date < calendarStartDate : false
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Botón para limpiar filtros */}
        <Button
          variant="ghost"
          onClick={() => {
            onReset();
            setCalendarStartDate(undefined);
            setCalendarEndDate(undefined);
          }}
          className="md:ml-auto"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
}
