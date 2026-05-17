import type { FC } from "react";

export type NotificationType =
    | "low_stock"
    | "jug_debt"
    | "delivery"
    | "payment"
    | "off_route"
    | "general";

export interface Notification {
    notification_id: number;
    type: NotificationType;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationCardProps {
    notification: Notification;
    onMarkRead: (id: number) => void;
}

const typeConfig: Record<NotificationType, { icon: string; color: string; bg: string }> = {
    low_stock: { icon: "⚠️", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
    jug_debt:  { icon: "🪣", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
    delivery:  { icon: "🚴", color: "text-blue-700",   bg: "bg-blue-50 border-blue-200"   },
    payment:   { icon: "💵", color: "text-green-700",  bg: "bg-green-50 border-green-200"  },
    off_route: { icon: "📍", color: "text-red-700",    bg: "bg-red-50 border-red-200"      },
    general:   { icon: "🔔", color: "text-gray-700",   bg: "bg-gray-50 border-gray-200"    },
};

const NotificationCard: FC<NotificationCardProps> = ({ notification, onMarkRead }) => {
    const config = typeConfig[notification.type];

    return (
        <div className={`rounded-xl border p-4 flex items-start gap-3 transition-opacity ${
            notification.is_read ? "opacity-60" : ""
        } ${config.bg}`}>
            {/* Icon */}
            <div className="text-2xl shrink-0 mt-0.5">
                {config.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-snug ${config.color}`}>
                    {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {notification.created_at}
                </p>
            </div>

            {/* Mark as read */}
            {!notification.is_read && (
                <button
                    type="button"
                    onClick={() => onMarkRead(notification.notification_id)}
                    className="shrink-0 text-xs text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap"
                >
                    Mark read
                </button>
            )}

            {notification.is_read && (
                <span className="shrink-0 text-xs text-gray-300">
                    Read
                </span>
            )}
        </div>
    );
};

export default NotificationCard;