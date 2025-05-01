import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Notification } from "@/types/notifications/notification.type";
import { motion } from "framer-motion";
import { ChevronRight, Eye, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatDate, getNotificationIcon } from "../utils/notificationUtils";

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: number) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onClick: (notification: Notification) => void;
}

export default function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete,
    onClick,
}: NotificationItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isMarkingRead, setIsMarkingRead] = useState(false);

    const handleMarkAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (notification.isRead) return;

        setIsMarkingRead(true);
        try {
            await onMarkAsRead(notification.id);
        } finally {
            setIsMarkingRead(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        setIsDeleting(true);
        try {
            await onDelete(notification.id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 border rounded-lg transition-all hover:bg-muted/30 cursor-pointer ${!notification.isRead ? "bg-primary/5 border-primary/10" : ""
                }`}
            onClick={() => onClick(notification)}
        >
            <div className="flex gap-4">
                <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${notification.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    }`}>
                    {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className={`text-base font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                            {notification.title}
                            {!notification.isRead && (
                                <span className="ml-2 inline-block h-2 w-2 bg-primary rounded-full"></span>
                            )}
                        </h4>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground hidden sm:block">
                                {formatDate(notification.createdAt)}
                            </span>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {!notification.isRead && (
                                        <DropdownMenuItem
                                            onClick={handleMarkAsRead}
                                            disabled={isMarkingRead}
                                            className="gap-2"
                                        >
                                            {isMarkingRead ? (
                                                <span className="animate-spin">⏳</span>
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                            <span>Marcar como leída</span>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="text-red-600 dark:text-red-400 gap-2"
                                    >
                                        {isDeleting ? (
                                            <span className="animate-spin">⏳</span>
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                        <span>Eliminar</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <p className={`mt-1 ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                        {notification.message}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground block sm:hidden">
                            {formatDate(notification.createdAt)}
                        </span>

                        {notification.actionUrl && (
                            <span className="text-xs flex items-center text-primary ml-auto">
                                Ver detalle <ChevronRight className="h-3 w-3 ml-1" />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}