import type { DeliveryTask } from "../RiderTasksMainPage";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import CloseButton from "../../../components/Button/CloseButton";
import RiderDeliveryActions from "./RiderDeliveryActions";
import { deliveryNeedsCollection } from "../../../utils/riderDelivery";

interface ViewDeliveryModalProps {
    isOpen: boolean;
    delivery: DeliveryTask | null;
    onClose: () => void;
    onUpdated?: () => void;
}

const statusConfig = {
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
    assigned: { label: "Assigned", className: "bg-indigo-100 text-indigo-700" },
    in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-700" },
    delivered: { label: "Delivered", className: "bg-green-100 text-green-700" },
};

const ViewDeliveryModal = ({ isOpen, delivery, onClose, onUpdated }: ViewDeliveryModalProps) => {
    if (!isOpen || !delivery) return null;

    const status = statusConfig[delivery.status];
    const totalItems = delivery.order_items.reduce((sum, item) => sum + item.quantity, 0);
    const needsCollection = deliveryNeedsCollection(delivery);

    const handleUpdated = () => {
        onUpdated?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <ModalCloseButton onClose={onClose} />

                <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-200">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                        Delivery #{delivery.delivery_id}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-lg font-bold text-gray-900">{delivery.customer_name}</p>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                            {status.label}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">📞 {delivery.contact_number}</p>
                    <p className="text-xs text-gray-400 mt-1">Scheduled: {delivery.scheduled_date}</p>
                    {delivery.is_recurring && (
                        <p className="text-xs text-purple-600 mt-1 font-medium">
                            Weekly recurring — collect payment on delivery
                        </p>
                    )}
                    {!delivery.is_recurring && delivery.payment_status === "paid" && (
                        <p className="text-xs text-green-600 mt-1 font-medium">
                            Already paid — no collection needed
                        </p>
                    )}
                </div>

                <div className="px-6 py-4 border-b border-dashed border-gray-200">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Delivery Address
                    </p>
                    <p className="text-sm text-gray-700">📍 {delivery.delivery_address}</p>
                    {delivery.notes && (
                        <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-1.5 mt-2">
                            📝 {delivery.notes}
                        </p>
                    )}
                </div>

                <div className="px-6 py-4 border-b border-dashed border-gray-200">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Order Items
                    </p>
                    <div className="space-y-2">
                        {delivery.order_items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {item.name} — {item.size}
                                    </p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">×{item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-4 border-b border-dashed border-gray-200">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Items ({totalItems})</span>
                        <span>₱{delivery.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-base font-bold text-gray-800">Total</p>
                        <p className="text-xl font-extrabold text-gray-900">
                            ₱{delivery.total_amount.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                delivery.payment_status === "paid"
                                    ? "bg-green-100 text-green-600"
                                    : "bg-red-100 text-red-600"
                            }`}
                        >
                            {delivery.payment_status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 capitalize">
                            {delivery.payment_method}
                        </span>
                        {needsCollection && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                                Collection required
                            </span>
                        )}
                    </div>
                </div>

                <div className="px-6 py-4">
                    <RiderDeliveryActions
                        delivery={delivery}
                        onView={() => {}}
                        onUpdated={handleUpdated}
                        layout="modal"
                        onNavigate={onClose}
                    />
                    <div className="mt-2">
                        <CloseButton label="Close" onClose={onClose} className="w-full text-center" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDeliveryModal;
