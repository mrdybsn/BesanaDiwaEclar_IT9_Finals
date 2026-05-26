import AxiosInstance from "./AxiosInstance";
import type { LostItemReport } from "../pages/Rider/RiderLostItemMainPage";

export interface LostItemFormData {
    delivery_id?: number;
    item_description: string;
    item_type: "gallon" | "cap" | "seal" | "other";
    quantity: number;
    notes?: string;
}

interface ApiReport {
    report_id: number;
    customer_name: string;
    delivery_address?: string;
    item_description: string;
    item_type: LostItemReport["item_type"];
    quantity: number;
    notes?: string;
    status: LostItemReport["status"];
    created_at: string;
}

const formatReportedAt = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
};

const mapReport = (r: ApiReport): LostItemReport => ({
    report_id: r.report_id,
    customer_name: r.customer_name,
    delivery_address: r.delivery_address ?? "—",
    item_description: r.item_description,
    item_type: r.item_type,
    quantity: r.quantity,
    notes: r.notes ?? "",
    reported_at: formatReportedAt(r.created_at),
    status: r.status,
});

const LostItemService = {
    loadReports: async (): Promise<LostItemReport[]> => {
        const response = await AxiosInstance.get<{ reports: ApiReport[] }>("/rider/lost-items");
        return (response.data.reports ?? []).map(mapReport);
    },

    storeReport: async (data: LostItemFormData) => {
        const response = await AxiosInstance.post("/rider/lost-items", data);
        return response.data;
    },
};

export default LostItemService;
