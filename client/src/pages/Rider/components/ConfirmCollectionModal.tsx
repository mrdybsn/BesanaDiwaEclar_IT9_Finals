import CloseButton from "../../../components/Button/CloseButton";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import type { CollectionDelivery } from "../RiderCollectionMainPage";

interface ConfirmCollectionModalProps {
    isOpen: boolean;
    delivery: CollectionDelivery | null;
    collectedAmount: number;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmCollectionModal = ({
    isOpen,
    delivery,
    collectedAmount,
    onClose,
    onConfirm,
}: ConfirmCollectionModalProps) => {
    if (!isOpen || !delivery) return null;

    const difference = collectedAmount - delivery.expected_amount;
    const isExact = difference === 0;
    const isOver = difference > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                <ModalCloseButton onClose={onClose} />

                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Confirm Submission
                </p>
                <p className="text-lg font-bold text-gray-900 mb-4">
                    Submit Collection
                </p>

                {/* Customer */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4">
                    <p className="text-sm font-bold text-gray-800">
                        {delivery.customer_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        📍 {delivery.delivery_address}
                    </p>
                </div>

                {/* Amount Summary */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Expected Amount</span>
                        <span className="font-semibold text-gray-800">
                            ₱{delivery.expected_amount.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Collected Amount</span>
                        <span className="font-semibold text-gray-800">
                            ₱{collectedAmount.toFixed(2)}
                        </span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between text-sm">
                        <span className="text-gray-500">Difference</span>
                        <span className={`font-bold ${
                            isExact
                                ? "text-green-600"
                                : isOver
                                ? "text-blue-600"
                                : "text-red-600"
                        }`}>
                            {difference >= 0 ? "+" : ""}₱{difference.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Status Note */}
                <div className={`p-3 rounded-xl border mb-6 text-sm ${
                    isExact
                        ? "bg-green-50 border-green-100 text-green-700"
                        : isOver
                        ? "bg-blue-50 border-blue-100 text-blue-700"
                        : "bg-red-50 border-red-100 text-red-700"
                }`}>
                    {isExact && "✓ Amount matches. This will be marked as verified."}
                    {isOver && "ℹ️ Overpayment detected. Return the change to the customer."}
                    {!isExact && !isOver && "⚠️ Discrepancy detected. Staff will be notified to verify."}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <CloseButton
                        label="Back"
                        onClose={onClose}
                        className="flex-1 text-center"
                    />
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg cursor-pointer transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmCollectionModal;