import CloseButton from "../../../components/Button/CloseButton";
import ModalCloseButton from "../../../components/Button/ModalCloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useModal } from "../../../hooks/useModal";

interface DeleteProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DeleteProductFormModal = ({ isOpen, onClose }: DeleteProductFormModalProps) => {
    const { closeModal } = useModal(false);

    if (!isOpen) return null;

    const handleClose = () => {
        closeModal();
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                    <ModalCloseButton onClose={handleClose} />

                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        Delete Product
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Are you sure you want to delete this product? This action cannot be undone.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FloatingLabelInput
                                label="Product Name"
                                type="text"
                                name="name"
                                readOnly
                            />
                        </div>
                        <div>
                            <FloatingLabelInput
                                label="Size"
                                type="text"
                                name="size"
                                readOnly
                            />
                        </div>
                        <div>
                            <FloatingLabelInput
                                label="Unit"
                                type="text"
                                name="unit"
                                readOnly
                            />
                        </div>
                        <div>
                            <FloatingLabelInput
                                label="Price (PHP)"
                                type="number"
                                name="price"
                                readOnly
                            />
                        </div>
                        <div>
                            <FloatingLabelInput
                                label="Container Deposit (PHP)"
                                type="number"
                                name="container_deposit"
                                readOnly
                            />
                        </div>
                        <div>
                            <FloatingLabelInput
                                label="Stock"
                                type="number"
                                name="stock"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <CloseButton label="Cancel" onClose={handleClose} />
                        <SubmitButton
                            label="Delete Product"
                            className="bg-red-600 hover:bg-red-700"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteProductFormModal;