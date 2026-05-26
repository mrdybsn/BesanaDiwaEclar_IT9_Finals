// services/DeliveryService.ts

import type { DeliveryPagination, UpdateDeliveryPayload, Delivery } from "../interfaces/DeliveryInterfaces";
import AxiosInstance from "./AxiosInstance";

const DeliveryService = {
    loadDeliveries: async (params?: {
        search?:     string;
        status?:     string;
        date?:       string;
        unassigned?: boolean;
        per_page?:   number;
        page?:       number;
    }): Promise<{ deliveries: DeliveryPagination }> => {
        const response = await AxiosInstance.get("/admin/deliveries", { params });
        return response.data;
    },

    updateDelivery: async (
        deliveryId: number,
        payload: UpdateDeliveryPayload
    ): Promise<{ message: string; delivery: Delivery }> => {
        const response = await AxiosInstance.put(`/admin/deliveries/${deliveryId}`, payload);
        return response.data;
    },

    updateStatus: async (
        deliveryId: number,
        status: string
    ): Promise<{ message: string; status: string }> => {
        const response = await AxiosInstance.patch(`/admin/deliveries/${deliveryId}/status`, { status });
        return response.data;
    },

    destroyDelivery: async (
        deliveryId: number
    ): Promise<{ message: string }> => {
        const response = await AxiosInstance.delete(`/admin/deliveries/${deliveryId}`);
        return response.data;
    },
};

export default DeliveryService;