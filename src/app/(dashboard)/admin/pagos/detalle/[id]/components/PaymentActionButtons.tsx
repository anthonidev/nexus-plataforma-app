import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface PaymentActionButtonsProps {
    onApprove: () => void;
    onReject: () => void;
}

export default function PaymentActionButtons({
    onApprove,
    onReject,
}: PaymentActionButtonsProps) {
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
}