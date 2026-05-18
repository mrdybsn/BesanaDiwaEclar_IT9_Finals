import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface NotifyJugDebtModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotifyJugDebtModal: FC<NotifyJugDebtModalProps> = ({ isOpen, onClose }) => {
    const channels = [
        { channel_id: "", channel: "Select Channel" },
        { channel_id: "app", channel: "In-App Notification" },
        { channel_id: "sms", channel: "SMS" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-1">
                    Notify Customer — Jug Debt
                </h1>
                <p className="text-sm text-gray-500 px-4 mb-4">
                    Send a reminder to the customer about their outstanding gallon jug debt.
                </p>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Customer Name" type="text" name="customer_name" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Gallons Owed" type="number" name="gallons_owed" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelSelect label="Notify Via" name="channel" required autoFocus>
                                {channels.map((c, index) => (
                                    <option value={c.channel_id} key={index}>{c.channel}</option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Message Preview</p>
                            <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700">
                                Hi! This is a reminder that you currently have{" "}
                                <span className="font-bold text-red-600">
                                    [gallons_owed] gallon jug(s)
                                </span>{" "}
                                that need to be returned to Soldier's Thirst. Please return them on your next delivery or drop by our store. Thank you!
                            </div>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Additional Note (optional)" type="text" name="note" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Send Notification" />
                </div>
            </form>
        </Modal>
    );
};

export default NotifyJugDebtModal;