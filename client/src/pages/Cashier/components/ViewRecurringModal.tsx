import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";

interface ViewRecurringModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ViewRecurringModal: FC<ViewRecurringModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Recurring Order Details
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Customer" type="text" name="customer_name" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Product" type="text" name="product" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Quantity" type="number" name="quantity" readOnly />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Day of Week" type="text" name="day_of_week" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Delivery Address" type="text" name="delivery_address" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Status" type="text" name="status" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Notes" type="text" name="notes" readOnly />
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

export default ViewRecurringModal;