import { Notification } from "@/types/notifications/notification.type";
import { AnimatePresence } from "framer-motion";
import { EmptyNotifications } from "./EmptyNotifications";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
    notifications: Notification[];
    onMarkAsRead: (id: number) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onNotificationClick: (notification: Notification) => void;
}

export default function NotificationList({
    notifications,
    onMarkAsRead,
    onDelete,
    onNotificationClick,
}: NotificationListProps) {
    if (notifications.length === 0) {
        return <EmptyNotifications />;
    }

    return (
        <div className="space-y-3">
            <AnimatePresence initial={false}>
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={onMarkAsRead}
                        onDelete={onDelete}
                        onClick={onNotificationClick}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}