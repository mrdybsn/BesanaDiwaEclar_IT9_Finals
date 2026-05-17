import { useState, useEffect } from "react";
import type { CollectionDelivery } from "../RiderCollectionMainPage";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import CloseButton from "../../../components/Button/CloseButton";

interface CollectionFormModalProps {
    isOpen: boolean;
    delivery: CollectionDelivery | null;
    onClose: () => void;
    onProceed: (amount: number) => void;
}

const QUICK_AMOUNTS = [20, 50, 100, 200];
const numpadKeys = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

const CollectionFormModal = ({
    isOpen,
    delivery,
    onClose,
    onProceed,
}: CollectionFormModalProps) => {
    const [amountInput, setAmountInput] = useState("");

    useEffect(() => {
        if (isOpen && delivery) {
            setAmountInput(delivery.expected_amount.toString());
        }
    }, [isOpen, delivery]);

    if (!isOpen || !delivery) return null;

    const amountCollected = parseFloat(amountInput) || 0;
    const difference = amountCollected - delivery.expected_amount;

    const handleNumpad = (val: string) => {
        if (val === "⌫") {
            setAmountInput((prev) => prev.slice(0, -1));
        } else if (val === ".") {
            if (!amountInput.includes(".")) setAmountInput((prev) => prev + ".");
        } else {
            setAmountInput((prev) => prev + val);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <ModalCloseButton onClose={onClose} />

                <div className="grid grid-cols-2 divide-x divide-gray-100">

                    {/* LEFT — Order Info */}
                    <div className="p-6">
                        <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                            Delivery #{delivery.delivery_id}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mb-4">
                            Collection Details
                        </p>

                        <p className="text-base font-semibold text-gray-800">
                            {delivery.customer_name}
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5 mb-3">
                            📞 {delivery.contact_number}
                        </p>

                        {/* Order Items */}
                        <div className="space-y-2 mb-4">
                            {delivery.order_items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-700">
                                        {item.name} — {item.size}
                                    </span>
                                    <span className="text-gray-500 shrink-0 ml-2">
                                        ×{item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Expected */}
                        <div className="border-t border-dashed border-gray-200 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">
                                    Expected Amount
                                </span>
                                <span className="text-xl font-extrabold text-gray-900">
                                    ₱{delivery.expected_amount.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Difference */}
                        {amountCollected > 0 && (
                            <div className={`mt-3 p-3 rounded-xl border ${
                                difference === 0
                                    ? "bg-green-50 border-green-100"
                                    : difference > 0
                                    ? "bg-blue-50 border-blue-100"
                                    : "bg-red-50 border-red-100"
                            }`}>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Collected</span>
                                    <span className="font-semibold text-gray-700">
                                        ₱{amountCollected.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-gray-500">Difference</span>
                                    <span className={`font-bold ${
                                        difference === 0
                                            ? "text-green-600"
                                            : difference > 0
                                            ? "text-blue-600"
                                            : "text-red-600"
                                    }`}>
                                        {difference >= 0 ? "+" : ""}₱{difference.toFixed(2)}
                                    </span>
                                </div>
                                {difference !== 0 && (
                                    <p className="text-xs mt-1.5 text-gray-400">
                                        {difference > 0
                                            ? "Overpayment — return change to customer."
                                            : "Short — verify with staff before submitting."}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Numpad */}
                    <div className="p-6 flex flex-col gap-4">
                        <p className="text-sm font-semibold text-gray-700">
                            Enter Collected Amount
                        </p>

                        {/* Amount Display */}
                        <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 text-right">
                            <p className="text-xs text-gray-400 mb-0.5">Amount Collected</p>
                            <p className="text-2xl font-bold text-gray-900 font-mono">
                                ₱{amountInput || "0"}
                            </p>
                        </div>

                        {/* Quick Amounts */}
                        <div className="grid grid-cols-4 gap-2">
                            {QUICK_AMOUNTS.map((amt) => (
                                <button
                                    key={amt}
                                    type="button"
                                    onClick={() => setAmountInput(amt.toString())}
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

                        {/* Buttons */}
                        <div className="flex gap-2 mt-auto">
                            <CloseButton
                                label="Cancel"
                                onClose={onClose}
                                className="flex-1 text-center"
                            />
                            <button
                                type="button"
                                onClick={() => onProceed(amountCollected)}
                                disabled={amountCollected <= 0}
                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg cursor-pointer transition-colors"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionFormModal;