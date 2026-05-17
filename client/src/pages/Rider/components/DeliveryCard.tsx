import { Link } from "react-router-dom";
import type { DeliveryTask } from "../RiderTasksMainPage";

interface DeliveryCardProps {
    delivery: DeliveryTask;
    onView: (delivery: DeliveryTask) => void;
}

const statusConfig = {
    pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-500",
    },
    in_transit: {
        label: "In Transit",
        className: "bg-blue-100 text-blue-700",
        dot: "bg-blue-500",
    },
    delivered: {
        label: "Delivered",
        className: "bg-green-100 text-green-700",
        dot: "bg-green-500",
    },
};

const paymentStatusConfig = {
    unpaid: { label: "Unpaid", className: "bg-red-100 text-red-600" },
    paid: { label: "Paid", className: "bg-green-100 text-green-600" },
};

const DeliveryCard = ({ delivery, onView }: DeliveryCardProps) => {
    const status = statusConfig[delivery.status];
    const paymentStatus = paymentStatusConfig[delivery.payment_status];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
            <div className="flex items-start justify-between gap-4">

                {/* Left — Customer Info */}
                <div className="flex-1 min-w-0">
                    {/* Status + Payment */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${paymentStatus.className}`}>
                            {paymentStatus.label}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 capitalize">
                            {delivery.payment_method}
                        </span>
                    </div>

                    {/* Customer Name */}
                    <p className="text-base font-bold text-gray-800 truncate">
                        {delivery.customer_name}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">
                        📞 {delivery.contact_number}
                    </p>

                    {/* Address */}
                    <p className="text-sm text-gray-500 mt-1.5 flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0">📍</span>
                        <span>{delivery.delivery_address}</span>
                    </p>

                    {/* Order Items */}
                    <div className="mt-2 space-y-0.5">
                        {delivery.order_items.map((item, index) => (
                            <p key={index} className="text-xs text-gray-400">
                                • {item.name} — {item.size} × {item.quantity}
                            </p>
                        ))}
                    </div>

                    {/* Notes */}
                    {delivery.notes && (
                        <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-1.5 mt-2">
                            📝 {delivery.notes}
                        </p>
                    )}
                </div>

                {/* Right — Total */}
                <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-lg font-extrabold text-gray-900">
                        ₱{delivery.total_amount.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            {delivery.status !== "delivered" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => onView(delivery)}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                    >
                        View Details
                    </button>
                    <Link
                        to="/rider/map"
                        className="flex-1 text-center px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                    >
                        🗺 Navigate
                    </Link>
                    <Link
                        to="/rider/collection"
                        className="flex-1 text-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
                    >
                        Collect
                    </Link>
                </div>
            )}

            {delivery.status === "delivered" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => onView(delivery)}
                        className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg cursor-pointer transition-colors"
                    >
                        View Details
                    </button>
                </div>
            )}
        </div>
    );
};

export default DeliveryCard;