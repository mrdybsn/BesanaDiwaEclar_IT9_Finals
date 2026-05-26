import AxiosInstance from "./AxiosInstance";

export interface Remittance {
    remittance_id: number;
    rider_id: number;
    delivery_id: number;
    date: string;
    collected_amount: number;
    remitted_amount: number;
    status: "pending" | "verified" | "discrepancy";
    notes?: string;
    rider?: { user_id: number; first_name: string; last_name: string };
    delivery?: { delivery_id: number; order?: { order_id: number } };
}

const RemittanceService = {
    loadRemittances: async (params?: {
        search?: string;
        status?: string;
        date?: string;
        date_from?: string;
        date_to?: string;
        rider_id?: number;
        page?: number;
        per_page?: number;
    }) => {
        const response = await AxiosInstance.get("/admin/remittances", { params });
        return response.data;
    },

    verifyRemittance: async (remittanceId: number, payload: { remitted_amount: number; notes?: string }) => {
        const response = await AxiosInstance.patch(`/admin/remittances/${remittanceId}/verify`, payload);
        return response.data;
    },
};

export default RemittanceService;
