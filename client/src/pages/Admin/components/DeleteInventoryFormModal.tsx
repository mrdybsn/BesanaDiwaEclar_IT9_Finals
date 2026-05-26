import { useState, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import InventoryService from "../../../services/InventoryService";
import type { InventoryItem } from "../../../interfaces/InventoryInterfaces";

interface DeleteInventoryFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: InventoryItem;
    onSuccess: (message: string, isFailed?: boolean) => void;
    refreshKey: () => void;
}

const DeleteInventoryFormModal: FC<DeleteInventoryFormModalProps> = ({
    isOpen,
    onClose,
    item,
    onSuccess,
    refreshKey,
}) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await InventoryService.destroyInventory(item.inventory_item_id);
            onSuccess("Inventory item deleted successfully.");
            refreshKey();
            onClose();
        } catch {
            onSuccess("Failed to delete inventory item.", true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <form onSubmit={handleDelete} className="bg-white p-4 rounded-lg">
                <h1 className="text-2xl border-b border-gray-100 p-4 font-semibold mb-1">
                    Delete Inventory Item
                </h1>
                <p className="text-sm text-gray-500 px-4 mb-4">
                    Delete <strong>{item.item_name}</strong>? This cannot be undone.
                </p>
                <div className="flex justify-end gap-2 px-4 pb-4">
                    <CloseButton label="Cancel" onClose={onClose} />
                    <SubmitButton
                        label={loading ? "Deleting…" : "Delete Item"}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default DeleteInventoryFormModal;
