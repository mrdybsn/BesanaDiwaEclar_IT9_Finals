import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";

interface ViewLostReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ViewLostReportModal: FC<ViewLostReportModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Lost / Damaged Item Report
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Rider" type="text" name="rider_name" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Customer" type="text" name="customer_name" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Item" type="text" name="item" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Quantity" type="number" name="quantity" readOnly />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Reason" type="text" name="reason" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Date" type="date" name="date" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Status" type="text" name="status" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Admin Notes" type="text" name="admin_notes" readOnly />
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

export default ViewLostReportModal;