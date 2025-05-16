import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentResponse } from "@/types/payment/payment-detail.type";
import { Edit, ThumbsDown, ThumbsUp } from "lucide-react";

interface PaymentActionButtonsProps {
    onApprove?: () => void;
    onReject?: () => void;
    onUpdate?: () => void;
    status: string;
}

export default function PaymentActionButtons({
    onApprove,
    onReject,
    onUpdate,
    status,
}: PaymentActionButtonsProps) {
    if (status === "PENDING") {
        return (
            <>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onReject}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Rechazar</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onApprove}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
                >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Aprobar</span>
                </Button>
            </>
        );
    } else if (status === "APPROVED" || status === "COMPLETED") {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={onUpdate}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800"
            >
                <Edit className="h-4 w-4" />
                <span>Editar información</span>
            </Button>
        );
    } else {
        return null;
    }
}