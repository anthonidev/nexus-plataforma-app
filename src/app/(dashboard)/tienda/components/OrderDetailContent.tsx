import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { OrderDetailClientResponse } from "@/types/ecommerce/client/ecommerce.types";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, ShoppingBag, Download, CalendarClock, CreditCard, Clock, Truck, CheckCircle, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderDetailContentProps {
    orderDetail: OrderDetailClientResponse;
    isMobile: boolean;
}

export function OrderDetailContent({ orderDetail, isMobile }: OrderDetailContentProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDIENTE":
                return (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40 flex items-center gap-1.5 px-2 py-0.5">
                        <Clock className="h-3 w-3" />
                        <span>Pendiente</span>
                    </Badge>
                );
            case "APROBADO":
                return (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40 flex items-center gap-1.5 px-2 py-0.5">
                        <CheckCircle className="h-3 w-3" />
                        <span>Aprobado</span>
                    </Badge>
                );
            case "ENVIADO":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40 flex items-center gap-1.5 px-2 py-0.5">
                        <Truck className="h-3 w-3" />
                        <span>Enviado</span>
                    </Badge>
                );
            case "ENTREGADO":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40 flex items-center gap-1.5 px-2 py-0.5">
                        <CheckCircle className="h-3 w-3" />
                        <span>Entregado</span>
                    </Badge>
                );
            case "RECHAZADO":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40 flex items-center gap-1.5 px-2 py-0.5">
                        <ShieldAlert className="h-3 w-3" />
                        <span>Rechazado</span>
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        {status}
                    </Badge>
                );
        }
    };

    const getHistoryIcon = (action: string) => {
        switch (action) {
            case "CREADO":
                return <ShoppingBag className="h-4 w-4 text-primary" />;
            case "APROBADO":
                return <CheckCircle className="h-4 w-4 text-emerald-500" />;
            case "ENVIADO":
                return <Truck className="h-4 w-4 text-blue-500" />;
            case "ENTREGADO":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "RECHAZADO":
                return <ShieldAlert className="h-4 w-4 text-red-500" />;
            case "CANCELADO":
                return <ShieldAlert className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const renderTimeline = () => {
        if (!orderDetail.orderHistory?.length) return null;

        return (
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Historial del pedido</h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:h-full before:border-l-2 before:border-dashed before:border-muted-foreground/30 ml-4 pl-6">
                    {orderDetail.orderHistory.map((event, index) => (
                        <div key={event.id} className="relative">
                            <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                                {getHistoryIcon(event.action)}
                            </div>
                            <div className="pb-4">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {event.action === "CREADO" ? "Pedido creado" :
                                                event.action === "APROBADO" ? "Pedido aprobado" :
                                                    event.action === "ENVIADO" ? "Pedido enviado" :
                                                        event.action === "ENTREGADO" ? "Pedido entregado" :
                                                            event.action === "RECHAZADO" ? "Pedido rechazado" :
                                                                event.action === "CANCELADO" ? "Pedido cancelado" : event.action}
                                        </span>
                                        {index === 0 && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40">
                                                Reciente
                                            </Badge>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {format(new Date(event.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                                    </span>
                                    {event.notes && (
                                        <p className="text-sm mt-1">{event.notes}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Información del pedido */}
            <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                            <span>Información del Pedido</span>
                        </div>
                        {getStatusBadge(orderDetail.status)}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Detalles del pedido</h3>
                                <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Número de pedido:</span>
                                        <span className="text-sm font-medium">#{orderDetail.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Fecha:</span>
                                        <span className="text-sm font-medium">
                                            {format(new Date(orderDetail.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Total:</span>
                                        <span className="text-sm font-bold text-primary">
                                            {formatCurrency(orderDetail.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {renderTimeline()}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Resumen de la compra</h3>
                                <div className="bg-muted/20 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Productos:</span>
                                        <span className="text-sm font-medium">{orderDetail.totalItems}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Subtotal:</span>
                                        <span className="text-sm font-medium">
                                            {formatCurrency(orderDetail.totalAmount)}
                                        </span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Total:</span>
                                        <span className="text-sm font-bold text-primary">
                                            {formatCurrency(orderDetail.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Productos */}
            <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span>Productos</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                        <div className="p-4 space-y-4">
                            {orderDetail.orderDetails.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/20 transition-colors"
                                >
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden border flex-shrink-0">
                                        {item.productImage ? (
                                            <Image
                                                src={item.productImage}
                                                alt={item.productName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-muted flex items-center justify-center">
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-1">
                                            {item.productName}
                                        </h4>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm text-muted-foreground">
                                                {item.quantity} x {formatCurrency(item.price)}
                                            </span>
                                            <span className="text-sm font-semibold text-primary">
                                                {formatCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="flex justify-between border-t p-4">
                    <Link href="/tienda/productos">
                        <Button variant="outline" size="sm">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Seguir comprando
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}