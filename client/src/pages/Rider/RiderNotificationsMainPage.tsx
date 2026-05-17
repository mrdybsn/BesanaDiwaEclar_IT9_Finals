import { useEffect, useState } from "react";
import NotificationCard, { type Notification } from "../../components/NotificationCard/NotificationCard";

const hardcodedNotifications: Notification[] = [
    {
        notification_id: 1,
        type: "delivery",
        message: "You have 3 deliveries scheduled for today. Check your task list.",
        is_read: false,
        created_at: "May 17, 2026 — 06:00 AM",
    },
    {
        notification_id: 2,
        type: "delivery",
        message: "Reminder: Delivery #1 for Maria Santos is due at 10:00 AM.",
        is_read: false,
        created_at: "May 17, 2026 — 09:00 AM",
    },
    {
        notification_id: 3,
        type: "payment",
        message: "Your collection of ₱245.00 for Delivery #2 has been verified by staff.",
        is_read: false,
        created_at: "May 17, 2026 — 11:30 AM",
    },
    {
        notification_id: 4,
        type: "off_route",
        message: "Admin was notified of a GPS signal loss at 10:28 AM. Please check in.",
        is_read: true,
        created_at: "May 17, 2026 — 10:28 AM",
    },
    {
        notification_id: 5,
        type: "delivery",
        message: "Tomorrow's route has been auto-generated. 4 deliveries scheduled.",
        is_read: true,
        created_at: "May 16, 2026 — 08:00 PM",
    },
];

const RiderNotificationsMainPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>(hardcodedNotifications);

    useEffect(() => {
        document.title = "Notifications — Rider";
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
                        Rider
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
                        Delivery schedules, reminders, and payment confirmations.
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

export default RiderNotificationsMainPage;