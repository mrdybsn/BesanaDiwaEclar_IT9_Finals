import AxiosInstance from "./AxiosInstance";
import type { DeliveryTask } from "../pages/Rider/RiderTasksMainPage";
import type { CollectionDelivery } from "../pages/Rider/RiderCollectionMainPage";
import type { ActiveDelivery } from "../pages/Rider/RiderMapMainPage";
import type { RecurringDelivery } from "../pages/Rider/RiderWeeklyScheduleMainPage";

export interface ApiDelivery {
    delivery_id: number;
    status: string;
    scheduled_date: string;
    expected_amount: number;
    collected_amount?: number | string | null;
    recurring_order_id?: number | null;
    notes?: string;
    order?: {
        delivery_address?: string;
        payment_method?: string;
        payment_status?: string;
        gps_lat?: number | string | null;
        gps_lng?: number | string | null;
        customer?: {
            first_name: string;
            last_name: string;
            contact_number?: string;
            address?: string;
        };
        notes?: string;
        order_items?: OrderLine[];
        orderItems?: OrderLine[];
    };
}

type OrderLine = {
    quantity: number;
    product?: { name: string; size: string };
};

export const hasValidGps = (lat?: number | string | null, lng?: number | string | null) => {
    const la = Number(lat);
    const ln = Number(lng);
    return Number.isFinite(la) && Number.isFinite(ln);
};

const getOrderItems = (order?: ApiDelivery["order"]): OrderLine[] => {
    if (!order) return [];
    return order.order_items ?? order.orderItems ?? [];
};

export const mapOrderItems = (order?: ApiDelivery["order"]) =>
    getOrderItems(order).map((item) => ({
        name: item.product?.name ?? "Product",
        size: item.product?.size ?? "",
        quantity: item.quantity,
    }));

const mapStatus = (status: string): DeliveryTask["status"] => {
    if (status === "assigned") return "assigned";
    if (status === "in_transit") return "in_transit";
    if (status === "delivered") return "delivered";
    return "pending";
};

const isPaid = (d: ApiDelivery) => {
    const collected = Number(d.collected_amount ?? 0);
    if (collected > 0) return true;
    return d.order?.payment_status === "paid";
};

export const mapApiDeliveryToTask = (d: ApiDelivery): DeliveryTask => {
    const customer = d.order?.customer;
    const orderNotes = d.order?.notes;
    const deliveryNotes = d.notes;
    const combinedNotes = [deliveryNotes, orderNotes].filter(Boolean).join(" — ");

    return {
        delivery_id: d.delivery_id,
        customer_name: customer
            ? `${customer.first_name} ${customer.last_name}`.trim()
            : "Customer",
        contact_number: customer?.contact_number ?? "—",
        delivery_address:
            d.order?.delivery_address?.trim() ||
            customer?.address?.trim() ||
            "—",
        order_items: mapOrderItems(d.order),
        total_amount: Number(d.expected_amount ?? 0),
        payment_method: d.order?.payment_method ?? "cash",
        is_recurring: Boolean(d.recurring_order_id),
        payment_status: d.recurring_order_id
            ? "unpaid"
            : isPaid(d)
              ? "paid"
              : "unpaid",
        status: mapStatus(d.status),
        scheduled_date: d.scheduled_date,
        notes: combinedNotes || undefined,
    };
};

export const mapApiDeliveryToCollection = (d: ApiDelivery): CollectionDelivery => {
    const task = mapApiDeliveryToTask(d);
    const collected = Number(d.collected_amount ?? 0);
    return {
        delivery_id: d.delivery_id,
        customer_name: task.customer_name,
        contact_number: task.contact_number,
        delivery_address: task.delivery_address,
        order_items: task.order_items,
        expected_amount: task.total_amount,
        collected_amount: collected > 0 ? collected : null,
        payment_method: task.payment_method,
        payment_status: task.payment_status,
        is_recurring: task.is_recurring,
        status: task.status === "delivered" ? "delivered" : "in_transit",
    };
};

export const mapApiDeliveryToActive = (d: ApiDelivery): ActiveDelivery => {
    const task = mapApiDeliveryToTask(d);
    const lat = Number(d.order?.gps_lat);
    const lng = Number(d.order?.gps_lng);
    const valid = hasValidGps(lat, lng);
    return {
        delivery_id: d.delivery_id,
        customer_name: task.customer_name,
        contact_number: task.contact_number,
        delivery_address: task.delivery_address,
        gps_lat: valid ? lat : 0,
        gps_lng: valid ? lng : 0,
        has_valid_gps: valid,
        order_items: task.order_items,
        total_amount: task.total_amount,
        payment_method: task.payment_method,
        payment_status: task.payment_status,
        is_recurring: task.is_recurring,
        status:
            task.status === "delivered"
                ? "delivered"
                : task.status === "in_transit"
                  ? "in_transit"
                  : "pending",
    };
};

const dayFromDate = (dateStr: string): RecurringDelivery["day_of_week"] => {
    const d = new Date(`${dateStr}T12:00:00`);
    return d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() as RecurringDelivery["day_of_week"];
};

export const mapApiDeliveryToSchedule = (d: ApiDelivery): RecurringDelivery => {
    const task = mapApiDeliveryToTask(d);
    const items = getOrderItems(d.order);
    const first = items[0];
    const productName = first?.product?.name ?? "Product";
    const productSize = first?.product?.size ?? "";
    const active = !["delivered", "failed"].includes(d.status);

    return {
        recurring_id: d.delivery_id,
        customer_name: task.customer_name,
        contact_number: task.contact_number,
        delivery_address: task.delivery_address,
        product_name: productName,
        product_size: productSize,
        quantity: items.reduce((sum, i) => sum + i.quantity, 0) || 1,
        day_of_week: dayFromDate(d.scheduled_date),
        is_active: active,
        notes: d.notes,
        estimated_amount: task.total_amount,
        gallon_exchange: productSize.toLowerCase().includes("exchange"),
    };
};

type DeliveryQuery = { scope?: "active" | "today"; date?: string };

const RiderDeliveryService = {
    loadMyDeliveries: async (query?: DeliveryQuery) => {
        const response = await AxiosInstance.get<{ deliveries: ApiDelivery[] }>("/rider/deliveries", {
            params: query?.date
                ? { scope: "today", date: query.date }
                : { scope: query?.scope ?? "active" },
        });
        return (response.data.deliveries ?? []).map(mapApiDeliveryToTask);
    },

    loadRawDeliveries: async (query?: DeliveryQuery) => {
        const response = await AxiosInstance.get<{ deliveries: ApiDelivery[] }>("/rider/deliveries", {
            params: query?.date
                ? { scope: "today", date: query.date }
                : { scope: query?.scope ?? "active" },
        });
        return response.data.deliveries ?? [];
    },

    loadTodayDeliveries: async () => {
        const today = new Date().toISOString().split("T")[0];
        return RiderDeliveryService.loadRawDeliveries({ scope: "today", date: today });
    },

    loadWeeklySchedule: async () => {
        const response = await AxiosInstance.get<{ deliveries: ApiDelivery[] }>("/rider/schedule");
        return (response.data.deliveries ?? []).map(mapApiDeliveryToSchedule);
    },

    markDelivered: async (deliveryId: number, collectedAmount: number, notes?: string) => {
        const response = await AxiosInstance.patch<{
            message: string;
            gallon_debt?: {
                gallons_owed: number;
                customer_id: number;
                customer_name: string | null;
            } | null;
        }>(`/rider/deliveries/${deliveryId}/delivered`, {
            collected_amount: collectedAmount,
            notes,
        });
        return response.data;
    },

    /** Prepaid one-time delivery — no cash collection at the door. */
    markCompletePrepaid: async (deliveryId: number, notes?: string) => {
        const response = await AxiosInstance.patch<{
            message: string;
            gallon_debt?: {
                gallons_owed: number;
                customer_id: number;
                customer_name: string | null;
            } | null;
        }>(`/rider/deliveries/${deliveryId}/delivered`, {
            collected_amount: 0,
            complete_only: true,
            notes,
        });
        return response.data;
    },

    markFailed: async (deliveryId: number, notes: string) => {
        const response = await AxiosInstance.patch(`/rider/deliveries/${deliveryId}/failed`, { notes });
        return response.data;
    },

    updateGPS: async (deliveryId: number, lat: number, lng: number) => {
        const response = await AxiosInstance.patch(`/rider/deliveries/${deliveryId}/gps`, {
            rider_gps_lat: lat,
            rider_gps_lng: lng,
        });
        return response.data;
    },
};

export default RiderDeliveryService;
