import type { CartItem } from "../ShopMainPage";

interface CartSummaryProps {
    cartItems: CartItem[];
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onProceed: () => void;
}

const CartSummary = ({
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onProceed,
}: CartSummaryProps) => {
    const totalItems = cartItems.reduce((sum, c) => sum + c.quantity, 0);
    const totalAmount = cartItems.reduce((sum, c) => sum + c.subtotal, 0);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-800">
                        My Cart
                    </span>
                    {totalItems > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {totalItems}
                        </span>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <button
                        type="button"
                        onClick={() => cartItems.forEach((c) => onRemoveItem(c.product_id))}
                        className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Items */}
            <div className="px-4 py-3 min-h-40 max-h-96 overflow-y-auto">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-300">
                        <span className="text-4xl mb-2">🛒</span>
                        <p className="text-sm">Your cart is empty</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product_id} className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 leading-tight">
                                        {item.size}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        ₱{item.price.toFixed(2)} / {item.unit}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold flex items-center justify-center cursor-pointer"
                                        >
                                            −
                                        </button>
                                        <span className="text-sm font-semibold text-gray-700 w-4 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-bold flex items-center justify-center cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <p className="text-sm font-semibold text-gray-800">
                                        ₱{item.subtotal.toFixed(2)}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveItem(item.product_id)}
                                        className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Total</span>
                        <span className="text-xl font-bold text-gray-900">
                            ₱{totalAmount.toFixed(2)}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onProceed}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl cursor-pointer transition-colors"
                    >
                        Proceed to Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartSummary;