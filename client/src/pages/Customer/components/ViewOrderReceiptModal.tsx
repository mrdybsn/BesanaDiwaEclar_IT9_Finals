import { Link } from "react-router-dom";
import type { OrderHistory } from "../OrderHistoryMainPage";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import CloseButton from "../../../components/Button/CloseButton";

interface ViewOrderReceiptModalProps {
    isOpen: boolean;
    order: OrderHistory | null;
    onClose: () => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    pending:    { label: "Pending",    className: "bg-yellow-100 text-yellow-700" },
    confirmed:  { label: "Confirmed",  className: "bg-blue-100 text-blue-700" },
    in_transit: { label: "In Transit", className: "bg-indigo-100 text-indigo-700" },
    delivered:  { label: "Delivered",  className: "bg-green-100 text-green-700" },
    cancelled:  { label: "Cancelled",  className: "bg-red-100 text-red-600" },
};

const ViewOrderReceiptModal = ({
    isOpen,
    order,
    onClose,
}: ViewOrderReceiptModalProps) => {
    if (!isOpen || !order) return null;

    const status = statusConfig[order.status];
    const totalItems = order.order_items.reduce((sum, i) => sum + i.quantity, 0);
    const canTrack = order.status === "in_transit" || order.status === "confirmed";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <ModalCloseButton onClose={onClose} />

                {/* Receipt Header */}
                <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-200 text-center">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                        Soldier's Thirst
                    </p>
                    <p className="text-lg font-extrabold text-gray-900">
                        Order #{order.order_id}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{order.placed_at}</p>
                    <span className={`mt-2 inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                        {status.label}
                    </span>
                </div>

                {/* Items */}
                <div className="px-6 py-4 border-b border-dashed border-gray-200">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                        Items Ordered
                    </p>
                    <div className="space-y-2">
                        {order.order_items.map((item, index) => (
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

                {/* Totals */}
                <div className="px-6 py-4 border-b border-dashed border-gray-200">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Items ({totalItems})</span>
                        <span>₱{order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-base font-bold text-gray-800">Total</span>
                        <span className="text-xl font-extrabold text-gray-900">
                            ₱{order.total_amount.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            order.payment_status === "paid"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                        }`}>
                            {order.payment_status === "paid" ? "Paid" : "Unpaid"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 capitalize">
                            {order.payment_method === "cash" ? "Cash on Delivery" : order.payment_method}
                        </span>
                    </div>
                </div>

                {/* Delivery Address */}
                {order.delivery_address && (
                    <div className="px-6 py-4 border-b border-dashed border-gray-200">
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                            Delivery Address
                        </p>
                        <p className="text-sm text-gray-600">
                            📍 {order.delivery_address}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="px-6 py-4 flex gap-2">
                    <CloseButton
                        label="Close"
                        onClose={onClose}
                        className="flex-1 text-center"
                    />
                    {canTrack && (
                        <Link
                            to={`/shop/track/${order.order_id}`}
                            onClick={onClose}
                            className="flex-1 text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
                        >
                            🗺 Track Order
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewOrderReceiptModal;