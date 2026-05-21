export type ProductSize = "500ml" | "1L" | "5gal" | "custom";

export interface ProductColumns {
    product_id: number;
    image?: string | null;
    name: string;
    size: ProductSize;
    unit: string;
    price: string | number;
    price_per_liter: string | number;
    custom_volume_ml?: number | null;
    container_deposit: string | number;
    stock: number;
    low_stock_threshold: number;
    is_available: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductFieldErrors {
    image?: string[];
    name?: string[];
    size?: string[];
    unit?: string[];
    price?: string[];
    price_per_liter?: string[];
    custom_volume_ml?: string[];
    container_deposit?: string[];
    stock?: string[];
    low_stock_threshold?: string[];
    is_available?: string[];
}