import type { DeliveryTask } from "../RiderTasksMainPage";
import RiderDeliveryActions from "./RiderDeliveryActions";

interface DeliveryCardProps {
    delivery: DeliveryTask;
    onView: (delivery: DeliveryTask) => void;
    onUpdated?: () => void;
}

const statusConfig = {
    pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-500",
    },
    assigned: {
        label: "Assigned",
        className: "bg-indigo-100 text-indigo-700",
        dot: "bg-indigo-500",
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

const DeliveryCard = ({ delivery, onView, onUpdated }: DeliveryCardProps) => {
    const status = statusConfig[delivery.status];
    const paymentStatus = paymentStatusConfig[delivery.payment_status];

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                        </span>
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${paymentStatus.className}`}
                        >
                            {paymentStatus.label}
                        </span>
                        {delivery.is_recurring && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                Weekly
                            </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 capitalize">
                            {delivery.payment_method}
                        </span>
                    </div>

                    <p className="text-xs text-gray-400 mb-0.5">Scheduled: {delivery.scheduled_date}</p>

                    <p className="text-base font-bold text-gray-800 truncate">{delivery.customer_name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">📞 {delivery.contact_number}</p>

                    <p className="text-sm text-gray-500 mt-1.5 flex items-start gap-1.5">
                        <span className="mt-0.5 shrink-0">📍</span>
                        <span>{delivery.delivery_address}</span>
                    </p>

                    <div className="mt-2 space-y-0.5">
                        {delivery.order_items.map((item, index) => (
                            <p key={index} className="text-xs text-gray-400">
                                • {item.name} — {item.size} × {item.quantity}
                            </p>
                        ))}
                    </div>

                    {delivery.notes && (
                        <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-1.5 mt-2">
                            📝 {delivery.notes}
                        </p>
                    )}
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-lg font-extrabold text-gray-900">
                        ₱{delivery.total_amount.toFixed(2)}
                    </p>
                </div>
            </div>

            <RiderDeliveryActions
                delivery={delivery}
                onView={onView}
                onUpdated={onUpdated}
                layout="card"
            />
        </div>
    );
};

export default DeliveryCard;
