import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";

interface ViewDeliveryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ViewDeliveryModal: FC<ViewDeliveryModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Delivery Details
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Rider"
                                type="text"
                                name="rider_name"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Scheduled Date"
                                type="date"
                                name="scheduled_date"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Order Count"
                                type="number"
                                name="order_count"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Status"
                                type="text"
                                name="status"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Expected Amount (₱)"
                                type="number"
                                name="expected_amount"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Collected Amount (₱)"
                                type="number"
                                name="collected_amount"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Notes"
                                type="text"
                                name="notes"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                </div>
            </div>
        </Modal>
    );
};

export default ViewDeliveryModal;