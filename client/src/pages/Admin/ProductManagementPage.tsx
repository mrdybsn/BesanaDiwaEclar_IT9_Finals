import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import ProductList from "./components/ProductList";
import AddProductFormModal from "./components/AddProductFormModal";
import EditProductFormModal from "./components/EditProductFormModal";
import DeleteProductFormModal from "./components/DeleteProductFormModal";

const ProductMainPage = () => {
    const addModal = useModal(false);
    const editModal = useModal(false);
    const deleteModal = useModal(false);

    useEffect(() => {
        document.title = "Product Management";
    }, []);

    return (
        <>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={addModal.openModal}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                >
                    + Add Product
                </button>
            </div>

            <ProductList
                onEdit={editModal.openModal}
                onDelete={deleteModal.openModal}
            />

            <AddProductFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
            />

            <EditProductFormModal
                isOpen={editModal.isOpen}
                onClose={editModal.closeModal}
            />

            <DeleteProductFormModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
            />
        </>
    );
};

export default ProductMainPage;