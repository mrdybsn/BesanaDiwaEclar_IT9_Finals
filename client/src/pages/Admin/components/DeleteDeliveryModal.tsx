import { useState, type FC } from "react";
import Modal from "../../../components/Modal";
import CloseButton from "../../../components/Button/CloseButton";
import type { Delivery } from "../../../interfaces/DeliveryInterfaces";
import DeliveryService from "../../../services/DeliveryService";

interface DeleteDeliveryModalProps {
    isOpen:     boolean;
    onClose:    () => void;
    delivery:   Delivery | null;
    onSuccess:  () => void;
}

const DeleteDeliveryModal: FC<DeleteDeliveryModalProps> = ({ isOpen, onClose, delivery, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const handleDelete = async () => {
        if (!delivery) return;
        setLoading(true);
        setError(null);
        try {
            await DeliveryService.destroyDelivery(delivery.delivery_id);
            onSuccess();
            onClose();
        } catch (e: any) {
            setError(e.response?.data?.message ?? "Failed to delete delivery.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h1 className="text-xl font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-3">
                    Delete Delivery
                </h1>
                <p className="text-sm text-gray-500 mb-5">
                    Are you sure you want to delete this delivery? This action cannot be undone.
                </p>

                {delivery && (
                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm space-y-2 mb-5">
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-xs">Rider</span>
                            <span className="font-medium text-gray-700">
                                {delivery.rider
                                    ? `${delivery.rider.last_name}, ${delivery.rider.first_name}`
                                    : <span className="text-yellow-600">Unassigned</span>}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-xs">Scheduled</span>
                            <span className="font-medium text-gray-700">{delivery.scheduled_date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-xs">Expected</span>
                            <span className="font-medium text-gray-700">
                                ₱{Number(delivery.expected_amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400 text-xs">Address</span>
                            <span className="font-medium text-gray-700 text-right max-w-48 truncate">
                                {delivery.order?.delivery_address ?? "—"}
                            </span>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                        {error}
                    </p>
                )}

                <div className="flex justify-end gap-2">
                    <CloseButton label="Cancel" onClose={onClose} />
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        {loading ? "Deleting…" : "Delete Delivery"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteDeliveryModal;