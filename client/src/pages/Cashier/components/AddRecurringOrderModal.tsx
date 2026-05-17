import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface AddRecurringOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddRecurringOrderModal: FC<AddRecurringOrderModalProps> = ({ isOpen, onClose }) => {
    const products = [
        { product_id: "", product: "Select Product" },
        { product_id: "1", product: "Purified Water — 500ml" },
        { product_id: "2", product: "Purified Water — 1L" },
        { product_id: "3", product: "Purified Water — 5gal (Exchange)" },
        { product_id: "4", product: "Purified Water — 5gal (New Container)" },
    ];

    const days = [
        { day_id: "", day: "Select Day" },
        { day_id: "monday", day: "Monday" },
        { day_id: "tuesday", day: "Tuesday" },
        { day_id: "wednesday", day: "Wednesday" },
        { day_id: "thursday", day: "Thursday" },
        { day_id: "friday", day: "Friday" },
        { day_id: "saturday", day: "Saturday" },
        { day_id: "sunday", day: "Sunday" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Set Recurring Order
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Customer Name" type="text" name="customer_name" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelSelect label="Product" name="product_id" required>
                                {products.map((p, index) => (
                                    <option value={p.product_id} key={index}>{p.product}</option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Quantity" type="number" name="quantity" required autoFocus />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelSelect label="Day of Week" name="day_of_week" required>
                                {days.map((d, index) => (
                                    <option value={d.day_id} key={index}>{d.day}</option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Delivery Address" type="text" name="delivery_address" required />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Notes" type="text" name="notes" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Save Recurring Order" />
                </div>
            </form>
        </Modal>
    );
};

export default AddRecurringOrderModal;