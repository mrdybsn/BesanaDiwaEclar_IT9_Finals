import { useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import ProductService from "../../../services/ProductService";
import type { ProductColumns } from "../../../interfaces/ProductInterfaces";

interface DeleteProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductColumns;
    onProductDeleted: (message: string, isFailed?: boolean) => void;
    refreshKey: () => void;
}

const DeleteProductFormModal: FC<DeleteProductFormModalProps> = ({
    isOpen,
    onClose,
    product,
    onProductDeleted,
    refreshKey,
}) => {
    const [loadingDelete, setLoadingDelete] = useState(false);

    const handleDeleteProduct = async (e: FormEvent) => {
        e.preventDefault();
        setLoadingDelete(true);
        try {
            const res = await ProductService.destroyProduct(product.product_id);
            if (res.status === 200) {
                onProductDeleted(res.data.message);
                refreshKey();
                onClose();
            }
        } catch (error) {
            onProductDeleted("Failed to delete product.", true);
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form onSubmit={handleDeleteProduct} className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-1">
                    Delete Product
                </h1>
                <p className="text-sm text-gray-500 px-4 mb-4">
                    Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="grid grid-cols-2 gap-4 border-b border-gray-100 mb-4">
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Product Name"
                                type="text"
                                name="name"
                                value={product.name}
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Size"
                                type="text"
                                name="size"
                                value={product.size}
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Unit"
                                type="text"
                                name="unit"
                                value={product.unit}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Price (PHP)"
                                type="number"
                                name="price"
                                value={Number(product.price).toFixed(2)}
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Container Deposit (PHP)"
                                type="number"
                                name="container_deposit"
                                value={Number(product.container_deposit).toFixed(2)}
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <FloatingLabelInput
                                label="Stock"
                                type="number"
                                name="stock"
                                value={product.stock}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    {!loadingDelete && (
                        <CloseButton label="Close" onClose={onClose} />
                    )}
                    <SubmitButton
                        label="Delete Product"
                        loading={loadingDelete}
                        loadingLabel="Deleting Product..."
                        className="bg-red-600 hover:bg-red-700"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default DeleteProductFormModal;