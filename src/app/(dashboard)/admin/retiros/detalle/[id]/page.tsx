"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import {
    Check,
    CheckCircle2,
    CircleDollarSign,
    Clock,
    CreditCard,
    Info,
    RefreshCw,
    UserRound,
    Wallet,
    X,
    XCircle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { WithdrawalDetailError } from "../../components/WithdrawalDetailError";
import { WithdrawalDetailSkeleton } from "../../components/WithdrawalDetailSkeleton";
import { WithdrawalPointsList } from "../../components/WithdrawalPointsList";
import { ApproveWithdrawalModal } from "../../components/modals/ApproveWithdrawalModal";
import { RejectWithdrawalModal } from "../../components/modals/RejectWithdrawalModal";
import { WithdrawalResponseModal } from "../../components/modals/WithdrawalResponseModal";
import { useWithdrawalDetail } from "../../hooks/useWithdrawalDetail";


export default function WithdrawalDetailPage() {
    const router = useRouter();
    const params = useParams();
    const withdrawalId = Number(params.id);

    // Estados para los modales
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [approveResponse, setApproveResponse] = useState<any>(null);
    const [rejectResponse, setRejectResponse] = useState<any>(null);

    const {
        withdrawal,
        points,
        pointsMeta,
        isLoading,
        error,
        currentPage,
        itemsPerPage,
        handlePageChange,
        handleItemsPerPageChange,
        refreshData,
        approveWithdrawal,
        rejectWithdrawal,
        isProcessing,
    } = useWithdrawalDetail(withdrawalId);

    // Configuración de estados para badges
    const statusConfig = {
        PENDING: {
            label: "Pendiente",
            color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
            icon: <Clock className="h-4 w-4" />,
        },
        APPROVED: {
            label: "Aprobado",
            color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
            icon: <Check className="h-4 w-4" />,
        },
        REJECTED: {
            label: "Rechazado",
            color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
            icon: <X className="h-4 w-4" />,
        },
    };

    const handleApproveClick = () => {
        setIsApproveModalOpen(true);
    };

    const handleRejectClick = () => {
        setIsRejectModalOpen(true);
    };

    const handleApprove = async () => {
        try {
            const response = await approveWithdrawal();
            setApproveResponse(response);
            setIsApproveModalOpen(false);
            setIsResponseModalOpen(true);
        } catch (error) {
            console.error("Error al aprobar:", error);
        }
    };

    const handleReject = async () => {
        try {
            if (!rejectionReason.trim()) {
                return;
            }
            const response = await rejectWithdrawal(rejectionReason);
            setRejectResponse(response);
            setIsRejectModalOpen(false);
            setIsResponseModalOpen(true);
        } catch (error) {
            console.error("Error al rechazar:", error);
        }
    };

    const closeResponseModal = () => {
        setIsResponseModalOpen(false);
        setApproveResponse(null);
        setRejectResponse(null);
    };

    if (isLoading) {
        return <WithdrawalDetailSkeleton />;
    }

    if (error || !withdrawal) {
        return <WithdrawalDetailError error={error} />;
    }

    const status = withdrawal.status;
    const statusInfo = statusConfig[status] || {
        label: status,
        color: "bg-gray-100 text-gray-800",
        icon: <Info className="h-4 w-4" />,
    };

    return (
        <div className="container py-8">
            <PageHeader
                title={`Detalle de retiro #${withdrawal.id}`}
                subtitle="Información completa de la solicitud de retiro"
                variant="gradient"
                icon={CircleDollarSign}
                backUrl="/admin/retiros"
                actions={
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshData}
                            disabled={isLoading}
                            className="mr-2"
                        >
                            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
                            Actualizar
                        </Button>

                        {status === "PENDING" && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRejectClick}
                                    className="border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-900/20 dark:text-red-500"
                                >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Rechazar
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={handleApproveClick}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Aprobar
                                </Button>
                            </div>
                        )}
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Información general */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" />
                            Información General
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Información del retiro */}
                            <div className="space-y-4">
                                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-medium text-primary flex items-center gap-1.5">
                                            <Wallet className="h-4 w-4" />
                                            Detalles del retiro
                                        </h3>
                                        <Badge
                                            className={`${statusInfo.color} flex items-center gap-1 px-2 py-1`}
                                        >
                                            {statusInfo.icon}
                                            {statusInfo.label}
                                        </Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Monto:</span>
                                            <span className="text-xl font-bold text-primary">
                                                {formatCurrency(withdrawal.amount)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Fecha de solicitud:</span>
                                            <span className="text-sm">
                                                {format(new Date(withdrawal.createdAt), "dd/MM/yyyy HH:mm")}
                                            </span>
                                        </div>

                                        {withdrawal.reviewedAt && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Fecha de revisión:</span>
                                                <span className="text-sm">
                                                    {format(new Date(withdrawal.reviewedAt), "dd/MM/yyyy HH:mm")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Información bancaria */}
                                <div className="bg-muted/30 p-4 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CreditCard className="h-4 w-4 text-primary" />
                                        <h3 className="text-sm font-medium">Información Bancaria</h3>
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
                                        {withdrawal.cci && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">CCI:</span>
                                                <span className="font-mono">{withdrawal.cci}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Metadatos adicionales si existen */}
                                {withdrawal.metadata && Object.keys(withdrawal.metadata).length > 0 && (
                                    <div className="bg-muted/30 p-4 rounded-lg border">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Info className="h-4 w-4 text-primary" />
                                            <h3 className="text-sm font-medium">Información adicional</h3>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            {Object.entries(withdrawal.metadata).map(([key, value]) => (
                                                <div key={key} className="flex justify-between">
                                                    <span className="text-muted-foreground capitalize">
                                                        {key.replace(/_/g, " ")}:
                                                    </span>
                                                    <span className="font-medium">{String(value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Motivo de rechazo */}
                                {withdrawal.rejectionReason && (
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            <h3 className="font-medium text-red-700 dark:text-red-400">Motivo de rechazo</h3>
                                        </div>
                                        <p className="text-sm text-red-600 dark:text-red-300">
                                            {withdrawal.rejectionReason}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Información del usuario */}
                            <div className="space-y-4">
                                <div className="bg-muted/30 p-4 rounded-lg border">
                                    <div className="flex items-center gap-2 mb-3">
                                        <UserRound className="h-4 w-4 text-primary" />
                                        <h3 className="text-sm font-medium">Información del usuario</h3>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <div className="text-muted-foreground mb-1">Email:</div>
                                            <div className="font-medium">{withdrawal.user.email}</div>
                                        </div>
                                        {withdrawal.user.personalInfo && (
                                            <>
                                                <div>
                                                    <div className="text-muted-foreground mb-1">Nombre completo:</div>
                                                    <div className="font-medium">
                                                        {withdrawal.user.personalInfo.firstName} {withdrawal.user.personalInfo.lastName}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-muted-foreground mb-1">Documento:</div>
                                                    <div className="font-medium">{withdrawal.user.personalInfo.documentNumber}</div>
                                                </div>
                                            </>
                                        )}
                                        {withdrawal.user.contactInfo && withdrawal.user.contactInfo.phone && (
                                            <div>
                                                <div className="text-muted-foreground mb-1">Teléfono:</div>
                                                <div className="font-medium">{withdrawal.user.contactInfo.phone}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Información del revisor si existe */}
                                {withdrawal.reviewedBy && (
                                    <div className="bg-muted/30 p-4 rounded-lg border">
                                        <div className="flex items-center gap-2 mb-3">
                                            <UserRound className="h-4 w-4 text-primary" />
                                            <h3 className="text-sm font-medium">Revisado por</h3>
                                        </div>
                                        <div className="text-sm">
                                            <div className="text-muted-foreground mb-1">Email:</div>
                                            <div className="font-medium">{withdrawal.reviewedBy.email}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Resumen de puntos */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CircleDollarSign className="h-5 w-5 text-primary" />
                            Resumen de Puntos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                                <div className="text-sm text-muted-foreground mb-2">Monto total del retiro:</div>
                                <div className="text-2xl font-bold text-primary">
                                    {formatCurrency(withdrawal.amount)}
                                </div>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <div className="text-sm font-medium mb-3">Detalles de puntos utilizados</div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total de puntos:</span>
                                        <span className="font-medium">{withdrawal.withdrawalPoints?.items.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de puntos utilizados */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                        Puntos Utilizados
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <WithdrawalPointsList
                        points={points}
                        pointsMeta={pointsMeta}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handleItemsPerPageChange}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            {/* Modales */}
            <ApproveWithdrawalModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onApprove={handleApprove}
                withdrawal={withdrawal}
                isSubmitting={isProcessing}
            />

            <RejectWithdrawalModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onReject={handleReject}
                withdrawal={withdrawal}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                isSubmitting={isProcessing}
            />

            <WithdrawalResponseModal
                isOpen={isResponseModalOpen}
                onClose={closeResponseModal}
                approveResponse={approveResponse}
                rejectResponse={rejectResponse}
                onViewAllWithdrawals={() => router.push('/admin/retiros')}
            />
        </div>
    );
}
