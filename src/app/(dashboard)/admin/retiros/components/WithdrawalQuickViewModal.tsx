"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Item } from "@/types/withdrawals/finance-withdrawals.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import Link from "next/link";
import {
    AlertCircle,
    Calendar,
    Check,
    Clock,
    CreditCard,
    Info,
    User,
    X
} from "lucide-react";

interface WithdrawalQuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    withdrawal: Item;
}

export function WithdrawalQuickViewModal({
    isOpen,
    onClose,
    withdrawal,
}: WithdrawalQuickViewModalProps) {
    // Mapeo de estados a estilos y colores
    const statusConfig = {
        PENDING: {
            label: "Pendiente",
            variant:
                "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
            icon: <Clock className="h-4 w-4" />,
        },
        APPROVED: {
            label: "Aprobado",
            variant:
                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
            icon: <Check className="h-4 w-4" />,
        },
        REJECTED: {
            label: "Rechazado",
            variant: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
            icon: <X className="h-4 w-4" />,
        },
    };

    const statusInfo = statusConfig[withdrawal.status] || {
        label: withdrawal.status,
        variant: "bg-gray-100 text-gray-800",
        icon: <Info className="h-4 w-4" />,
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Vista rápida retiro #{withdrawal.id}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Estado del retiro */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Estado:</span>
                        <Badge
                            className={`px-2 py-1 text-sm flex items-center gap-1 ${statusInfo.variant}`}
                        >
                            {statusInfo.icon}
                            {statusInfo.label}
                        </Badge>
                    </div>

                    {/* Monto */}
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Monto solicitado:</span>
                            <span className="text-xl font-bold text-primary">
                                {formatCurrency(withdrawal.amount)}
                            </span>
                        </div>
                    </div>

                    {/* Información del usuario */}
                    <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">Información del usuario</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Nombre:</span>
                                <span className="font-medium">
                                    {withdrawal.user.personalInfo.firstName} {withdrawal.user.personalInfo.lastName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email:</span>
                                <span>{withdrawal.user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">DNI:</span>
                                <span>{withdrawal.user.personalInfo.documentNumber}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información bancaria */}
                    <div className="bg-muted/30 p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-3">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">Información Bancaria</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Banco:</span>
                                <span className="font-medium">{withdrawal.bankName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Número de cuenta:</span>
                                <span className="font-mono">{withdrawal.accountNumber}</span>
                            </div>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-3 rounded-lg border">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-xs font-medium">Fecha solicitud</span>
                            </div>
                            <p className="text-sm font-medium">
                                {format(new Date(withdrawal.createdAt), "dd/MM/yyyy")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(withdrawal.createdAt), "HH:mm")} hrs
                            </p>
                        </div>

                        {withdrawal.reviewedAt ? (
                            <div className="bg-muted/30 p-3 rounded-lg border">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-medium">Fecha revisión</span>
                                </div>
                                <p className="text-sm font-medium">
                                    {format(new Date(withdrawal.reviewedAt), "dd/MM/yyyy")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(withdrawal.reviewedAt), "HH:mm")} hrs
                                </p>
                            </div>
                        ) : (
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="h-4 w-4 text-amber-500" />
                                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">En revisión</span>
                                </div>
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Pendiente de aprobación
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Información del revisor */}
                    {withdrawal.reviewedBy && (
                        <div className="bg-muted/30 p-4 rounded-lg border">
                            <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-primary" />
                                <h3 className="font-medium">Revisado por</h3>
                            </div>
                            <p className="text-sm">{withdrawal.reviewedBy.email}</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Link href={`/admin/retiros/detalle/${withdrawal.id}`}>
                        <Button>
                            Ver detalle completo
                        </Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}