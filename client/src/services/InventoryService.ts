import AxiosInstance from "./AxiosInstance";
import type { InventoryItem } from "../interfaces/InventoryInterfaces";

export interface InventoryFormData {
    item_name: string;
    category: string;
    quantity: number;
    unit: string;
    low_stock_threshold: number;
}

const InventoryService = {
    loadInventory: async (page: number, search?: string, category?: string) => {
        return AxiosInstance.get<{ items: { data: InventoryItem[]; current_page: number; last_page: number } }>(
            "/admin/inventory",
            { params: { page, search: search || undefined, category: category || undefined } }
        );
    },

    loadAlerts: async () => {
        return AxiosInstance.get<{ alerts: InventoryItem[]; count: number }>("/admin/inventory/alerts");
    },

    storeInventory: async (data: InventoryFormData) => {
        return AxiosInstance.post("/admin/inventory", data);
    },

    updateInventory: async (itemId: number, data: InventoryFormData) => {
        return AxiosInstance.put(`/admin/inventory/${itemId}`, data);
    },

    destroyInventory: async (itemId: number) => {
        return AxiosInstance.delete(`/admin/inventory/${itemId}`);
    },
};

export default InventoryService;
