import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface AssignDeliveryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AssignDeliveryModal: FC<AssignDeliveryModalProps> = ({ isOpen, onClose }) => {
    const riders = [
        { rider_id: "", rider: "Select Rider" },
        { rider_id: "1", rider: "Reyes, Carlo B." },
        { rider_id: "2", rider: "Santos, Mark A." },
        { rider_id: "3", rider: "Dela Cruz, Jun R." },
        { rider_id: "4", rider: "Garcia, Pedro M." },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Assign Delivery Form
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelSelect label="Rider" name="rider_id" required>
                                {riders.map((rider, index) => (
                                    <option value={rider.rider_id} key={index}>
                                        {rider.rider}
                                    </option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Scheduled Date"
                                type="date"
                                name="scheduled_date"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Order Count"
                                type="number"
                                name="order_count"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Expected Amount (₱)"
                                type="number"
                                name="expected_amount"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Notes"
                                type="text"
                                name="notes"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Assign Delivery" />
                </div>
            </form>
        </Modal>
    );
};

export default AssignDeliveryModal;