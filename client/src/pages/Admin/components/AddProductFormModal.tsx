import type { FC } from "react"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect"
import CloseButton from "../../../components/Button/CloseButton"
import SubmitButton from "../../../components/Button/SubmitButton"
import Modal from "../../../components/Modal"

interface AddProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddProductFormModal: FC<AddProductFormModalProps> = ({ isOpen, onClose }) => {
    const sizes = [
        { size_id: '', size: 'Select Size' },
        { size_id: '500ml', size: '500ml' },
        { size_id: '1L', size: '1L' },
        { size_id: '5gal', size: '5 Gallon' },
        { size_id: 'custom', size: 'Custom' },
    ]

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-4">
                    Add Product Form
                </h1>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Product Name"
                                type="text"
                                name="name"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelSelect label="Size" name="size" required>
                                {sizes.map((size, index) => (
                                    <option value={size.size_id} key={index}>
                                        {size.size}
                                    </option>
                                ))}
                            </FloatingLabelSelect>
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Unit (e.g. bottle, gallon)"
                                type="text"
                                name="unit"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Price (PHP)"
                                type="number"
                                name="price"
                                required
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Price per Liter (PHP)"
                                type="number"
                                name="price_per_liter"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Container Deposit (PHP)"
                                type="number"
                                name="container_deposit"
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Stock"
                                type="number"
                                name="stock"
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
                    <SubmitButton label="Save Product" />
                </div>
            </form>
        </Modal>
    )
}

export default AddProductFormModal;