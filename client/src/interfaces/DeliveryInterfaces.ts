// interfaces/DeliveryInterfaces.ts

export interface Rider {
    user_id:    number;
    first_name: string;
    last_name:  string;
}

export interface Delivery {
    delivery_id:      number;
    order_id:         number;
    rider_id:         number | null;
    scheduled_date:   string;
    status:           "pending" | "assigned" | "in_transit" | "delivered" | "failed";
    expected_amount:  number;
    collected_amount: number;
    notes:            string | null;
    is_deleted:       boolean;
    created_at:       string;
    updated_at:       string;
    rider?:           Rider | null;
    order?: {
        order_id:     number;
        order_type:   string;
        total_amount: number;
        delivery_address: string | null;
        order_items?: {
            quantity:  number;
            product?: { name: string; size: string };
        }[];
    };
}

export interface DeliveryPagination {
    data:         Delivery[];
    current_page: number;
    last_page:    number;
    per_page:     number;
    total:        number;
}

export interface UpdateDeliveryPayload {
    rider_id:        number;
    scheduled_date:  string;
    expected_amount?: number;
    notes?:          string;
}