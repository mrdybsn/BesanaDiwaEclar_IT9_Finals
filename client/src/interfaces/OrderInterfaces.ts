export interface OrderItem {
    order_item_id: number;
    order_id:      number;
    product_id:    number;
    quantity:      number;
    unit_price:    number;
    subtotal:      number;
    product?: {
        product_id: number;
        name:       string;
        size:       string;
        unit:       string;
        price:      number;
        image?:     string;
    };
}

export interface Order {
    order_id:        number;
    customer_id:     number | null;
    processed_by:    number | null;
    order_type:      "walkin" | "delivery";
    total_amount:    number;
    gallon_owned:    number;
    gallon_exchange: number;
    status:          "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
    payment_method:  "cash" | "gcash" | "maya" | "other";
    payment_status:  "unpaid" | "paid" | "partial";
    delivery_address: string | null;
    gps_lat:         number | null;
    gps_lng:         number | null;
    notes:           string | null;
    is_deleted:      boolean;
    created_at:      string;
    updated_at:      string;
    order_items?:    OrderItem[];
    customer?: {
        customer_id:     number;
        first_name:      string;
        last_name:       string;
        contact_number:  string | null;
        address:         string | null;
    };
    processed_by_user?: {
        user_id:    number;
        first_name: string;
        last_name:  string;
    };
}

export interface OrderPagination {
    data:         Order[];
    current_page: number;
    last_page:    number;
    per_page:     number;
    total:        number;
}

export interface StoreOrderPayload {
    order_type:       "walkin" | "delivery";
    payment_method:   "cash" | "gcash" | "maya" | "other";
    payment_status:   "unpaid" | "paid" | "partial";
    status?:          "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
    gallon_owned?:    number;
    gallon_exchange?: number;
    delivery_address?: string;
    gps_lat?:         number;
    gps_lng?:         number;
    notes?:           string;
    scheduled_date?:  string;
    // ── customer auto-save fields ──────────────────────────────────────────
    customer_name?:    string;
    customer_contact?: string;
    customer_address?: string;
    // ──────────────────────────────────────────────────────────────────────
    items: {
        product_id: number;
        quantity:   number;
    }[];
}

export interface UpdateOrderPayload {
    payment_method:    "cash" | "gcash" | "maya" | "other";
    payment_status:    "unpaid" | "paid" | "partial";
    delivery_address?: string;
    gps_lat?:          number;
    gps_lng?:          number;
    gallon_owned?:     number;
    gallon_exchange?:  number;
    notes?:            string;
}

export interface UpdateOrderStatusPayload {
    status: "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
}