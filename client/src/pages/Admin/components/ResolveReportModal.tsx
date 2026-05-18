import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface ResolveReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResolveReportModal: FC<ResolveReportModalProps> = ({ isOpen, onClose }) => {
    const actions = [
        { action_id: "", action: "Select Action" },
        { action_id: "replace", action: "Replace Item" },
        { action_id: "deduct_rider", action: "Deduct from Rider" },
        { action_id: "write_off", action: "Write Off" },
        { action_id: "other", action: "Other" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-1">
                    Resolve Lost / Damaged Report
                </h1>
                <p className="text-sm text-gray-500 px-4 mb-4">
                    Review the report and take appropriate action.
                </p>
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
                            <FloatingLabelSelect label="Action Taken" name="action" required autoFocus>
                                {actions.map((a, index) => (
                                    <option value={a.action_id} key={index}>{a.action}</option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Admin Notes" type="text" name="admin_notes" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Mark as Resolved" />
                </div>
            </form>
        </Modal>
    );
};

export default ResolveReportModal;