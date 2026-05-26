export interface InventoryItem {
    inventory_item_id: number;
    item_name: string;
    category: string;
    quantity: number;
    unit: string;
    low_stock_threshold: number;
}

export type InventoryFieldErrors = Partial<Record<string, string[]>>;
