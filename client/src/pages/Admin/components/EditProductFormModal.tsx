import type { FC } from "react"
import Modal from "../../../components/Modal"
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput"
import CloseButton from "../../../components/Button/CloseButton"
import SubmitButton from "../../../components/Button/SubmitButton"

interface DeleteProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DeleteProductFormModal: FC<DeleteProductFormModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-1">
                    Delete Product
                </h1>
                <p className="text-sm text-gray-500 px-4 mb-4">
                    Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Product Name" type="text" name="name" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Size" type="text" name="size" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Unit" type="text" name="unit" readOnly />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput label="Price (PHP)" type="number" name="price" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Container Deposit (PHP)" type="number" name="container_deposit" readOnly />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput label="Stock" type="number" name="stock" readOnly />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <CloseButton label="Close" onClose={onClose} />
                    <SubmitButton label="Delete Product" className="bg-red-600 hover:bg-red-700" />
                </div>
            </div>
        </Modal>
    )
}

export default DeleteProductFormModal