import { useEffect, useState } from "react";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import RiderDeliveryService, { mapApiDeliveryToTask } from "../../../services/RiderDeliveryService";
import LostItemService from "../../../services/LostItemService";

interface ReportLostItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ReportLostItemModal = ({ isOpen, onClose, onSuccess }: ReportLostItemModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryOptions, setDeliveryOptions] = useState<{ delivery_id: number; label: string }[]>([]);
    const [form, setForm] = useState({
        delivery_id: "",
        item_type: "",
        quantity: "1",
        item_description: "",
        notes: "",
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        const load = async () => {
            try {
                const raw = await RiderDeliveryService.loadRawDeliveries({ scope: "active" });
                setDeliveryOptions(
                    raw.map((d) => {
                        const task = mapApiDeliveryToTask(d);
                        return {
                            delivery_id: d.delivery_id,
                            label: `${task.customer_name} — ${task.delivery_address}`,
                        };
                    })
                );
            } catch {
                setDeliveryOptions([]);
            }
        };
        load();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await LostItemService.storeReport({
                delivery_id: form.delivery_id ? Number(form.delivery_id) : undefined,
                item_description: form.item_description,
                item_type: form.item_type as "gallon" | "cap" | "seal" | "other",
                quantity: Number(form.quantity),
                notes: form.notes || undefined,
            });
            setForm({
                delivery_id: "",
                item_type: "",
                quantity: "1",
                item_description: "",
                notes: "",
            });
            onSuccess();
            onClose();
        } catch {
            setError("Failed to submit report. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <ModalCloseButton onClose={onClose} />

                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Rider</p>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Report Lost / Damaged Item</h2>

                {error && (
                    <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <FloatingLabelSelect
                                label="Select Delivery (optional)"
                                name="delivery_id"
                                value={form.delivery_id}
                                onChange={handleChange}
                            >
                                <option value="">No linked delivery</option>
                                {deliveryOptions.map((d) => (
                                    <option key={d.delivery_id} value={d.delivery_id}>
                                        {d.label}
                                    </option>
                                ))}
                            </FloatingLabelSelect>
                        </div>

                        <div>
                            <FloatingLabelSelect
                                label="Item Type"
                                name="item_type"
                                value={form.item_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="gallon">Gallon Jug</option>
                                <option value="cap">Cap</option>
                                <option value="seal">Seal</option>
                                <option value="other">Other</option>
                            </FloatingLabelSelect>
                        </div>

                        <div>
                            <FloatingLabelInput
                                label="Quantity"
                                type="number"
                                name="quantity"
                                min={1}
                                value={form.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <FloatingLabelInput
                                label="Item Description"
                                type="text"
                                name="item_description"
                                value={form.item_description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <FloatingLabelInput
                                label="Notes (optional)"
                                type="text"
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <CloseButton label="Cancel" onClose={onClose} />
                        <SubmitButton
                            label="Submit Report"
                            loading={isLoading}
                            loadingLabel="Submitting..."
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportLostItemModal;
