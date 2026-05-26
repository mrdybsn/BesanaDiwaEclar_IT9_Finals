import { useEffect, useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import RemittanceService, { type Remittance } from "../../../services/RemittanceService";

interface VerifyRemittanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    remittance: Remittance | null;
    onVerified: () => void;
}

const VerifyRemittanceModal: FC<VerifyRemittanceModalProps> = ({
    isOpen,
    onClose,
    remittance,
    onVerified,
}) => {
    const [remittedAmount, setRemittedAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && remittance) {
            const collected = Number(remittance.collected_amount);
            setRemittedAmount(collected.toFixed(2));
            setNotes(remittance.notes ?? "");
            setError(null);
        }
    }, [isOpen, remittance]);

    const collected = Number(remittance?.collected_amount ?? 0);
    const remitted = parseFloat(remittedAmount) || 0;
    const difference = remitted - collected;

    const riderName = remittance?.rider
        ? `${remittance.rider.last_name}, ${remittance.rider.first_name}`
        : "—";

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!remittance) return;

        if (remitted < 0) {
            setError("Remitted amount cannot be negative.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await RemittanceService.verifyRemittance(remittance.remittance_id, {
                remitted_amount: remitted,
                notes: notes.trim() || undefined,
            });
            onVerified();
            onClose();
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                ?? "Failed to verify remittance. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-6 rounded-lg w-full max-w-lg" onSubmit={handleSubmit}>
                <h1 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-2">
                    Verify Remittance
                </h1>
                <p className="text-sm text-gray-500 mb-4">
                    Enter the amount the rider handed over. If it matches collected (within ₱1.00),
                    status becomes verified; otherwise it is flagged as a discrepancy.
                </p>

                {!remittance ? (
                    <p className="text-sm text-gray-400 text-center py-8">No remittance selected.</p>
                ) : (
                    <>
                        {error && (
                            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <FloatingLabelInput
                                label="Rider"
                                type="text"
                                name="rider_name"
                                value={riderName}
                                readOnly
                            />
                            <FloatingLabelInput
                                label="Delivery ID"
                                type="text"
                                name="delivery_id"
                                value={String(remittance.delivery_id)}
                                readOnly
                            />
                            <FloatingLabelInput
                                label="Date"
                                type="date"
                                name="date"
                                value={remittance.date}
                                readOnly
                            />
                            <FloatingLabelInput
                                label="Collected Amount (₱)"
                                type="number"
                                name="collected_amount"
                                value={collected.toFixed(2)}
                                readOnly
                            />
                            <FloatingLabelInput
                                label="Remitted Amount (₱)"
                                type="number"
                                name="remitted_amount"
                                value={remittedAmount}
                                onChange={(e) => setRemittedAmount(e.target.value)}
                                required
                                autoFocus
                                step="0.01"
                                min={0}
                            />
                            <FloatingLabelInput
                                label="Notes"
                                type="text"
                                name="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <div className={`mb-4 p-3 rounded-lg text-sm border ${
                            Math.abs(difference) < 1
                                ? "bg-green-50 border-green-100 text-green-700"
                                : "bg-amber-50 border-amber-100 text-amber-800"
                        }`}>
                            Difference: {difference >= 0 ? "+" : ""}₱{difference.toFixed(2)}
                            {Math.abs(difference) < 1
                                ? " — will be marked verified"
                                : " — will be marked as discrepancy"}
                        </div>
                    </>
                )}

                <div className="flex justify-end gap-2">
                    <CloseButton label="Cancel" onClose={onClose} />
                    <SubmitButton
                        label="Confirm Verification"
                        loading={loading}
                        loadingLabel="Saving…"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default VerifyRemittanceModal;
