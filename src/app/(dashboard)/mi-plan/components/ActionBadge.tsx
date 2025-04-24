import { Badge } from "@/components/ui/badge";
import { MembershipHistoryItem } from "@/types/plan/membership";
import { AlertOctagon, ArrowDown, ArrowUpCircle, CheckCircle, Database, FileText, Info, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";

export const ActionIcon = ({ action }: { action: MembershipHistoryItem['action'] }) => {
    switch (action) {
        case "CREATED":
            return <FileText className="h-4 w-4 text-blue-500" />;
        case "RENEWED":
            return <RefreshCw className="h-4 w-4 text-green-500" />;
        case "CANCELLED":
            return <Trash2 className="h-4 w-4 text-red-500" />;
        case "UPGRADED":
            return <ArrowUpCircle className="h-4 w-4 text-purple-500" />;
        case "DOWNGRADED":
            return <ArrowDown className="h-4 w-4 text-amber-500" />;
        case "REACTIVATED":
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case "EXPIRED":
            return <AlertOctagon className="h-4 w-4 text-red-500" />;
        case "STATUS_CHANGED":
            return <ShieldAlert className="h-4 w-4 text-blue-500" />;
        case "PAYMENT_RECEIVED":
            return <Database className="h-4 w-4 text-green-500" />;
        default:
            return <Info className="h-4 w-4 text-gray-500" />;
    }
};

const ActionBadge = ({ action }: { action: MembershipHistoryItem['action'] }) => {
    const getActionConfig = () => {
        switch (action) {
            case "CREATED":
                return {
                    label: "Creación",
                    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40"
                };
            case "RENEWED":
                return {
                    label: "Renovación",
                    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/40"
                };
            case "CANCELLED":
                return {
                    label: "Cancelación",
                    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40"
                };
            case "UPGRADED":
                return {
                    label: "Actualización",
                    className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/40"
                };
            case "DOWNGRADED":
                return {
                    label: "Degradación",
                    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40"
                };
            case "REACTIVATED":
                return {
                    label: "Reactivación",
                    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/40"
                };
            case "EXPIRED":
                return {
                    label: "Expiración",
                    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40"
                };
            case "STATUS_CHANGED":
                return {
                    label: "Cambio de estado",
                    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40"
                };
            case "PAYMENT_RECEIVED":
                return {
                    label: "Pago recibido",
                    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/40"
                };
            default:
                return {
                    label: "Otros",
                    className: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/40"
                };
        }
    };

    const config = getActionConfig();

    return (
        <Badge variant="outline" className={`flex items-center gap-1.5 px-2 py-0.5 ${config.className}`}>
            <ActionIcon action={action} />
            <span>{config.label}</span>
        </Badge>
    );
};

export default ActionBadge;