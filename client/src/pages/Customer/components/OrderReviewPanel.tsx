import type { GallonDeclaration, DeliveryDetails } from "../OrderFormMainPage";
import type { CartItem } from "../ShopMainPage";

interface OrderReviewPanelProps {
    cartItems: CartItem[];
    computedItems: CartItem[];
    declarations: GallonDeclaration[];
    totalAmount: number;
    deliveryDetails: DeliveryDetails;
    onPlaceOrder: () => void;
}

const OrderReviewPanel = ({
    computedItems,
    totalAmount,
    deliveryDetails,
    onPlaceOrder,
}: OrderReviewPanelProps) => {
    const totalItems = computedItems.reduce((sum, c) => sum + c.quantity, 0);
    const isReady =
        deliveryDetails.delivery_address.trim() !== "" &&
        deliveryDetails.contact_number.trim() !== "";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24">
            {/* Header */}
            <div className="px-4 py-3 border-b border-dashed border-gray-200">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-0.5">
                    Delivery Order
                </p>
                <p className="text-base font-bold text-gray-800">Order Review</p>
            </div>

            {/* Items */}
            <div className="px-4 py-3 space-y-3 max-h-72 overflow-y-auto">
                {computedItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 leading-tight">
                                {item.size}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                × {item.quantity}
                            </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 shrink-0 ml-3">
                            ₱{item.subtotal.toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="px-4 pb-4">
                <div className="border-t border-dashed border-gray-200 pt-3 mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Items ({totalItems})</span>
                        <span>₱{totalAmount.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-3 mb-4">
                    <span className="text-sm font-bold text-gray-700">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">
                        ₱{totalAmount.toFixed(2)}
                    </span>
                </div>

                {/* Delivery Info Preview */}
                {deliveryDetails.delivery_address && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 mb-4 text-xs text-gray-500 space-y-1">
                        <p>📍 {deliveryDetails.delivery_address}</p>
                        {deliveryDetails.contact_number && (
                            <p>📞 {deliveryDetails.contact_number}</p>
                        )}
                        <p className="capitalize">
                            💳 {deliveryDetails.payment_method === "cash"
                                ? "Cash on Delivery"
                                : deliveryDetails.payment_method}
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onPlaceOrder}
                    disabled={!isReady}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl cursor-pointer transition-colors"
                >
                    Place Order
                </button>
                {!isReady && (
                    <p className="text-xs text-gray-400 text-center mt-2">
                        Fill in address and contact number to continue.
                    </p>
                )}
            </div>
        </div>
    );
};

export default OrderReviewPanel;