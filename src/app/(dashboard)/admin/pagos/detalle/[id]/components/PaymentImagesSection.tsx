import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentImageResponse } from "@/types/payment/payment-detail.type";
import { formatCurrency } from "@/utils/format-currency.utils";
import { format } from "date-fns";
import { Building, ImageIcon } from "lucide-react";
import Image from "next/image";

interface PaymentImagesSectionProps {
    images: PaymentImageResponse[];
    onImageClick: (url: string) => void;
}

export default function PaymentImagesSection({
    images,
    onImageClick,
}: PaymentImagesSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Comprobantes
                </CardTitle>
            </CardHeader>
            <CardContent>
                {images.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="border rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                                onClick={() => onImageClick(image.url)}
                            >
                                <div className="w-full h-36 relative bg-muted">
                                    <Image
                                        width={500}
                                        height={500}
                                        src={image.url}
                                        alt={`Comprobante #${image.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all group">
                                        <div className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all">
                                            <ImageIcon className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 bg-muted/30 text-xs">
                                    <div className="flex items-center gap-1 text-primary/70 mb-1">
                                        <Building className="h-3 w-3 flex-shrink-0" />
                                        <p className="font-medium truncate">{image.bankName || "Banco"}</p>
                                    </div>
                                    <p className="font-medium truncate">
                                        {image.transactionReference}
                                    </p>
                                    <div className="flex justify-between mt-1 text-muted-foreground">
                                        <span>{formatCurrency(image.amount)}</span>
                                        <span>
                                            {format(
                                                new Date(image.transactionDate),
                                                "dd/MM/yyyy"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 text-muted-foreground">
                        No hay comprobantes adjuntos
                    </div>
                )}
            </CardContent>
        </Card>
    );
}