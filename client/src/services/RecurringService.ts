import AxiosInstance from "./AxiosInstance";
import type {
    RecurringOrderPagination,
    RecurringOrder,
    StoreRecurringOrderPayload,
    UpdateRecurringOrderPayload,
} from "../interfaces/RecurringInterfaces";

const RecurringService = {
    loadRecurring: async (params?: {
        page?:   number;
        search?: string;
    }): Promise<{ recurring: RecurringOrderPagination }> => {
        const response = await AxiosInstance.get("/admin/recurring", { params });
        return response.data;
    },

    storeRecurring: async (
        payload: StoreRecurringOrderPayload
    ): Promise<{ message: string; recurring: RecurringOrder }> => {
        const response = await AxiosInstance.post("/admin/recurring", payload);
        return response.data;
    },

    updateRecurring: async (
        recurringId: number,
        payload: UpdateRecurringOrderPayload
    ): Promise<{ message: string; recurring: RecurringOrder }> => {
        const response = await AxiosInstance.put(
            `/admin/recurring/${recurringId}`,
            payload
        );
        return response.data;
    },

    toggleActive: async (
        recurringId: number
    ): Promise<{ message: string; is_active: boolean }> => {
        const response = await AxiosInstance.patch(
            `/admin/recurring/${recurringId}/toggle`
        );
        return response.data;
    },

    destroyRecurring: async (
        recurringId: number
    ): Promise<{ message: string }> => {
        const response = await AxiosInstance.delete(
            `/admin/recurring/${recurringId}`
        );
        return response.data;
    },
};

export default RecurringService;