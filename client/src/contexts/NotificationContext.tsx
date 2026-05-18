import { createContext, useContext, useState, useCallback, type FC, type ReactNode } from "react";

export type NotificationType = "low_stock" | "jug_debt" | "delivery" | "payment" | "off_route";

export interface Notification {
    notification_id: number;
    type: NotificationType;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markRead: (id: number) => void;
    markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Dummy data — replace with API call later
const initialNotifications: Notification[] = [
    {
        notification_id: 1,
        type: "low_stock",
        message: "Bottle Caps stock is below the threshold (12 remaining, threshold: 100).",
        is_read: false,
        created_at: "2026-05-16 08:12",
    },
    {
        notification_id: 2,
        type: "jug_debt",
        message: "Juan Dela Cruz placed a new order but has 3 unreturned gallon jugs.",
        is_read: false,
        created_at: "2026-05-16 08:45",
    },
    {
        notification_id: 3,
        type: "delivery",
        message: "Delivery batch #12 is scheduled for today. 8 stops assigned to Rider Carlo.",
        is_read: true,
        created_at: "2026-05-16 07:00",
    },
    {
        notification_id: 4,
        type: "payment",
        message: "Rider Carlo submitted ₱ 1,240.00 collected from today's deliveries.",
        is_read: true,
        created_at: "2026-05-16 09:30",
    },
    {
        notification_id: 5,
        type: "off_route",
        message: "Rider Maria's GPS signal was lost for more than 5 minutes.",
        is_read: false,
        created_at: "2026-05-16 10:05",
    },
    {
        notification_id: 6,
        type: "low_stock",
        message: "Sediment Filters are critically low (2 remaining, threshold: 5).",
        is_read: false,
        created_at: "2026-05-16 10:22",
    },
];

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const markRead = useCallback((id: number) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.notification_id === id ? { ...n, is_read: true } : n
            )
        );
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used inside NotificationProvider");
    return context;
};