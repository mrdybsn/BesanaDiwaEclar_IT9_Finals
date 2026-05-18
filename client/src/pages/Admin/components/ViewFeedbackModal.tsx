import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import { Star } from "lucide-react";

interface ViewFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ViewFeedbackModal: FC<ViewFeedbackModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Customer Feedback Details
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Customer" type="text" name="customer_name" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Feedback For" type="text" name="target_type" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Name" type="text" name="target_name" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Date" type="date" name="date" readOnly />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        {/* Star Rating Display */}
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">Rating</p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={20}
                                        className="text-yellow-400 fill-yellow-400"
                                    />
                                ))}
                                <span className="text-sm font-semibold text-gray-700 ml-2">
                                    5 / 5
                                </span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Comment" type="text" name="comment" readOnly />
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

export default ViewFeedbackModal;