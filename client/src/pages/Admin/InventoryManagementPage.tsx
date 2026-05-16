import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import InventoryList from "./components/InventoryList";
import AddInventoryFormModal from "./components/AddInventoryFormModal";
import EditInventoryFormModal from "./components/EditInventoryFormModal";
import DeleteInventoryFormModal from "./components/DeleteInventoryFormModal";

const InventoryMainPage = () => {
    const addModal = useModal(false);
    const editModal = useModal(false);
    const deleteModal = useModal(false);

    useEffect(() => {
        document.title = "Inventory Management";
    }, []);

    return (
        <>
            <div className="mb-4 flex justify-end">
                <button
                    type="button"
                    onClick={addModal.openModal}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg"
                >
                    + Add Item
                </button>
            </div>

            <InventoryList
                onEdit={editModal.openModal}
                onDelete={deleteModal.openModal}
            />

            <AddInventoryFormModal
                isOpen={addModal.isOpen}
                onClose={addModal.closeModal}
            />

            <EditInventoryFormModal
                isOpen={editModal.isOpen}
                onClose={editModal.closeModal}
            />

            <DeleteInventoryFormModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
            />
        </>
    );
};

export default InventoryMainPage;