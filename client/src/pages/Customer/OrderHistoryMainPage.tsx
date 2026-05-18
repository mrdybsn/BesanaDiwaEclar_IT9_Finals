import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewOrderModal from "./components/ViewOrderModal";
import ActiveOrderList from "./components/ActiveOrderList";
import PastOrderList from "./components/PastOrderList";

export interface OrderItem {
    name: string;
    size: string;
    quantity: number;
    subtotal: number;
}

export interface Order {
    order_id: number;
    order_type: "one_time" | "recurring";
    status: "pending" | "confirmed" | "in_transit" | "delivered" | "cancelled";
    payment_method: "cash" | "gcash" | "maya";
    payment_status: "unpaid" | "paid";
    total_amount: number;
    delivery_address: string;
    contact_number: string;
    preferred_date?: string;
    preferred_day?: string;
    notes?: string;
    placed_at: string;
    estimated_arrival?: string;
    items: OrderItem[];
}

export const MOCK_ORDERS: Order[] = [
    {
        order_id: 1005,
        order_type: "one_time",
        status: "in_transit",
        payment_method: "cash",
        payment_status: "unpaid",
        total_amount: 220,
        delivery_address: "Brgy. Baybay, Roxas City, Capiz",
        contact_number: "09171234567",
        preferred_date: "2026-05-18",
        notes: "Leave at gate if no one's home",
        placed_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        estimated_arrival: "10:45 AM",
        items: [
            { name: "Purified Water", size: "5gal (Exchange)", quantity: 2, subtotal: 70 },
            { name: "Purified Water", size: "1L", quantity: 5, subtotal: 75 },
        ],
    },
    {
        order_id: 1004,
        order_type: "recurring",
        status: "delivered",
        payment_method: "gcash",
        payment_status: "paid",
        total_amount: 185,
        delivery_address: "Brgy. Baybay, Roxas City, Capiz",
        contact_number: "09171234567",
        preferred_day: "monday",
        placed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        items: [
            { name: "Purified Water", size: "5gal (New Container)", quantity: 1, subtotal: 185 },
        ],
    },
    {
        order_id: 1003,
        order_type: "one_time",
        status: "delivered",
        payment_method: "cash",
        payment_status: "paid",
        total_amount: 140,
        delivery_address: "Brgy. Baybay, Roxas City, Capiz",
        contact_number: "09171234567",
        preferred_date: "2026-05-10",
        placed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        items: [
            { name: "Purified Water", size: "5gal (Exchange)", quantity: 2, subtotal: 70 },
            { name: "Purified Water", size: "500ml", quantity: 7, subtotal: 70 },
        ],
    },
    {
        order_id: 1002,
        order_type: "one_time",
        status: "cancelled",
        payment_method: "maya",
        payment_status: "unpaid",
        total_amount: 35,
        delivery_address: "Brgy. Baybay, Roxas City, Capiz",
        contact_number: "09171234567",
        preferred_date: "2026-05-05",
        placed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        items: [
            { name: "Purified Water", size: "5gal (Exchange)", quantity: 1, subtotal: 35 },
        ],
    },
];

type Tab = "active" | "history";

const OrderHistoryMainPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>("active");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        document.title = "My Orders";
    }, []);

    const activeOrders = MOCK_ORDERS.filter(
        (o) => o.status === "pending" || o.status === "confirmed" || o.status === "in_transit"
    );
    const pastOrders = MOCK_ORDERS.filter(
        (o) => o.status === "delivered" || o.status === "cancelled"
    );

    const handleView = (order: Order) => {
        setSelectedOrder(order);
        setIsViewOpen(true);
    };

    const handleTrack = (orderId: number) => {
        navigate(`/shop/track/${orderId}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                        Customer
                    </p>
                    <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/shop")}
                    className="text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                    + New Order
                </button>
            </div>

            <div className="flex border-b border-gray-200 mb-5">
                {([
                    { key: "active",  label: "My Orders",     count: activeOrders.length },
                    { key: "history", label: "Order History",  count: pastOrders.length },
                ] as { key: Tab; label: string; count: number }[]).map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold cursor-pointer border-b-2 transition-colors ${
                            activeTab === tab.key
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                                activeTab === tab.key
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-400"
                            }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {activeTab === "active" ? (
                <ActiveOrderList
                    orders={activeOrders}
                    onView={handleView}
                    onTrack={handleTrack}
                />
            ) : (
                <PastOrderList
                    orders={pastOrders}
                    onView={handleView}
                />
            )}

            <ViewOrderModal
                isOpen={isViewOpen}
                order={selectedOrder}
                onClose={() => {
                    setIsViewOpen(false);
                    setSelectedOrder(null);
                }}
                onTrack={handleTrack}
            />
        </div>
    );
};

export default OrderHistoryMainPage;