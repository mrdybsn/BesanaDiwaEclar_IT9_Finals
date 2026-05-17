import { Package, ChevronRight, RotateCcw, Clock } from "lucide-react";
import type { Order } from "../OrderHistoryMainPage";

const STATUS_META: Record<
    Order["status"],
    { label: string; chipClass: string; dot: string }
> = {
    pending:    { label: "Pending",     chipClass: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-400" },
    confirmed:  { label: "Confirmed",   chipClass: "bg-blue-100 text-blue-700",     dot: "bg-blue-500"   },
    in_transit: { label: "On the Way",  chipClass: "bg-sky-100 text-sky-700",       dot: "bg-sky-500 animate-pulse" },
    delivered:  { label: "Delivered",   chipClass: "bg-green-100 text-green-700",   dot: "bg-green-500"  },
    cancelled:  { label: "Cancelled",   chipClass: "bg-red-100 text-red-600",       dot: "bg-red-400"    },
};

const ACTIVE_STATUSES: Order["status"][] = ["pending", "confirmed", "in_transit"];

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

interface Props {
    orders: Order[];
    onView: (order: Order) => void;
    onTrack: (orderId: number) => void;
}

const OrderHistoryList = ({ orders, onView, onTrack }: Props) => {
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Package className="w-12 h-12 opacity-30 mb-3" />
                <p className="text-sm font-medium">No orders yet</p>
                <p className="text-xs mt-1">Your deliveries will appear here</p>
            </div>
        );
    }

    const active   = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
    const past     = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));

    return (
        <div className="space-y-6">
            {/* Active orders */}
            {active.length > 0 && (
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                        Active Orders
                    </h2>
                    <div className="space-y-3">
                        {active.map((order) => (
                            <OrderCard
                                key={order.order_id}
                                order={order}
                                onView={onView}
                                onTrack={onTrack}
                                isActive
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Past orders */}
            {past.length > 0 && (
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                        Past Orders
                    </h2>
                    <div className="space-y-3">
                        {past.map((order) => (
                            <OrderCard
                                key={order.order_id}
                                order={order}
                                onView={onView}
                                onTrack={onTrack}
                                isActive={false}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

const OrderCard = ({
    order,
    onView,
    onTrack,
    isActive,
}: {
    order: Order;
    onView: (o: Order) => void;
    onTrack: (id: number) => void;
    isActive: boolean;
}) => {
    const meta = STATUS_META[order.status];

    return (
        <div
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                isActive ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-200"
            }`}
        >
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.chipClass}`}>
                        {meta.label}
                    </span>
                    {order.order_type === "recurring" && (
                        <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            <RotateCcw className="w-3 h-3" />
                            Weekly
                        </span>
                    )}
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(order.placed_at)}
                </span>
            </div>

            {/* Card body */}
            <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">
                            Order #{order.order_id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {order.items.map((i) => `${i.quantity}× ${i.size}`).join(" · ")}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                            📍 {order.delivery_address}
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-base font-bold text-gray-800">
                            ₱{order.total_amount.toLocaleString()}
                        </p>
                        <p className={`text-xs font-semibold mt-0.5 capitalize ${
                            order.payment_status === "paid"
                                ? "text-green-600"
                                : "text-amber-600"
                        }`}>
                            {order.payment_status}
                        </p>
                    </div>
                </div>
            </div>

            {/* Card actions */}
            <div className="px-4 pb-3 flex items-center gap-2">
                {isActive ? (
                    <>
                        <button
                            onClick={() => onTrack(order.order_id)}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                        >
                            Track Order
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => onView(order)}
                            className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Details
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onView(order)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        View Receipt
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryList;