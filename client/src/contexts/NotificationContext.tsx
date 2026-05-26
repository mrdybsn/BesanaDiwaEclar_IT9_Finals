import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type FC,
    type ReactNode,
} from "react";
import NotificationService, {
    type AppNotification,
    type NotificationType,
} from "../services/NotificationService";
import { useAuth } from "./AuthContext";

export type { NotificationType };

export interface Notification extends AppNotification {
    type: NotificationType | string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    refresh: () => Promise<void>;
    markRead: (id: number) => Promise<void>;
    markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }
        setLoading(true);
        try {
            const res = await NotificationService.load();
            setNotifications(res.notifications);
            setUnreadCount(res.unread_count);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refresh();
        const interval = setInterval(refresh, 60_000);
        return () => clearInterval(interval);
    }, [refresh]);

    const markRead = useCallback(async (id: number) => {
        try {
            await NotificationService.markRead(id);
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === id ? { ...n, is_read: true } : n
                )
            );
            setUnreadCount((c) => Math.max(0, c - 1));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }, []);

    const markAllRead = useCallback(async () => {
        try {
            await NotificationService.markAllRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, loading, refresh, markRead, markAllRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used inside NotificationProvider");
    }
    return context;
};
