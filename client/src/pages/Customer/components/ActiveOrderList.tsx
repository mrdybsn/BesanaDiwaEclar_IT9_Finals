import type { Order } from "../OrderHistoryMainPage";

interface ActiveOrderListProps {
    orders: Order[];
    onView: (order: Order) => void;
    onTrack: (orderId: number) => void;
}

const productImageMap: Record<string, string> = {
    "500ml": "https://images.unsplash.com/photo-1536939459926-301728717817?w=80&q=80",
    "1L": "https://images.unsplash.com/photo-1624958723474-76cfe7a7c44e?w=80&q=80",
    "5gal (Exchange)": "https://images.unsplash.com/photo-1563351672-62b74891a28a?w=80&q=80",
    "5gal (New Container)": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=80&q=80",
};

const statusConfig: Record<string, { label: string; color: string }> = {
    pending:    { label: "Normal Order",  color: "text-blue-500" },
    confirmed:  { label: "Confirmed",     color: "text-green-500" },
    in_transit: { label: "Out for Delivery", color: "text-blue-600" },
};

const ActiveOrderList = ({ orders, onView, onTrack }: ActiveOrderListProps) => {
    if (orders.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-5xl mb-3">📦</p>
                <p className="text-base font-semibold text-gray-700 mb-1">No active orders</p>
                <p className="text-sm text-gray-400">Your active orders will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => {
                const status = statusConfig[order.status];
                const formattedDate = new Date(order.placed_at).toLocaleString("en-PH", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                }).toUpperCase();

                return (
                    <div
                        key={order.order_id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                    >
                        {/* Date + Order ID */}
                        <p className="text-xs font-bold text-gray-500 mb-0.5">
                            {formattedDate}
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                            Order ID ({order.order_id})
                        </p>

                        {/* Order Type */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-gray-500">Order Type</p>
                            <p className={`text-xs font-semibold ${status.color}`}>
                                {status.label}
                            </p>
                        </div>

                        {/* Items */}
                        <div className="space-y-3 mb-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                                        <img
                                            src={productImageMap[item.size]}
                                            alt={item.size}
                                            className="w-full h-full object-cover rounded-xl"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-800">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-400">({item.size})</p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-600 shrink-0">
                                        {item.quantity} {item.quantity === 1 ? "Bottle" : "Bottles"}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-gray-200 pt-3 mb-3">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-bold text-gray-700">Total Cost</p>
                                <p className="text-base font-extrabold text-blue-600">
                                    ₱{order.total_amount.toFixed(2)}
                                </p>
                            </div>
                            {order.estimated_arrival && (
                                <div className="mt-2">
                                    <p className="text-xs text-gray-400">Estimated Arrival</p>
                                    <p className="text-xs font-medium text-gray-600">
                                        {order.estimated_arrival}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onView(order)}
                                className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl cursor-pointer transition-colors"
                            >
                                View Order
                            </button>
                            {(order.status === "in_transit" || order.status === "confirmed") && (
                                <button
                                    type="button"
                                    onClick={() => onTrack(order.order_id)}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl cursor-pointer transition-colors"
                                >
                                    🗺 Track
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActiveOrderList;