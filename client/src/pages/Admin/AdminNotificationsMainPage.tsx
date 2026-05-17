import { useEffect, useState } from "react";
import type { Notification } from "../../components/NotificationCard/NotificationCard";
import NotificationCard from "../../components/NotificationCard/NotificationCard";

const hardcodedNotifications: Notification[] = [
    {
        notification_id: 1,
        type: "low_stock",
        message: "Caps stock is critically low — only 15 units left. Threshold is 50.",
        is_read: false,
        created_at: "May 17, 2026 — 08:00 AM",
    },
    {
        notification_id: 2,
        type: "jug_debt",
        message: "Maria Santos placed a new order but has 2 unreturned gallons.",
        is_read: false,
        created_at: "May 17, 2026 — 09:15 AM",
    },
    {
        notification_id: 3,
        type: "off_route",
        message: "Rider Carlo Reyes appears to be off-route or has lost GPS signal.",
        is_read: false,
        created_at: "May 17, 2026 — 10:30 AM",
    },
    {
        notification_id: 4,
        type: "payment",
        message: "Rider Carlo Reyes submitted ₱245.00 collection for Delivery #2.",
        is_read: true,
        created_at: "May 16, 2026 — 03:45 PM",
    },
    {
        notification_id: 5,
        type: "low_stock",
        message: "Seals stock is below threshold — 8 units remaining.",
        is_read: true,
        created_at: "May 16, 2026 — 07:00 AM",
    },
];

const AdminNotificationsMainPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>(hardcodedNotifications);

    useEffect(() => {
        document.title = "Notifications — Admin";
    }, []);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const handleMarkRead = (id: number) => {
        setNotifications((prev) =>
            prev.map((n) => (n.notification_id === id ? { ...n, is_read: true } : n))
        );
    };

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    };

    return (
        <>
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                        Admin
                    </p>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Low stock alerts, jug debts, off-route warnings, and payments.
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer shrink-0"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                    <p className="text-5xl mb-3">🔔</p>
                    <p className="text-base font-semibold text-gray-700">
                        No notifications yet
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <NotificationCard
                            key={n.notification_id}
                            notification={n}
                            onMarkRead={handleMarkRead}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default AdminNotificationsMainPage;