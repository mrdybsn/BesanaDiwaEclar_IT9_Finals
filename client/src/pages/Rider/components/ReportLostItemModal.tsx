import { useState } from "react";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface ReportLostItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const hardcodedDeliveries = [
    { delivery_id: 1, label: "Maria Santos — 123 Rizal St., Brgy. Baybay" },
    { delivery_id: 2, label: "Juan Dela Cruz — 45 Magsaysay Ave., Brgy. Dayao" },
    { delivery_id: 3, label: "Ana Reyes — 78 Lawaan Rd., Brgy. Milibili" },
];

const ReportLostItemModal = ({ isOpen, onClose }: ReportLostItemModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onClose();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <ModalCloseButton onClose={onClose} />

                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Rider
                </p>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Report Lost / Damaged Item
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Delivery (full width) */}
                        <div className="col-span-2">
                            <FloatingLabelSelect
                                label="Select Delivery"
                                name="delivery_id"
                                required
                            >
                                <option value="">Select Delivery</option>
                                {hardcodedDeliveries.map((d) => (
                                    <option key={d.delivery_id} value={d.delivery_id}>
                                        {d.label}
                                    </option>
                                ))}
                            </FloatingLabelSelect>
                        </div>

                        {/* Item Type */}
                        <div>
                            <FloatingLabelSelect
                                label="Item Type"
                                name="item_type"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="gallon">Gallon Jug</option>
                                <option value="cap">Cap</option>
                                <option value="seal">Seal</option>
                                <option value="other">Other</option>
                            </FloatingLabelSelect>
                        </div>

                        {/* Quantity */}
                        <div>
                            <FloatingLabelInput
                                label="Quantity"
                                type="number"
                                name="quantity"
                                min={1}
                                required
                            />
                        </div>

                        {/* Item Description (full width) */}
                        <div className="col-span-2">
                            <FloatingLabelInput
                                label="Item Description"
                                type="text"
                                name="item_description"
                                required
                            />
                        </div>

                        {/* Notes (full width) */}
                        <div className="col-span-2">
                            <FloatingLabelInput
                                label="Notes (optional)"
                                type="text"
                                name="notes"
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