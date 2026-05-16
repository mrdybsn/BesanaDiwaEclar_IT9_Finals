import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface ResolveGallonDebtModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResolveGallonDebtModal: FC<ResolveGallonDebtModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-1">
                    Resolve Gallon Debt
                </h1>
                <p className="text-sm text-gray-500 px-4 mb-4">
                    Log the number of jugs returned by the customer to update their debt.
                </p>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Customer Name"
                                type="text"
                                name="customer_name"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Gallons Borrowed"
                                type="number"
                                name="gallons_borrowed"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Gallons Already Returned"
                                type="number"
                                name="gallons_returned"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Gallons Still Owed"
                                type="number"
                                name="gallons_owed"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Jugs Returned Now"
                                type="number"
                                name="jugs_returned_now"
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
                    <SubmitButton label="Confirm Return" />
                </div>
            </form>
        </Modal>
    );
};

export default ResolveGallonDebtModal;