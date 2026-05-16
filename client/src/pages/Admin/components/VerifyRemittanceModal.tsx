import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface VerifyRemittanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VerifyRemittanceModal: FC<VerifyRemittanceModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-1">
                    Verify Remittance
                </h1>
                <p className="text-sm text-gray-500 px-4 mb-4">
                    Review the collected and remitted amounts. If the difference is less than
                    ₱1.00 it will be marked as verified, otherwise it will be flagged as a discrepancy.
                </p>
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
                                label="Delivery ID"
                                type="text"
                                name="delivery_id"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Date"
                                type="date"
                                name="date"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
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
                                label="Remitted Amount (₱)"
                                type="number"
                                name="remitted_amount"
                                required
                                autoFocus
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
                    <SubmitButton label="Confirm Verification" />
                </div>
            </form>
        </Modal>
    );
};

export default VerifyRemittanceModal;