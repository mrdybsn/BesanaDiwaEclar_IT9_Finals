import { useState } from "react";
import type { OrderItem } from "../POSMainPage";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderItems: OrderItem[];
    onConfirm: () => void;
}

const PAYMENT_METHODS = [
    { value: "cash", label: "💵 Cash" },
    { value: "gcash", label: "📱 GCash" },
    { value: "maya", label: "💳 Maya" },
];

const QUICK_AMOUNTS = [20, 50, 100, 200];

const PaymentModal = ({
    isOpen,
    onClose,
    orderItems,
    onConfirm,
}: PaymentModalProps) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amountInput, setAmountInput] = useState("");

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const amountTendered = parseFloat(amountInput) || 0;
    const change = amountTendered - totalAmount;

    if (!isOpen) return null;

    const handleNumpad = (val: string) => {
        if (val === "⌫") {
            setAmountInput((prev) => prev.slice(0, -1));
        } else if (val === ".") {
            if (!amountInput.includes(".")) setAmountInput((prev) => prev + ".");
        } else {
            setAmountInput((prev) => prev + val);
        }
    };

    const handleQuickAmount = (amount: number) => {
        setAmountInput(amount.toString());
    };

    const handleConfirm = () => {
        setAmountInput("");
        setPaymentMethod("cash");
        onConfirm();
    };

    const numpadKeys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <ModalCloseButton onClose={onClose} />

                <div className="grid grid-cols-2 divide-x divide-gray-100">

                    {/* LEFT — Transaction Details (Receipt) */}
                    <div className="p-6">
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                            Walk-in Order
                        </p>
                        <p className="text-lg font-bold text-gray-900 mb-4">
                            Transaction Details
                        </p>

                        {/* Items */}
                        <div className="space-y-3 mb-4">
                            {orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {item.name} — {item.size}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            ₱{item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800 shrink-0 ml-4">
                                        ₱{item.subtotal.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="border-t border-dashed border-gray-200 pt-3 space-y-1">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Items ({totalItems})</span>
                                <span>₱{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                            <span className="text-base font-bold text-gray-800">Total</span>
                            <span className="text-xl font-extrabold text-gray-900">
                                ₱{totalAmount.toFixed(2)}
                            </span>
                        </div>

                        {/* Change */}
                        {paymentMethod === "cash" && amountTendered > 0 && (
                            <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tendered</span>
                                    <span className="font-semibold text-gray-700">
                                        ₱{amountTendered.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-500">Change</span>
                                    <span className={`font-bold ${change < 0 ? "text-red-500" : "text-green-600"}`}>
                                        ₱{change < 0 ? "0.00" : change.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Payment Method + Numpad */}
                    <div className="p-6 flex flex-col gap-4">
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                Select a payment method
                            </p>
                            <div className="flex flex-col gap-2">
                                {PAYMENT_METHODS.map((m) => (
                                    <button
                                        key={m.value}
                                        type="button"
                                        onClick={() => {
                                            setPaymentMethod(m.value);
                                            setAmountInput("");
                                        }}
                                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                            paymentMethod === m.value
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Numpad — only for Cash */}
                        {paymentMethod === "cash" && (
                            <div>
                                {/* Amount display */}
                                <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-right mb-3">
                                    <p className="text-xs text-gray-400 mb-0.5">Amount Tendered</p>
                                    <p className="text-2xl font-bold text-gray-900 font-mono">
                                        ₱{amountInput || "0"}
                                    </p>
                                </div>

                                {/* Quick amounts */}
                                <div className="grid grid-cols-4 gap-2 mb-3">
                                    {QUICK_AMOUNTS.map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => handleQuickAmount(amt)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 rounded-lg cursor-pointer transition-colors"
                                        >
                                            ₱{amt}
                                        </button>
                                    ))}
                                </div>

                                {/* Numpad */}
                                <div className="grid grid-cols-3 gap-2">
                                    {numpadKeys.map((key) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => handleNumpad(key)}
                                            className={`py-3 rounded-xl text-base font-semibold cursor-pointer transition-colors ${
                                                key === "⌫"
                                                    ? "bg-red-50 hover:bg-red-100 text-red-500"
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                                            }`}
                                        >
                                            {key}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Confirm Button */}
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={
                                paymentMethod === "cash" &&
                                (amountTendered < totalAmount || amountTendered === 0)
                            }
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-xl cursor-pointer transition-colors mt-auto"
                        >
                            Confirm Sale
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;