import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface ProcessOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProcessOrderModal: FC<ProcessOrderModalProps> = ({ isOpen, onClose }) => {
    const statuses = [
        { status_id: "", status: "Select Status" },
        { status_id: "processing", status: "Processing" },
        { status_id: "out_for_delivery", status: "Out for Delivery" },
        { status_id: "completed", status: "Completed" },
        { status_id: "cancelled", status: "Cancelled" },
    ];

    const riders = [
        { rider_id: "", rider: "Select Rider (optional)" },
        { rider_id: "1", rider: "Reyes, Carlo B." },
        { rider_id: "2", rider: "Santos, Mark A." },
        { rider_id: "3", rider: "Dela Cruz, Jun R." },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Process Order
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
                            <FloatingLabelInput label="Total Amount (₱)" type="number" name="total_amount" readOnly />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelSelect label="Update Status" name="status" required autoFocus>
                                {statuses.map((s, index) => (
                                    <option value={s.status_id} key={index}>{s.status}</option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelSelect label="Assign Rider" name="rider_id">
                                {riders.map((r, index) => (
                                    <option value={r.rider_id} key={index}>{r.rider}</option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Notes" type="text" name="notes" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Update Order" />
                </div>
            </form>
        </Modal>
    );
};

export default ProcessOrderModal;