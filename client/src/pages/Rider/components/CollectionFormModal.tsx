import { useState, useEffect } from "react";
import type { CollectionDelivery } from "../RiderCollectionMainPage";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";

interface CollectionFormModalProps {
    isOpen: boolean;
    delivery: CollectionDelivery | null;
    onClose: () => void;
    onSubmit: (amount: number) => Promise<void>;
}

const CollectionFormModal = ({
    isOpen,
    delivery,
    onClose,
    onSubmit,
}: CollectionFormModalProps) => {
    const [amountInput, setAmountInput] = useState("");
    const [step, setStep] = useState<"amount" | "confirm">("amount");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && delivery) {
            setAmountInput(delivery.expected_amount.toFixed(2));
            setStep("amount");
            setSubmitting(false);
        }
    }, [isOpen, delivery]);

    if (!isOpen || !delivery) return null;

    const amountCollected = parseFloat(amountInput) || 0;
    const difference = amountCollected - delivery.expected_amount;

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await onSubmit(amountCollected);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
            <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[92vh] overflow-y-auto">
                <ModalCloseButton onClose={onClose} />

                <div className="p-5 pb-6">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                        Delivery #{delivery.delivery_id}
                        {delivery.is_recurring && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 normal-case">
                                Weekly
                            </span>
                        )}
                    </p>
                    <h2 className="text-lg font-bold text-gray-900 mt-1 mb-4">
                        {step === "amount" ? "Collect Payment" : "Confirm"}
                    </h2>

                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-4">
                        <p className="font-semibold text-gray-900">{delivery.customer_name}</p>
                        <p className="text-sm text-gray-500 mt-1">{delivery.contact_number}</p>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{delivery.delivery_address}</p>
                    </div>

                    <div className="flex justify-between items-center mb-4 px-1">
                        <span className="text-sm text-gray-500">Amount due</span>
                        <span className="text-2xl font-extrabold text-gray-900">
                            ₱{delivery.expected_amount.toFixed(2)}
                        </span>
                    </div>

                    {step === "amount" ? (
                        <>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cash collected
                            </label>
                            <input
                                type="number"
                                inputMode="decimal"
                                step="0.01"
                                min="0"
                                value={amountInput}
                                onChange={(e) => setAmountInput(e.target.value)}
                                className="w-full text-2xl font-bold text-center border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => setAmountInput(delivery.expected_amount.toFixed(2))}
                                className="w-full mt-2 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
                            >
                                Use exact amount (₱{delivery.expected_amount.toFixed(2)})
                            </button>

                            <div className="flex gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={amountCollected <= 0}
                                    onClick={() => setStep("confirm")}
                                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold disabled:opacity-40"
                                >
                                    Continue
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={`rounded-xl border p-4 mb-4 text-sm ${
                                difference === 0
                                    ? "bg-green-50 border-green-100"
                                    : difference > 0
                                    ? "bg-blue-50 border-blue-100"
                                    : "bg-amber-50 border-amber-100"
                            }`}>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Collected</span>
                                    <span className="font-bold">₱{amountCollected.toFixed(2)}</span>
                                </div>
                                {difference !== 0 && (
                                    <div className="flex justify-between mt-2">
                                        <span className="text-gray-500">Difference</span>
                                        <span className="font-bold">
                                            {difference >= 0 ? "+" : ""}₱{difference.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setStep("amount")}
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold disabled:opacity-60"
                                >
                                    {submitting ? "Saving…" : "Submit"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionFormModal;
