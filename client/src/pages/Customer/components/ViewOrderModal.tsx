import CloseButton from "../../../components/Button/CloseButton";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import type { Order } from "../OrderHistoryMainPage";

interface ViewOrderModalProps {
    isOpen: boolean;
    order: Order | null;
    onClose: () => void;
    onTrack: (orderId: number) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:    { label: "Pending",         className: "bg-yellow-100 text-yellow-700" },
    confirmed:  { label: "Confirmed",       className: "bg-blue-100 text-blue-700" },
    in_transit: { label: "Out for Delivery",className: "bg-indigo-100 text-indigo-700" },
    delivered:  { label: "Delivered",       className: "bg-green-100 text-green-700" },
    cancelled:  { label: "Cancelled",       className: "bg-red-100 text-red-600" },
};

const ViewOrderModal = ({ isOpen, order, onClose, onTrack }: ViewOrderModalProps) => {
    if (!isOpen || !order) return null;

    const status = statusConfig[order.status];
    const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
    const canTrack = order.status === "in_transit" || order.status === "confirmed";
    const formattedDate = new Date(order.placed_at).toLocaleString("en-PH", {
        weekday: "short", month: "short", day: "numeric",
        year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
    }).toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <ModalCloseButton onClose={onClose} />

                {/* Receipt Header */}
                <div className="px-6 pt-6 pb-4 text-center border-b border-dashed border-gray-200">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                        Soldier's Thirst
                    </p>
                    <p className="text-lg font-extrabold text-gray-900">
                        Order #{order.order_id}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
                    <div className="flex justify-center gap-2 mt-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                            {status.label}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.payment_status === "paid"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                        }`}>
                            {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                    </div>
                </div>

                {/* Items */}
                <div className="px-6 py-4 border-b border-dashed border-gray-200">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                        Items Ordered
                    </p>
                    <div className="space-y-2">
                        {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {item.name} — {item.size}
                                    </p>
                                    <p className="text-xs text-gray-400">× {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-800 shrink-0 ml-4">
                                    ₱{item.subtotal.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="px-6 py-4 border-b border-dashed border-gray-200">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Items ({totalItems})</span>
                        <span>₱{order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-base font-bold text-gray-800">Total Cost</span>
                        <span className="text-xl font-extrabold text-blue-600">
                            ₱{order.total_amount.toFixed(2)}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                        {order.payment_method === "cash" ? "💵 Cash on Delivery" : order.payment_method === "gcash" ? "📱 GCash" : "💳 Maya"}
                    </p>
                </div>

                {/* Delivery Info */}
                <div className="px-6 py-4 border-b border-dashed border-gray-200">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                        Delivery Info
                    </p>
                    <p className="text-sm text-gray-600">📍 {order.delivery_address}</p>
                    {order.estimated_arrival && (
                        <p className="text-sm text-gray-600 mt-1">
                            🕐 ETA: {order.estimated_arrival}
                        </p>
                    )}
                    {order.notes && (
                        <p className="text-sm text-gray-500 mt-1">📝 {order.notes}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 flex gap-2">
                    <CloseButton label="Close" onClose={onClose} className="flex-1 text-center" />
                    {canTrack && (
                        <button
                            type="button"
                            onClick={() => { onTrack(order.order_id); onClose(); }}
                            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors"
                        >
                            🗺 Track Order
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewOrderModal;