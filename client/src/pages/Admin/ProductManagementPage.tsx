import { useEffect } from "react";
import AddProductFormModal from "./components/AddProductFormModal";
import EditProductFormModal from "./components/EditProductFormModal";
import DeleteProductFormModal from "./components/DeleteProductFormModal";
import ProductList from "./components/ProductList";
import { useModal } from "../../hooks/useModal";
import type { ProductColumns } from "../../interfaces/ProductInterfaces";
import { useToastMessage } from "../../hooks/useToastMessage";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useRefresh } from "../../hooks/useRefresh";
import PageHeader from "../../components/Layout/PageHeader";

const ProductManagementPage = () => {
    const {
        isOpen: isAddProductFormModalOpen,
        openModal: openAddProductFormModal,
        closeModal: closeAddProductFormModal,
    } = useModal<undefined>(false);

    const {
        isOpen: isEditProductFormModalOpen,
        selectedUser: selectedProductForEdit,
        openModal: openEditProductFormModal,
        closeModal: closeEditProductFormModal,
    } = useModal<ProductColumns>(false);

    const {
        isOpen: isDeleteProductFormModalOpen,
        selectedUser: selectedProductForDelete,
        openModal: openDeleteProductFormModal,
        closeModal: closeDeleteProductFormModal,
    } = useModal<ProductColumns>(false);

    const {
        message: toastMessage,
        isFailed: toastIsFailed,
        isVisible: toastMessageIsVisible,
        showToastMessage,
        closeToastMessage,
    } = useToastMessage("", false, false);

    const { refresh, handleRefresh } = useRefresh(false);

    useEffect(() => {
        document.title = "Product Management";
    }, []);

    return (
        <>
            <PageHeader
                title="Products"
                description="Manage your product catalog and pricing."
            />
            <ToastMessage
                message={toastMessage}
                isFailed={toastIsFailed}
                isVisible={toastMessageIsVisible}
                onClose={closeToastMessage}
            />

            <AddProductFormModal
                isOpen={isAddProductFormModalOpen}
                onClose={closeAddProductFormModal}
                onProductAdded={showToastMessage}
                refreshKey={handleRefresh}
            />

            {selectedProductForEdit && (
                <EditProductFormModal
                    isOpen={isEditProductFormModalOpen}
                    onClose={closeEditProductFormModal}
                    product={selectedProductForEdit}
                    onProductUpdated={showToastMessage}
                    refreshKey={handleRefresh}
                />
            )}

            {selectedProductForDelete && (
                <DeleteProductFormModal
                    isOpen={isDeleteProductFormModalOpen}
                    onClose={closeDeleteProductFormModal}
                    product={selectedProductForDelete}
                    onProductDeleted={showToastMessage}
                    refreshKey={handleRefresh}
                />
            )}

            <ProductList
                onAddProduct={openAddProductFormModal}
                onEditProduct={(product: ProductColumns) => openEditProductFormModal(product)}
                onDeleteProduct={(product: ProductColumns) => openDeleteProductFormModal(product)}
                onAvailabilityToggled={showToastMessage}
                refreshKey={refresh}
            />
        </>
    );
};

export default ProductManagementPage;