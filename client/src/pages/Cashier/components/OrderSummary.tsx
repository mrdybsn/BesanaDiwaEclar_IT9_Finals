import type { OrderItem } from "../POSMainPage";

interface OrderSummaryProps {
    orderItems: OrderItem[];
    onRemoveItem: (index: number) => void;
    onUpdateQuantity: (index: number, quantity: number) => void;
    onClearOrder: () => void;
    onProceedPayment: () => void;
}

const OrderSummary = ({
    orderItems,
    onRemoveItem,
    onUpdateQuantity,
    onClearOrder,
    onProceedPayment,
}: OrderSummaryProps) => {
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const orderNumber = "WT-0001";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-24 flex flex-col">

            {/* Receipt Header */}
            <div className="px-5 pt-5 pb-3 border-b border-dashed border-gray-200">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                        Walk-in Order
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                        {orderNumber}
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-base font-bold text-gray-800">
                        Order Summary
                    </p>
                    {orderItems.length > 0 && (
                        <button
                            type="button"
                            onClick={onClearOrder}
                            className="text-xs text-red-400 hover:text-red-600 font-medium cursor-pointer"
                        >
                            Clear all
                        </button>
                    )}
                </div>
            </div>

            {/* Receipt Items */}
            <div className="px-5 py-3 min-h-40 max-h-80 overflow-y-auto">
                {orderItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-300">
                        <span className="text-4xl mb-2">🧾</span>
                        <p className="text-sm">No items added</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orderItems.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-start justify-between gap-2">
                                    {/* Left */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {item.size}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            ₱{item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                        {/* Qty Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                                                className="w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center cursor-pointer"
                                            >
                                                −
                                            </button>
                                            <span className="text-sm font-semibold text-gray-700 w-5 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                                className="w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 text-sm font-bold flex items-center justify-center cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {/* Right */}
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        <p className="text-sm font-bold text-gray-900">
                                            ₱{item.subtotal.toFixed(2)}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveItem(index)}
                                            className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                {/* Divider */}
                                {index < orderItems.length - 1 && (
                                    <div className="border-b border-dashed border-gray-100 mt-3" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Receipt Footer Totals */}
            {orderItems.length > 0 && (
                <div className="border-t border-dashed border-gray-200 px-5 pt-3 pb-5">
                    <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Items ({totalItems})</span>
                            <span>₱{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3 mb-4">
                        <span className="text-sm font-bold text-gray-700">Total</span>
                        <span className="text-xl font-extrabold text-gray-900">
                            ₱{totalAmount.toFixed(2)}
                        </span>
                    </div>

                    {/* Payment Method Pills */}
                    <div className="flex gap-2 mb-4">
                        {["Cash", "GCash", "Maya"].map((method) => (
                            <span
                                key={method}
                                className="flex-1 text-center text-xs border border-gray-200 rounded-lg py-1.5 text-gray-500 bg-gray-50"
                            >
                                {method}
                            </span>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onProceedPayment}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 rounded-xl cursor-pointer transition-colors duration-150 shadow-sm"
                    >
                        Pay Now
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderSummary;