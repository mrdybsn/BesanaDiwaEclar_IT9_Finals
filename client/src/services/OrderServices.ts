import type { Order, OrderPagination, StoreOrderPayload, UpdateOrderPayload, UpdateOrderStatusPayload } from "../interfaces/OrderInterfaces";
import AxiosInstance from "./AxiosInstance";

const OrderService = {
    loadOrders: async (params?: {
        search?:     string;
        order_type?: string;
        category?:   "walkin" | "delivery" | "recurring";
        status?:     string;
        date_from?:  string;
        date_to?:    string;
        page?:       number;
    }): Promise<{ orders: OrderPagination }> => {
        const response = await AxiosInstance.get("/admin/orders", { params });
        return response.data;
    },

    getOrder: async (orderId: number): Promise<{ order: Order }> => {
        const response = await AxiosInstance.get(`/admin/orders/${orderId}`);
        return response.data;
    },

    storeOrder: async (
        payload: StoreOrderPayload & {
            customer_name?:    string;
            customer_contact?: string;
            customer_address?: string;
        }
    ): Promise<{ message: string; order: Order }> => {
        const response = await AxiosInstance.post("/admin/orders", payload);
        return response.data;
    },

    updateOrder: async (
        orderId: number,
        payload: UpdateOrderPayload
    ): Promise<{ message: string; order: Order }> => {
        const response = await AxiosInstance.put(
            `/admin/orders/${orderId}`,
            payload
        );
        return response.data;
    },

    updateStatus: async (
        orderId: number,
        payload: UpdateOrderStatusPayload
    ): Promise<{ message: string; status: string }> => {
        const response = await AxiosInstance.patch(
            `/admin/orders/${orderId}/status`,
            payload
        );
        return response.data;
    },

    destroyOrder: async (
        orderId: number
    ): Promise<{ message: string }> => {
        const response = await AxiosInstance.delete(
            `/admin/orders/${orderId}`
        );
        return response.data;
    },
};

export default OrderService;