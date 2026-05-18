import { useEffect } from "react";
import { Bell, AlertTriangle, Truck, CreditCard, GlassWater, WifiOff } from "lucide-react";
import { useNotification, type NotificationType } from "../../contexts/NotificationContext";

const notificationConfig: Record<
    NotificationType,
    { label: string; icon: React.ElementType; color: string; bg: string }
> = {
    low_stock: {
        label: "Low Stock",
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-red-50",
    },
    jug_debt: {
        label: "Jug Debt",
        icon: GlassWater,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
    },
    delivery: {
        label: "Delivery",
        icon: Truck,
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    payment: {
        label: "Payment",
        icon: CreditCard,
        color: "text-green-600",
        bg: "bg-green-50",
    },
    off_route: {
        label: "Off Route",
        icon: WifiOff,
        color: "text-orange-600",
        bg: "bg-orange-50",
    },
};

interface NotificationsPageProps {
    title?: string;
}

const NotificationsPage = ({ title = "Notifications" }: NotificationsPageProps) => {
    const { notifications, unreadCount, markRead, markAllRead } = useNotification();

    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <div className="space-y-4">

            {/* Header Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-gray-600" />
                    <h1 className="text-sm font-semibold text-gray-700">
                        {title}
                    </h1>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold">
                            {unreadCount} unread
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={markAllRead}
                        className="text-xs text-blue-600 hover:underline font-medium"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notification List */}
            <div className="space-y-2">
                {notifications.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 px-6 py-10 text-center text-sm text-gray-400">
                        No notifications found.
                    </div>
                ) : (
                    notifications.map((notif) => {
                        const config = notificationConfig[notif.type];
                        const Icon = config.icon;

                        return (
                            <div
                                key={notif.notification_id}
                                className={`flex items-start gap-4 rounded-lg border p-4 shadow-sm transition-all ${
                                    notif.is_read
                                        ? "bg-white border-gray-200"
                                        : "bg-blue-50 border-blue-200"
                                }`}
                            >
                                {/* Icon */}
                                <div className={`p-2 rounded-lg ${config.bg} shrink-0`}>
                                    <Icon size={18} className={config.color} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                                            {config.label}
                                        </span>
                                        {!notif.is_read && (
                                            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-700">{notif.message}</p>
                                    <p className="text-xs text-gray-400 mt-1">{notif.created_at}</p>
                                </div>

                                {/* Mark as Read */}
                                {!notif.is_read && (
                                    <button
                                        type="button"
                                        onClick={() => markRead(notif.notification_id)}
                                        className="text-xs text-blue-600 hover:underline font-medium shrink-0"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;