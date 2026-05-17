import type { Order } from "../OrderHistoryMainPage";

const PAYMENT_LABELS: Record<string, string> = {
    cash:  "Cash on Delivery",
    gcash: "GCash",
    maya:  "Maya",
};

const DAY_LABELS: Record<string, string> = {
    monday:    "Every Monday",
    tuesday:   "Every Tuesday",
    wednesday: "Every Wednesday",
    thursday:  "Every Thursday",
    friday:    "Every Friday",
    saturday:  "Every Saturday",
};

interface Props {
    order: Order;
}

const TrackingOrderSummary = ({ order }: Props) => {
    return (
        <div className="space-y-4">
            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Order Summary
                </p>
                <div className="space-y-2 mb-3">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                {item.quantity}× {item.size}
                            </span>
                            <span className="font-semibold text-gray-800">
                                ₱{item.subtotal.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">Total</span>
                    <span className="text-lg font-extrabold text-gray-900">
                        ₱{order.total_amount.toLocaleString()}
                    </span>
                </div>
                <p className={`text-xs font-semibold mt-1.5 capitalize ${
                    order.payment_status === "paid" ? "text-green-600" : "text-amber-600"
                }`}>
                    Payment: {order.payment_status}
                </p>
            </div>

            {/* Delivery info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Delivery Info
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                    <p>📍 {order.delivery_address}</p>
                    <p>📞 {order.contact_number}</p>
                    <p>💳 {PAYMENT_LABELS[order.payment_method] ?? order.payment_method}</p>
                    {order.order_type === "one_time" && order.preferred_date && (
                        <p>
                            📅{" "}
                            {new Date(order.preferred_date).toLocaleDateString("en-PH", {
                                weekday: "long",
                                month:   "long",
                                day:     "numeric",
                                year:    "numeric",
                            })}
                        </p>
                    )}
                    {order.order_type === "recurring" && order.preferred_day && (
                        <p>🔁 {DAY_LABELS[order.preferred_day] ?? order.preferred_day}</p>
                    )}
                    {order.notes && <p>📝 {order.notes}</p>}
                </div>
            </div>
        </div>
    );
};

export default TrackingOrderSummary;