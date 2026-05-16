import type { FC } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";

interface AddInventoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddInventoryFormModal: FC<AddInventoryFormModalProps> = ({ isOpen, onClose }) => {
    const categories = [
        { category_id: "", category: "Select Category" },
        { category_id: "containers", category: "Containers" },
        { category_id: "caps", category: "Caps" },
        { category_id: "filters", category: "Filters" },
        { category_id: "chemicals", category: "Chemicals" },
        { category_id: "equipment", category: "Equipment" },
        { category_id: "other", category: "Other" },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Add Inventory Item Form
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Item Name"
                                type="text"
                                name="item_name"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelSelect label="Category" name="category" required>
                                {categories.map((cat, index) => (
                                    <option value={cat.category_id} key={index}>
                                        {cat.category}
                                    </option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Unit (e.g. pcs, liters, units)"
                                type="text"
                                name="unit"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Quantity"
                                type="number"
                                name="quantity"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Low Stock Threshold"
                                type="number"
                                name="low_stock_threshold"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Save Item" />
                </div>
            </form>
        </Modal>
    );
};

export default AddInventoryFormModal;