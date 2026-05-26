import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { useRefresh } from "../../hooks/useRefresh";
import { useToastMessage } from "../../hooks/useToastMessage";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import PageHeader from "../../components/Layout/PageHeader";
import type { InventoryItem } from "../../interfaces/InventoryInterfaces";
import InventoryList from "./components/InventoryList";
import AddInventoryFormModal from "./components/AddInventoryFormModal";
import EditInventoryFormModal from "./components/EditInventoryFormModal";
import DeleteInventoryFormModal from "./components/DeleteInventoryFormModal";

const InventoryMainPage = () => {
    const addModal = useModal(false);
    const editModal = useModal<InventoryItem>(false);
    const deleteModal = useModal<InventoryItem>(false);
    const { refresh, handleRefresh } = useRefresh(false);
    const {
        message: toastMessage,
        isFailed: toastIsFailed,
        isVisible: toastMessageIsVisible,
        showToastMessage,
        closeToastMessage,
    } = useToastMessage("", false, false);

    useEffect(() => {
        document.title = "Inventory Management";
    }, []);

    return (
        <>
            <PageHeader
                title="Inventory"
                description="Manage supply items and low-stock thresholds."
            >
                <button
                    type="button"
                    onClick={() => addModal.openModal()}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                >
                    + Add Item
                </button>
            </PageHeader>

            <ToastMessage
                message={toastMessage}
                isFailed={toastIsFailed}
                isVisible={toastMessageIsVisible}
                onClose={closeToastMessage}
            />

            <InventoryList
                onEdit={editModal.openModal}
                onDelete={deleteModal.openModal}
                refreshKey={refresh}
            />

            <AddInventoryFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
                onSuccess={showToastMessage}
                refreshKey={handleRefresh}
            />

            {editModal.selectedUser && (
                <EditInventoryFormModal
                    isOpen={editModal.isOpen}
                    onClose={editModal.closeModal}
                    item={editModal.selectedUser}
                    onSuccess={showToastMessage}
                    refreshKey={handleRefresh}
                />
            )}

            {deleteModal.selectedUser && (
                <DeleteInventoryFormModal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.closeModal}
                    item={deleteModal.selectedUser}
                    onSuccess={showToastMessage}
                    refreshKey={handleRefresh}
                />
            )}
        </>
    );
};

export default InventoryMainPage;
