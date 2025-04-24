import { Card, CardContent } from "@/components/ui/card";
import { PaymentResponse } from "@/types/payment/payment-detail.type";
import { Building, User } from "lucide-react";

interface PaymentUserSectionProps {
    payment: PaymentResponse;
}

export default function PaymentUserSection({ payment }: PaymentUserSectionProps) {
    return (
        <div className="space-y-5">
            <Card className="bg-background rounded-xl shadow-sm">
                <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium">Información del Usuario</h3>
                            <p className="text-sm text-muted-foreground">
                                Detalles del propietario del pago
                            </p>
                        </div>
                    </div>

                    <div className="pl-2 border-l-2 border-primary/20 mt-4">
                        <p className="text-sm text-muted-foreground mb-1">Email:</p>
                        <p className="text-base font-medium break-all">
                            {payment.user.email}
                        </p>
                        <p className="text-sm text-muted-foreground mt-3 mb-1">
                            Nombre completo:
                        </p>
                        <p className="text-sm">
                            {payment.user.personalInfo.firstName +
                                " " +
                                payment.user.personalInfo.lastName}{" "}
                        </p>
                        <p className="text-sm text-muted-foreground mt-3 mb-1">
                            Teléfono:
                        </p>
                        <p className="text-sm">{payment.user.contactInfo.phone}</p>
                        <p className="text-sm text-muted-foreground mt-3 mb-1">
                            Número de documento:
                        </p>
                        <p className="text-sm">
                            {payment.user.personalInfo.documentNumber ??
                                "Sin documento"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {payment.reviewedBy && (
                <Card className="bg-background rounded-xl shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Building className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-medium">Revisado por</h3>
                                <p className="text-sm text-muted-foreground">
                                    Administrador que procesó el pago
                                </p>
                            </div>
                        </div>
                        <p className="text-base font-medium mt-2">
                            {payment.reviewedBy.email}
                        </p>
                    </CardContent>
                </Card>
            )}


        </div>
    );
}