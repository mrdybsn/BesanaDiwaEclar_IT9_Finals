import type { DeliveryDetails } from "../OrderFormMainPage";
import { useState } from "react";
import type { CartItem } from "../ShopMainPage";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface OrderConfirmModalProps {
    isOpen: boolean;
    computedItems: CartItem[];
    totalAmount: number;
    deliveryDetails: DeliveryDetails;
    onClose: () => void;
    onConfirm: () => void;
}

const OrderConfirmModal = ({
    isOpen,
    computedItems,
    totalAmount,
    deliveryDetails,
    onClose,
    onConfirm,
}: OrderConfirmModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const totalItems = computedItems.reduce((sum, c) => sum + c.quantity, 0);

    const handleConfirm = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onConfirm();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
                <ModalCloseButton onClose={onClose} />

                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Confirm Order
                </p>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Place Delivery Order
                </h2>

                {/* Items */}
                <div className="space-y-2 mb-4">
                    {computedItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                                {item.size} × {item.quantity}
                            </span>
                            <span className="font-semibold text-gray-800">
                                ₱{item.subtotal.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="border-t border-dashed border-gray-200 pt-3 mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Items ({totalItems})</span>
                        <span>₱{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-base font-bold text-gray-800">Total</span>
                        <span className="text-xl font-extrabold text-gray-900">
                            ₱{totalAmount.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 mb-6 space-y-1.5 text-sm text-gray-600">
                    <p>📍 {deliveryDetails.delivery_address}</p>
                    <p>📞 {deliveryDetails.contact_number}</p>
                    <p className="capitalize">
                        💳 {deliveryDetails.payment_method === "cash"
                            ? "Cash on Delivery"
                            : deliveryDetails.payment_method}
                    </p>
                    {deliveryDetails.notes && (
                        <p>📝 {deliveryDetails.notes}</p>
                    )}
                </div>
                <form onSubmit={handleConfirm}>
                    <div className="flex gap-2">
                        <CloseButton
                            label="Cancel"
                            onClose={onClose}
                            className="flex-1 text-center"
                        />
                        <SubmitButton
                            label="Confirm Order"
                            loading={isLoading}
                            loadingLabel="Placing Order..."
                            className="flex-1"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderConfirmModal;