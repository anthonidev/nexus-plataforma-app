"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Item } from "@/types/withdrawals/finance-withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import {
    Calendar,
    Check,
    Clock,
    CreditCard,
    Eye,
    Info,
    User,
    X
} from "lucide-react";
import Link from "next/link";

interface MobileWithdrawalsViewProps {
    withdrawals: Item[];
    onQuickView: (withdrawal: Item) => void;
}

export function MobileWithdrawalsView({
    withdrawals,
    onQuickView,
}: MobileWithdrawalsViewProps) {
    if (!withdrawals.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground border rounded-md bg-muted/5">
                <Info className="h-12 w-12 text-muted-foreground/70 mb-2" />
                <p>No se encontraron retiros</p>
                <p className="text-sm mt-1">Intenta modificar los filtros de búsqueda</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {withdrawals.map((withdrawal) => {
                // Configuración de estado para badges
                let statusBadge;
                switch (withdrawal.status) {
                    case "PENDING":
                        statusBadge = (
                            <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40 flex items-center gap-1.5 px-2 py-0.5"
                            >
                                <Clock className="h-3 w-3" />
                                <span>Pendiente</span>
                            </Badge>
                        );
                        break;
                    case "APPROVED":
                        statusBadge = (
                            <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40 flex items-center gap-1.5 px-2 py-0.5"
                            >
                                <Check className="h-3 w-3" />
                                <span>Aprobado</span>
                            </Badge>
                        );
                        break;
                    case "REJECTED":
                        statusBadge = (
                            <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40 flex items-center gap-1.5 px-2 py-0.5"
                            >
                                <X className="h-3 w-3" />
                                <span>Rechazado</span>
                            </Badge>
                        );
                        break;
                    default:
                        statusBadge = <Badge variant="outline">{withdrawal.status}</Badge>;
                }

                return (
                    <Card key={withdrawal.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col divide-y">
                                {/* Cabecera con estado e ID */}
                                <div className="flex items-center justify-between p-4 bg-muted/20">
                                    {statusBadge}
                                    <div className="text-sm text-muted-foreground">
                                        <span>#{withdrawal.id}</span>
                                    </div>
                                </div>

                                {/* Contenido principal */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-primary" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {withdrawal.user.personalInfo.firstName} {withdrawal.user.personalInfo.lastName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {withdrawal.user.email}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        <div className="font-semibold">
                                            {formatCurrency(withdrawal.amount)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <div className="text-sm">
                                            {withdrawal.bankName}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm">
                                                {format(new Date(withdrawal.createdAt), "dd/MM/yyyy")}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(withdrawal.createdAt), "HH:mm")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pie con botones de acción */}
                                <div className="p-3 bg-muted/10 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onQuickView(withdrawal)}
                                        className="w-1/2 flex items-center justify-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>Ver</span>
                                    </Button>

                                    <Link
                                        href={`/admin/retiros/detalle/${withdrawal.id}`}
                                        className="w-1/2"
                                    >
                                        <Button
                                            variant={withdrawal.status === "PENDING" ? "default" : "outline"}
                                            size="sm"
                                            className="w-full"
                                        >
                                            {withdrawal.status === "PENDING" ? "Gestionar" : "Detalle"}
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}