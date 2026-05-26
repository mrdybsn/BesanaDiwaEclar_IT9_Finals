import AxiosInstance from "./AxiosInstance";

export type NotificationType =
    | "low_stock"
    | "jug_debt"
    | "delivery"
    | "payment"
    | "off_route"
    | "lost_item"
    | "general";

export interface AppNotification {
    notification_id: number;
    type: NotificationType | string;
    title?: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

const NotificationService = {
    load: async (): Promise<{ notifications: AppNotification[]; unread_count: number }> => {
        const response = await AxiosInstance.get("/notifications");
        return response.data;
    },

    markRead: async (notificationId: number) => {
        const response = await AxiosInstance.patch(`/notifications/${notificationId}/read`);
        return response.data;
    },

    markAllRead: async () => {
        const response = await AxiosInstance.patch("/notifications/read-all");
        return response.data;
    },
};

export default NotificationService;
