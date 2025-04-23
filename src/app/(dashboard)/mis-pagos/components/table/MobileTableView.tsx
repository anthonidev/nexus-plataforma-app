// MobileTableView.tsx
import { PaymentListUserItem } from "@/types/payment/payment-user.type";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/format-currency.utils";
import {
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Info,
    Tag,
    XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NextRouter } from "next/router";
import { useRouter } from "next/navigation";

interface MobileTableViewProps {
    payments: PaymentListUserItem[];
}

export function MobileTableView({ payments }: MobileTableViewProps) {
    const router = useRouter();
    if (!payments.length) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center text-muted-foreground border rounded-md bg-muted/5">
                <Info className="h-12 w-12 text-muted-foreground/70 mb-2" />
                <p>No se encontraron pagos</p>
                <p className="text-sm mt-1">Intenta ajustar los filtros para ver más resultados</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {payments.map((payment) => {
                const date = payment.createdAt
                    ? new Date(payment.createdAt)
                    : null;

                let statusBadge;
                switch (payment.status) {
                    case "PENDING":
                        statusBadge = (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40 flex items-center gap-1.5 px-2 py-0.5">
                                <Clock className="h-3 w-3" />
                                <span>Pendiente</span>
                            </Badge>
                        );
                        break;
                    case "APPROVED":
                        statusBadge = (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40 flex items-center gap-1.5 px-2 py-0.5">
                                <CheckCircle className="h-3 w-3" />
                                <span>Aprobado</span>
                            </Badge>
                        );
                        break;
                    case "REJECTED":
                        statusBadge = (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40 flex items-center gap-1.5 px-2 py-0.5">
                                <XCircle className="h-3 w-3" />
                                <span>Rechazado</span>
                            </Badge>
                        );
                        break;
                    default:
                        statusBadge = <Badge variant="outline">{payment.status}</Badge>;
                }

                return (
                    <Card key={payment.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col divide-y">
                                {/* Cabecera con estado e ID */}
                                <div className="flex items-center justify-between p-4 bg-muted/20">
                                    {statusBadge}
                                    <div className="text-sm text-muted-foreground">
                                        <span>#{payment.id}</span>
                                    </div>
                                </div>

                                {/* Contenido principal */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        <div className="font-semibold">
                                            {formatCurrency(payment.amount)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-muted-foreground" />
                                        <div className="text-sm">
                                            {payment.paymentConfig?.name || "N/A"}
                                        </div>
                                    </div>

                                    {date && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex flex-col">
                                                <span className="text-sm">{format(date, "dd/MM/yyyy")}</span>
                                                <span className="text-xs text-muted-foreground">{format(date, "HH:mm")}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Pie con botón de acción */}
                                <div className="p-3 bg-muted/10">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => router.push(`/mis-pagos/detalle/${payment.id}`)}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>Ver detalles</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}