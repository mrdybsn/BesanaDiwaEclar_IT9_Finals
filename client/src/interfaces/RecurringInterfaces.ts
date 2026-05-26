export interface RecurringOrder {
    recurring_order_id: number;
    customer_id:        number;
    product_id:         number;
    quantity:           number;
    day_of_week:        string;
    delivery_address:   string;
    notes:              string | null;
    is_active:          boolean;
    is_deleted:         boolean;
    created_at:         string;
    updated_at:         string;
    customer: {
        user_id:    number;
        first_name: string;
        last_name:  string;
    };
    product: {
        product_id: number;
        name:       string;
        price:      number;
        size:       string;   
    };
}


export interface RecurringOrderPagination {
    data:         RecurringOrder[];
    current_page: number;
    last_page:    number;
    per_page:     number;
    total:        number;
}

export interface StoreRecurringOrderPayload {
    product_id:       number;
    quantity:         number;
    day_of_week:      "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    delivery_address: string;
    notes?:           string;
}

export interface UpdateRecurringOrderPayload {
    quantity:         number;
    day_of_week:      "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
    delivery_address: string;
    notes?:           string;
}