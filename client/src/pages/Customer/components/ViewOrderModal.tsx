import { ChevronRight, RotateCcw, X } from "lucide-react";
import type { Order } from "../OrderHistoryMainPage";

const STATUS_META: Record<
    Order["status"],
    { label: string; chipClass: string }
> = {
    pending:    { label: "Pending",    chipClass: "bg-yellow-100 text-yellow-700" },
    confirmed:  { label: "Confirmed",  chipClass: "bg-blue-100 text-blue-700"     },
    in_transit: { label: "On the Way", chipClass: "bg-sky-100 text-sky-700"       },
    delivered:  { label: "Delivered",  chipClass: "bg-green-100 text-green-700"   },
    cancelled:  { label: "Cancelled",  chipClass: "bg-red-100 text-red-600"       },
};

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

const ACTIVE_STATUSES: Order["status"][] = ["pending", "confirmed", "in_transit"];

interface Props {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
    onTrack: (orderId: number) => void;
}

const ViewOrderModal = ({ isOpen, order, onClose, onTrack }: Props) => {
    if (!isOpen || !order) return null;

    const meta     = STATUS_META[order.status];
    const isActive = ACTIVE_STATUSES.includes(order.status);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Title */}
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Order Details
                </p>
                <div className="flex items-center gap-2 mb-5">
                    <h2 className="text-lg font-bold text-gray-900">
                        Order #{order.order_id}
                    </h2>
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

                {/* Items */}
                <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        Items
                    </p>
                    <div className="space-y-2">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">
                                    {item.quantity}× {item.size} {item.name}
                                </span>
                                <span className="font-semibold text-gray-800">
                                    ₱{item.subtotal.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="border-t border-dashed border-gray-200 pt-3 mb-5">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-gray-800">Total</span>
                        <span className="text-xl font-extrabold text-gray-900">
                            ₱{order.total_amount.toLocaleString()}
                        </span>
                    </div>
                    <p className={`text-xs font-semibold mt-1 capitalize ${
                        order.payment_status === "paid" ? "text-green-600" : "text-amber-600"
                    }`}>
                        Payment: {order.payment_status}
                    </p>
                </div>

                {/* Delivery info */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 mb-5 space-y-1.5 text-sm text-gray-600">
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

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    {isActive && (
                        <button
                            onClick={() => {
                                onClose();
                                onTrack(order.order_id);
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                        >
                            Track Order
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewOrderModal;