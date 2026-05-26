import AxiosInstance from "./AxiosInstance";

export interface GallonDebt {
    gallon_debt_id: number;
    customer_id: number;
    gallons_borrowed: number;
    gallons_returned: number;
    gallons_owed: number;
    notes?: string;
    customer?: { customer_id: number; first_name: string; last_name: string; contact_number?: string };
}

const GallonDebtService = {
    loadDebts: async (params?: { search?: string; page?: number }) => {
        const response = await AxiosInstance.get("/admin/gallon-debts", { params });
        return response.data;
    },

    resolveDebt: async (debtId: number) => {
        const response = await AxiosInstance.patch(`/admin/gallon-debts/${debtId}/resolve`);
        return response.data;
    },
};

export default GallonDebtService;
