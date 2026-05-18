import type { Order } from "../OrderHistoryMainPage";

interface PastOrderListProps {
    orders: Order[];
    onView: (order: Order) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    delivered: { label: "Delivered", className: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-600" },
};

const PastOrderList = ({ orders, onView }: PastOrderListProps) => {
    if (orders.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-5xl mb-3">🧾</p>
                <p className="text-base font-semibold text-gray-700 mb-1">No past orders</p>
                <p className="text-sm text-gray-400">Completed orders will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => {
                const status = statusConfig[order.status];
                const formattedDate = new Date(order.placed_at).toLocaleString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });
                const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

                return (
                    <div
                        key={order.order_id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
                    >
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-2xl">
                            💧
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800">
                                Order #{order.order_id}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {formattedDate} · {totalItems} item{totalItems > 1 ? "s" : ""}
                            </p>
                            <p className="text-xs font-semibold text-blue-600 mt-0.5">
                                ₱{order.total_amount.toFixed(2)}
                            </p>
                        </div>

                        {/* Status + View */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                                {status.label}
                            </span>
                            <button
                                type="button"
                                onClick={() => onView(order)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                            >
                                View →
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default PastOrderList;